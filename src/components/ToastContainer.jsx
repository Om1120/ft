import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useFranchises();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="var(--status-success-text)" />;
      case 'warning':
        return <AlertTriangle size={18} color="var(--status-warning-text)" />;
      case 'error':
        return <XCircle size={18} color="var(--status-danger-text)" />;
      default:
        return <Info size={18} color="var(--status-info-text)" />;
    }
  };

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          <div className="toast-icon-wrap">{getIcon(toast.type)}</div>
          <div className="toast-content">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            <div className="toast-message">{toast.message}</div>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
