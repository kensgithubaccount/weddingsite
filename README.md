# Sophie + Ken wedding site

## Browser-only visual preview (GitHub Codespaces)

This repo includes a preview setup that does **not** need Emergent, MongoDB, or a local install.

1. On GitHub, open the repo and choose **Code → Codespaces → Create codespace on main**.
2. Wait for setup to finish. Dependencies install automatically and the preview starts automatically.
3. When GitHub forwards port **3000**, open **Wedding Site Preview**. If it does not pop open, use the **Ports** tab and click the globe/open-in-browser icon beside port 3000.
4. Frontend edits hot-reload. Changes to `backend/content.py` are re-read on every `/api/content` request, so a browser refresh is enough for copy/content changes.

### What this preview does

- Uses the real React components, styles, images, and current `backend/content.py` content.
- Uses a tiny preview-only API on port 8001 so the homepage can render without MongoDB.
- Keeps the production RSVP/backend code untouched.

### What this preview does not do

RSVP submissions, admin/database actions, and production email behavior are intentionally not active in Codespaces. Use this environment for visual QA and copy/layout review.

### If the preview needs a restart

Open a Codespaces terminal and run:

```bash
pkill -f start_codespaces_preview.sh || true
pkill -f preview_api.py || true
pkill -f "craco start" || true
nohup bash ./scripts/start_codespaces_preview.sh >/tmp/wedding-preview.log 2>&1 &
```

Then refresh port 3000.
