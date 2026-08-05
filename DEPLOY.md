# Cloud Run — Vue frontend
#
# Run these from Cloud Shell inside ProdFrontEnd/CVAgentFrontEndVue/
# after uploading/cloning this project.
#
# The browser loads /runtime-config.js which is written at container start from
# BACKEND_URL, so fetch("/health") becomes fetch("https://your-api.../health").
# You MUST set FRONTEND_ORIGIN on the API to this web service URL (CORS).

# ── 1. Backend URL from the API deploy ──────────────────────────────────────
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

export WEB_URL=$(gcloud run services describe cvagent-web --region "$REGION" --format='value(status.url)')
echo "Web URL: $WEB_URL"

# ── 4. REQUIRED: allow this origin on the API (browser calls API directly) ──

gcloud run services update cvagent-api \
  --region "$REGION" \
  --update-env-vars "FRONTEND_ORIGIN=${WEB_URL}"
