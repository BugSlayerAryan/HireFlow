import { NavLink, useNavigate } from "react-router-dom";
import { clearAuthStorage } from "../utils/auth";

export default function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    clearAuthStorage();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo"><span className="logo-orb"><i className="bi bi-stars"></i></span><span className="logo-gradient">HireFlow</span></div>
      <div className="sidebar-section-label">Workspace</div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" end><i className="bi bi-grid-1x2"></i><span>Dashboard</span></NavLink>
        <NavLink to="/dashboard/jobs"><i className="bi bi-briefcase"></i><span>Explore Jobs</span></NavLink>
        {role === "RECRUITER" && <>
          <NavLink to="/dashboard/post-job"><i className="bi bi-plus-circle"></i><span>Post a Job</span></NavLink>
          <NavLink to="/dashboard/applications"><i className="bi bi-people"></i><span>Applications</span></NavLink>
        </>}
        {role === "JOB_SEEKER" && <>
          <NavLink to="/dashboard/my-applications"><i className="bi bi-send-check"></i><span>My Applications</span></NavLink>
          <NavLink to="/dashboard/resume-match"><i className="bi bi-stars"></i><span>Resume Match</span></NavLink>
          <NavLink to="/dashboard/recommended"><i className="bi bi-lightbulb"></i><span>AI Job Picks</span></NavLink>
        </>}
        {role === "ADMIN" && <>
          <NavLink to="/admin/dashboard"><i className="bi bi-shield-lock"></i><span>Admin Dashboard</span></NavLink>
          <NavLink to="/admin/users"><i className="bi bi-people"></i><span>Users</span></NavLink>
          <NavLink to="/admin/jobs"><i className="bi bi-collection"></i><span>All Listings</span></NavLink>
          <NavLink to="/admin/reports"><i className="bi bi-bar-chart"></i><span>Reports</span></NavLink>
        </>}
        <div className="sidebar-divider"></div>
        <NavLink to="/dashboard/interviews"><i className="bi bi-calendar2-event"></i><span>Interviews</span></NavLink>
        <NavLink to="/dashboard/profile"><i className="bi bi-person-circle"></i><span>My Profile</span></NavLink>
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-ai-card"><i className="bi bi-lightning-charge-fill"></i><div><strong>HireFlow AI</strong><span>Assistant online</span></div></div>
        <button onClick={handleLogout} className="sidebar-logout"><i className="bi bi-box-arrow-left"></i><span>Logout</span></button>
      </div>
    </aside>
  );
}
