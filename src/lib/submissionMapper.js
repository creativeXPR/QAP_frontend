export function formatLabel(value) {
  if (!value) return "General";

  const normalized = String(value).toLowerCase().replace(/_/g, " ");
  const mapping = {
    academic: "Academics",
    academics: "Academics",
    "hostel welfare": "Hostel/Welfare",
    hostel_welfare: "Hostel/Welfare",
    facilities: "Facilities",
    "staff conduct": "Staff Conduct",
    staff_conduct: "Staff Conduct",
    "admin delays": "Admin Delays",
    admin_delays: "Admin Delays",
    "safety security": "Safety/Security",
    safety_security: "Safety/Security",
    results: "Results",
    general: "General",
    complaint: "Complaint",
    suggestion: "Suggestion",
    comment: "Comment",
    feedback: "Feedback",
    concern: "Concern",
    "service request": "Service Request",
    service_request: "Service Request",
    "open identity": "Open Identity",
    open_identity: "Open Identity",
    confidential: "Confidential",
    anonymous: "Anonymous",
  };

  return (
    mapping[normalized] ||
    normalized.replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function mapSubmissionFromApi(item) {
  const title = item?.feedback || "Untitled submission";
  const category = formatLabel(
    item?.classification || item?.category || "General",
  );

  const status =
    item?.status === "pending"
      ? "In Review"
      : item?.status === "under_review"
        ? "In Review"
      : item?.status === "resolved"
        ? "Resolved"
        : formatLabel(item?.status || "pending");

  return {
    id: `UI 2026-QAP-${item?.id ?? ""}`,
    title,
    category,
    status,
    rawStatus: item?.status || "pending",
    submittedAt: item?.submitted_at || null,
    feedback: item?.feedback || "",
    submissionType: formatLabel(item?.category || ""),
    submissionMode: formatLabel(item?.submission_mode || ""),
    studentEmail: item?.student_email || "",
  };
}

export function mapSubmissionsFromApi(items = []) {
  return items.map(mapSubmissionFromApi);
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
}

/**
 * Staff-facing view of a feedback/complaint record (Admin/PO/FP), as
 * opposed to mapSubmissionFromApi's student-facing view — surfaces the
 * staff-only fields (admin_comment, assigned_to, submitted_by) that
 * students never see.
 */
export function mapFeedbackForStaff(item) {
  return {
    id: item?.id,
    studentName: item?.submitted_by_username || item?.student || "Anonymous",
    studentEmail: item?.student_email || "",
    title: item?.feedback || "Untitled submission",
    category: formatLabel(item?.classification || item?.category || "General"),
    submissionType: formatLabel(item?.category || ""),
    urgency: formatLabel(item?.urgency || "normal"),
    rawUrgency: item?.urgency || "normal",
    status: formatLabel(item?.status || "pending"),
    rawStatus: item?.status || "pending",
    submissionMode: formatLabel(item?.submission_mode || ""),
    adminComment: item?.admin_comment || "",
    assignedTo: item?.assigned_to || null,
    submittedAt: formatDate(item?.submitted_at),
    updatedAt: formatDate(item?.updated_at),
  };
}

export function mapFeedbackListForStaff(items = []) {
  return items.map(mapFeedbackForStaff);
}
