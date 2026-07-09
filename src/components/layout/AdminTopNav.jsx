import { Link } from "react-router-dom";
import { UserCircle } from "../../lib/icons";

// Matches the reference "admin" template's nav: logo/title left,
// plain anchor links (Home, FP Management, PO Management, Profile) on
// the right. No tabs/active-highlighting, no role badge, no logout —
// logout only lives on the Profile page in the reference.
export default function AdminTopNav() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 md:px-8 py-3 gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Crest" className="h-8 w-auto object-contain" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              QUALITY ASSURANCE PLATFORM
            </p>
            <p className="text-[10px] text-gray-400 hidden sm:block">
              Quality Assurance...doing the right things right every time
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
          {/* "Home" in the reference points to the public landing page;
              there's no unrestricted equivalent route here, so this
              just refreshes the Admin Portal itself. */}
          <Link to="/admin" className="hover:text-brand">
            Home
          </Link>
          <a href="#fpm" className="hover:text-brand">
            FP Management
          </a>
          <a href="#pom" className="hover:text-brand">
            PO Management
          </a>
          <Link to="/profile/me" className="flex items-center gap-1.5 hover:text-brand">
            <UserCircle size={16} />
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}