"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-[#15803d]/10",
          border: "border-[#15803d]",
          text: "text-[#15803d]",
          icon: CheckCircle,
        };
      case "error":
        return {
          bg: "bg-[#9a3412]/10",
          border: "border-[#9a3412]",
          text: "text-[#9a3412]",
          icon: AlertCircle,
        };
      case "warning":
        return {
          bg: "bg-[#b45309]/10",
          border: "border-[#b45309]",
          text: "text-[#b45309]",
          icon: AlertTriangle,
        };
      default:
        return {
          bg: "bg-[#fdfaf4]",
          border: "border-[#bfb5a3]",
          text: "text-[#24231f]",
          icon: Info,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          const Icon = styles.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between border-2 border-[#24231f] ${styles.bg} p-4 rounded-none shadow-[4px_4px_0_#24231f] animate-in fade-in slide-in-from-bottom-5 duration-200`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={`${styles.text} shrink-0`} />
                <p className="text-xs font-bold uppercase tracking-wider text-[#24231f]">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 p-1 text-[#645d52] hover:text-[#24231f] hover:bg-[#ebe3d5] transition-all cursor-pointer rounded-none border border-transparent hover:border-[#bfb5a3]"
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
