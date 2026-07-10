import { createContext, useContext, useState, useCallback } from 'react';

// 1. Create the Context
const ToastContext = createContext();

// 2. Create the Provider Component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // The function that will be called from anywhere
  const addToast = useCallback((type, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    
    // Automatically remove the toast after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container fixed to top-right */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onRemove={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Custom hook to use the toaster easily
export const useToast = () => useContext(ToastContext);

// 3. The Individual Toast Component
function ToastItem({ toast, onRemove }) {
  // Map the urgency types to Tailwind colors matching your design rules
  const typeStyles = {
    success: 'border-green-500 text-green-700',
    warning: 'border-yellow-500 text-yellow-700',
    error: 'border-red-500 text-red-700',
    info: 'border-blue-500 text-blue-700', // Added info type
  };

  const currentStyle = typeStyles[toast.type] || typeStyles.success;

  return (
    <div 
      className={`pointer-events-auto flex items-start justify-between p-4 min-w-[280px] max-w-sm bg-white border rounded-xl shadow-lg animate-slide-in ${currentStyle}`}
    >
      <span className="font-medium text-sm mt-0.5">{toast.message}</span>
      <button 
        onClick={onRemove} 
        className="ml-4 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}