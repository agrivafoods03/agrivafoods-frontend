import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let bgStyle = 'bg-white border-primary/30 text-primary-dark shadow-premium-hover';
        let iconStyle = 'text-primary';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          bgStyle = 'bg-white border-error/30 text-error shadow-premium-hover';
          iconStyle = 'text-error';
        } else if (toast.type === 'info') {
          Icon = Info;
          bgStyle = 'bg-white border-sage text-foreground shadow-premium';
          iconStyle = 'text-muted';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border ${bgStyle} animate-fade-in transition-all`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 flex-shrink-0 ${iconStyle}`} />
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-muted hover:text-foreground rounded-lg transition-colors ml-2"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
