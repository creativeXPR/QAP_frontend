// Faculty & department lookups for the report submission form.
const API_BASE = `${import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")}/api/core`;

/**
 * Returns the full faculty list: [{ id, name }, ...]
 */
export async function getFaculties() {
  const res = await fetch(`${API_BASE}/faculties/`);
  if (!res.ok) throw new Error("Failed to load faculties");
  return res.json();
}

/**
 * Returns the full department list:
 * [{ id, faculty, faculty_name, name }, ...]
 *
 * Fetched once and filtered client-side by `faculty_name` when a
 * faculty is selected, rather than re-fetching per faculty — the API
 * doesn't currently expose a filtered endpoint.
 */
export async function getDepartments() {
  const res = await fetch(`${API_BASE}/departments/`);
  if (!res.ok) throw new Error("Failed to load departments");
  return res.json();
}
