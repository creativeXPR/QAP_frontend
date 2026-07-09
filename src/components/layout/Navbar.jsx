import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "../../lib/icons";
import LogoutModal from "../common/LogoutModal";

const NAV_LINKS = ["Home", "About", "Mission", "Unit", "Contact"];

export default function Navbar({
  ctaLabel = "Submit Form",
  ctaVariant = "filled",
  ctaTo,
  showLogout = true,
}) {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const ctaClassName =
    ctaVariant === "outline"
      ? "border border-gray-300 text-gray-700 text-base font-medium px-4 py-2 rounded-[10px] hover:bg-gray-50"
      : "bg-brand hover:bg-brand-dark text-white text-base font-medium px-4 py-2 rounded-[10px]";

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/sign-in");
  };

  return (
    <header className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Crest" className="h-9 w-auto object-contain" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              DIRECTORATE OF QUALITY ASSURANCE
            </p>
            <p className="text-[10px] text-gray-400 hidden sm:block">
              University of Ibadan
            </p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="hover:text-brand">
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {showLogout && (
            <button
              onClick={() => setShowLogoutModal(true)}
              className="hidden sm:flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
          {ctaTo ? (
            <Link to={ctaTo} className={ctaClassName}>
              {ctaLabel}
            </Link>
          ) : (
            <button className={ctaClassName}>{ctaLabel}</button>
          )}
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-500"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-3 px-4 pb-4 text-sm text-gray-600">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="hover:text-brand">
              {link}
            </a>
          ))}
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