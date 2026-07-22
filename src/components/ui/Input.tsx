import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Icône/bouton affiché à l'intérieur du champ, aligné à droite (ex: bascule afficher/masquer). */
  rightElement?: ReactNode;
}

export function Input({ label, className = '', id, rightElement, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-ink-soft)]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          className={`w-full px-4 py-3 rounded-xl bg-black/[0.03] border border-transparent focus:border-[var(--color-accent)] focus:bg-white focus:outline-none text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] transition-colors ${rightElement ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightElement}</div>
        )}
      </div>
    </div>
  );
}
