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

export function clearAuthStorage() {
  ["token", "role", "userName", "userId", "userEmail", "profileImageUrl"].forEach((key) => {
    localStorage.removeItem(key);
  });
}
