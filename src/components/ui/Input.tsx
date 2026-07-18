import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-ink-soft)]">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-3 rounded-xl bg-black/[0.03] border border-transparent focus:border-[var(--color-accent)] focus:bg-white focus:outline-none text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
