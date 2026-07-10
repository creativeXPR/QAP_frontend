import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthExpiryListener from "./components/common/AuthExpiryListener";
import { ROLES } from "./lib/auth";

import { ToastProvider } from "./components/common/ToastContext";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";

import FPLanding from "./pages/FPLanding";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminFocalPersons from "./pages/admin/AdminFocalPersons";
import AdminPrincipalOfficers from "./pages/admin/AdminPrincipalOfficers";
import PODashboard from "./pages/PODashboard";
import ProfileLanding from "./pages/ProfileLanding";
import UserProfile from "./pages/UserProfile";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentReportWizard from "./pages/student/StudentReportWizard";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentSubmissionsList from "./pages/student/StudentSubmissionsList";
import StudentProfile from "./pages/student/StudentProfile";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffReportWizard from "./pages/staff/StaffReportWizard";
import StaffNotifications from "./pages/staff/StaffNotifications";
import StaffSubmissionsList from "./pages/staff/StaffSubmissionsList";
import StaffProfile from "./pages/staff/StaffProfile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AuthExpiryListener />
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
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminStaff />
              </ProtectedRoute>
            }
          />          <Route
            path="/admin/focal-persons"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminFocalPersons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/principal-officers"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminPrincipalOfficers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
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
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/reports"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentSubmissionsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/reports/new"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentReportWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/report/new"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentSubmissionsList />
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


          {/* Staff only */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/profile"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                <StaffProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/reports"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                <StaffSubmissionsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/reports/new"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                <StaffReportWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/report/new"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                <StaffSubmissionsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/notifications"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                <StaffNotifications />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
