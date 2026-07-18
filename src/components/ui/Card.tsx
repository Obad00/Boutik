import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
  raised?: boolean;
}

export function Card({ children, padded = true, raised = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-[var(--color-surface)] rounded-[var(--radius-card)] ${
        raised ? 'shadow-[0_8px_30px_-8px_rgba(19,26,44,0.18)]' : 'shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)]'
      } ${padded ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
