import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import axiosInstance from "../api/axiosInstance";
import { FaCheck, FaTimes, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import ScheduleInterviewModal from "../components/ScheduleInterviewModal";

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);

    const loadApplications = () => {
        axiosInstance
            .get("/applications/recruiter")
            .then((res) => setApplications(res.data))
            .catch(() => toast.error("Failed to load applications"));
    };

    useEffect(() => {
        loadApplications();
    }, []);

    const updateStatus = (id, status) => {
        axiosInstance
            .put(`/applications/${id}/status`, null, {
                params: { status },
            })
            .then(() => {
                toast.success(`Application ${status.toLowerCase()}`);
                loadApplications();
            })
            .catch(() => toast.error("Action failed"));
    };

    const statusBadge = (status) => {
        if (status === "APPROVED") return "bg-green-soft text-success border";
        if (status === "REJECTED") return "bg-pink-100 text-danger border";
        return "bg-orange-soft text-warning border";
    };

    return (
        <DashboardLayout>


            <div className="page-header slide-in">
                <div>
                    <h4>Review Applications</h4>
                    <p className="text-muted small">Manage candidates for your job listings</p>
                </div>
            </div>

            <div className="glass-table-container fade-in mt-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="ps-4">Candidate</th>
                            <th>Position & Intent</th>
                            <th>AI Match</th>
                            <th>Status</th>
                            <th className="text-end pe-4">Decision</th>
                        </tr>
                    </thead>

                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td className="ps-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar bg-primary text-white" style={{ width: '40px', height: '40px', fontSize: '1rem', borderRadius: '12px' }}>
                                            {app.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark">{app.user?.name}</div>
                                            <div className="text-muted small">{app.user?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="fw-700 text-primary">{app.job?.title}</div>
                                    <div className="text-muted small d-flex flex-column">
                                        <span>Applied {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Just now'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="progress flex-grow-1" style={{ height: '8px', width: '80px', borderRadius: '10px' }}>
                                            <div
                                                className={`progress-bar ${app.matchScore > 80 ? 'bg-success' : app.matchScore > 50 ? 'bg-primary' : 'bg-warning'}`}
                                                style={{ width: `${app.matchScore}%` }}
                                            ></div>
                                        </div>
                                        <span className={`fw-900 ${app.matchScore > 80 ? 'text-success' : 'text-primary'}`}>{app.matchScore}%</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge-pill ${statusBadge(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="text-end pe-4">
                                    {app.status === "APPLIED" ? (
                                        <div className="d-flex justify-content-end gap-2">
                                            <button
                                                className="btn btn-primary btn-sm rounded-3 shadow-sm d-flex align-items-center gap-1"
                                                onClick={() => updateStatus(app.id, "APPROVED")}
                                            >
                                                <FaCheck size={12} /> Approve
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm rounded-3 d-flex align-items-center gap-1"
                                                onClick={() => updateStatus(app.id, "REJECTED")}
                                            >
                                                <FaTimes size={12} /> Reject
                                            </button>
                                        </div>
                                    ) : app.status === "APPROVED" ? (
                                        <div className="d-flex justify-content-end">
                                            <button
                                                className="btn btn-primary-gradient btn-sm px-3 rounded-pill shadow-lg border-0 d-flex align-items-center gap-2"
                                                onClick={() => setSelectedApp(app)}
                                            >
                                                <FaCalendarAlt size={12} /> Schedule
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-muted small fw-600">Decision Finalized</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-5">
                                    <div className="opacity-25 mb-3">
                                        <i className="bi bi-people" style={{ fontSize: '4rem' }}></i>
                                    </div>
                                    <h5 className="text-muted">No applications to review.</h5>
                                    <p className="text-muted small">Once candidates apply, they'll appear here for review.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {selectedApp && (
                <ScheduleInterviewModal
                    application={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onScheduled={() => {
                        setSelectedApp(null);
                        loadApplications();
                    }}
                />
            )}
        </DashboardLayout>
    );
}

