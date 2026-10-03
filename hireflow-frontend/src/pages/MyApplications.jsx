import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import axiosInstance from "../api/axiosInstance";

export default function MyApplications() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axiosInstance
            .get("/applications/my")
            .then(res => setApplications(res.data))
            .catch(err => console.error(err));
    }, []);

    const getStatusClass = (status) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED': return 'bg-green-soft text-success';
            case 'REJECTED': return 'bg-pink-100 text-danger';
            case 'APPLIED': return 'bg-orange-soft text-warning';
            default: return 'bg-blue-soft text-primary';
        }
    }

    return (
        <DashboardLayout>
            <div className="page-header slide-in">
                <div>
                    <h4>My Journey</h4>
                    <p className="text-muted small">Track your application progress</p>
                </div>
            </div>

            <div className="glass-table-container fade-in mt-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="ps-4">Applied Position</th>
                            <th>Company</th>
                            <th>AI Score</th>
                            <th className="text-end pe-4">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td className="ps-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar bg-blue-soft text-primary" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
                                            <i className="bi bi-briefcase"></i>
                                        </div>
                                        <div>
                                            <div className="fw-700 text-dark">{app.job?.title}</div>
                                            <div className="text-muted small">ID: APP-{app.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="fw-600 text-primary">{app.job?.company}</div>
                                </td>
                                <td>
                                    <span className={`fw-800 ${app.matchScore > 80 ? 'text-success' : 'text-primary'}`}>
                                        {app.matchScore}%
                                    </span>
                                </td>
                                <td className="text-end pe-4">
                                    <div className="d-flex align-items-center justify-content-end gap-2">
                                        <button
                                            className="btn btn-xs btn-outline-primary border-0"
                                            onClick={() => window.dispatchEvent(new CustomEvent('openChatbot', {
                                                detail: `I applied for the ${app.job?.title} role at ${app.job?.company} and the status is ${app.status}. What should be my next steps or follow-up strategy?`
                                            }))}
                                            title="Get AI Follow-up Strategy"
                                        >
                                            <i className="bi bi-lightbulb"></i>
                                        </button>
                                        <span className={`badge-pill ${getStatusClass(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {applications.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-5">
                                    <div className="opacity-25 mb-3">
                                        <i className="bi bi-send-check" style={{ fontSize: '4rem' }}></i>
                                    </div>
                                    <h5 className="text-muted">No applications found.</h5>
                                    <p className="text-muted small">Your journey starts here. Explore jobs and apply now!</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

