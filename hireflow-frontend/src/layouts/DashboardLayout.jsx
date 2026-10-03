import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import Chatbot from "../components/Chatbot";
import "../styles/dashboard.css";
import useNotifications from "../hooks/useNotifications";

export default function DashboardLayout({ children }) {
    const userEmail = localStorage.getItem("userEmail");
    useNotifications(userEmail);

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="main-content">
                <TopNavbar />
                <div className="page-content">{children}</div>
                <Chatbot />
            </div>
        </div>
    );
}
