import { formatFCFACompact } from '../../lib/currency';

type Tone = 'ink' | 'cash-in' | 'cash-out' | 'credit';

const toneClasses: Record<Tone, string> = {
  ink: 'text-[var(--color-ink)]',
  'cash-in': 'text-[var(--color-cash-in)]',
  'cash-out': 'text-[var(--color-cash-out)]',
  credit: 'text-[var(--color-credit)]',
};

export function Amount({ value, tone = 'ink', size = 'lg' }: { value: number; tone?: Tone; size?: 'md' | 'lg' | 'xl' }) {
  const sizeClass = size === 'xl' ? 'text-4xl' : size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <span className={`font-display font-bold font-mono-num ${sizeClass} ${toneClasses[tone]}`}>
      {formatFCFACompact(value)} <span className="text-[0.5em] font-semibold align-middle opacity-60">FCFA</span>
    </span>
  );
}
