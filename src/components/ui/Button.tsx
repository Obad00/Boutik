import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] shadow-lg shadow-[var(--color-primary)]/20',
  secondary: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] hover:brightness-95',
  ghost: 'bg-transparent text-[var(--color-ink-soft)] hover:bg-black/5',
  danger: 'bg-[var(--color-cash-out)] text-white hover:brightness-95 shadow-lg shadow-[var(--color-cash-out)]/20',
  success: 'bg-[var(--color-cash-in)] text-white hover:brightness-95 shadow-lg shadow-[var(--color-cash-in)]/20',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-5 py-3 text-[15px] rounded-2xl gap-2',
  lg: 'px-6 py-4 text-base rounded-2xl gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`tap-scale inline-flex items-center justify-center font-semibold select-none disabled:opacity-40 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
