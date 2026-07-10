import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../common/LogoutModal";
import { logout } from "../../lib/auth";
import { useToast } from "../common/ToastContext";

export default function FpNav({ showLogout = true }) {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    addToast("success", "Signed out successfully.");
    navigate("/sign-in");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Crest"
            className="h-9 w-auto object-contain"
          />

          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              DIRECTORATE OF QUALITY ASSURANCE
            </p>

            <p className="text-[10px] text-gray-400 hidden sm:block">
              University of Ibadan
            </p>
          </div>
        </div>

        {/* Back Button */}
        {/* <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="border border-gray-300 text-gray-700 text-base font-medium px-4 py-2 rounded-[10px] hover:bg-gray-50"
          >
            Back
          </button>
        </div> */}
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-3 px-4 pb-4 text-sm text-gray-600">
          {showLogout && (
            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-left text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          )}
        </nav>
      )}

      <LogoutModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
}
