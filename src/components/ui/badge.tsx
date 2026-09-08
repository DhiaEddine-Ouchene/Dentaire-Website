import { cn } from '@/lib/utils';

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

const variants: Record<BadgeVariant, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  primary: 'bg-primary-100 text-primary-800',
  success: 'bg-success-light text-success-dark',
  warning: 'bg-warning-light text-warning-dark',
  error: 'bg-error-light text-error-dark',
  info: 'bg-info-light text-info-dark'
};

/** Petite étiquette d'état (statut de rendez-vous, catégorie, tag…). */
export function Badge({
  variant = 'neutral',
  className,
  children
}: {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
