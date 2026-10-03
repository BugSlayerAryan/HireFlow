import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import MatchResult from "../components/MatchResult";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function ResumeMatch() {
    const [result, setResult] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [jobData, setJobData] = useState("Java, Spring Boot, React, Docker, AWS");

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const analyzeResume = async () => {
        if (!resumeFile) {
            toast.warn("Please upload your resume file first.");
            return;
        }

        setAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append("resumeFile", resumeFile);
            formData.append("job", jobData);

            const res = await axiosInstance.post("/ai/match", formData);
            setResult(res.data);
            toast.success("AI analysis complete!");
        } catch (error) {
            console.error("Analysis failed", error);
            toast.error("AI analysis failed. Invalid file or server error.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="welcome-banner p-4 mb-5 glass border-0 overflow-hidden position-relative rounded-lg shadow-xl" style={{
                backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.7), rgba(30, 27, 75, 0.9)), url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid rgba(255,b255,255,0.05)'
            }}>
                <div className="position-relative" style={{ zIndex: 1 }}>
                    <div className="badge-pill bg-white-10 text-white mb-2 d-inline-block px-3 py-1 fw-800 fs-xs text-uppercase backdrop-blur">AI Analysis Core</div>
                    <h2 className="fw-900 text-white mb-1">Resume Intelligence</h2>
                    <p className="text-white opacity-75 small mb-0">Optimizing your technical profile for the global talent network.</p>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-lg-6">
                    <div className="dashboard-card fade-in">
                        <h5 className="dashboard-card-title small text-uppercase">Resume Analysis</h5>

                        <div className="mb-4">
                            <label className="form-label fw-bold small">Upload Resume (PDF, DOCX)</label>
                            <div className="upload-box p-4 border-dashed rounded-lg text-center bg-light cursor-pointer"
                                onClick={() => document.getElementById('resumeFileInput').click()}
                                style={{ border: '2px dashed #cbd5e1' }}>
                                <i className="bi bi-cloud-arrow-up fs-1 text-primary mb-2 d-block"></i>
                                <span className="text-muted small">
                                    {resumeFile ? resumeFile.name : "Click to select or drop your resume here"}
                                </span>
                                <input
                                    type="file"
                                    id="resumeFileInput"
                                    className="d-none"
                                    accept=".pdf,.docx,.doc"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold small">Target Job Requirements</label>
                            <input
                                className="form-control"
                                placeholder="Target Role Skills (e.g. Java, Docker, AWS)"
                                value={jobData}
                                onChange={(e) => setJobData(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn btn-primary w-100"
                            onClick={analyzeResume}
                            disabled={analyzing}
                        >
                            {analyzing ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    AI is reading your resume...
                                </>
                            ) : (
                                <><i className="bi bi-cpu me-2"></i> Run AI Analysis</>
                            )}
                        </button>
                    </div>
                </div>

                <div className="col-lg-6">
                    {result ? (
                        <div className="fade-in">
                            <MatchResult result={result} />
                        </div>
                    ) : (
                        <div className="dashboard-card h-100 d-flex align-items-center justify-content-center text-center opacity-75 border-dashed">
                            <div>
                                <i className="bi bi-robot fs-1 text-muted mb-3 d-block"></i>
                                <p className="text-muted">Upload your resume and enter requirements<br />to generate your AI intelligence report.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

