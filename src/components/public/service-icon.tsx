import {
  Stethoscope,
  Sparkles,
  Sun,
  ShieldCheck,
  Anchor,
  Smile,
  Crown,
  Baby,
  HeartPulse
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ServiceIcon } from '@/data/services';
import { cn } from '@/lib/utils';

/** Association clé d'icône de service → icône lucide. */
export const serviceIconMap: Record<ServiceIcon, LucideIcon> = {
  consultation: Stethoscope,
  cleaning: Sparkles,
  whitening: Sun,
  cavity: ShieldCheck,
  implant: Anchor,
  ortho: Smile,
  crown: Crown,
  pediatric: Baby,
  emergency: HeartPulse
};

/** Pastille d'icône de service, réutilisée sur l'accueil et la page Services. */
export function ServiceIconBadge({
  icon,
  className
}: {
  icon: ServiceIcon;
  className?: string;
}) {
  const Icon = serviceIconMap[icon];
  return (
    <span
      className={cn(
        'inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600',
        className
      )}
    >
      <Icon className="h-7 w-7" strokeWidth={1.75} />
    </span>
  );
}
