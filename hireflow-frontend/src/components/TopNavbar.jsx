import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ThemeToggle from "./ThemeToggle";
import axiosInstance from "../api/axiosInstance";
import { assetUrl } from "../utils/assets";
import "../styles/dashboard.css";

export default function TopNavbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "USER";
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Candidate");
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImageUrl") || "");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    let active = true;
    axiosInstance.get("/auth/user").then(({ data }) => {
      if (!active || !data) return;
      setUserName(data.name || "User");
      setProfileImage(data.profileImageUrl || "");
      localStorage.setItem("userName", data.name || "User");
      if (data.profileImageUrl) localStorage.setItem("profileImageUrl", data.profileImageUrl);
    }).catch(() => {});

    const onProfileUpdate = (event) => {
      if (event.detail?.name) setUserName(event.detail.name);
      if (event.detail?.profileImageUrl !== undefined) setProfileImage(event.detail.profileImageUrl || "");
    };
    window.addEventListener("hireflow-profile-updated", onProfileUpdate);
    return () => {
      active = false;
      window.removeEventListener("hireflow-profile-updated", onProfileUpdate);
    };
  }, []);

  const roleLabel = role === "ADMIN" ? "Platform Administrator" : role === "RECRUITER" ? "Recruiter Workspace" : "Candidate Workspace";
  const notifications = [
    { id: 1, text: "Your HireFlow workspace is ready.", time: "Now" },
    { id: 2, text: role === "RECRUITER" ? "Review recent candidate activity." : "Explore your latest job matches.", time: "Today" }
  ];
  const fallbackInitial = (userName || "U").trim().charAt(0).toUpperCase();

  return (
    <header className="top-navbar">
      <div className="topbar-title-group">
        <div className="topbar-product-icon"><i className="bi bi-stars"></i></div>
        <div>
          <h6 className="mb-0">HireFlow AI</h6>
          <span className="topbar-role-label">{roleLabel}</span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 gap-md-3">
        <ThemeToggle />
        <div className="position-relative">
          <button onClick={() => setShowNotifications((v) => !v)} className="btn-icon" aria-label="Notifications">
            <i className="bi bi-bell"></i><span className="notification-badge"></span>
          </button>
          {showNotifications && (
            <div className="notification-dropdown glass fade-in">
              <div className="dropdown-header d-flex justify-content-between align-items-center">
                <span>Notifications</span>
                <button className="btn btn-link btn-sm p-0 text-decoration-none extra-small" onClick={() => toast.info("All notifications marked as read")}>Mark read</button>
              </div>
              {notifications.map((n) => <div key={n.id} className="dropdown-item"><p className="mb-0 small fw-bold">{n.text}</p><span className="extra-small text-muted">{n.time}</span></div>)}
            </div>
          )}
        </div>

        <button className="topbar-profile-button" onClick={() => navigate("/dashboard/profile")} aria-label="Open profile">
          <div className="topbar-user-copy d-none d-sm-block">
            <p className="mb-0 fw-800 small text-main">{userName}</p>
            <span>{role.replace("_", " ")}</span>
          </div>
          <div className="avatar topbar-avatar">
            {profileImage ? <img src={assetUrl(profileImage)} alt={`${userName} profile`} /> : <span>{fallbackInitial}</span>}
            <span className="online-dot"></span>
          </div>
        </button>
      </div>
    </header>
  );
}
