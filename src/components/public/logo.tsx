import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

/** Icône dent (SVG en ligne — marque du cabinet). */
export function ToothMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 2.2c-1.9 0-2.9 1-4.6 1.5-.9.3-1.9.2-2.8.6C3 5.1 2.6 6.8 2.9 8.7c.3 1.7.9 2.7 1.2 4.4.3 1.5.4 3.1.9 4.9.3 1.2.7 2.9 1.7 2.9 1.1 0 1.4-1.8 1.8-3.4.3-1.3.5-2.8 1.6-2.8h.2c1.1 0 1.3 1.5 1.6 2.8.4 1.6.7 3.4 1.8 3.4 1 0 1.4-1.7 1.7-2.9.5-1.8.6-3.4.9-4.9.3-1.7.9-2.7 1.2-4.4.3-1.9-.1-3.6-1.7-4.4-.9-.4-1.9-.3-2.8-.6C14.9 3.2 13.9 2.2 12 2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Logo du cabinet : marque dent + nom. `theme="light"` pour les fonds sombres. */
export function Logo({
  className,
  showName = true,
  theme = 'dark'
}: {
  className?: string;
  showName?: boolean;
  theme?: 'dark' | 'light';
}) {
  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-2.5', className)}
      aria-label={siteConfig.name}
    >
      <span
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-2xl shadow-soft transition-colors',
          theme === 'light'
            ? 'bg-white text-primary-600'
            : 'bg-primary-500 text-white group-hover:bg-primary-600'
        )}
      >
        <ToothMark className="h-6 w-6" />
      </span>
      {showName && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display text-lg font-semibold',
              theme === 'light' ? 'text-white' : 'text-ink-900'
            )}
          >
            Le Sourire
          </span>
          <span
            className={cn(
              'text-[11px] font-medium uppercase tracking-wider',
              theme === 'light' ? 'text-primary-200' : 'text-primary-600'
            )}
          >
            Cabinet Dentaire
          </span>
        </span>
      )}
    </Link>
  );
}
