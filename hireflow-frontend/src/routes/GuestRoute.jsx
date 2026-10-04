import { Navigate } from "react-router-dom";
import { getDefaultRouteForRole, getStoredSession } from "../utils/auth";

export default function GuestRoute({ children }) {
  const session = getStoredSession();

  if (session) {
    return <Navigate to={getDefaultRouteForRole(session.role)} replace />;
  }

  return children;
}
