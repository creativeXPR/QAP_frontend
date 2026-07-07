import { ChevronDown } from "lucide-react";

export default function StudentTopBar({
  name = "Emmanuel Aina",
  date = "Monday, 6th July 2026",
  sessionLabel = "This Semester",
}) {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 py-5 border-b border-gray-100">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Welcome Back, {name} 👋
        </h1>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
      <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50">
        {sessionLabel}
        <ChevronDown size={14} />
      </button>
    </div>
  );
}