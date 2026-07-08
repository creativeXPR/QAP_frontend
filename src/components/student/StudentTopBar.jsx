import { ChevronDown, Menu } from "../../lib/icons";
import { getDateParts } from "../../lib/date";
 
let userData = JSON.parse(localStorage.getItem("user"));
let currentDate = getDateParts();
console.log("Current Date:", currentDate, "User Data:", userData);

/**
 * Single source of truth for the student welcome bar. StudentLayout
 * renders this and passes onMenuClick so the mobile hamburger button
 * still opens the sidebar drawer, even though the button itself now
 * lives here.
 */
export default function StudentTopBar({
  name = userData?.username || "Username",
  date = `${currentDate[1]}, ${currentDate[0]}th ${currentDate[2]}` ||
    "Monday, 6th July 2026",
  sessionDisplay = "2025/2026",
  onMenuClick,
}) {
    // alert("SessionLabel: " + sessionDisplay);
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
            Welcome Back, {name} 👋
          </h1>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
      </div>

      <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 shrink-0">
        <span className="hidden sm:inline">{sessionDisplay}</span>
        <span className="sm:hidden">{sessionDisplay.split(" ")[0]}</span>
        <ChevronDown size={14} />
      </button>
    </div>
  );
}