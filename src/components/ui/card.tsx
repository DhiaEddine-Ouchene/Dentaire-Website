import { cn } from '@/lib/utils';

/**
 * Carte de contenu — surface blanche, rayon doux, ombre légère.
 * `interactive` ajoute un effet de survol (pour les cartes cliquables).
 */
export function Card({
  className,
  interactive = false,
  children,
  ...props
}: {
  className?: string;
  interactive?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-ink-100 bg-white shadow-card',
        interactive && 'transition-shadow duration-300 hover:shadow-lifted',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('p-6 sm:p-8', className)}>{children}</div>;
}

export function CardTitle({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h3 className={cn('text-xl font-semibold text-ink-900', className)}>{children}</h3>;
}

export function CardDescription({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={cn('mt-2 leading-relaxed text-ink-600', className)}>{children}</p>;
}
