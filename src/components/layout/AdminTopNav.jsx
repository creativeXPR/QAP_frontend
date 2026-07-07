import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import LogoutModal from "../common/LogoutModal";

export default function AdminTopNav({ tabs = [], activeTab, portalLabel }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/sign-in");
  };

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 md:px-8 py-3 gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Crest" className="h-8 w-auto object-contain" />
          <p className="text-sm font-semibold text-gray-900">
            DIRECTORATE OF QUALITY ASSURANCE
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1.5 rounded-md ${
                tab === activeTab
                  ? "bg-brand text-white font-medium"
                  : "text-gray-500 hover:text-brand"
              }`}
            >
              {tab}
            </button>
          ))}
          {portalLabel && (
            <span className="ml-2 text-xs font-medium text-brand border border-brand/30 bg-brand/5 px-2 py-1 rounded-full">
              {portalLabel}
            </span>
          )}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 ml-2"
          >
            <LogOut size={15} />
            Logout
          </button>
        </nav>
      </div>

      <LogoutModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
}