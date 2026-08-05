export type CvAgentRuntimeConfig = {
  /** Backend origin, e.g. https://cvagent-api-xxx.run.app — empty = same-origin (Vite/nginx proxy) */
  apiBaseUrl: string;
};

declare global {
  interface Window {
    __CVAGENT_CONFIG__?: CvAgentRuntimeConfig;
  }
}

/** API origin from runtime-config.js (Cloud Run) or "" for local proxy. */
export function getApiBaseUrl(): string {
  const raw = window.__CVAGENT_CONFIG__?.apiBaseUrl?.trim() ?? "";
  return raw.replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
