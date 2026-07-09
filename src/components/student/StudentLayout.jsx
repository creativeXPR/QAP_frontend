import { useState } from "react";
import StudentSidebar from "./StudentSidebar";
import StudentTopBar from "./StudentTopBar";

/**
 * Shared shell for every student page: sidebar (desktop rail / mobile
 * drawer) + top welcome bar + content area.
 *
 * StudentTopBar.jsx is the single source of truth for the welcome bar's
 * design and its dynamic name/date/session defaults — this component
 * just renders it and wires up the mobile menu toggle.
 *
 * Usage:
 *   <StudentLayout>
 *     ...page content...
 *   </StudentLayout>
 *
 * Pass name/date/sessionLabel here only if a specific page needs to
 * override StudentTopBar's own defaults.
 */
export default function StudentLayout({ children, name, date, sessionLabel }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      <StudentSidebar
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="md:ml-64 min-w-0">
        <StudentTopBar
          {...(name !== undefined && { name })}
          {...(date !== undefined && { date })}
          {...(sessionLabel !== undefined && { sessionLabel })}
          onMenuClick={() => setMobileNavOpen(true)}
        />

        <main className="px-4 md:px-8 py-6">{children}</main>
      </div>
    </div>
  );
}