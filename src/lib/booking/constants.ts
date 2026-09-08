/**
 * Constantes de la logique de réservation (PROMPT 7).
 * Regroupées ici pour être ajustables sans toucher à la logique.
 */

/** Durée appliquée quand le motif est inconnu ou n'a pas de durée valide. */
export const DEFAULT_MOTIF_DURATION_MIN = 30;

/** Granularité (en minutes) des heures de début de créneau proposées. */
export const DEFAULT_SLOT_STEP_MIN = 15;

/** Délai minimal (heures) avant le rendez-vous pour autoriser une annulation. */
export const DEFAULT_CANCELLATION_DEADLINE_HOURS = 24;

/**
 * Délai minimal (minutes) entre « maintenant » et le début d'un créneau
 * réservable le jour même. 0 = réservation possible jusqu'à la dernière minute.
 */
export const DEFAULT_MIN_LEAD_MIN = 0;
