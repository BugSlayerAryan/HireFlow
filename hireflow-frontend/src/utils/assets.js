const configuredApi = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";
export const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || configuredApi.replace(/\/api\/?$/, "")).replace(/\/$/, "");

export function assetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
