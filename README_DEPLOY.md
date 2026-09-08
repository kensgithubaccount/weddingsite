# Production deployment (Railway)

This repo is prepared to run as one Railway web service plus one Railway MongoDB service.

## Web service variables

Required:
- `MONGO_URL` — reference the Railway MongoDB service's `MONGO_URL`
- `DB_NAME` — e.g. `wedding`
- `ADMIN_PASSWORD` — strong private admin password
- `JWT_SECRET` — long random secret
- `SITE_URL` — final public URL, e.g. `https://sophieandken.com`

Email (required before RSVP is made public):
- `RESEND_API_KEY`
- `EMAIL_FROM_ADDRESS` — verified sender, e.g. `rsvp@sophieandken.com`
- `EMAIL_FROM_NAME` — optional, defaults to `Sophie + Ken`

Frontend build mode:
- `REACT_APP_SITE_PHASE=save-the-date` for launch
- later change to `REACT_APP_SITE_PHASE=full-wedding` and redeploy
- keep `REACT_APP_ENABLE_PHASE_TOGGLE=false` in production

Optional:
- `CORS_ORIGINS` — final site URL
- `ENABLE_SAMPLE_SEED=false` — production default; do not seed test guests

## Railway healthcheck

Set the web service healthcheck path to `/api/health`.

## Architecture

The root `Dockerfile` builds the React frontend and serves it from the same FastAPI/uvicorn service. `/api/*` stays on FastAPI; all other routes use the React SPA. This means only one public web service needs a domain.
