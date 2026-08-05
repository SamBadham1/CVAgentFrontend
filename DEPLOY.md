# Cloud Run — Vue frontend
#
# Run these from Cloud Shell inside ProdFrontEnd/CVAgentFrontEndVue/
# after uploading/cloning this project.
#
# The container serves the SPA and proxies /api + /health to the Backend
# Cloud Run URL, so the browser stays same-origin (no CORS needed for chat).

# ── 0. One-time setup (skip if already done for the API) ─────────────────────

export PROJECT_ID=YOUR_PROJECT_ID
export REGION=australia-southeast1

gcloud config set project "$PROJECT_ID"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# ── 1. Backend URL from the API deploy ──────────────────────────────────────
# Paste the URL printed by: gcloud run services describe cvagent-api ...

export BACKEND_URL=https://cvagent-api-XXXXXXXX-XX.a.run.app

# ── 2. Deploy Vue frontend ──────────────────────────────────────────────────

gcloud run deploy cvagent-web \
  --source . \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --min-instances 0 \
  --max-instances 5 \
  --set-env-vars "BACKEND_URL=${BACKEND_URL}"

# ── 3. Note the frontend URL ────────────────────────────────────────────────

gcloud run services describe cvagent-web --region "$REGION" --format='value(status.url)'

# Open that URL in a browser. Chat calls go to /api on the same host and are
# proxied to the backend.

# ── 4. Point the API CORS origin at this frontend (recommended) ─────────────
# Even with the nginx proxy, set FRONTEND_ORIGIN for any direct API use.

export WEB_URL=$(gcloud run services describe cvagent-web --region "$REGION" --format='value(status.url)')

gcloud run services update cvagent-api \
  --region "$REGION" \
  --update-env-vars "FRONTEND_ORIGIN=${WEB_URL}"
