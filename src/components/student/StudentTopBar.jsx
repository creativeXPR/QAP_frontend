import { ChevronDown, Menu } from "../../lib/icons";
import { getDateParts } from "../../lib/date";
import { getStoredUser } from "../../lib/auth";

/**
 * Single source of truth for the student welcome bar. StudentLayout
 * renders this and passes onMenuClick so the mobile hamburger button
 * still opens the sidebar drawer, even though the button itself now
 * lives here.
 *
 * name/date/sessionLabel default from the logged-in user + today's date
 * — read fresh on every render (not at module load, which would freeze
 * them to whatever was in localStorage before login ever ran).
 */
export default function StudentTopBar({
  name,
  date,
  sessionLabel,
  onMenuClick,
}) {
  sessionLabel = "2025/2026";
  const storedUser = getStoredUser();
  const [day, month, year] = getDateParts();

  const displayName = name ?? storedUser?.username ?? "Student";
  const displayDate = date ?? `${month}, ${day}th ${year}`;

  return (
    <div className="flex items-center justify-between gap-3 px-4 md:px-8 py-4 md:py-5 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-3 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden text-gray-500 shrink-0"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-semibold text-gray-900 truncate">
            Welcome Back, {displayName} 👋
          </h1>
          <p className="text-xs text-gray-400">{displayDate}</p>
        </div>
      </div>

      <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 shrink-0">
        <span className="hidden sm:inline">{sessionLabel}</span>
        <span className="sm:hidden">{sessionLabel.split(" ")[0]}</span>
        <ChevronDown size={14} />
      </button>
    </div>
  );
}
