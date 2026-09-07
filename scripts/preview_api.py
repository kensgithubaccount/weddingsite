#!/usr/bin/env python3
"""Tiny preview-only API for Codespaces.

It serves the canonical CONTENT object from backend/content.py without starting
MongoDB or the production RSVP backend. The React dev server proxies /api/* here.
"""

from __future__ import annotations

import json
import runpy
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT_FILE = ROOT / "backend" / "content.py"
HOST = "127.0.0.1"
PORT = 8001


def load_content():
    namespace = runpy.run_path(str(CONTENT_FILE))
    return namespace["CONTENT"]


class PreviewHandler(BaseHTTPRequestHandler):
    server_version = "WeddingPreview/1.0"

    def _json(self, status: int, payload) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):  # noqa: N802
        if self.path == "/api/content":
            try:
                self._json(200, load_content())
            except Exception as exc:  # preview diagnostics only
                self._json(500, {"detail": f"Could not load preview content: {exc}"})
            return

        if self.path == "/api/health":
            self._json(200, {"ok": True, "mode": "codespaces-visual-preview"})
            return

        if self.path.startswith("/api/"):
            self._json(
                501,
                {
                    "detail": (
                        "This Codespaces preview serves visual/content data only. "
                        "RSVP writes and admin/database actions remain on the real backend."
                    )
                },
            )
            return

        self._json(404, {"detail": "Not found"})

    def log_message(self, fmt, *args):
        print(f"[preview-api] {self.address_string()} - {fmt % args}")


if __name__ == "__main__":
    print(f"Preview content API: http://{HOST}:{PORT}/api/content")
    ThreadingHTTPServer((HOST, PORT), PreviewHandler).serve_forever()
