// Local / default: empty apiBaseUrl → browser uses same-origin /api and /health
// (Vite proxy in dev, nginx proxy if BACKEND_URL is unset).
// On Cloud Run the container entrypoint overwrites this file with the real BACKEND_URL.
window.__CVAGENT_CONFIG__ = { apiBaseUrl: "" };
