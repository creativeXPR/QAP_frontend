import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import LogoutModal from "../components/common/LogoutModal";
import { Briefcase, Building2, Mail, ShieldCheck, LogOut } from "../lib/icons";
import { getStoredUser, logout } from "../lib/auth";
import { useToast } from "../components/common/ToastContext";

function getRoleLabel(status) {
  switch (status) {
    case "principle_officer":
      return "Principal Officer";
    case "focal_person":
      return "Focal Person";
    case "student":
      return "Student";
    case "admin":
      return "Admin";
    default:
      return status ? String(status).replace(/_/g, " ") : "User";
  }
}

export default function UserProfile() {
  const { addToast } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const storedUser = getStoredUser() || {};
  const name = storedUser.username || "Dr. Adewale Olumide Johnson";
  const roleTag = getRoleLabel(storedUser.status);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const USER = {
    name,
    roleTag,
    initials,
    fields: [
      { icon: Briefcase, label: "Role", value: roleTag },
      { icon: Mail, label: "Email Address", value: storedUser.email || "—" },
    ],
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    addToast("success", "Signed out successfully.");
    navigate("/sign-in");
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar showLogout={false} />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="rounded-lg border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-brand text-white text-lg font-semibold shrink-0">
                {USER.initials}
              </span>

              <div>
                <h1 className="text-lg font-semibold text-gray-900 mb-1">
                  {USER.name}
                </h1>
                <a
                  href="#"
                  className="text-brand text-sm font-medium hover:underline"
                >
                  {USER.roleTag}
                </a>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 mt-4">
                  {USER.fields.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2">
                      <Icon
                        size={15}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-sm text-gray-800">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 text-base font-medium text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-[10px] shrink-0"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </main>

      {/* <Footer /> */}

      <LogoutModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
