import { api, getAuthHeaders } from "../api/client";

export { getAuthHeaders };

// The four roles your backend's "status" field can be.
export const ROLES = {
  STUDENT: "student",
  FOCAL_PERSON: "focal_person",
  PRINCIPLE_OFFICER: "principle_officer",
  ADMIN: "admin",
};

// Where each role should land right after logging in.
export const ROLE_HOME_ROUTES = {
  [ROLES.STUDENT]: "/student/dashboard",
  [ROLES.FOCAL_PERSON]: "/fp",
  [ROLES.PRINCIPLE_OFFICER]: "/po",
  [ROLES.ADMIN]: "/admin/dashboard",
};

function extractToken(data) {
  return (
    data?.access ||
    data?.token ||
    data?.jwt ||
    data?.accessToken ||
    data?.access_token ||
    data?.key ||
    null
  );
}

function extractAuthType(data) {
  const rawType =
    data?.token_type || data?.auth_type || data?.tokenType || "Bearer";
  return String(rawType).charAt(0).toUpperCase() + String(rawType).slice(1);
}

function storeAuthSession(data, fallbackRole) {
  const token = extractToken(data);
  console.log("[Auth] Login response token extraction:", {
    allKeys: Object.keys(data),
    extractedToken: token ? `${token.substring(0, 20)}...` : "NO TOKEN",
    data_access: data?.access ? `${data.access.substring(0, 20)}...` : undefined,
    data_token: data?.token ? `${data.token.substring(0, 20)}...` : undefined,
  });
  
  if (token) {
    localStorage.setItem("access_token", token);
    localStorage.setItem("auth_type", extractAuthType(data));
    console.log("[Auth] Token stored in localStorage", {
      tokenLength: token.length,
      authType: extractAuthType(data),
    });
  } else {
    console.warn("[Auth] NO TOKEN extracted from login response!");
  }
  
  if (data?.refresh) localStorage.setItem("refresh_token", data.refresh);
  if (data?.user_id) localStorage.setItem("user_id", data.user_id);

  const role = extractRole(data) || fallbackRole;
  const user = role && data?.user ? { ...data.user, status: data.user.status || role } : data?.user;

  if (user) localStorage.setItem("user", JSON.stringify(user));
  if (role) localStorage.setItem("user_role", role);
}

export function getStoredAccessToken() {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("accessToken") ||
    ""
  );
}

/**
 * Pulls the role out of a login/register response.
 * NOTE: your auth-doc.md doesn't show exactly where this field lives in
 * the login response (it only confirms `data.user.username` and
 * `data.profile_complete`). This checks the most likely spots based on
 * your registration payload (`status`). If your backend actually returns
 * it somewhere else, update this one function and everything else
 * (redirects, route guarding) will keep working.
 */
function extractRole(data) {
  return data?.user?.status || data?.status || data?.role || null;
}

/**
 * Logs in a user with an email/username + password.
 * Returns { access, refresh, user, profile_complete, ... } on success.
 * Throws an Error with a readable message on failure.
 */
export async function loginUser(identifier, password) {
  const data = await api.post(
    "/api/auth/login/",
    {
      username: identifier,
      password,
    },
    { auth: false },
  );

  storeAuthSession(data);

  return data;
}

/**
 * Registers a new user.
 * status must be one of: "student" | "focal_person" | "principle_officer" | "admin"
 */
export async function registerUser({
  username,
  email,
  password,
  passwordConfirm,
  status,
}) {
  const data = await api.post(
    "/api/auth/google/register/",
    {
      username,
      email,
      password,
      password_confirm: passwordConfirm,
      status,
    },
    { auth: false },
  );

  storeAuthSession(data, status);

  return data;
}

export async function requestPasswordReset(email) {
  return api.post("/api/auth/password/reset/", { email }, { auth: false });
}

export async function logoutUser() {
  try {
    const refresh = localStorage.getItem("refresh_token");
    await api.post("/api/auth/logout/", refresh ? { refresh } : {});
  } finally {
    logout();
  }
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user");
  localStorage.removeItem("user_role");
  localStorage.removeItem("auth_type");
}

export function isAuthenticated() {
  return !!localStorage.getItem("access_token");
}

export function getUserRole() {
  return localStorage.getItem("user_role");
}

export function getStoredUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
