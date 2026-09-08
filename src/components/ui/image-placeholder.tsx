import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PlaceholderTone = 'primary' | 'teal' | 'sand' | 'gold' | 'ink';

const toneGradient: Record<PlaceholderTone, string> = {
  primary: 'from-primary-100 via-primary-50 to-sand-100',
  teal: 'from-primary-200 via-primary-100 to-white',
  sand: 'from-sand-200 via-sand-100 to-primary-50',
  gold: 'from-accent-100 via-sand-100 to-primary-50',
  ink: 'from-ink-200 via-ink-100 to-ink-50'
};

const toneIcon: Record<PlaceholderTone, string> = {
  primary: 'text-primary-500/50',
  teal: 'text-primary-500/50',
  sand: 'text-accent-500/40',
  gold: 'text-accent-500/50',
  ink: 'text-ink-400/50'
};

/**
 * Visuel de remplacement (dégradé doux + icône) utilisé tant que les vraies
 * photos ne sont pas téléversées. Garantit des builds fiables et un rendu
 * cohérent avec la charte. Purement décoratif si aucun `label`.
 */
export function ImagePlaceholder({
  tone = 'primary',
  icon: Icon,
  label,
  className,
  children
}: {
  tone?: PlaceholderTone;
  icon?: LucideIcon;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-gradient-to-br',
        toneGradient[tone],
        className
      )}
      aria-hidden={label ? undefined : true}
    >
      <div className="pointer-events-none absolute -end-8 -top-8 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -start-6 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
      {Icon && <Icon className={cn('h-14 w-14', toneIcon[tone])} strokeWidth={1.5} />}
      {label && (
        <span className="absolute bottom-3 start-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-ink-700 backdrop-blur">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
