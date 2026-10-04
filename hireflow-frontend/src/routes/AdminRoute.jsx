import { Navigate } from "react-router-dom";
import { getStoredSession } from "../utils/auth";

export default function AdminRoute({ children }) {
  const session = getStoredSession();

  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== "ADMIN") return <Navigate to="/dashboard" replace />;

  return children;
}
