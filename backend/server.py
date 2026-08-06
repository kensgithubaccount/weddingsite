import csv
import io
import logging
import os
import time
import uuid
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import List, Optional

import httpx
import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException, Request
from fastapi.responses import PlainTextResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from starlette.middleware.cors import CORSMiddleware

from content import CONTENT, SEED_HOUSEHOLDS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Sophie + Ken")
PREVIEW_PASSWORD = os.environ.get("PREVIEW_PASSWORD", "soph")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "skks-2027")
JWT_SECRET = os.environ.get("JWT_SECRET", "skks-jwt-secret")

app = FastAPI()
api_router = APIRouter(prefix="/api")
logger = logging.getLogger(__name__)


def now_iso():
    return datetime.now(timezone.utc).isoformat()


_hits = defaultdict(list)


def rate_limit(key: str, limit: int, window: int):
    t = time.time()
    _hits[key] = [x for x in _hits[key] if t - x < window]
    if len(_hits[key]) >= limit:
        raise HTTPException(status_code=429, detail="Too many requests. Please wait a moment and try again.")
    _hits[key].append(t)


# ---------- models ----------

class PreviewUnlock(BaseModel):
    password: str


class LookupRequest(BaseModel):
    first_name: str
    last_name: str
    company: Optional[str] = ""  # honeypot


class GuestResponseIn(BaseModel):
    guest_id: str
    attending: bool
    meal: Optional[str] = ""
    dietary: Optional[str] = ""
    accessibility: Optional[str] = ""
    plus_one_name: Optional[str] = ""


class SubmitRequest(BaseModel):
    household_id: str
    email: EmailStr
    phone: Optional[str] = ""
    note: Optional[str] = ""
    personality_answer: Optional[str] = ""
    responses: List[GuestResponseIn]
    company: Optional[str] = ""  # honeypot


class AdminLogin(BaseModel):
    password: str


class MemberIn(BaseModel):
    first_name: str
    last_name: str
    plus_one_allowed: bool = False


class HouseholdIn(BaseModel):
    name: str
    members: List[MemberIn]


# ---------- auth ----------

def require_admin(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        jwt.decode(authorization[7:], JWT_SECRET, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Unauthorized")


# ---------- helpers ----------

def guest_public(g):
    return {
        "id": g["id"],
        "first_name": g["first_name"],
        "last_name": g["last_name"],
        "plus_one_allowed": g.get("plus_one_allowed", False),
    }


async def send_email(recipient: str, subject: str, html: str):
    payload = {
        "to": [recipient],
        "subject": subject,
        "html": html,
        "from_name": EMAIL_FROM_NAME,
    }
    try:
        async with httpx.AsyncClient(timeout=30) as client_http:
            resp = await client_http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return True
    except Exception as e:
        logger.error(f"Email send error: {e}")
        return False


def build_confirmation_email(household_name, responses, attending_any):
    rows = "".join(
        f"<tr>"
        f"<td style='padding:8px 16px 8px 0;font-family:Georgia,serif;font-size:15px;color:#1A1A1A;border-bottom:1px solid #e3ded4;'>{r['guest_name']}</td>"
        f"<td style='padding:8px 0;font-family:Georgia,serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:{'#4A5D4E' if r['attending'] else '#731F17'};border-bottom:1px solid #e3ded4;'>{'Attending' if r['attending'] else 'Regrets'}</td>"
        f"</tr>"
        for r in responses
    )
    headline = "YOU&rsquo;RE ON THE LIST." if attending_any else "WE&rsquo;LL MISS YOU."
    sub = (
        "We&rsquo;ll see you in New York on June 5."
        if attending_any
        else "Thank you for letting us know. We&rsquo;re lucky to have you in our lives, wherever you are that night."
    )
    return f"""
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F0;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#F7F5F0;border:1px solid #d8d2c4;padding:48px 40px;">
      <tr><td align="center" style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.25em;color:#595959;padding-bottom:24px;">
        VOL. I &nbsp;&middot;&nbsp; NO. 1 &nbsp;&middot;&nbsp; THE WEDDING ISSUE
      </td></tr>
      <tr><td align="center" style="font-family:Georgia,serif;font-size:30px;color:#1A1A1A;padding-bottom:8px;">
        Sophie <span style="color:#731F17;">&amp;</span> Ken
      </td></tr>
      <tr><td align="center" style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.2em;color:#595959;padding-bottom:32px;">
        JUNE 5, 2027 &nbsp;&middot;&nbsp; NEW YORK ATHLETIC CLUB
      </td></tr>
      <tr><td align="center" style="font-family:Georgia,serif;font-size:24px;color:#731F17;padding-bottom:12px;">{headline}</td></tr>
      <tr><td align="center" style="font-family:Georgia,serif;font-style:italic;font-size:15px;color:#595959;padding-bottom:32px;">{sub}</td></tr>
      <tr><td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{rows}</table>
      </td></tr>
      <tr><td align="center" style="padding-top:36px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.2em;color:#731F17;border:1px solid #731F17;display:inline-block;padding:12px 24px;margin-top:36px;">
        JUN 05 2027 &nbsp;&middot;&nbsp; NEW YORK, NEW YORK
      </td></tr>
      <tr><td align="center" style="padding-top:32px;font-family:Georgia,serif;font-size:12px;color:#595959;">
        5:30 PM &nbsp;&middot;&nbsp; 180 Central Park South, New York, New York
      </td></tr>
    </table>
  </td></tr>
</table>"""


# ---------- public routes ----------

@api_router.get("/")
async def root():
    return {"message": "Sophie + Ken — June 5, 2027"}


@api_router.get("/content")
async def get_content():
    return CONTENT


@api_router.post("/preview/unlock")
async def preview_unlock(body: PreviewUnlock, request: Request):
    rate_limit(f"preview:{request.client.host}", 10, 300)
    if body.password != PREVIEW_PASSWORD:
        raise HTTPException(status_code=401, detail="Incorrect password")
    return {"ok": True}


@api_router.post("/rsvp/lookup")
async def rsvp_lookup(body: LookupRequest, request: Request):
    rate_limit(f"lookup:{request.client.host}", 20, 300)
    if body.company:
        raise HTTPException(status_code=404, detail="We couldn't find that invitation.")
    first = body.first_name.strip().lower()
    last = body.last_name.strip().lower()
    if not first or not last:
        raise HTTPException(status_code=400, detail="Please enter a first and last name.")
    guest = await db.guests.find_one(
        {"first_lower": first, "last_lower": last}, {"_id": 0}
    )
    if not guest:
        raise HTTPException(
            status_code=404,
            detail="We couldn't find that invitation. Check the spelling on your envelope, or contact us below.",
        )
    household = await db.households.find_one({"id": guest["household_id"]}, {"_id": 0})
    members = await db.guests.find(
        {"household_id": guest["household_id"]}, {"_id": 0}
    ).to_list(50)
    existing = await db.rsvps.find_one({"household_id": guest["household_id"]}, {"_id": 0})
    return {
        "household": {"id": household["id"], "name": household["name"]},
        "members": [guest_public(m) for m in members],
        "existing": existing,
    }


@api_router.post("/rsvp/submit")
async def rsvp_submit(body: SubmitRequest, request: Request):
    rate_limit(f"submit:{request.client.host}", 10, 300)
    if body.company:
        raise HTTPException(status_code=400, detail="Something went wrong.")
    household = await db.households.find_one({"id": body.household_id}, {"_id": 0})
    if not household:
        raise HTTPException(status_code=404, detail="Invitation not found.")
    members = await db.guests.find({"household_id": body.household_id}, {"_id": 0}).to_list(50)
    member_map = {m["id"]: m for m in members}
    if not body.responses:
        raise HTTPException(status_code=400, detail="No responses provided.")
    for r in body.responses:
        if r.guest_id not in member_map:
            raise HTTPException(status_code=400, detail="Guest does not belong to this invitation.")
        if r.plus_one_name and not member_map[r.guest_id].get("plus_one_allowed"):
            raise HTTPException(status_code=400, detail="This guest does not have plus-one access.")

    responses_out = []
    for r in body.responses:
        m = member_map[r.guest_id]
        responses_out.append({
            "guest_id": r.guest_id,
            "guest_name": f"{m['first_name']} {m['last_name']}",
            "attending": r.attending,
            "meal": r.meal if r.attending else "",
            "dietary": r.dietary if r.attending else "",
            "accessibility": r.accessibility if r.attending else "",
            "plus_one_name": r.plus_one_name if (r.attending and r.plus_one_name) else "",
        })

    attending_any = any(r["attending"] for r in responses_out)
    doc = {
        "id": str(uuid.uuid4()),
        "household_id": body.household_id,
        "household_name": household["name"],
        "email": body.email,
        "phone": body.phone,
        "note": body.note,
        "personality_answer": body.personality_answer,
        "responses": responses_out,
        "attending_any": attending_any,
        "updated_at": now_iso(),
    }
    await db.rsvps.update_one(
        {"household_id": body.household_id},
        {"$set": doc, "$setOnInsert": {"submitted_at": now_iso()}},
        upsert=True,
    )

    html = build_confirmation_email(household["name"], responses_out, attending_any)
    subject = "You're on the list — Sophie + Ken, June 5, 2027" if attending_any else "We'll miss you — Sophie + Ken"
    email_sent = await send_email(body.email, subject, html)

    return {"ok": True, "attending_any": attending_any, "email_sent": email_sent, "responses": responses_out}


# ---------- admin routes ----------

@api_router.post("/admin/login")
async def admin_login(body: AdminLogin, request: Request):
    rate_limit(f"admin:{request.client.host}", 10, 300)
    if body.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Incorrect password")
    token = jwt.encode(
        {"role": "admin", "exp": datetime.now(timezone.utc) + timedelta(hours=12)},
        JWT_SECRET,
        algorithm="HS256",
    )
    return {"token": token}


@api_router.get("/admin/overview", dependencies=[Depends(require_admin)])
async def admin_overview():
    guests = await db.guests.count_documents({})
    households = await db.households.count_documents({})
    rsvps = await db.rsvps.find({}, {"_id": 0}).to_list(10000)
    attending = sum(1 for r in rsvps for g in r["responses"] if g["attending"])
    declining = sum(1 for r in rsvps for g in r["responses"] if not g["attending"])
    plus_ones = sum(1 for r in rsvps for g in r["responses"] if g.get("plus_one_name"))
    return {
        "guests": guests,
        "households": households,
        "households_responded": len(rsvps),
        "attending": attending,
        "declining": declining,
        "plus_ones": plus_ones,
    }


@api_router.get("/admin/households", dependencies=[Depends(require_admin)])
async def admin_households():
    households = await db.households.find({}, {"_id": 0}).to_list(10000)
    out = []
    for h in households:
        members = await db.guests.find({"household_id": h["id"]}, {"_id": 0}).to_list(50)
        rsvp = await db.rsvps.find_one({"household_id": h["id"]}, {"_id": 0})
        out.append({
            "id": h["id"],
            "name": h["name"],
            "members": [guest_public(m) for m in members],
            "responded": rsvp is not None,
            "attending_any": rsvp.get("attending_any") if rsvp else None,
        })
    return out


@api_router.post("/admin/households", dependencies=[Depends(require_admin)])
async def admin_create_household(body: HouseholdIn):
    if not body.members:
        raise HTTPException(status_code=400, detail="A household needs at least one guest.")
    hid = str(uuid.uuid4())
    await db.households.insert_one({"id": hid, "name": body.name, "created_at": now_iso()})
    for m in body.members:
        await db.guests.insert_one({
            "id": str(uuid.uuid4()),
            "household_id": hid,
            "first_name": m.first_name.strip(),
            "last_name": m.last_name.strip(),
            "first_lower": m.first_name.strip().lower(),
            "last_lower": m.last_name.strip().lower(),
            "plus_one_allowed": m.plus_one_allowed,
            "created_at": now_iso(),
        })
    return {"ok": True, "id": hid}


@api_router.delete("/admin/households/{hid}", dependencies=[Depends(require_admin)])
async def admin_delete_household(hid: str):
    await db.households.delete_one({"id": hid})
    await db.guests.delete_many({"household_id": hid})
    await db.rsvps.delete_many({"household_id": hid})
    return {"ok": True}


@api_router.post("/admin/households/{hid}/members", dependencies=[Depends(require_admin)])
async def admin_add_member(hid: str, body: MemberIn):
    household = await db.households.find_one({"id": hid}, {"_id": 0})
    if not household:
        raise HTTPException(status_code=404, detail="Household not found")
    gid = str(uuid.uuid4())
    await db.guests.insert_one({
        "id": gid,
        "household_id": hid,
        "first_name": body.first_name.strip(),
        "last_name": body.last_name.strip(),
        "first_lower": body.first_name.strip().lower(),
        "last_lower": body.last_name.strip().lower(),
        "plus_one_allowed": body.plus_one_allowed,
        "created_at": now_iso(),
    })
    return {"ok": True, "id": gid}


@api_router.delete("/admin/members/{gid}", dependencies=[Depends(require_admin)])
async def admin_delete_member(gid: str):
    await db.guests.delete_one({"id": gid})
    return {"ok": True}


@api_router.get("/admin/responses", dependencies=[Depends(require_admin)])
async def admin_responses():
    return await db.rsvps.find({}, {"_id": 0}).to_list(10000)


@api_router.get("/admin/export", dependencies=[Depends(require_admin)])
async def admin_export():
    rsvps = await db.rsvps.find({}, {"_id": 0}).to_list(10000)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Household", "Guest", "Attending", "Meal", "Dietary", "Accessibility", "Plus One", "Email", "Phone", "Note", "Song", "Updated"])
    for r in rsvps:
        for g in r["responses"]:
            writer.writerow([
                r["household_name"], g["guest_name"],
                "Yes" if g["attending"] else "No",
                g.get("meal", ""), g.get("dietary", ""), g.get("accessibility", ""),
                g.get("plus_one_name", ""), r.get("email", ""), r.get("phone", ""),
                r.get("note", ""), r.get("personality_answer", ""), r.get("updated_at", ""),
            ])
    return PlainTextResponse(
        buf.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sophie-ken-rsvps.csv"},
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


@app.on_event("startup")
async def seed_guests():
    if await db.households.count_documents({}) == 0:
        for h in SEED_HOUSEHOLDS:
            hid = str(uuid.uuid4())
            await db.households.insert_one({"id": hid, "name": h["name"], "created_at": now_iso()})
            for m in h["members"]:
                await db.guests.insert_one({
                    "id": str(uuid.uuid4()),
                    "household_id": hid,
                    "first_name": m["first_name"],
                    "last_name": m["last_name"],
                    "first_lower": m["first_name"].lower(),
                    "last_lower": m["last_name"].lower(),
                    "plus_one_allowed": m["plus_one_allowed"],
                    "created_at": now_iso(),
                })
        logger.info("Seeded sample guest list")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
