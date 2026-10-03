export default function MatchResult({ result }) {
    return (
        <div className="dashboard-card border-primary" style={{ borderLeft: '4px solid var(--primary-color)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 fw-bold underline">AI Analysis Report</h5>
                <div className="text-end">
                    <span className="h3 fw-bold text-primary mb-0">{result.score}%</span>
                    <p className="text-muted small mb-0">Compatibility Score</p>
                </div>
            </div>

            <div className="progress mb-4" style={{ height: '10px', borderRadius: '5px' }}>
                <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                    style={{ width: `${result.score}%` }}
                ></div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <h6 className="fw-bold text-success"><i className="bi bi-check-circle-fill me-2"></i>Matched Skills</h6>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {result.matched.map((skill, i) => (
                            <span key={i} className="badge bg-green-soft text-success border">{skill}</span>
                        ))}
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <h6 className="fw-bold text-danger"><i className="bi bi-exclamation-triangle-fill me-2"></i>Missing Skills</h6>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {result.missing.map((skill, i) => (
                            <span key={i} className="badge bg-pink-100 text-danger border">{skill}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 p-3 bg-light rounded-lg border small shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-robot text-primary"></i>
                    <strong className="text-dark">AI Intelligence Insight:</strong>
                </div>
                <p className="mb-2 text-muted fw-500">{result.summary || "Summary generation in progress..."}</p>
                {result.missing && result.missing.length > 0 ? (
                    <p className="mb-0 text-muted extra-small">
                        💡 Suggestion: Focus on <span className="fw-bold text-primary">{result.missing.join(", ")}</span> for a competitive edge.
                    </p>
                ) : (
                    <p className="mb-0 text-muted extra-small">
                        ✨ Advice: Your profile is a perfect baseline. Highlight project leadership in your application!
                    </p>
                )}

                <div className="mt-3 pt-3 border-top">
                    <button
                        className="btn btn-sm btn-outline-primary rounded-pill w-100 fw-bold"
                        onClick={() => window.dispatchEvent(new CustomEvent('openChatbot', { detail: `How can I improve my resume for ${result.jobTitle || 'this role'}? I'm missing ${result.missing?.join(', ')}.` }))}
                    >
                        <i className="bi bi-lightning-stars me-2"></i> Get Improvement Roadmap
                    </button>
                </div>
            </div>
        </div>
    );
}

