import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but not admin
    if (role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    // Admin access granted
    return children;
}
