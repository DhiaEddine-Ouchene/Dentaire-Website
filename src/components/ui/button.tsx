import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-white shadow-soft hover:bg-primary-600 active:bg-primary-700',
  secondary: 'bg-sand-100 text-primary-800 hover:bg-sand-200 active:bg-sand-300',
  outline: 'border border-primary-500 text-primary-700 hover:bg-primary-50 active:bg-primary-100',
  ghost: 'text-primary-700 hover:bg-primary-50 active:bg-primary-100',
  danger: 'bg-error text-white shadow-soft hover:bg-error-dark'
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-base'
};

/** Génère les classes d'un bouton — pratique pour styliser un <Link> comme un bouton. */
export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={buttonVariants({ variant, size, className })} {...props} />
  )
);

Button.displayName = 'Button';
