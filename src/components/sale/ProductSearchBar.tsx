import { Search } from 'lucide-react';

export function ProductSearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un article…"
        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--color-surface)] shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)] border border-transparent focus:border-[var(--color-accent)] focus:outline-none text-[15px] placeholder:text-[var(--color-ink-faint)]"
      />
    </div>
  );
}
