import { CLASSIFICATION_CONFIG } from "./classifications";
import { getStoredUser } from "./auth";

const CATEGORY_API_VALUES = {
  Complaint: "complaint",
  Suggestion: "suggestion",
  Comment: "other",
  Feedback: "other",
  Concern: "complaint",
  "Service Request": "support",
  Inquiry: "inquiry",
};

const CLASSIFICATION_API_VALUES = {
  Academics: "academic",
  "Hostel/Welfare": "welfare",
  Facilities: "facility",
  "Staff Conduct": "administrative",
  "Admin Delays": "administrative",
  "Safety/Security": "other",
  Results: "academic",
};

const URGENCY_API_VALUES = {
  Low: "normal",
  Medium: "normal",
  High: "high",
  Critical: "critical",
};

const SUBMISSION_MODE_API_VALUES = {
  Anonymous: "anonymous",
  Confidential: "confidential",
  "Open Identity": "open_identity",
};

/**
 * Builds the exact feedback string format specified:
 *
 * Date: [Date]
 * Faculty: [Faculty]
 * Department: [Department]
 * Classification: [Classification]   <- added for backend context; the
 *                                        spec's template didn't include
 *                                        a line for this explicitly, but
 *                                        omitting it means the dynamic
 *                                        fields below have no stated
 *                                        topic. Remove this line if the
 *                                        backend doesn't want it.
 * [dynamic fields for the selected classification, "Label: value"]
 * Person Involved: [Person Involved]
 *
 * [Description]
 *
 * NOTE: "Report Title" isn't part of the given template or payload
 * shape at all, so it's intentionally left out of `feedback` here.
 * It's still shown on the Review & Submit screen for the student's own
 * confirmation, but not sent to the backend. Flag if it should be
 * included somewhere.
 */
function buildFeedbackString(form) {
  const config = CLASSIFICATION_CONFIG[form.category] || CLASSIFICATION_CONFIG.Academics;

  const lines = [
    `Date: ${form.dateOccurred || "—"}`,
    `Faculty: ${form.faculty || "—"}`,
    `Department: ${form.department || "—"}`,
    `Classification: ${form.category || "—"}`,
  ];

  if (config.showCourseCode && form.courseCode) {
    lines.push(`Course Code: ${form.courseCode}`);
  }

  config.extraFields.forEach(({ key, label }) => {
    if (form[key]) {
      lines.push(`${label}: ${form[key]}`);
    }
  });

  lines.push(`Person Involved: ${form.personInvolved || "—"}`);

  return `${lines.join("\n")}\n\n${form.description || ""}`;
}

/**
 * Builds the full payload to POST to the (not-yet-available) submit
 * endpoint. `category` here is the step-1 submission type (Complaint/
 * Suggestion/etc) per the agreed naming — not the step-2 classification,
 * which instead appears inside `feedback` above.
 */
export function buildSubmissionPayload(form) {
  const user = getStoredUser();

  return {
    student: user?.username || user?.name || "",
    student_email: user?.email || "",
    category: CATEGORY_API_VALUES[form.submissionType] || "other",
    classification: CLASSIFICATION_API_VALUES[form.category] || "other",
    urgency: URGENCY_API_VALUES[form.urgency] || "normal",
    feedback: buildFeedbackString(form),
    submission_mode: SUBMISSION_MODE_API_VALUES[form.privacyMode] || "open_identity",
  };
}

export function buildSubmissionRequestBody(form, files = []) {
  const payload = buildSubmissionPayload(form);
  if (!files.length) return payload;

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value ?? "");
  });
  files.forEach((file) => {
    formData.append("attachments", file);
  });

  return formData;
}
