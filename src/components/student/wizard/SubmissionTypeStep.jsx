import {
  FileText,
  MessageSquareText,
  MessageCircle,
  Lightbulb,
  AlertTriangle,
  Headphones,
} from "../../../lib/icons";

// NOTE: the design shows the same subtitle ("Report an issue that needs
// to be addressed") repeated under every option — that looks like a
// copy/paste placeholder in the source mockup rather than intentional.
// Replicated as-is below; swap in per-option descriptions once you have
// real copy for each submission type.
const TYPES = [
  { label: "Complaint", icon: FileText, description: "Report an issue that needs to be addressed" },
  { label: "Suggestion", icon: MessageSquareText, description: "Report an issue that needs to be addressed" },
  { label: "Comment", icon: MessageCircle, description: "Report an issue that needs to be addressed" },
  { label: "Feedback", icon: Lightbulb, description: "Report an issue that needs to be addressed" },
  { label: "Concern", icon: AlertTriangle, description: "Report an issue that needs to be addressed" },
  { label: "Service Request", icon: Headphones, description: "Report an issue that needs to be addressed" },
];

export default function SubmissionTypeStep({ value, onChange, onContinue }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
        What type of submission is this?
      </h2>
      <p className="text-sm text-gray-400 text-center mb-6">
        Select the option that best describes your student voice submission
      </p>

      <div className="space-y-3">
        {TYPES.map(({ label, icon: Icon, description }) => (
          <label
            key={label}
            className={`flex items-start sm:items-center justify-between gap-3 border rounded-lg px-4 py-3 cursor-pointer ${
              value === label
                ? "border-brand bg-brand/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="flex items-start sm:items-center gap-3 min-w-0">
              <Icon size={18} className="text-gray-500 shrink-0 mt-0.5 sm:mt-0" />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-gray-900">
                  {label}
                </span>
                <span className="block text-xs text-gray-400">
                  {description}
                </span>
              </span>
            </span>
            <input
              type="radio"
              name="submission-type"
              checked={value === label}
              onChange={() => onChange(label)}
              className="text-brand focus:ring-brand shrink-0 mt-0.5"
            />
          </label>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full mt-6 bg-brand hover:bg-brand-dark text-white text-base font-medium py-2.5 rounded-[10px]"
      >
        Continue
      </button>
    </div>
  );
}