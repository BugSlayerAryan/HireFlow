import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { assetUrl } from "../utils/assets";

const emptyJob = { title: "", company: "", location: "", description: "", skillsRequired: "", companyImageUrl: "" };

export default function PostJob() {
  const navigate = useNavigate();
  const logoRef = useRef(null);
  const [job, setJob] = useState(emptyJob);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleChange = (e) => setJob((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogo = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Choose a valid company logo image");
    if (file.size > 5 * 1024 * 1024) return toast.error("Company image must be 5 MB or smaller");
    const form = new FormData();
    form.append("image", file);
    setUploadingLogo(true);
    try {
      const { data } = await axiosInstance.post("/files/company-image", form);
      setJob((prev) => ({ ...prev, companyImageUrl: data.url }));
      toast.success("Company image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Company image upload failed");
    } finally {
      setUploadingLogo(false);
      if (logoRef.current) logoRef.current.value = "";
    }
  };

  const handleAiEnhance = async () => {
    if (!job.title || !job.skillsRequired) return toast.warn("Add the title and required skills first");
    const id = toast.loading("HireFlow AI is polishing this job description...");
    try {
      const { data } = await axiosInstance.post("/ai/generate-job-description", {
        title: job.title,
        description: job.description,
        skills: job.skillsRequired
      });
      setJob((prev) => ({ ...prev, description: data.description }));
      toast.update(id, { render: "Job description improved", type: "success", isLoading: false, autoClose: 2500 });
    } catch (err) {
      toast.update(id, { render: err.response?.data?.message || "AI service unavailable", type: "error", isLoading: false, autoClose: 3500 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post("/jobs", job);
      toast.success("Job published successfully");
      navigate("/dashboard/jobs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not publish this job");
    } finally {
      setSubmitting(false);
    }
  };

  const skills = job.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 6);

  return (
    <DashboardLayout>
      <div className="page-header modern-page-header">
        <div><span className="eyebrow">Recruitment studio</span><h4>Create a job</h4><p className="text-muted mb-0">Publish a clear, branded opportunity that is easy for candidates to evaluate.</p></div>
        <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/dashboard/jobs")}><i className="bi bi-arrow-left me-2"></i>Back to jobs</button>
      </div>

      <div className="row g-4 mt-1 align-items-start">
        <div className="col-xl-8">
          <form className="dashboard-card job-compose-card" onSubmit={handleSubmit}>
            <div className="section-heading"><div><span className="eyebrow">Brand</span><h5>Company identity</h5></div><i className="bi bi-building"></i></div>
            <div className="company-upload-row mb-5">
              <button type="button" className="company-logo-upload" onClick={() => logoRef.current?.click()} disabled={uploadingLogo}>
                {job.companyImageUrl ? <img src={assetUrl(job.companyImageUrl)} alt="Company logo" /> : uploadingLogo ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-image"></i><span>Add logo</span></>}
              </button>
              <div><strong>Company image</strong><p className="text-muted small mb-2">Add a square logo or brand image. It appears on the job listing.</p><button type="button" className="btn btn-sm btn-outline-primary" onClick={() => logoRef.current?.click()}>{job.companyImageUrl ? "Replace image" : "Upload image"}</button></div>
              <input ref={logoRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="d-none" onChange={(e) => handleLogo(e.target.files?.[0])} />
            </div>

            <div className="section-heading"><div><span className="eyebrow">Opportunity</span><h5>Job details</h5></div><i className="bi bi-briefcase"></i></div>
            <div className="row g-4">
              <div className="col-md-6"><label className="form-label">Job title</label><input className="form-control" name="title" value={job.title} onChange={handleChange} placeholder="Software Developer" required /></div>
              <div className="col-md-6"><label className="form-label">Company name</label><input className="form-control" name="company" value={job.company} onChange={handleChange} placeholder="Acme Technologies" required /></div>
              <div className="col-md-6"><label className="form-label">Location</label><input className="form-control" name="location" value={job.location} onChange={handleChange} placeholder="Bhubaneswar / Remote" required /></div>
              <div className="col-md-6"><label className="form-label">Required skills</label><input className="form-control" name="skillsRequired" value={job.skillsRequired} onChange={handleChange} placeholder="Java, Spring Boot, React" required /></div>
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center gap-3 mb-2"><label className="form-label mb-0">Job description</label><button type="button" className="btn btn-sm btn-ai-soft" onClick={handleAiEnhance} disabled={!job.title || !job.skillsRequired}><i className="bi bi-stars me-1"></i>AI rewrite</button></div>
                <textarea className="form-control" rows="9" name="description" value={job.description} onChange={handleChange} placeholder="Explain the role, responsibilities, requirements and benefits..." required />
              </div>
            </div>
            <div className="form-actions mt-5"><span className="text-muted small"><i className="bi bi-eye me-1"></i>Preview updates as you type.</span><button className="btn btn-primary px-5" disabled={submitting || uploadingLogo}>{submitting ? "Publishing..." : <><i className="bi bi-send me-2"></i>Publish job</>}</button></div>
          </form>
        </div>

        <div className="col-xl-4">
          <div className="dashboard-card sticky-preview-card">
            <span className="eyebrow">Live preview</span><h6 className="mb-4">Candidate view</h6>
            <div className="job-preview-card">
              <div className="job-preview-top">
                <div className="job-company-logo">{job.companyImageUrl ? <img src={assetUrl(job.companyImageUrl)} alt="" /> : <span>{(job.company || "C").charAt(0)}</span>}</div>
                <span className="status-pill">New</span>
              </div>
              <h5>{job.title || "Your job title"}</h5><p className="text-primary fw-600 mb-3">{job.company || "Company name"}</p>
              <div className="job-preview-meta"><span><i className="bi bi-geo-alt"></i>{job.location || "Location"}</span><span><i className="bi bi-clock"></i>Full-time</span></div>
              <div className="skill-preview mt-4">{skills.length ? skills.map((s) => <span key={s}>{s}</span>) : <span>Required skills</span>}</div>
              <p className="job-preview-description">{job.description ? `${job.description.slice(0, 150)}${job.description.length > 150 ? "…" : ""}` : "Your job description will appear here."}</p>
            </div>
            <div className="posting-tip"><i className="bi bi-lightbulb"></i><div><strong>Tip</strong><p>Specific titles, a real logo and a concise skill list make listings easier to trust and scan.</p></div></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
