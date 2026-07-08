import { CLASSIFICATION_CONFIG } from "./classifications";
import { getStoredUser } from "./auth";

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
    category: form.submissionType,
    classification: form.category,
    urgency: form.urgency,
    feedback: buildFeedbackString(form),
    submission_mode: form.privacyMode,
  };
}