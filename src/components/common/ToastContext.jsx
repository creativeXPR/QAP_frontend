import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "../../lib/icons";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 4000;

// Urgency -> icon/border/text. Colors follow the app's existing
// convention (emerald for success, amber for warning, red for error)
// rather than literal Tailwind green/yellow, to match how status is
// colored everywhere else (badges, PrivacyTab's warning box, etc.).
const TOAST_STYLES = {
  success: { icon: CheckCircle2, border: "border-emerald-500", text: "text-emerald-700" },
  warning: { icon: AlertTriangle, border: "border-amber-500", text: "text-amber-700" },
  error: { icon: XCircle, border: "border-red-500", text: "text-red-700" },
  info: { icon: Info, border: "border-blue-500", text: "text-blue-700" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Callable from anywhere via useToast(): addToast(type, message, duration?)
  // type is one of "success" | "warning" | "error" | "info". Pass
  // duration: 0 to keep it on screen until manually dismissed.
  const addToast = useCallback(
    (type, message, duration = DEFAULT_DURATION) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Toast stack, sliding in from off-screen right into the top-right corner */}
      <div className="fixed top-4 inset-x-4 sm:inset-x-auto sm:right-4 z-[200] flex flex-col items-stretch sm:items-end gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }) {
  const { icon: Icon, border, text } = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 w-full sm:w-auto sm:min-w-[300px] sm:max-w-sm bg-white border ${border} rounded-lg shadow-lg px-4 py-3 animate-slide-in`}
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${text}`} />
      <p className={`flex-1 min-w-0 text-sm font-medium break-words ${text}`}>{toast.message}</p>
      <button
        onClick={onRemove}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
