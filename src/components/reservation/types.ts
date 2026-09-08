import type { ServiceIcon } from '@/data/services';
import type { LocalizedContent } from '@/lib/i18n-content';

/** Identifiant du motif « Je ne sais pas encore » (durée par défaut). */
export const UNKNOWN_MOTIF = '__unknown__';

/** Motif proposé à l'étape 1 (sous-ensemble sérialisable d'un `Service`). */
export type MotifOption = {
  slug: string;
  icon: ServiceIcon;
  durationMin: number;
  name: LocalizedContent;
  short: LocalizedContent;
};

/** Créneau horaire sérialisable (heures murales calculées côté serveur). */
export type SlotDTO = {
  startISO: string;
  endISO: string;
  label: string;
  endLabel: string;
};
