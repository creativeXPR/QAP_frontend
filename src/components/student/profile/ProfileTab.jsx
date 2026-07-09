import { useState } from "react";
import { EyeOff, Lock, Eye } from "../../../lib/icons";

// TODO: no backend endpoint currently exists to persist a saved
// "default privacy mode" preference — this only updates local UI
// state for now. Wire this to a real PATCH/PUT call once that
// endpoint exists (likely something like students.profile.update()).
const PRIVACY_MODES = [
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

export default function ProfileTab() {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const name = userData.username || "Username";
  const email = userData.email || "—";
  const status = userData.status || "student";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const [privacyMode, setPrivacyMode] = useState("Anonymous");

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-8">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-brand text-white text-sm font-semibold shrink-0">
            {initials}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-400">{email}</p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full capitalize">
          {status}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        Default Privacy Mode
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        This mode is pre-selected when you start a new submission.
      </p>

      <div className="space-y-3">
        {PRIVACY_MODES.map(({ value, icon: Icon, description }) => {
          const selected = privacyMode === value;
          return (
            <label
              key={value}
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
                    {value}
                  </span>
                  <span className="block text-xs text-gray-400">{description}</span>
                </span>
              </span>
              <input
                type="radio"
                name="default-privacy-mode"
                checked={selected}
                onChange={() => setPrivacyMode(value)}
                className="text-brand focus:ring-brand shrink-0 mt-0.5"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}