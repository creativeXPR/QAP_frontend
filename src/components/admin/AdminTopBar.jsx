import { Link } from "react-router-dom";
import { Menu, UserCircle } from "../../lib/icons";
import { getDateParts } from "../../lib/date";
import { getStoredUser } from "../../lib/auth";

export default function AdminTopBar({
  title = "Admin Dashboard",
  onMenuClick,
}) {
  const storedUser = getStoredUser();
  const [day, month, year] = getDateParts();

  const displayDate = `${month}, ${day}th ${year}`;

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
            {title}
          </h1>
          <p className="text-xs text-gray-400">{displayDate}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
          Administrator
        </span>
        <Link
          to="/profile/me"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand"
        >
          <UserCircle size={16} />
          <span className="hidden sm:inline">Profile</span>
        </Link>
      </div>
    </div>
  );
}
