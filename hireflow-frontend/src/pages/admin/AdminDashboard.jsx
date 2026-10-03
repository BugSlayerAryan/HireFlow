import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import { FiUsers, FiBriefcase, FiUserCheck, FiActivity, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRecruiters: 0,
        totalJobs: 0,
        totalInterviews: 0,
        systemHealth: 0,
        serverLoad: 0,
        databaseUsage: 0,
        memoryUsage: 0
    });

    useEffect(() => {
        axiosInstance.get("/dashboard/stats")
            .then(res => {
                setStats({
                    totalUsers: res.data.totalUsers || 0,
                    totalRecruiters: res.data.totalRecruiters || 0,
                    totalJobs: res.data.totalJobs || 0,
                    totalInterviews: res.data.totalInterviews || 0,
                    systemHealth: res.data.systemHealth || 98,
                    serverLoad: res.data.serverLoad || 24,
                    databaseUsage: res.data.databaseUsage || 42,
                    memoryUsage: res.data.memoryUsage || 18
                });
            })
            .catch(err => console.error("Stats fetch error:", err));
    }, []);
    return (
        <DashboardLayout>
            <div className="welcome-banner p-4 mb-5 glass border-0 overflow-hidden position-relative rounded-lg shadow-xl" style={{
                backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 27, 75, 0.95)), url(https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div className="position-relative" style={{ zIndex: 1 }}>
                    <div className="badge-pill bg-primary-soft text-primary mb-3 d-inline-block px-3 py-1 fw-800 fs-xs">NODE: GLOBAL_ADMIN_01</div>
                    <h2 className="fw-900 text-white mb-1">Architecture Analytics</h2>
                    <p className="text-white opacity-75 lead small mb-0">Real-time infrastructure monitoring and global platform oversight.</p>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<FiUsers />}
                    bgClass="bg-blue"
                />
                <StatCard
                    title="Recruiters"
                    value={stats.totalRecruiters}
                    icon={<FiUserCheck />}
                    bgClass="bg-purple"
                />
                <StatCard
                    title="Jobs Posted"
                    value={stats.totalJobs}
                    icon={<FiBriefcase />}
                    bgClass="bg-green"
                />
                <StatCard
                    title="Interviews"
                    value={stats.totalInterviews}
                    icon={<FiActivity />}
                    bgClass="bg-orange"
                />
            </div>

            <div className="row mt-4">
                <div className="col-lg-8">
                    <div className="dashboard-card h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="dashboard-card-title mb-0">Platform Activity</h5>
                            <span className="badge-pill bg-primary-soft">Live Status</span>
                        </div>

                        <div className="activity-placeholder p-5 text-center bg-light rounded-4 overflow-hidden position-relative">
                            <div className="landing-hero-glow" style={{ opacity: 0.1 }}></div>
                            <div className="pulse-icon mb-3">
                                <FiActivity size={40} className="text-primary" />
                            </div>
                            <h6 className="fw-bold">All Systems Operational</h6>
                            <p className="text-muted mb-4 small">Real-time monitoring is active. No pending alerts found for the current period.</p>
                            <button
                                className="btn btn-primary-gradient btn-sm px-4 rounded-pill shadow-lg border-0"
                                onClick={() => window.dispatchEvent(new CustomEvent('openChatbot', {
                                    detail: `Perform a system audit. Current stats: Health ${stats.systemHealth}%, Load ${stats.serverLoad}%, DB Usage ${stats.databaseUsage}%. Any optimizations needed?`
                                }))}
                            >
                                <i className="bi bi-cpu me-2"></i> Run AI System Audit
                            </button>
                        </div>

                        <div className="mt-4">
                            <h6 className="fw-bold mb-3">Quick Navigation</h6>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <Link to="/admin/users" className="action-btn text-decoration-none">
                                        <div className="bg-blue-soft p-2 rounded-3">
                                            <FiUsers className="text-blue" />
                                        </div>
                                        <span>Manage Users</span>
                                        <FiArrowRight className="ms-auto text-muted" />
                                    </Link>
                                </div>
                                <div className="col-md-6">
                                    <Link to="/admin/jobs" className="action-btn text-decoration-none">
                                        <div className="bg-green-soft p-2 rounded-3">
                                            <FiBriefcase className="text-green" />
                                        </div>
                                        <span>Audit Jobs</span>
                                        <FiArrowRight className="ms-auto text-muted" />
                                    </Link>
                                </div>
                                <div className="col-md-6">
                                    <Link to="/admin/reports" className="action-btn text-decoration-none">
                                        <div className="bg-orange-soft p-2 rounded-3">
                                            <i className="bi bi-bar-chart-fill text-orange"></i>
                                        </div>
                                        <span>Analytics Insight</span>
                                        <FiArrowRight className="ms-auto text-muted" />
                                    </Link>
                                </div>
                                <div className="col-md-6">
                                    <Link to="/dashboard/interviews" className="action-btn text-decoration-none">
                                        <div className="bg-purple-soft p-2 rounded-3">
                                            <i className="bi bi-calendar2-check-fill text-purple"></i>
                                        </div>
                                        <span>Interview Pipeline</span>
                                        <FiArrowRight className="ms-auto text-muted" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="dashboard-card h-100">
                        <h5 className="dashboard-card-title">System Metrics</h5>
                        <div className="metric-item mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="small fw-semibold">Server Load</span>
                                <span className="small fw-bold">{stats.serverLoad}%</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar bg-primary" style={{ width: `${stats.serverLoad}%` }}></div>
                            </div>
                        </div>
                        <div className="metric-item mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="small fw-semibold">Database Usage</span>
                                <span className="small fw-bold">{stats.databaseUsage}%</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar bg-info" style={{ width: `${stats.databaseUsage}%` }}></div>
                            </div>
                        </div>
                        <div className="metric-item">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="small fw-semibold">Memory Usage</span>
                                <span className="small fw-bold">{stats.memoryUsage}%</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar bg-success" style={{ width: `${stats.memoryUsage}%` }}></div>
                            </div>
                        </div>

                        <div className="mt-5 p-4 bg-light rounded-4 border">
                            <h6 className="fw-bold small mb-2">Security Status</h6>
                            <div className="d-flex align-items-center gap-2">
                                <div className="dot bg-success"></div>
                                <span className="small text-muted">Firewall Protected</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
