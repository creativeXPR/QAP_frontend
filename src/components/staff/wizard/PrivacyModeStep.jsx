import { EyeOff, Lock, Eye, Info } from "../../../lib/icons";

const MODES = [
  {
    value: "Anonymous",
    icon: EyeOff,
    description: "Your identity is completely hidden",
  },
  {
    value: "Confidential",
    icon: Lock,
    description: "Your identity is only known to the Focal Point Officer",
  },
  {
    value: "Open Identity",
    icon: Eye,
    description: "Your identity is visible throughout the process",
  },
];

export default function PrivacyModeStep({ value, onChange, onBack, onContinue }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
        Choose your submission mode
      </h2>
      <p className="text-sm text-gray-400 text-center mb-6">
        This controls how your identity is handled throughout the process.
      </p>

      <div className="space-y-3">
        {MODES.map(({ value: modeValue, icon: Icon, description }) => {
          const selected = value === modeValue;
          return (
            <label
              key={modeValue}
              className={`flex items-start sm:items-center justify-between gap-3 border rounded-lg px-4 py-3 cursor-pointer ${
                selected
                  ? "border-brand bg-brand/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="flex items-start sm:items-center gap-3 min-w-0">
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${
                    selected ? "bg-brand text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-gray-900">
                    {modeValue}
                  </span>
                  <span className="block text-xs text-gray-400">
                    {description}
                  </span>
                </span>
              </span>
              <input
                type="radio"
                name="submission-mode"
                checked={selected}
                onChange={() => onChange(modeValue)}
                className="text-brand focus:ring-brand shrink-0 mt-0.5"
              />
            </label>
          );
        })}
      </div>

      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-md px-3 py-3 mt-4 text-xs text-blue-700">
        <Info size={15} className="shrink-0 mt-0.5" />
        <p>
          Regardless of mode, your data is encrypted and stored securely on
          University servers. Only authorized QA personnel can access case
          details.
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 text-base font-medium text-gray-600 border border-gray-300 rounded-[10px] py-2.5 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="flex-1 bg-brand hover:bg-brand-dark text-white text-base font-medium py-2.5 rounded-[10px]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}