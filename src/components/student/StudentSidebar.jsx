import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  PlusSquare,
  Bell,
  UserCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard, end: true },
  { label: "Reports", to: "/student/reports", icon: BarChart2, end: false },
  { label: "Submit Report", to: "/student/reports/new", icon: PlusSquare, end: true },
  { label: "Notifications", to: "/student/notifications", icon: Bell, end: true },
  { label: "Profile", to: "/student/profile", icon: UserCircle, end: true },
];

export default function StudentSidebar({ user = { name: "Emmanuel Aina", role: "Student" } }) {
  return (
    <aside className="hidden md:flex md:w-64 shrink-0 border-r border-gray-100 bg-white flex-col justify-between min-h-screen">
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
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-sm font-medium text-gray-600 overflow-hidden">
          {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </span>
        <div className="leading-tight">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <span className="inline-block text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            {user.role}
          </span>
        </div>
      </div>
    </aside>
  );
}