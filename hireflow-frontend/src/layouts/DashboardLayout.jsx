import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import Chatbot from "../components/Chatbot";
import "../styles/dashboard.css";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.classList.toggle("mobile-nav-open", sidebarOpen);
        return () => document.body.classList.remove("mobile-nav-open");
    }, [sidebarOpen]);

    return (
        <div className="dashboard-wrapper">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <button
                type="button"
                className={`sidebar-backdrop ${sidebarOpen ? "show" : ""}`}
                aria-label="Close navigation"
                onClick={() => setSidebarOpen(false)}
            />
            <div className="main-content">
                <TopNavbar onMenuToggle={() => setSidebarOpen((value) => !value)} />
                <main className="page-content">{children}</main>
                <Chatbot />
            </div>
        </div>
    );
}
