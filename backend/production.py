import logging
import os
from pathlib import Path

import httpx
from fastapi import HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

import server

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
EMAIL_FROM_ADDRESS = os.environ.get("EMAIL_FROM_ADDRESS", "")


async def resend_send_email(recipient: str, subject: str, html: str):
    if not RESEND_API_KEY or not EMAIL_FROM_ADDRESS:
        logger.error("Resend is not configured; set RESEND_API_KEY and EMAIL_FROM_ADDRESS.")
        return False

    payload = {
        "from": f"{server.EMAIL_FROM_NAME} <{EMAIL_FROM_ADDRESS}>",
        "to": [recipient],
        "subject": subject,
        "html": html,
    }
    try:
        async with httpx.AsyncClient(timeout=30) as client_http:
            resp = await client_http.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
        if resp.status_code >= 400:
            logger.error("Resend %s: %s", resp.status_code, resp.text[:300])
        resp.raise_for_status()
        return True
    except Exception as exc:
        logger.error("Email send error: %s", exc)
        return False


# Replace the old Emergent email transport while leaving RSVP behavior unchanged.
server.send_email = resend_send_email


# Never put sample guests into a production database unless explicitly requested.
if os.environ.get("ENABLE_SAMPLE_SEED", "false").lower() not in {"1", "true", "yes"}:
    async def no_sample_seed():
        logger.info("Production sample guest seeding disabled.")

    server.seed_if_empty = no_sample_seed
    server.seed_test_fixtures = no_sample_seed

app = server.app


@app.get("/api/health", include_in_schema=False)
async def production_health():
    try:
        await server.db.command("ping")
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Database unavailable") from exc
    return {"ok": True, "mode": "production"}


# Serve the compiled React app from the same process/domain as FastAPI.
# This keeps deployment to one web service plus MongoDB.
build_dir = Path(
    os.environ.get(
        "FRONTEND_BUILD_DIR",
        str(Path(__file__).resolve().parent.parent / "frontend" / "build"),
    )
).resolve()

static_dir = build_dir / "static"
if static_dir.is_dir():
    app.mount("/static", StaticFiles(directory=static_dir), name="frontend-static")

if build_dir.is_dir():
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")

        candidate = (build_dir / full_path).resolve()
        if build_dir not in candidate.parents and candidate != build_dir:
            raise HTTPException(status_code=404, detail="Not found")
        if candidate.is_file():
            return FileResponse(candidate)

        index_file = build_dir / "index.html"
        if not index_file.is_file():
            raise HTTPException(status_code=404, detail="Frontend build not found")
        return FileResponse(index_file)
