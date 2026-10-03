import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import "../styles/dashboard.css";
import { assetUrl } from "../utils/assets";

export default function Jobs() {
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const [jobList, setJobList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterLocation, setFilterLocation] = useState("All");
    const [loading, setLoading] = useState(true);

    const loadJobs = () => {
        setLoading(true);
        axiosInstance
            .get("/jobs")
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : [];
                setJobList(data);
            })
            .catch(() => toast.error("Failed to load jobs"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const filteredJobs = useMemo(() => {
        return jobList.filter(job => {
            const matchesSearch = (job.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (job.company || "").toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = filterLocation === "All" || job.location === filterLocation;
            return matchesSearch && matchesLocation;
        });
    }, [searchTerm, filterLocation, jobList]);

    const deleteJob = (id) => {
        if (window.confirm("Are you sure you want to delete this job listing?")) {
            axiosInstance.delete(`/jobs/${id}`)
                .then(() => {
                    toast.success("Job deleted successfully");
                    loadJobs();
                })
                .catch(() => toast.error("Failed to delete job. Restricted access."));
        }
    };

    const uniqueLocations = ["All", ...new Set(jobList.filter(j => j && j.location).map(j => j.location))];

    return (
        <DashboardLayout>
            <div className="welcome-banner p-4 mb-5 glass border-0 overflow-hidden position-relative rounded-lg shadow-xl" style={{
                backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.7), rgba(15, 23, 42, 0.9)), url(https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div className="d-flex justify-content-between align-items-center position-relative" style={{ zIndex: 1 }}>
                    <div>
                        <div className="badge-pill bg-white-10 text-white mb-2 d-inline-block px-3 py-1 fw-800 fs-xs text-uppercase backdrop-blur">Global Market</div>
                        <h2 className="fw-900 text-white mb-1">Career Opportunities</h2>
                        <p className="text-white opacity-75 small mb-0">Explore {jobList.length} open opportunities across the globe</p>
                    </div>

                    {role === "RECRUITER" && (
                        <button
                            className="btn btn-white text-primary fw-900 shadow-lg px-4 py-2 rounded-pill"
                            onClick={() => navigate("/dashboard/post-job")}
                        >
                            <i className="bi bi-plus-lg me-2"></i> Post New Job
                        </button>
                    )}
                </div>
            </div>

            {/* SEARCH & FILTER BAR */}
            <div className="dashboard-card p-3 mt-4 mb-4 fade-in bg-white border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <div className="row g-3 align-items-center">
                    <div className="col-lg-7">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-search"></i></span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Search by title or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-geo-alt"></i></span>
                            <select
                                className="form-select border-start-0 ps-0"
                                value={filterLocation}
                                onChange={(e) => setFilterLocation(e.target.value)}
                            >
                                {uniqueLocations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <div className="text-end text-muted small px-2">
                            {filteredJobs.length} Results
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 fade-in">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map((i) => (
                        <div className="col-lg-4 col-md-6" key={i}>
                            <div className="dashboard-card h-100 p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="skeleton-avatar skeleton"></div>
                                    <div className="skeleton" style={{ width: '60px', height: '20px' }}></div>
                                </div>
                                <div className="skeleton-title skeleton mb-2"></div>
                                <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                                <div className="mt-4 mb-4">
                                    <div className="skeleton-text skeleton"></div>
                                    <div className="skeleton-text skeleton" style={{ width: '80%' }}></div>
                                </div>
                                <div className="mt-auto pt-3 border-top">
                                    <div className="skeleton-btn skeleton"></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    filteredJobs.map((job) => (
                        <div className="col-lg-4 col-md-6" key={job.id}>
                            <div className="dashboard-card h-100 p-4 hover-lift">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="job-list-company-logo">
                                        {job.companyImageUrl ? (
                                            <img src={assetUrl(job.companyImageUrl)} alt={`${job.company || "Company"} logo`} />
                                        ) : (
                                            <span>{job.company?.charAt(0) || "C"}</span>
                                        )}
                                    </div>
                                    <div className="d-flex gap-2">
                                        {job.id > (jobList[0]?.id - 3) && <span className="badge-pill bg-green-soft text-success border-0 px-2" style={{ fontSize: '0.6rem' }}>New</span>}
                                        <span className="badge-pill bg-blue-soft border" style={{ fontSize: '0.65rem' }}>Active</span>
                                    </div>
                                </div>

                                <h5 className="fw-800 mb-1">{job.title}</h5>
                                <p className="text-primary small fw-600 mb-3">{job.company}</p>

                                <div className="d-flex align-items-center gap-3 text-muted mb-4" style={{ fontSize: '0.85rem' }}>
                                    <span><i className="bi bi-geo-alt me-1"></i>{job.location}</span>
                                    <span><i className="bi bi-clock me-1"></i>Full-time</span>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex flex-wrap gap-1">
                                        {(job.skillsRequired || "").split(',').filter(s => s.trim()).map((s, i) => (
                                            <span key={i} className="badge bg-light text-dark border-0 px-2 py-1" style={{ fontSize: '0.7rem' }}>{s.trim()}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
                                    {role === "JOB_SEEKER" ? (
                                        <Link
                                            to={`/dashboard/apply/${job.id}`}
                                            className="btn btn-primary w-100 rounded-pill"
                                        >
                                            Apply Now <i className="bi bi-arrow-right ms-2"></i>
                                        </Link>
                                    ) : (
                                        <div className="d-flex w-100 gap-2">
                                            <button className="btn btn-outline-secondary flex-grow-1 disabled opacity-50 small rounded-pill">
                                                Registered Listing
                                            </button>
                                            {parseInt(localStorage.getItem("userId")) === job.recruiter?.id && (
                                                <button
                                                    className="btn btn-outline-danger px-3 rounded-pill"
                                                    title="Delete My Posting"
                                                    onClick={() => deleteJob(job.id)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {!loading && filteredJobs.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <div className="opacity-25 mb-4">
                            <i className="bi bi-search" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h5 className="text-muted">No matches found.</h5>
                        <p className="text-muted small">Try adjusting your search criteria or location filter.</p>
                        <button className="btn btn-outline-primary btn-sm mt-3" onClick={() => { setSearchTerm(""); setFilterLocation("All"); }}>
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

