function formatLabel(value) {
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
      : item?.status === "resolved"
        ? "Resolved"
        : item?.status || "Pending";

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
