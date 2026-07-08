import { LogOut } from "../../lib/icons";

/**
 * Reusable confirm-logout dialog.
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <LogoutModal open={open} onCancel={() => setOpen(false)} onConfirm={handleLogout} />
 */
export default function LogoutModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto mb-4">
          <LogOut size={20} />
        </div>
        <h2 className="text-base font-semibold text-gray-900 text-center mb-1">
          Log out of your account?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          You'll need to sign in again to access your dashboard.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 text-base font-medium text-gray-700 border border-gray-300 rounded-[10px] py-2.5 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 text-base font-medium text-white bg-red-500 hover:bg-red-600 rounded-[10px] py-2.5"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}