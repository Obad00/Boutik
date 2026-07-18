import type { ReactNode } from 'react';

type Tone = 'neutral' | 'danger' | 'warning' | 'success' | 'credit';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-black/5 text-[var(--color-ink-soft)]',
  danger: 'bg-[var(--color-cash-out-soft)] text-[var(--color-cash-out)]',
  warning: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  success: 'bg-[var(--color-cash-in-soft)] text-[var(--color-cash-in)]',
  credit: 'bg-[var(--color-credit-soft)] text-[var(--color-credit)]',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
