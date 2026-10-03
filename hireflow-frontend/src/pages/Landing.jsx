import { Link } from "react-router-dom";
import "../styles/auth.css";
import "../styles/landing.css";
import { motion } from "framer-motion";

export default function Landing() {
    return (
        <div className="landing-wrapper overflow-hidden bg-main">
            <div className="auth-bg-mesh"></div>
            <div className="landing-hero-glow"></div>

            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="navbar navbar-expand-lg glass sticky-top py-3 px-4 mx-3 mt-3 rounded-pill"
                style={{ zIndex: 1000 }}
            >
                <div className="container-fluid px-lg-5">
                    <Link className="navbar-brand logo-gradient fs-2 fw-850" to="/">
                        HireFlow<span className="text-primary">.</span>
                    </Link>
                    <div className="ms-auto d-flex gap-2 gap-md-4 align-items-center">
                        <Link to="/login" className="text-decoration-none fw-700 text-main hover-primary px-2 transition">Sign In</Link>
                        <Link to="/register" className="btn btn-primary px-4 py-2 rounded-pill shadow-lg fw-700 border-0">Get Started</Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <header className="hero-section text-center pt-5 pb-5 mt-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-11">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="badge-pill bg-white shadow-sm border px-4 py-2 mb-4 d-inline-flex align-items-center gap-2"
                                style={{ borderRadius: '50px' }}
                            >
                                <span className="bg-primary-soft text-primary p-1 rounded-circle"><i className="bi bi-stars"></i></span>
                                <span className="extra-small fw-800 text-uppercase tracking-wider">Next-Gen AI Protocol 4.0</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="display-1 fw-900 mb-4 text-main"
                                style={{ letterSpacing: '-0.04em', lineHeight: '1.05' }}
                            >
                                The Neural Network for <br />
                                <span className="logo-gradient">Technical Capital</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="lead text-muted mx-auto mb-5"
                                style={{ maxWidth: '850px', fontSize: '1.35rem', fontWeight: '400' }}
                            >
                                Bridge the technical divide. Our proprietary AI engine analyzes candidate DNA to match elite engineering talent with world-class product teams in real-time.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="d-flex flex-column flex-md-row justify-content-center gap-3 mb-5"
                            >
                                <Link to="/register" className="btn btn-primary btn-lg rounded-pill px-5 py-3 fs-5 shadow-2xl transition-all hvr-grow">
                                    Launch Enterprise <i className="bi bi-arrow-right-short ms-2"></i>
                                </Link>
                                <Link to="/login" className="btn glass btn-lg rounded-pill px-5 py-3 fs-5 fw-700 transition-all">
                                    Join Network <i className="bi bi-person-check ms-2"></i>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            {/* FEATURES SECTION */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="features-grid py-5 mt-5 bg-card"
                style={{ borderTop: '1px solid var(--glass-border)' }}
            >
                <div className="container py-5">
                    <div className="row align-items-center mb-5 pb-4">
                        <div className="col-lg-6">
                            <h2 className="fw-900 display-4 text-main mb-0">High-Precision <br />Infrastructure.</h2>
                        </div>
                        <div className="col-lg-6">
                            <p className="text-muted lead mb-0">Engineered for the most demanding recruitment workflows. Scale your talent acquisition with industrial-grade AI intelligence.</p>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="glass p-5 h-100 border-0 shadow-lg rounded-lg hover-lift"
                            >
                                <i className="bi bi-cpu fs-1 text-primary mb-4 d-block"></i>
                                <h4 className="fw-900 text-main mb-3">Core Intelligence</h4>
                                <p className="text-muted">Proprietary LLMs extract deep technical nuances from raw documents with 99.4% accuracy.</p>
                            </motion.div>
                        </div>
                        <div className="col-md-4">
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="glass p-5 h-100 border-0 shadow-lg rounded-lg hover-lift"
                            >
                                <i className="bi bi-lightning-charge fs-1 text-primary mb-4 d-block"></i>
                                <h4 className="fw-900 text-main mb-3">Instant Validation</h4>
                                <p className="text-muted">Recruiters receive instant match scores, reducing screening time from days to seconds.</p>
                            </motion.div>
                        </div>
                        <div className="col-md-4">
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="glass p-5 h-100 border-0 shadow-lg rounded-lg hover-lift"
                            >
                                <i className="bi bi-shield-check fs-1 text-primary mb-4 d-block"></i>
                                <h4 className="fw-900 text-main mb-3">Enterprise Trust</h4>
                                <p className="text-muted">End-to-end encryption ensures your talent pipeline data remains private and secure.</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="footer py-5 text-center bg-main border-top">
                <p className="text-muted fw-600 mb-0 px-3">&copy; 2026 HireFlow Global AI Protocol. Built by Hariom.</p>
            </footer>
        </div>
    );
}
