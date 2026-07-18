import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-[var(--color-ink)]/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-[var(--color-surface)] rounded-t-[2rem] sm:rounded-[2rem] max-h-[88vh] flex flex-col shadow-2xl animate-[slideUp_0.2s_ease-out]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[var(--color-border)]">
          <h2 className="font-display font-bold text-lg text-[var(--color-ink)]">{title}</h2>
          <button
            onClick={onClose}
            className="tap-scale w-9 h-9 flex items-center justify-center rounded-full bg-black/5 text-[var(--color-ink-soft)]"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-[var(--color-border)] safe-bottom">{footer}</div>}
      </div>
    </div>
  );
}
