import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import axiosInstance from "../api/axiosInstance";
import { Radar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale
} from 'chart.js';
import "../styles/dashboard.css";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale
);

export default function Dashboard() {
    const role = localStorage.getItem("role");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [randomSkillData, setRandomSkillData] = useState([]);
    const [randomMarketData, setRandomMarketData] = useState([]);

    let greetingName = "Candidate";
    if (role === "ADMIN") greetingName = "Administrator";
    else if (role === "RECRUITER") greetingName = "Recruiter";

    useEffect(() => {
        axiosInstance.get("/dashboard/stats")
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch stats", err);
                setLoading(false);
            });
    }, []);

    const userSkills = useMemo(() => stats?.userSkills || ['React', 'Node.js', 'System Design', 'Teamwork', 'Logic', 'DevOps'], [stats?.userSkills]);

    useEffect(() => {
        setRandomSkillData(userSkills.map(() => 60 + Math.random() * 40));
        setRandomMarketData(userSkills.map(() => 65 + Math.random() * 15));
    }, [userSkills]);

    const radarData = useMemo(() => ({
        labels: userSkills.slice(0, 6),
        datasets: [
            {
                label: 'Your Skill Level',
                data: randomSkillData,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
            },
            {
                label: 'Market Average',
                data: randomMarketData,
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                borderColor: 'rgba(6, 182, 212, 1)',
                borderWidth: 2,
            },
        ],
    }), [userSkills, randomSkillData, randomMarketData]);

    const lineData = useMemo(() => ({
        labels: stats?.successTrend?.map(m => m.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Application Success rate',
                data: stats?.successTrend?.map(m => m.rate) || [33, 45, 62, 55, 78, 85],
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: 'var(--primary-color)',
                tension: 0.4,
            },
        ],
    }), [stats?.successTrend]);

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(148, 163, 184, 0.1)' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
                pointLabels: { color: 'var(--text-muted)', font: { size: 10 } },
                ticks: { display: false }
            }
        },
        plugins: { legend: { display: false } }
    };

    // Recruiter Data: Hiring Funnel from backend
    const recruiterFunnelData = useMemo(() => ({
        labels: stats?.recruiterFunnel?.map(f => f.stage) || ['Apps', 'Screened', 'Interview', 'Hired'],
        datasets: [{
            label: 'Candidate Flow',
            data: stats?.recruiterFunnel?.map(f => f.count) || [120, 45, 12, 4],
            backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'],
            borderRadius: 8,
        }]
    }), [stats?.recruiterFunnel]);

    // Admin Data: Platform Growth from backend
    const adminGrowthData = useMemo(() => ({
        labels: stats?.monthlyGrowth?.map(m => m.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'New Users',
            data: stats?.monthlyGrowth?.map(m => m.users) || [400, 600, 800, 1200, 1900, 2400],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
        }]
    }), [stats?.monthlyGrowth]);

    const renderAdminStats = () => (
        <div className="stats-grid">
            <StatCard title="Active Jobs" value={stats?.totalJobs || 0} icon={<i className="bi bi-briefcase"></i>} bgClass="bg-blue" />
            <StatCard title="Total Applications" value={stats?.totalApplications || 0} icon={<i className="bi bi-file-earmark-text"></i>} bgClass="bg-green" />
            <StatCard title="Verify Recruiters" value={stats?.totalRecruiters || 0} icon={<i className="bi bi-building"></i>} bgClass="bg-orange" />
            <StatCard title="Registered Seekers" value={stats?.totalSeekers || 0} icon={<i className="bi bi-person-check"></i>} bgClass="bg-purple" />
        </div>
    );

    const renderRecruiterStats = () => (
        <div className="stats-grid">
            <StatCard title="My Job Posts" value={stats?.myJobsCount || 0} icon={<i className="bi bi-journal-text"></i>} bgClass="bg-blue" />
            <StatCard title="Apps Received" value={stats?.totalAppsReceived || 0} icon={<i className="bi bi-people"></i>} bgClass="bg-green" />
            <StatCard title="Pending Review" value={stats?.pendingApps || 0} icon={<i className="bi bi-clock-history"></i>} bgClass="bg-orange" />
            <StatCard title="Avg Match %" value={`${stats?.avgMatchScore || 0}%`} icon={<i className="bi bi-cpu"></i>} bgClass="bg-purple" />
        </div>
    );

    const renderSeekerStats = () => (
        <div className="stats-grid">
            <StatCard title="Jobs Applied" value={stats?.jobsApplied || 0} icon={<i className="bi bi-send-check"></i>} bgClass="bg-blue" />
            <StatCard title="High Match (80%+)" value={stats?.highMatchJobs || 0} icon={<i className="bi bi-stars"></i>} bgClass="bg-green" />
            <StatCard title="Approved / Offers" value={stats?.approvedApps || 0} icon={<i className="bi bi-award"></i>} bgClass="bg-orange" />
            <StatCard title="Available Jobs" value={stats?.availableJobs || 0} icon={<i className="bi bi-search"></i>} bgClass="bg-purple" />
        </div>
    );

    if (loading) return (
        <DashboardLayout>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="fade-in px-2 px-lg-4">
                <div className="welcome-banner p-5 mb-5 glass border-0 overflow-hidden position-relative rounded-lg shadow-xl" style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 27, 75, 0.9)), url(${role === 'ADMIN' ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070' : 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div className="landing-hero-glow"></div>
                    <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
                        <div className="col-md-8">
                            <div className="badge-pill bg-primary-soft text-primary px-3 py-1 mb-3 d-inline-block small fw-800">SYSTEM ACTIVE</div>
                            <h1 className="fw-900 mb-2 text-white display-5">Welcome, {greetingName}.</h1>
                            <p className="lead mb-0 text-white opacity-75">You are currently accessing the <span className="fw-900 text-primary">{role?.replace('_', ' ')} COMMAND CENTER</span>.</p>
                        </div>
                        <div className="col-md-4 text-md-end mt-4 mt-md-0">
                            <div className="glass p-3 rounded-4 d-inline-block border-0 bg-white-10">
                                <div className="small text-white-50 opacity-75 mb-1">Local Network Time</div>
                                <div className="h4 mb-0 text-white fw-800">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="slide-in mb-5">
                    {role?.toUpperCase() === 'ADMIN' && renderAdminStats()}
                    {role?.toUpperCase() === 'RECRUITER' && renderRecruiterStats()}
                    {role?.toUpperCase() === 'JOB_SEEKER' && renderSeekerStats()}
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="dashboard-card h-100 fade-in">
                            <h5 className="dashboard-card-title mb-4">AI Talent Analytics</h5>

                            {role?.toUpperCase() === 'JOB_SEEKER' && (
                                <div className="row g-4 align-items-center">
                                    <div className="col-md-5">
                                        <div className="p-3 bg-card rounded-4 border">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="small fw-bold mb-0 text-main">Skill Alignment Map</h6>
                                                <button
                                                    className="btn btn-xs btn-link p-0 text-primary border-0"
                                                    onClick={() => window.dispatchEvent(new CustomEvent('openChatbot', { detail: "Can you analyze my skill alignment map? What should I focus on next based on my current profile?" }))}
                                                    title="Ask AI for advice"
                                                >
                                                    <i className="bi bi-info-circle-fill"></i>
                                                </button>
                                            </div>
                                            <div style={{ height: '220px' }}>
                                                <Radar data={radarData} options={radarOptions} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="p-4 bg-card rounded-4 border h-100">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="small fw-bold mb-0 text-main">Hiring Probability Trend</h6>
                                                <span className="badge-pill bg-green-soft text-green">+12% Growth</span>
                                            </div>
                                            <div style={{ height: '180px' }}>
                                                <Line data={lineData} options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: { legend: { display: false } },
                                                    scales: {
                                                        x: { display: false },
                                                        y: { display: false }
                                                    }
                                                }} />
                                            </div>
                                            <div className="mt-3">
                                                <p className="extra-small text-muted mb-0">
                                                    <i className="bi bi-info-circle me-1"></i>
                                                    Your profile is trending higher in the Fintech sector this month.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {role?.toUpperCase() === 'RECRUITER' && (
                                <div className="row g-4 align-items-center">
                                    <div className="col-md-6">
                                        <div className="p-4 bg-card rounded-4 border">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="small fw-bold mb-0 text-main">Hiring Pipeline Funnel</h6>
                                                <button
                                                    className="btn btn-xs btn-link p-0 text-primary border-0"
                                                    onClick={() => window.dispatchEvent(new CustomEvent('openChatbot', { detail: "My hiring pipeline funnel seems to have a drop-off. How can I optimize my candidate screening process to improve efficiency?" }))}
                                                    title="Get AI optimization tips"
                                                >
                                                    <i className="bi bi-info-circle-fill"></i>
                                                </button>
                                            </div>
                                            <div style={{ height: '200px' }}>
                                                <Radar data={recruiterFunnelData} options={radarOptions} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-4 bg-card rounded-4 border">
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <i className="bi bi-lightning text-warning"></i>
                                                <h6 className="small fw-bold mb-0 text-main">AI Smart Match Speed</h6>
                                            </div>
                                            <h3 className="fw-bold text-main mb-1">0.8s</h3>
                                            <p className="extra-small text-muted">Average time to analyze candidate DNA.</p>
                                            <div className="progress mt-4" style={{ height: '8px' }}>
                                                <div className="progress-bar bg-success" style={{ width: '92%' }}></div>
                                            </div>
                                            <span className="extra-small text-muted mt-2 d-block">92% efficiency vs industry average</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {role?.toUpperCase() === 'ADMIN' && (
                                <div className="row g-4">
                                    <div className="col-md-12">
                                        <div className="p-4 bg-card rounded-4 border">
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h6 className="small fw-bold mb-0 text-main">Platform Traffic & Growth</h6>
                                                <div className="d-flex gap-2">
                                                    <span className="badge-pill bg-primary-soft text-primary small">Live</span>
                                                </div>
                                            </div>
                                            <div style={{ height: '220px' }}>
                                                <Line data={adminGrowthData} options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: { legend: { display: false } },
                                                    scales: {
                                                        y: { grid: { color: 'rgba(148, 163, 184, 0.05)' }, ticks: { color: '#94a3b8' } },
                                                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                                                    }
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="dashboard-card h-100 fade-in">
                            <h5 className="dashboard-card-title">Recent Activity</h5>
                            <div className="activity-feed">
                                {(stats?.recentActions || []).length > 0 ? (
                                    stats.recentActions.map((action, index) => (
                                        <div key={index} className="d-flex gap-3 mb-4 last-child-mb-0">
                                            <div className="avatar bg-blue-soft text-primary flex-shrink-0">
                                                <i className={`bi ${action.title.includes('Job') ? 'bi-briefcase' : 'bi-lightning-charge'}`}></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-1 fw-bold small">{action.title}</h6>
                                                <p className="mb-1 text-muted small">{action.description}</p>
                                                <span className="text-muted opacity-75" style={{ fontSize: '0.7rem' }}>{action.time}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 opacity-50">
                                        <p className="small mb-0">No recent activity detected.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
