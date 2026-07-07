import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ROLES } from "./lib/auth";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";

import FPLanding from "./pages/FPLanding";
import AdminPortal from "./pages/AdminPortal";
import PODashboard from "./pages/PODashboard";
import ProfileLanding from "./pages/ProfileLanding";
import UserProfile from "./pages/UserProfile";

import StudentDashboard from "./pages/student/StudentDashboard";
import SubmitReport from "./pages/student/SubmitReport";
import StudentReportsList from "./pages/student/StudentReportsList";
import StudentNotifications from "./pages/student/StudentNotifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<ProfileLanding />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Any authenticated user, regardless of role */}
        <Route
          path="/profile/me"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Focal Person only */}
        <Route
          path="/fp"
          element={
            <ProtectedRoute allowedRoles={[ROLES.FOCAL_PERSON]}>
              <FPLanding />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminPortal />
            </ProtectedRoute>
          }
        />

        {/* Principal Officer only */}
        <Route
          path="/po"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PRINCIPLE_OFFICER]}>
              <PODashboard />
            </ProtectedRoute>
          }
        />

        {/* Student only */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/reports"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentReportsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/reports/new"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <SubmitReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentNotifications />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
