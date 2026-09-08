FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
RUN corepack enable
COPY frontend/package.json ./
RUN yarn install --non-interactive
COPY frontend/ ./

ARG REACT_APP_SITE_PHASE=save-the-date
ARG REACT_APP_ENABLE_PHASE_TOGGLE=false
ENV REACT_APP_SITE_PHASE=${REACT_APP_SITE_PHASE}
ENV REACT_APP_ENABLE_PHASE_TOGGLE=${REACT_APP_ENABLE_PHASE_TOGGLE}
ENV CI=false
RUN yarn build


FROM python:3.12-slim AS runtime

WORKDIR /app
COPY backend/requirements-production.txt /app/backend/requirements-production.txt
RUN pip install --no-cache-dir -r /app/backend/requirements-production.txt

COPY backend/ /app/backend/
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

ENV PYTHONUNBUFFERED=1
ENV FRONTEND_BUILD_DIR=/app/frontend/build
WORKDIR /app/backend

CMD ["/bin/sh", "-c", "exec uvicorn production:app --host 0.0.0.0 --port ${PORT:-8000}"]
