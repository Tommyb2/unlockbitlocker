import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  toasts,
  onDismiss
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none">
      {toasts.map(toast => {
        let borderClass = 'border-blue-500/40 bg-[#0e1424] text-slate-100';
        let Icon = Info;
        let iconClass = 'text-blue-400';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/40 bg-[#0a1a14] text-emerald-100';
          Icon = CheckCircle2;
          iconClass = 'text-emerald-400';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/40 bg-[#1c150b] text-amber-100';
          Icon = AlertTriangle;
          iconClass = 'text-amber-400';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/40 bg-[#1f0d11] text-rose-100';
          Icon = AlertCircle;
          iconClass = 'text-rose-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200 ${borderClass}`}
          >
            <div className="flex items-start gap-2.5">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} />
              <div>
                <h4 className="text-xs font-bold">{toast.title}</h4>
                <p className="text-[11px] opacity-90 leading-relaxed mt-0.5">{toast.message}</p>
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
