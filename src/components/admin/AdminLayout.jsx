import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

export default function AdminLayout({ children, title }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminSidebar
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="md:ml-64 min-w-0">
        <AdminTopBar
          title={title}
          onMenuClick={() => setMobileNavOpen(true)}
        />

        <main className="px-4 md:px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
