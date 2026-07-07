import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../../lib/auth";

/**
 * Wraps a route element and enforces both:
 *  1. The user is logged in at all (has a token).
 *  2. If `allowedRoles` is given, the user's stored role is in that list.
 *
 * Usage:
 *   <Route path="/admin" element={
 *     <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
 *       <AdminPortal />
 *     </ProtectedRoute>
 *   } />
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  const role = getUserRole();
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}