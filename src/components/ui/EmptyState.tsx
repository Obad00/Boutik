import type { ReactNode } from 'react';

export function EmptyState({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
      <div className="w-14 h-14 rounded-2xl bg-black/[0.04] flex items-center justify-center text-[var(--color-ink-faint)]">
        {icon}
      </div>
      <p className="font-display font-semibold text-[var(--color-ink)]">{title}</p>
      {subtitle && <p className="text-sm text-[var(--color-ink-soft)] max-w-xs">{subtitle}</p>}
    </div>
  );
}
