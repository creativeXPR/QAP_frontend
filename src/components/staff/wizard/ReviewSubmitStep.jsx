import { CheckCircle2 } from "../../../lib/icons";
import { CLASSIFICATION_CONFIG } from "../../../lib/classifications";

export default function ReviewSubmitStep({
  form,
  files,
  onBack,
  onSubmit,
  submitting,
}) {
  const config =
    CLASSIFICATION_CONFIG[form.category] || CLASSIFICATION_CONFIG.Academics;

  const rows = [
    ["Submission Type", form.submissionType],
    ["Classification", form.category],
    ["Title", form.title || "—"],
    ["Description", form.description || "—"],
    ["Date Occurred", form.dateOccurred || "—"],
    ["Urgency", form.urgency],
    ["Faculty", form.faculty || "—"],
    ["Department", form.department || "—"],
    ...(config.showCourseCode ? [["Course Code", form.courseCode || "—"]] : []),
    ...config.extraFields.map(({ key, label }) => [label, form[key] || "—"]),
    ["Person Involved", form.personInvolved || "—"],
    ["Submission Mode", form.privacyMode],
    ["Attachments", files.length > 0 ? `${files.length} file(s)` : "None"],
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
        Review & Submit
      </h2>

      <p className="text-sm text-gray-400 text-center mb-6">
        Confirm the details below before submitting your report.
      </p>

      <dl className="space-y-3 text-sm mb-6">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-4 border-b border-gray-100 pb-2"
          >
            <dt className="text-gray-400 shrink-0">{label}</dt>
            <dd className="text-gray-800 text-right break-words">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 text-base font-medium text-gray-600 border border-gray-300 rounded-[10px] py-2.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>

        <button
          onClick={onSubmit}
          disabled={submitting}
          className={`flex-1 flex items-center justify-center gap-2 text-white text-base font-medium py-2.5 rounded-[10px] ${
            submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-brand hover:bg-brand-dark"
          }`}
        >
          <CheckCircle2 size={16} />

          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
}
