import { Link } from "react-router-dom";
import { UserCircle, BarChart2 } from "../../lib/icons";

// Matches the reference "pmp" template's nav exactly: logo/title left,
// a plain Profile link and a single "Analyze Data" button on the right.
// No tabs, no role badge (that was commented out in the reference).
export default function POTopNav({ onAnalyzeClick }) {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 md:px-8 py-3 gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Crest"
            className="h-8 w-auto object-contain"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              QUALITY ASSURANCE PLATFORM
            </p>
            <p className="text-[10px] text-gray-400 hidden sm:block">
              Quality Assurance...doing the right things right every time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/profile/me"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand"
          >
            <UserCircle size={16} />
            Profile
          </Link>
          <button
            onClick={onAnalyzeClick}
            className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white text-base font-medium px-4 py-2 rounded-[10px]"
          >
            <BarChart2 size={15} />
            Analyze Data
          </button>
        </div>
      </div>
    </header>
  );
}
