import { BookOpen, Calendar } from "../../lib/icons";

// Status is shown as a pill below the title.
// New/Completed are solid-filled; Pending uses a dot + muted background.
const STATUS_STYLES = {
  New: "bg-brand text-white",
  Completed: "bg-emerald-500 text-white",
  Pending: "bg-gray-100 text-gray-500",
};

const CATEGORY_ICON_BG = {
  Academic: "bg-blue-50 text-blue-600",
  Administrative: "bg-gray-100 text-gray-600",
};

function StatusPill({ status }) {
  if (!status) return null;
  const isPending = status === "Pending";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
        STATUS_STYLES[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      {isPending && <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
      {status}
    </span>
  );
}

export default function FormCard({
  category,
  title,
  status,
  dueDate,
  action = "Start",
}) {
  const isDone = action === "View" && status === "Completed";

  return (
    <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-md ${
            CATEGORY_ICON_BG[category] || "bg-gray-100 text-gray-500"
          }`}
        >
          <BookOpen size={14} />
        </span>
        <span className="text-sm text-gray-600">{category}</span>
      </div>

      <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>

      <div className="mb-2">
        <StatusPill status={status} />
      </div>

      {dueDate && (
        <p className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Calendar size={12} />
          Due: {dueDate}
        </p>
      )}

      <button
        className={`mt-auto text-base font-medium py-2 rounded-[10px] transition-colors ${
          isDone
            ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
            : action === "Continue"
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-brand hover:bg-brand-dark text-white"
        }`}
      >
        {action}
      </button>
    </div>
  );
}