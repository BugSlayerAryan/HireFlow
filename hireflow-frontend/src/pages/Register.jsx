import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import "../styles/auth.css";
import ThemeToggle from "../components/ThemeToggle";

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "JOB_SEEKER",
        skills: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axiosInstance.post("/auth/register", formData);
            toast.success("Account created successfully!");
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            const data = error.response?.data;
            toast.error(data?.message || (typeof data === "string" ? data : "Registration failed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-bg" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1974")' }}>
            <div className="auth-bg-overlay"></div>
            <div className="auth-theme-toggle"><ThemeToggle /></div>
            <div className="auth-bg-mesh"></div>
            <div className="auth-card fade-in">
                <h4 className="text-center auth-title">
                    Create Account
                </h4>
                <p className="text-center auth-subtitle">
                    Join HireFlow AI today
                </p>

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Skills (comma separated)</label>
                        <input
                            className="form-control"
                            name="skills"
                            placeholder="Java, Spring Boot, React"
                            value={formData.skills}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="role-switch mb-4">
                        <button
                            type="button"
                            className={formData.role === "JOB_SEEKER" ? "active" : ""}
                            onClick={() => setFormData({ ...formData, role: "JOB_SEEKER" })}
                        >
                            👤 Job Seeker
                        </button>

                        <button
                            type="button"
                            className={formData.role === "RECRUITER" ? "active" : ""}
                            onClick={() => setFormData({ ...formData, role: "RECRUITER" })}
                        >
                            🏢 Recruiter
                        </button>
                    </div>

                    <button
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <div className="auth-footer-text">
                    Already have an account?{" "}
                    <Link to="/login">Login Now</Link>

                </div>
            </div>
        </div>
    );
}

