import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import axiosInstance from "../api/axiosInstance";
import { FaCalendarAlt, FaLink, FaClock, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Interviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem("role");

    useEffect(() => {
        axiosInstance.get("/interviews/my")
            .then(res => setInterviews(res.data))
            .catch(() => toast.error("Failed to fetch interviews"))
            .finally(() => setLoading(false));
    }, []);

    const getStatusClass = (status) => {
        if (status === "PENDING") return "bg-orange-soft text-warning border";
        if (status === "COMPLETED") return "bg-green-soft text-success border";
        return "bg-secondary-soft text-muted border";
    };

    return (
        <DashboardLayout>
            <div className="page-header slide-in">
                <div>
                    <h4>Interview Pipeline</h4>
                    <p className="text-muted small">Upcoming and past technical assessments</p>
                </div>
            </div>

            <div className="row mt-4 fade-in">
                {interviews.length > 0 ? (
                    interviews.map(interview => (
                        <div key={interview.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="dashboard-card h-100 position-relative overflow-hidden">
                                <div className="landing-hero-glow" style={{ opacity: 0.1, top: '-50%', right: '-50%' }}></div>

                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <span className={`badge-pill ${getStatusClass(interview.status)}`}>
                                        {interview.status}
                                    </span>
                                    <div className="avatar bg-primary-soft text-primary" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
                                        <FaCalendarAlt />
                                    </div>
                                </div>

                                <h5 className="fw-900 mb-1">{interview.application?.job?.title}</h5>
                                <p className="text-primary small fw-bold mb-0">Candidate: {interview.application?.user?.name}</p>
                                <p className="text-muted extra-small mb-3">{interview.application?.job?.company}</p>

                                <div className="d-flex flex-column gap-2 mb-4">
                                    <div className="d-flex align-items-center gap-2 text-dark small">
                                        <FaClock className="text-primary opacity-50" />
                                        <span>{new Date(interview.scheduledAt).toLocaleString()}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-dark small">
                                        <FaLink className="text-primary opacity-50" />
                                        <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none text-truncate" style={{ maxWidth: '200px' }}>
                                            Join Meeting
                                        </a>
                                    </div>
                                </div>

                                <div className="p-3 bg-light rounded-3 mb-3">
                                    <p className="extra-small fw-800 text-uppercase text-muted mb-1">Recruiter Notes</p>
                                    <p className="small mb-0 text-dark opacity-75">{interview.notes || "No notes provided."}</p>
                                </div>

                                {role === "RECRUITER" && interview.status === "PENDING" && (
                                    <button className="btn btn-outline-success btn-sm w-100 rounded-pill mt-2">
                                        <FaCheckCircle className="me-1" /> Mark as Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : !loading && (
                    <div className="col-12 text-center py-5">
                        <div className="opacity-25 mb-4">
                            <FaCalendarAlt size={80} className="text-primary" />
                        </div>
                        <h4 className="text-muted fw-800">No scheduled interviews.</h4>
                        <p className="text-muted">Once a recruiter schedules an interview, it will appear here.</p>
                    </div>
                )}
                {loading && (
                    <div className="col-12 text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
