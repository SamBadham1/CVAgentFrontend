#!/bin/sh
set -eu

if [ -z "${BACKEND_URL:-}" ]; then
  echo "[cvagent-web] ERROR: BACKEND_URL must be set to your cvagent-api Cloud Run URL"
  exit 1
fi

# Inject Cloud Run BACKEND_URL so the browser calls the API directly.
# (Container env vars are not available to client-side JS otherwise.)
API_BASE=$(printf '%s' "$BACKEND_URL" | sed 's:/*$::')

cat > /usr/share/nginx/html/runtime-config.js <<EOF
window.__CVAGENT_CONFIG__ = { apiBaseUrl: "${API_BASE}" };
EOF

echo "[cvagent-web] runtime-config apiBaseUrl=${API_BASE}"

# Run the stock nginx entrypoint (envsubst templates → start nginx)
exec /docker-entrypoint.sh nginx -g "daemon off;"
