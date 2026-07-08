import { core } from "../api/services";

/**
 * Returns the full faculty list: [{ id, name }, ...]
 */
export async function getFaculties() {
  return core.faculties.list();
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
  return core.departments.list();
}
