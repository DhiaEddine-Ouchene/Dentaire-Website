/**
 * Types & utilitaires de chevauchement d'intervalles (PROMPT 7).
 * Purs, sans dépendance à la base ni au fuseau — testables unitairement.
 */

/** Intervalle temporel demi-ouvert [start, end). */
export type TimeRange = { start: Date; end: Date };

/** Créneau réservable proposé au patient. */
export type Slot = TimeRange;

/** Forme minimale d'un rendez-vous existant pour le calcul de disponibilité. */
export type AppointmentLike = {
  dateDebut: Date;
  dateFin: Date;
  /** Statut Prisma (`EN_ATTENTE` | `CONFIRME` | `ANNULE` | `TERMINE`). */
  statut: string;
};

/**
 * Deux intervalles demi-ouverts se chevauchent-ils ?
 * Le contact bord-à-bord (ex. 09:30–10:00 et 10:00–10:30) N'est PAS un conflit.
 */
export function overlaps(a: TimeRange, b: TimeRange): boolean {
  return a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime();
}

/** Le créneau candidat entre-t-il en conflit avec un intervalle occupé ? */
export function hasConflict(candidate: TimeRange, busy: TimeRange[]): boolean {
  return busy.some((b) => overlaps(candidate, b));
}

/**
 * Convertit une liste de rendez-vous en intervalles « occupés ».
 * Les rendez-vous ANNULÉS sont exclus : leur créneau redevient donc
 * automatiquement disponible à la réservation (exigence PROMPT 7).
 */
export function toBusyIntervals(appointments: AppointmentLike[]): TimeRange[] {
  return appointments
    .filter((a) => a.statut !== 'ANNULE')
    .map((a) => ({ start: a.dateDebut, end: a.dateFin }));
}
