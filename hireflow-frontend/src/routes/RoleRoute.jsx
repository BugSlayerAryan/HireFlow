import { Navigate } from "react-router-dom";
import { getDefaultRouteForRole, isRoleAllowed } from "../utils/auth";

export default function RoleRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (!isRoleAllowed(role, allowedRoles)) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return children;
}
