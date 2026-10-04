import { Navigate } from "react-router-dom";
import { getDefaultRouteForRole, getStoredSession, isRoleAllowed } from "../utils/auth";

export default function RoleRoute({ children, allowedRoles }) {
  const session = getStoredSession();

  if (!session) return <Navigate to="/login" replace />;
  if (!isRoleAllowed(session.role, allowedRoles)) {
    return <Navigate to={getDefaultRouteForRole(session.role)} replace />;
  }

  return children;
}
