import { Navigate } from "react-router-dom";
import { getStoredSession } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const session = getStoredSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
