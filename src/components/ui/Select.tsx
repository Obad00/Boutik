import type { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export function Select({ label, className = '', id, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-ink-soft)]">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-3 rounded-xl bg-black/[0.03] border border-transparent focus:border-[var(--color-accent)] focus:bg-white focus:outline-none text-[var(--color-ink)] transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
