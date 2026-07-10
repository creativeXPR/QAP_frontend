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
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-brand text-white text-sm font-semibold shrink-0">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 break-words">{name}</p>
            <p className="text-xs text-gray-400 break-words">{email}</p>
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

    </div>
  );
}