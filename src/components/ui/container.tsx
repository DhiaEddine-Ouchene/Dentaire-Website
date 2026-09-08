import { cn } from '@/lib/utils';

/**
 * Conteneur centré à largeur maximale, avec marges responsives cohérentes.
 * À utiliser pour aligner tout le contenu sur une grille commune.
 */
export function Container({
  className,
  children,
  as: Component = 'div'
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <Component className={cn('mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-8', className)}>
      {children}
    </Component>
  );
}
