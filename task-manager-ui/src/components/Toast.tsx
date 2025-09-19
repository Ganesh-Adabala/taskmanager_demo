import React, { useEffect, useState, useCallback, useRef } from "react";
import "./FormStyles.css";

// Toast types for semantic meaning and accessibility
export type ToastType = "success" | "error" | "warning" | "info";

// Individual toast configuration
export interface ToastConfig {
  id?: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

// Individual toast component
interface ToastProps extends ToastConfig {
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id = "",
  type,
  title,
  message,
  duration = 5000,
  persistent = false,
  action,
  onRemove,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Icon mapping for different toast types
  const getIcon = (toastType: ToastType): string => {
    switch (toastType) {
      case "success":
        return "✓";
      case "error":
        return "⚠";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "ℹ";
    }
  };

  // ARIA role mapping for different toast types
  const getAriaRole = (toastType: ToastType): string => {
    switch (toastType) {
      case "error":
        return "alert";
      case "warning":
        return "alert";
      default:
        return "status";
    }
  };

  // Handle toast removal with animation
  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(id);
    }, 300); // Match CSS animation duration
  }, [id, onRemove]);

  // Set up auto-dismiss timer
  useEffect(() => {
    if (!persistent && duration > 0) {
      timeoutRef.current = setTimeout(handleRemove, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration, persistent, handleRemove]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      handleRemove();
    }
  };

  // Focus management for accessibility
  useEffect(() => {
    if (toastRef.current) {
      // Focus the toast for screen readers on critical messages
      if (type === "error") {
        toastRef.current.focus();
      }
    }
  }, [type]);

  return (
    <div
      ref={toastRef}
      className={`toast ${type} ${isRemoving ? "removing" : ""}`}
      role={getAriaRole(type)}
      aria-live={type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      tabIndex={type === "error" ? 0 : -1}
      onKeyDown={handleKeyDown}
    >
      <div className="toast-content">
        <span
          className="toast-icon"
          aria-hidden="true"
          role="img"
          aria-label={`${type} notification`}
        >
          {getIcon(type)}
        </span>
        <div className="toast-message">
          <div className="toast-title">{title}</div>
          {message && <div>{message}</div>}
          {action && (
            <button
              type="button"
              onClick={action.handler}
              className="toast-action"
              style={{
                marginTop: "8px",
                padding: "4px 8px",
                background: "transparent",
                border: "1px solid currentColor",
                borderRadius: "3px",
                color: "inherit",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          type="button"
          className="toast-close"
          onClick={handleRemove}
          aria-label={`Close ${type} notification: ${title}`}
          title="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Toast container component
interface ToastContainerProps {
  toasts: (ToastConfig & { id: string })[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Announce toast count changes for screen readers
  const toastCount = toasts.length;
  const errorCount = toasts.filter((t) => t.type === "error").length;

  return (
    <>
      {/* Screen reader announcement for toast count */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {toastCount > 0 &&
          `${toastCount} notification${toastCount > 1 ? "s" : ""} present${
            errorCount > 0
              ? `, ${errorCount} error${errorCount > 1 ? "s" : ""}`
              : ""
          }`}
      </div>

      <div
        ref={containerRef}
        className="toast-container"
        role="region"
        aria-label="Notifications"
        aria-relevant="additions removals"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onRemove={onRemove} />
        ))}
      </div>
    </>
  );
};

// Toast hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<(ToastConfig & { id: string })[]>([]);

  // Add a new toast
  const addToast = useCallback((config: ToastConfig) => {
    const id =
      config.id ||
      `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast = { ...config, id };

    setToasts((prev) => [...prev, toast]);

    return id;
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods for different toast types
  const toast = {
    success: (
      title: string,
      message?: string,
      options?: Partial<ToastConfig>
    ) => addToast({ ...options, type: "success", title, message }),

    error: (title: string, message?: string, options?: Partial<ToastConfig>) =>
      addToast({ ...options, type: "error", title, message, persistent: true }),

    warning: (
      title: string,
      message?: string,
      options?: Partial<ToastConfig>
    ) => addToast({ ...options, type: "warning", title, message }),

    info: (title: string, message?: string, options?: Partial<ToastConfig>) =>
      addToast({ ...options, type: "info", title, message }),
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    toast,
    ToastContainer: () => (
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    ),
  };
};

export { Toast, ToastContainer };
