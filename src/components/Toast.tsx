import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
      <div className="pointer-events-auto px-4 py-2.5 rounded-xl bg-[#1D211D] text-[#F2F1EB] text-xs font-medium shadow-2xl border border-[#B8C7A1]/40 flex items-center gap-3">
        <CheckCircle2 className="w-4 h-4 text-[#B8C7A1] shrink-0" />
        <span className="font-['Manrope']">{message}</span>
        <button
          onClick={onClose}
          className="ml-1 text-[#A2A69D] hover:text-[#F2F1EB] transition-colors"
          aria-label="Đóng thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
