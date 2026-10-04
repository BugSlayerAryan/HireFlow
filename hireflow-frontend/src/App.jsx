import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";
import Users from "./pages/admin/Users";
import AllJobs from "./pages/admin/AllJobs";
import ResumeMatch from "./pages/ResumeMatch";
import RecommendedJobs from "./pages/RecommendedJobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import ApplyJob from "./pages/ApplyJob";
import MyApplications from "./pages/MyApplications";
import PostJob from "./pages/PostJob";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import Interviews from "./pages/Interviews";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import GuestRoute from "./routes/GuestRoute";
import useWebSocket from "./hooks/useWebSocketHook";
import { getDefaultRouteForRole, getStoredSession } from "./utils/auth";
import "./styles/responsive.css";

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.22 }}
  >
    {children}
  </motion.div>
);

const protectedPage = (page) => (
  <ProtectedRoute><PageTransition>{page}</PageTransition></ProtectedRoute>
);

const rolePage = (roles, page) => (
  <RoleRoute allowedRoles={roles}><PageTransition>{page}</PageTransition></RoleRoute>
);

function App() {
  const [session, setSession] = useState(() => getStoredSession());

  useEffect(() => {
    const refreshSession = () => setSession(getStoredSession());
    window.addEventListener("hireflow-auth-changed", refreshSession);
    window.addEventListener("storage", refreshSession);
    return () => {
      window.removeEventListener("hireflow-auth-changed", refreshSession);
      window.removeEventListener("storage", refreshSession);
    };
  }, []);

  useWebSocket(session?.userEmail || "");

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={session
              ? <Navigate to={getDefaultRouteForRole(session.role)} replace />
              : <PageTransition><Landing /></PageTransition>}
          />
          <Route path="/login" element={<GuestRoute><PageTransition><Login /></PageTransition></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><PageTransition><Register /></PageTransition></GuestRoute>} />

          <Route path="/dashboard" element={protectedPage(<Dashboard />)} />
          <Route path="/dashboard/jobs" element={protectedPage(<Jobs />)} />
          <Route path="/dashboard/profile" element={protectedPage(<Profile />)} />
          <Route path="/dashboard/interviews" element={protectedPage(<Interviews />)} />

          <Route path="/dashboard/apply/:id" element={rolePage(["JOB_SEEKER"], <ApplyJob />)} />
          <Route path="/dashboard/my-applications" element={rolePage(["JOB_SEEKER"], <MyApplications />)} />
          <Route path="/dashboard/resume-match" element={rolePage(["JOB_SEEKER"], <ResumeMatch />)} />
          <Route path="/dashboard/recommended" element={rolePage(["JOB_SEEKER"], <RecommendedJobs />)} />

          <Route path="/dashboard/post-job" element={rolePage(["RECRUITER"], <PostJob />)} />
          <Route path="/dashboard/applications" element={rolePage(["RECRUITER"], <Applications />)} />

          <Route path="/admin/dashboard" element={rolePage(["ADMIN"], <AdminDashboard />)} />
          <Route path="/admin/users" element={rolePage(["ADMIN"], <Users />)} />
          <Route path="/admin/jobs" element={rolePage(["ADMIN"], <AllJobs />)} />
          <Route path="/admin/reports" element={rolePage(["ADMIN"], <AdminReports />)} />

          <Route path="*" element={<Navigate to={session ? getDefaultRouteForRole(session.role) : "/login"} replace />} />
        </Routes>
      </AnimatePresence>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  );
}

export default App;
