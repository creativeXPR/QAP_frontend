import {
  FileText,
  MessageSquareText,
  MessageCircle,
  Lightbulb,
  AlertTriangle,
  Headphones,
  Heart,
  Layers,
} from "../../../lib/icons";

// Note: this list has 8 types (adds "Compliment" and "Other" beyond
// what SubmissionTypeStep.jsx currently offers in the wizard — that
// step only has 6). Flagging the mismatch rather than silently
// changing the wizard's options; let me know if the wizard should be
// updated to match this list.
const SUBMISSION_TYPES = [
  { label: "Complaint", icon: FileText, description: "Report an issue that needs to be addressed." },
  { label: "Suggestion", icon: MessageSquareText, description: "Propose an idea that could improve things." },
  { label: "Comment", icon: MessageCircle, description: "Share a general observation or remark." },
  { label: "Feedback", icon: Lightbulb, description: "Provide structured feedback on a service or experience." },
  { label: "Concern", icon: AlertTriangle, description: "Raise a worry or potential risk." },
  { label: "Service Request", icon: Headphones, description: "Request a specific service or action." },
  { label: "Compliment", icon: Heart, description: "Acknowledge exceptional service or staff conduct." },
  { label: "Other", icon: Layers, description: "Anything that does not fit the above types." },
];

const PROCESS_STEPS = [
  {
    step: 1,
    title: "Create a submission",
    description: "Choose your submission type, fill in the details, and select your privacy mode.",
  },
  {
    step: 2,
    title: "QA Admin review",
    description: "A QA Officer reviews your submission and contacts the relevant unit/department.",
  },
  {
    step: 3,
    title: "Resolution & feedback",
    description: "You are notified of actions taken. You may follow up, appeal, or confirm resolution.",
  },
];

export default function GuidelinesTab() {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900">
        Directorate of Quality Assurance, University Of Ibadan
      </h3>
      <p className="text-xs text-gray-400 italic mb-6">
        ...doing the right things right, everytime
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="space-y-3">
          {SUBMISSION_TYPES.map(({ label, icon: Icon, description }) => (
            <div
              key={label}
              className="flex items-start gap-3 border border-gray-100 rounded-lg px-4 py-3"
            >
              <Icon size={16} className="text-gray-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-400">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-gray-100 rounded-lg p-4 h-fit">
          <p className="text-sm font-semibold text-gray-900 mb-4">
            How the Process Works
          </p>
          <div className="space-y-5">
            {PROCESS_STEPS.map(({ step, title, description }) => (
              <div key={step} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand text-white text-xs font-semibold shrink-0">
                  {step}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}