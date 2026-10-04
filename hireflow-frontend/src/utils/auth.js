export function normalizeRole(role) {
  if (!role) return "";
  return String(role).trim().toUpperCase().replace(/^ROLE_/, "");
}

export function getDefaultRouteForRole(role) {
  return normalizeRole(role) === "ADMIN" ? "/admin/dashboard" : "/dashboard";
}

export function isRoleAllowed(role, allowedRoles = []) {
  const normalized = normalizeRole(role);
  return allowedRoles.map(normalizeRole).includes(normalized);
}

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  if (!token || token === "null" || token === "undefined") return true;
  const payload = decodeJwtPayload(token);
  if (!payload) return true;
  if (!payload.exp) return false;
  return payload.exp * 1000 <= Date.now();
}

export function getStoredSession() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    clearAuthStorage(false);
    return null;
  }

  return {
    token,
    role: normalizeRole(localStorage.getItem("role")),
    userName: localStorage.getItem("userName") || "User",
    userId: localStorage.getItem("userId") || "",
    userEmail: localStorage.getItem("userEmail") || "",
    profileImageUrl: localStorage.getItem("profileImageUrl") || "",
  };
}

export function hasValidSession() {
  return Boolean(getStoredSession()?.token);
}

export function saveAuthSession({ token, role, name, userId, email, profileImageUrl }) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", normalizeRole(role));
  localStorage.setItem("userName", name || "User");
  localStorage.setItem("userId", String(userId ?? ""));
  localStorage.setItem("userEmail", email || "");

  if (profileImageUrl) {
    localStorage.setItem("profileImageUrl", profileImageUrl);
  } else {
    localStorage.removeItem("profileImageUrl");
  }

  window.dispatchEvent(new CustomEvent("hireflow-auth-changed"));
}

export function clearAuthStorage(emitEvent = true) {
  if (typeof window === "undefined") return;

  ["token", "role", "userName", "userId", "userEmail", "profileImageUrl"].forEach((key) => {
    localStorage.removeItem(key);
  });

  if (emitEvent) {
    window.dispatchEvent(new CustomEvent("hireflow-auth-changed"));
  }
}
