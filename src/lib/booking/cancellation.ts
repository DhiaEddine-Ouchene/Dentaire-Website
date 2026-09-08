/**
 * Logique d'annulation d'un rendez-vous par le patient (PROMPT 7).
 *
 * Le patient annule via un lien unique (`jetonAnnulation`), mais seulement
 * s'il reste avant le délai limite configurable (ex. 24h avant le RDV).
 * Fonctions pures — la vérification du jeton et l'écriture en base se font
 * dans la couche serveur (PROMPT 8+).
 */
import { DEFAULT_CANCELLATION_DEADLINE_HOURS } from './constants';

/** Raison précise d'un refus d'annulation. */
export type CancellationDenyReason =
  | 'ALREADY_CANCELLED' // déjà annulé
  | 'ALREADY_COMPLETED' // rendez-vous terminé
  | 'IN_PAST' // le rendez-vous a déjà commencé/est passé
  | 'DEADLINE_PASSED'; // trop tard (dans la fenêtre du délai limite)

export type CancellationCheck =
  | { allowed: true }
  | { allowed: false; reason: CancellationDenyReason };

export type CanCancelInput = {
  dateDebut: Date;
  /** Statut Prisma courant du rendez-vous. */
  statut: string;
  /** Instant « maintenant » (défaut : `new Date()`). */
  now?: Date;
  /** Délai limite en heures (défaut : 24h). */
  deadlineHours?: number;
};

/**
 * Instant limite à partir duquel l'annulation n'est plus possible.
 * = dateDebut − deadlineHours.
 */
export function cancellationDeadline(
  dateDebut: Date,
  deadlineHours: number = DEFAULT_CANCELLATION_DEADLINE_HOURS
): Date {
  return new Date(dateDebut.getTime() - deadlineHours * 60 * 60 * 1000);
}

/**
 * Le patient peut-il encore annuler ce rendez-vous ?
 * Ordre des vérifications : statut terminal, puis fenêtre temporelle.
 */
export function canCancelRendezVous(input: CanCancelInput): CancellationCheck {
  const {
    dateDebut,
    statut,
    now = new Date(),
    deadlineHours = DEFAULT_CANCELLATION_DEADLINE_HOURS
  } = input;

  if (statut === 'ANNULE') return { allowed: false, reason: 'ALREADY_CANCELLED' };
  if (statut === 'TERMINE') return { allowed: false, reason: 'ALREADY_COMPLETED' };

  // Rendez-vous déjà commencé ou passé.
  if (now.getTime() >= dateDebut.getTime()) {
    return { allowed: false, reason: 'IN_PAST' };
  }

  // Dans la fenêtre du délai limite (ex. moins de 24h avant).
  if (now.getTime() >= cancellationDeadline(dateDebut, deadlineHours).getTime()) {
    return { allowed: false, reason: 'DEADLINE_PASSED' };
  }

  return { allowed: true };
}
