import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";

export default function ApplyJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [job, setJob] = useState(null);
    const [resumeSkills, setResumeSkills] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axiosInstance.get(`/jobs/${id}`)
            .then(res => setJob(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const submitApplication = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.post(`/applications/apply/${id}`, null, {
                params: {
                    resume: resumeSkills,
                },
            });

            toast.success(`Application submitted! AI Match Score: ${res.data.matchScore}%`);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#a855f7', '#ec4899']
            });
            setTimeout(() => navigate("/dashboard/my-applications"), 2000);
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to submit application.");
        } finally {
            setLoading(false);
        }
    };

    const renderStepIcon = (s) => {
        if (step > s) return <i className="bi bi-check-circle-fill text-success"></i>;
        return <span>{s}</span>;
    }

    return (
        <DashboardLayout>
            <div className="page-header slide-in">
                <div>
                    <h4>Application Portal</h4>
                    <p className="text-muted small">
                        {job ? (
                            <>Applying for <span className="text-primary fw-bold">{job.title}</span> at <span className="fw-600">{job.company}</span></>
                        ) : (
                            "Loading opportunity details..."
                        )}
                    </p>
                </div>
            </div>

            <div className="mx-auto" style={{ maxWidth: '700px' }}>
                {/* Step Progress Indicator */}
                <div className="d-flex justify-content-between mb-5 px-5 position-relative">
                    <div className="position-absolute translate-middle-y top-50 start-0 end-0 bg-light" style={{ height: '2px', zIndex: 0, margin: '0 60px' }}></div>
                    <div className="position-absolute translate-middle-y top-50 start-0 bg-primary" style={{ height: '2px', zIndex: 0, margin: '0 60px', width: `${(step - 1) * 45}%`, transition: 'width 0.3s ease' }}></div>

                    {[1, 2, 3].map((s) => (
                        <div key={s} className="text-center" style={{ zIndex: 1, position: 'relative' }}>
                            <div className={`avatar mb-2 ${step >= s ? 'bg-primary text-white shadow' : 'bg-white text-muted border'}`} style={{ width: '40px', height: '40px' }}>
                                {renderStepIcon(s)}
                            </div>
                            <div className={`small fw-bold ${step >= s ? 'text-primary' : 'text-muted'}`}>
                                {s === 1 ? 'Personal' : s === 2 ? 'Experience' : 'AI Analysis'}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-card fade-in">
                    {/* STEP 1 */}
                    {step === 1 && (
                        <div className="slide-in">
                            <h5 className="dashboard-card-title">Personal Details</h5>
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input className="form-control" placeholder="Jane Doe" required />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-control" placeholder="jane@example.com" required />
                            </div>

                            <div className="text-end">
                                <button className="btn btn-primary px-5" onClick={nextStep}>
                                    Next Phase <i className="bi bi-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="slide-in">
                            <h5 className="dashboard-card-title">Background & Pitch</h5>
                            <div className="mb-4">
                                <label className="form-label">Brief Intro / Cover Note</label>
                                <textarea className="form-control" rows="6" placeholder="Tell us why you're a great fit..." />
                            </div>

                            <div className="d-flex justify-content-between">
                                <button className="btn btn-outline-secondary" onClick={prevStep}>
                                    <i className="bi bi-arrow-left"></i> Back
                                </button>
                                <button className="btn btn-primary px-5" onClick={nextStep}>
                                    Next Phase <i className="bi bi-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <div className="slide-in">
                            <h5 className="dashboard-card-title">AI Skill Profiling</h5>
                            <p className="text-muted small mb-4">Our AI will compare your skills against the job requirements to generate a match score.</p>

                            <div className="mb-4">
                                <label className="form-label">Core Technical Skills</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. Java, Python, React, Cloud Architecture"
                                    value={resumeSkills}
                                    onChange={(e) => setResumeSkills(e.target.value)}
                                />
                                <div className="form-text mt-2"><i className="bi bi-info-circle me-1"></i> Use comma-separated values for better match accuracy.</div>
                            </div>

                            <div className="d-flex justify-content-between">
                                <button className="btn btn-outline-secondary" onClick={prevStep}>
                                    <i className="bi bi-arrow-left"></i> Back
                                </button>
                                <button
                                    className="btn btn-primary px-5"
                                    onClick={submitApplication}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span> Submitting...</>
                                    ) : (
                                        <><i className="bi bi-send-fill me-2"></i> Submit Application</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

