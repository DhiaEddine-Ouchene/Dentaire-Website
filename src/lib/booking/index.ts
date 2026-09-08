/**
 * Logique métier de réservation (PROMPT 7) — point d'entrée unique.
 * La logique est pure et testable ; l'interface arrive au PROMPT 8.
 */
export * from './constants';
export * from './overlap';
export * from './slots';
export * from './cancellation';
export { weeklyHoursFromSite } from './hours';
