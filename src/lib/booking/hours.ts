/**
 * Adaptateur horaires : convertit les horaires du cabinet (`siteConfig.hours`)
 * en `WeeklyHours` indexés par jour JS, consommables par `computeAvailableSlots`.
 *
 * Isolé ici pour garder `slots.ts` pur et testable ; ce module est le seul
 * point de couplage entre la logique et la configuration du site.
 */
import { siteConfig } from '@/config/site';
import type { OpeningInterval, WeeklyHours } from './slots';

/** Clés de jour de `siteConfig.hours` → index JS `Date.getDay()` (0 = dimanche). */
const DAY_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

/**
 * Construit les horaires hebdomadaires depuis `siteConfig`.
 * Les jours marqués `closed` (ou sans open/close) sont omis → fermés.
 */
export function weeklyHoursFromSite(): WeeklyHours {
  const week: WeeklyHours = {};

  for (const entry of siteConfig.hours) {
    const index = DAY_INDEX[entry.day];
    if (index === undefined) continue;
    if ('closed' in entry && entry.closed) continue;
    if (!('open' in entry) || !('close' in entry)) continue;

    const interval: OpeningInterval = { open: entry.open, close: entry.close };
    (week[index] ??= []).push(interval);
  }

  return week;
}
