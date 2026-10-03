import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function AllJobs() {
    const [jobs, setJobs] = useState([]);

    const loadJobs = () => {
        axiosInstance
            .get("/admin/jobs")
            .then((res) => setJobs(res.data))
            .catch(() => toast.error("Audit access denied"));
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const deleteJob = (id) => {
        if (window.confirm("Are you sure you want to delete this job listing?")) {
            axiosInstance.delete(`/admin/jobs/${id}`)
                .then(() => {
                    toast.success("Listing removed from inventory");
                    loadJobs();
                })
                .catch(() => toast.error("Failed to delete listing"));
        }
    };

    return (
        <DashboardLayout>
            <div className="page-header slide-in">
                <div>
                    <h4>Inventory of Jobs</h4>
                    <p className="text-muted small">Global view of all posted opportunities</p>
                </div>
            </div>

            <div className="glass-table-container fade-in mt-4">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="ps-4">Job Identification</th>
                            <th>Company</th>
                            <th>Location</th>
                            <th className="text-end pe-4">Verification</th>
                        </tr>
                    </thead>

                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.id}>
                                <td className="ps-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar bg-primary text-white" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
                                            <i className="bi bi-briefcase"></i>
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark">{job.title}</div>
                                            <div className="text-muted small">ID: JB-{job.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="fw-600 text-primary">{job.company}</div>
                                </td>
                                <td>
                                    <span className="text-muted">
                                        <i className="bi bi-geo-alt me-1"></i>{job.location}
                                    </span>
                                </td>
                                <td className="text-end pe-4">
                                    <div className="d-flex align-items-center justify-content-end gap-3">
                                        <span className="badge-pill bg-green-soft text-success border small">
                                            Live Listing
                                        </span>
                                        <button
                                            className="btn btn-outline-danger btn-xs border-0"
                                            onClick={() => deleteJob(job.id)}
                                            title="Delete Job"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {jobs.length === 0 && (
                    <div className="text-center py-5">
                        <i className="bi bi-collection fs-1 d-block mb-3 opacity-25"></i>
                        <p className="text-muted">No jobs are currently listed in the database.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
