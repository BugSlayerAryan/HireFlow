import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import axiosInstance from "../api/axiosInstance";

export default function RecommendedJobs() {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axiosInstance
            .get("/ai/recommend")
            .then(res => setJobs(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <DashboardLayout>
            <div className="page-header slide-in">
                <div>
                    <h4>AI Job Picks</h4>
                    <p className="text-muted small">Personalized recommendations based on your profile</p>
                </div>
            </div>

            <div className="row mt-3 fade-in g-4">
                {jobs.map(job => (
                    <div className="col-md-6 col-lg-4" key={job.id}>
                        <div className="dashboard-card h-100 p-4 hover-lift position-relative overflow-hidden">
                            <div className="position-absolute top-0 end-0 p-3">
                                <span className="badge-pill bg-primary shadow-sm" style={{ fontSize: '0.65rem' }}>
                                    <i className="bi bi-robot me-1"></i> AI PICK
                                </span>
                            </div>

                            <div className="avatar bg-blue-soft text-primary mb-3" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
                                {job.company.charAt(0)}
                            </div>

                            <h5 className="fw-800 mb-1">{job.title}</h5>
                            <p className="text-muted small mb-3">{job.company}</p>

                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div className="dot bg-success"></div>
                                <span className="small fw-700 text-success">High Compatibility</span>
                            </div>

                            <div className="mt-auto d-flex flex-column gap-2">
                                <button
                                    onClick={() => navigate(`/dashboard/apply/${job.id}`)}
                                    className="btn btn-primary w-100"
                                >
                                    Review & Apply
                                </button>
                                <span className="text-center text-muted" style={{ fontSize: '0.65rem' }}>Matches your skill stack perfectly</span>
                            </div>
                        </div>
                    </div>
                ))}

                {jobs.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <div className="mb-4 opacity-25">
                            <i className="bi bi-stars" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h5 className="text-muted">No tailored picks yet.</h5>
                        <p className="text-muted small">We&apos;re scanning the market for roles that match your profile.</p>
                        <button className="btn btn-outline-primary mt-3 px-4">Refresh Feed</button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

