import { cn } from '@/lib/utils';
import { Container } from './container';

type SectionTone = 'default' | 'muted' | 'warm' | 'primary';

const toneStyles: Record<SectionTone, string> = {
  default: 'bg-white',
  muted: 'bg-ink-50',
  warm: 'bg-sand-50',
  primary: 'bg-primary-900 text-white'
};

/**
 * Bloc de section vertical avec espacement rythmé et fond optionnel.
 * `contained` enveloppe automatiquement le contenu dans un <Container>.
 */
export function Section({
  tone = 'default',
  contained = true,
  className,
  containerClassName,
  children,
  ...props
}: {
  tone?: SectionTone;
  contained?: boolean;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn('py-16 sm:py-20 lg:py-24', toneStyles[tone], className)} {...props}>
      {contained ? <Container className={containerClassName}>{children}</Container> : children}
    </section>
  );
}

/**
 * En-tête de section : sur-titre optionnel + titre + description.
 * `centered` centre le tout (usage vitrine).
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  className
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('max-w-2xl', centered && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-display-sm text-ink-900">{title}</h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-ink-600">{description}</p>}
    </div>
  );
}
