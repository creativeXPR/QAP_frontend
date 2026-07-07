// Central place for all auth API calls.
// The base URL comes from an environment variable so it's easy to point
// at a different backend (staging, production) without touching this file.
const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

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
  [ROLES.ADMIN]: "/admin",
};

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
  const res = await fetch(`${API_BASE}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: identifier,
      password,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Invalid credentials");
  }

  if (data?.access) localStorage.setItem("access_token", data.access);
  if (data?.refresh) localStorage.setItem("refresh_token", data.refresh);
  if (data?.user_id) localStorage.setItem("user_id", data.user_id);
  if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

  const role = extractRole(data);
  if (role) localStorage.setItem("user_role", role);

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
  const res = await fetch(`${API_BASE}/google/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
      password_confirm: passwordConfirm,
      status,
    }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    let message = "Registration failed";
    if (data) {
      if (typeof data === "string") {
        message = data;
      } else if (data.detail) {
        message = data.detail;
      } else {
        message = Object.entries(data)
          .map(([key, value]) =>
            Array.isArray(value) ? `${key}: ${value.join(" ")}` : `${key}: ${value}`
          )
          .join(" | ");
      }
    }
    throw new Error(message);
  }

  if (data?.access) localStorage.setItem("access_token", data.access);
  if (data?.refresh) localStorage.setItem("refresh_token", data.refresh);
  if (data?.user_id) localStorage.setItem("user_id", data.user_id);
  if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

  // We already know the role client-side at registration time (the form
  // value), so store it even if the response doesn't echo it back.
  const role = extractRole(data) || status;
  if (role) localStorage.setItem("user_role", role);

  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user");
  localStorage.removeItem("user_role");
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