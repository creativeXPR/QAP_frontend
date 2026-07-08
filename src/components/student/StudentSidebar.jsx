import { NavLink } from "react-router-dom";
import { X } from "../../lib/icons";
import { getStoredUser } from "../../lib/auth";
import { formatLabel } from "../../lib/submissionMapper";
import {
  LayoutDashboard,
  BarChart2,
  PlusSquare,
  Bell,
  UserCircle,
} from "../../lib/icons";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard, end: true },
  { label: "New Submission", to: "/student/reports", icon: PlusSquare, end: true },
  { label: "Submissions", to: "/student/reports/new", icon: BarChart2, end: true },
  { label: "Notifications", to: "/student/notifications", icon: Bell, end: true },
  { label: "Profile", to: "/student/profile", icon: UserCircle, end: true },
];

function SidebarContent({ user, onNavigate }) {
  return (
    <>
      <div>
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
          <img src="/logo.png" alt="Crest" className="h-8 w-auto object-contain" />
          <div className="leading-tight">
            <p className="text-[11px] font-semibold text-brand">
              DIRECTORATE OF QUALITY ASSURANCE
            </p>
            <p className="text-[9px] text-gray-400">
              Quality Assurance...doing the right things right every time
            </p>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm ${
                  isActive
                    ? "bg-brand/10 text-brand font-medium"
                    : "text-gray-500 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-100">
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-sm font-medium text-gray-600 overflow-hidden shrink-0">
          {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </span>
        <div className="leading-tight">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <span className="inline-block text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            {user.role}
          </span>
        </div>
      </div>
    </>
  );
}

/**
 * Desktop: a permanent left rail (md and up).
 * Mobile: a slide-in drawer controlled by `open`/`onClose`, triggered
 * from StudentLayout's mobile top bar.
 */

export default function StudentSidebar({ user, open = false, onClose = () => {} }) {
  const storedUser = getStoredUser();
  const resolvedUser = user ?? {
    name: storedUser?.username || "Student",
    role: formatLabel(storedUser?.status || "student"),
  };

  return (
    <>
      {/* Desktop rail — fixed so it never scrolls with page content */}
      <aside className="hidden md:flex md:w-64 md:fixed md:inset-y-0 md:left-0 border-r border-gray-100 bg-white flex-col justify-between overflow-y-auto z-20">
        <SidebarContent user={resolvedUser} onNavigate={() => {}} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[80vw] bg-white flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-end px-3 pt-3">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-between -mt-8">
              <SidebarContent user={resolvedUser} onNavigate={onClose} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}