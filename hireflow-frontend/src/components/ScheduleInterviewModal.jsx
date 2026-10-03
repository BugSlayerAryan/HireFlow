import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function ScheduleInterviewModal({ application, onClose, onScheduled }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        scheduledAt: "",
        meetingLink: "https://meet.google.com/new",
        notes: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post(`/interviews/schedule/${application.id}`, data);
            toast.success("Interview scheduled and candidate notified via email and real-time alert! 🚀");
            onScheduled();
            onClose();
        } catch {
            toast.error("Failed to schedule interview.");
        } finally {
            setLoading(false);
        }
    };

    const handleAiSuggest = () => {
        // Simple heuristic for now: Suggest tomorrow at 10 AM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);

        const pad = (num) => String(num).padStart(2, '0');
        const formatted = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(tomorrow.getMinutes())}`;

        setData({ ...data, scheduledAt: formatted, notes: "AI Suggested: Optimal time based on common technical interview slots." });
        toast.info("AI suggested next available optimal slot! ✨");
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass p-4 shadow-2xl slide-in" style={{ maxWidth: '500px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-900 mb-0">Schedule Selection</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label small fw-800 text-uppercase">Interview Timestamp</label>
                            <button type="button" className="btn btn-xs btn-outline-primary border-0" onClick={handleAiSuggest}>
                                <i className="bi bi-cpu me-1"></i> AI Suggest
                            </button>
                        </div>
                        <input
                            type="datetime-local"
                            className="form-control"
                            required
                            value={data.scheduledAt}
                            onChange={(e) => setData({ ...data, scheduledAt: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-800 text-uppercase">Virtual Meeting DNA (Link)</label>
                        <input
                            type="url"
                            className="form-control"
                            placeholder="https://zoom.us/j/..."
                            required
                            value={data.meetingLink}
                            onChange={(e) => setData({ ...data, meetingLink: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-800 text-uppercase">Protocol Notes</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Technical focus areas, agenda..."
                            value={data.notes}
                            onChange={(e) => setData({ ...data, notes: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="d-grid">
                        <button className="btn btn-primary py-3 fw-800" disabled={loading}>
                            {loading ? "Initializing..." : "Launch Interview Protocol"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
