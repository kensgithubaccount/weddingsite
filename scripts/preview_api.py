#!/usr/bin/env python3
"""Tiny functional API for the GitHub Codespaces preview.

It serves the canonical CONTENT object and a safe in-memory RSVP sandbox so the
public RSVP flow can be tested without MongoDB or the production backend.
Nothing submitted here persists after the preview process stops.
"""

from __future__ import annotations

import json
import re
import runpy
import secrets
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT_FILE = ROOT / "backend" / "content.py"
HOST = "127.0.0.1"
PORT = 8001


def load_namespace():
    return runpy.run_path(str(CONTENT_FILE))


def load_content():
    return load_namespace()["CONTENT"]


def normalize_name(value: str) -> str:
    value = (value or "").lower().strip()
    value = value.replace("’", "'").replace("‘", "'").replace("`", "'")
    value = re.sub(r"[^a-z0-9'\- ]", "", value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def relaxed_name(value: str) -> str:
    return re.sub(r"['\- ]", "", normalize_name(value))


def build_parties():
    households = load_namespace().get("SEED_HOUSEHOLDS", [])
    parties = {}
    for p_index, household in enumerate(households, start=1):
        party_id = f"preview-party-{p_index}"
        members = []
        for m_index, member in enumerate(household.get("members", []), start=1):
            members.append(
                {
                    "id": f"preview-guest-{p_index}-{m_index}",
                    "first_name": member.get("first_name", ""),
                    "last_name": member.get("last_name", ""),
                    "plus_one_allowed": bool(member.get("plus_one_allowed", False)),
                }
            )
        parties[party_id] = {
            "id": party_id,
            "display_name": household.get("name") or "Preview Party",
            "members": members,
        }
    return parties


PARTIES = build_parties()
TOKENS = {}
CANDIDATES = {}
RESPONSES = {}


def issue_token(party_id: str) -> str:
    token = secrets.token_urlsafe(24)
    TOKENS[token] = party_id
    return token


def party_payload(party_id: str, token: str | None = None) -> dict:
    party = PARTIES[party_id]
    existing = RESPONSES.get(party_id)
    payload = {
        "party": {"display_name": party["display_name"]},
        "members": party["members"],
        "already_responded": existing is not None,
        "existing": existing,
    }
    if token:
        payload["token"] = token
    return payload


def find_party_ids(name: str):
    exact = normalize_name(name)
    relaxed = relaxed_name(name)
    found = []
    for party_id, party in PARTIES.items():
        names = [party["display_name"]] + [
            f"{m['first_name']} {m['last_name']}" for m in party["members"]
        ]
        if any(normalize_name(candidate) == exact or relaxed_name(candidate) == relaxed for candidate in names):
            found.append(party_id)
    return found


class PreviewHandler(BaseHTTPRequestHandler):
    server_version = "WeddingPreview/2.0"

    def _json(self, status: int, payload) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _body(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length) if length else b"{}"
            return json.loads(raw.decode("utf-8"))
        except Exception:
            return {}

    def do_GET(self):  # noqa: N802
        if self.path == "/api/content":
            try:
                self._json(200, load_content())
            except Exception as exc:
                self._json(500, {"detail": f"Could not load preview content: {exc}"})
            return

        if self.path == "/api/health":
            self._json(200, {"ok": True, "mode": "codespaces-functional-preview"})
            return

        if self.path == "/api/rsvp/status":
            self._json(
                200,
                {
                    "closed": False,
                    "deadline": None,
                    "meal_options_enabled": False,
                    "meal_options": [],
                    "preview": True,
                },
            )
            return

        if self.path.startswith("/api/rsvp/update/"):
            token = self.path.rsplit("/", 1)[-1]
            party_id = TOKENS.get(token)
            if not party_id or party_id not in PARTIES:
                self._json(404, {"detail": "That preview link has expired. Please look up the invitation again."})
                return
            self._json(200, {"status": "found", **party_payload(party_id, token)})
            return

        if self.path == "/api/":
            self._json(200, {"message": "Sophie + Ken Codespaces preview API"})
            return

        if self.path.startswith("/api/"):
            self._json(
                501,
                {
                    "detail": (
                        "This Codespaces preview only implements the public content and RSVP flow. "
                        "Admin/database actions require the production backend."
                    )
                },
            )
            return

        self._json(404, {"detail": "Not found"})

    def do_POST(self):  # noqa: N802
        if self.path == "/api/guest-lookup":
            body = self._body()
            name = (body.get("name") or "").strip()
            if not name:
                self._json(200, {"status": "not_found"})
                return

            candidate_token = body.get("candidates_token")
            if candidate_token:
                party_ids = CANDIDATES.get(candidate_token, [])
                disambiguator = body.get("disambiguator") or ""
                matches = []
                for party_id in party_ids:
                    party = PARTIES.get(party_id)
                    if not party:
                        continue
                    member_names = [f"{m['first_name']} {m['last_name']}" for m in party["members"]]
                    existing_email = (RESPONSES.get(party_id) or {}).get("email", "")
                    if (
                        normalize_name(disambiguator) == normalize_name(existing_email)
                        or any(relaxed_name(disambiguator) == relaxed_name(member_name) for member_name in member_names)
                    ):
                        matches.append(party_id)
                if len(matches) != 1:
                    self._json(200, {"status": "not_found"})
                    return
                party_id = matches[0]
                token = issue_token(party_id)
                self._json(200, {"status": "found", **party_payload(party_id, token)})
                return

            party_ids = find_party_ids(name)
            if not party_ids:
                self._json(200, {"status": "not_found"})
                return
            if len(party_ids) > 1:
                candidates_token = secrets.token_urlsafe(18)
                CANDIDATES[candidates_token] = party_ids
                self._json(
                    200,
                    {
                        "status": "multiple",
                        "method": "member",
                        "candidates_token": candidates_token,
                    },
                )
                return

            party_id = party_ids[0]
            token = issue_token(party_id)
            self._json(200, {"status": "found", **party_payload(party_id, token)})
            return

        if self.path == "/api/rsvp/submit":
            body = self._body()
            token = body.get("token") or ""
            party_id = TOKENS.get(token)
            if not party_id or party_id not in PARTIES:
                self._json(401, {"detail": "That preview invitation has expired. Please look it up again."})
                return

            party = PARTIES[party_id]
            member_ids = {m["id"] for m in party["members"]}
            responses = body.get("responses") or []
            if not responses or any(r.get("guest_id") not in member_ids for r in responses):
                self._json(400, {"detail": "Invalid preview RSVP response."})
                return

            existing = {
                "email": (body.get("email") or "").strip(),
                "responses": [
                    {
                        "guest_id": r.get("guest_id"),
                        "attending": bool(r.get("attending")),
                        "meal_choice": (r.get("meal_choice") or "").strip(),
                        "dietary_notes": (r.get("dietary_notes") or "").strip(),
                        "plus_one_name": (r.get("plus_one_name") or "").strip(),
                    }
                    for r in responses
                ],
                "event_responses": body.get("event_responses") or [],
                "accessibility_notes": (body.get("accessibility_notes") or "").strip(),
                "song_request": (body.get("song_request") or "").strip(),
                "message_to_couple": (body.get("message_to_couple") or "").strip(),
            }
            RESPONSES[party_id] = existing
            attending_any = any(r["attending"] for r in existing["responses"])
            self._json(
                200,
                {
                    "ok": True,
                    "attending_any": attending_any,
                    "email_sent": False,
                    "preview": True,
                    "responses": existing["responses"],
                    "event_responses": existing["event_responses"],
                },
            )
            return

        if self.path.startswith("/api/"):
            self._json(
                501,
                {
                    "detail": (
                        "This Codespaces preview only implements the public content and RSVP flow. "
                        "Admin/database actions require the production backend."
                    )
                },
            )
            return

        self._json(404, {"detail": "Not found"})

    def log_message(self, fmt, *args):
        print(f"[preview-api] {self.address_string()} - {fmt % args}")


if __name__ == "__main__":
    print(f"Preview API: http://{HOST}:{PORT}/api/health")
    print("RSVP sandbox: use Test Guest, Taylor Guest, Alex Sample, Jordan Example, Riley Example, or Casey Example.")
    ThreadingHTTPServer((HOST, PORT), PreviewHandler).serve_forever()
