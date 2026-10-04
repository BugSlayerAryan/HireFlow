import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import ThemeToggle from "../components/ThemeToggle";
import { getDefaultRouteForRole, normalizeRole, saveAuthSession } from "../utils/auth";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("JOB_SEEKER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", {
        email: email.trim(),
        password,
        role,
      });

      const { token, role: backendRole, name, userId, profileImageUrl } = res.data;
      const normalizedRole = normalizeRole(backendRole);

      saveAuthSession({
        token,
        role: normalizedRole,
        name,
        userId,
        email: email.trim(),
        profileImageUrl,
      });

      toast.success(`Welcome back, ${name || "User"}`);
      navigate(getDefaultRouteForRole(normalizedRole), { replace: true });
    } catch (error) {
      const data = error?.response?.data;
      const message = data?.message || data?.error || (typeof data === "string" ? data : null) || "Invalid email, password, or selected role";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg auth-bg-modern">
      <div className="auth-bg-overlay"></div>
      <div className="auth-theme-toggle"><ThemeToggle /></div>
      <div className="auth-card fade-in">
        <div className="auth-brand-mark"><i className="bi bi-stars"></i></div>
        <h4 className="auth-title">HireFlow AI</h4>
        <p className="auth-subtitle">Sign in to the workspace built for your role</p>

        <div className="role-switch mb-4" aria-label="Choose account role">
          <button type="button" className={role === "JOB_SEEKER" ? "active" : ""} onClick={() => setRole("JOB_SEEKER")}>
            <i className="bi bi-person-workspace me-1"></i> Job Seeker
          </button>
          <button type="button" className={role === "RECRUITER" ? "active" : ""} onClick={() => setRole("RECRUITER")}>
            <i className="bi bi-building me-1"></i> Recruiter
          </button>
          <button type="button" className={role === "ADMIN" ? "active" : ""} onClick={() => setRole("ADMIN")}>
            <i className="bi bi-shield-check me-1"></i> Admin
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="auth-input-wrap">
              <i className="bi bi-envelope"></i>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <div className="auth-input-wrap">
              <i className="bi bi-lock"></i>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required />
            </div>
          </div>
          <button className="btn btn-primary w-100 auth-submit" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</> : <>Sign in as {role.replace("_", " ")} <i className="bi bi-arrow-right ms-2"></i></>}
          </button>
        </form>

        <div className="auth-footer-text">New to HireFlow? <Link to="/register">Create account</Link></div>
      </div>
    </div>
  );
}
