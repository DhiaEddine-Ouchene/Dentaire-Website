import { describe, it, expect } from 'vitest';
import {
  canCancelRendezVous,
  cancellationDeadline,
  DEFAULT_CANCELLATION_DEADLINE_HOURS
} from '../index';

const H = 60 * 60 * 1000;

// Rendez-vous de référence : 2026-01-10 à 10:00.
const RDV = new Date(2026, 0, 10, 10, 0);

describe('cancellationDeadline', () => {
  it('place la limite à dateDebut − délai (24h par défaut)', () => {
    expect(cancellationDeadline(RDV)).toEqual(new Date(RDV.getTime() - DEFAULT_CANCELLATION_DEADLINE_HOURS * H));
  });

  it('respecte un délai personnalisé', () => {
    expect(cancellationDeadline(RDV, 2)).toEqual(new Date(RDV.getTime() - 2 * H));
  });
});

describe('canCancelRendezVous', () => {
  it('autorise l\'annulation bien avant le délai limite', () => {
    const now = new Date(RDV.getTime() - 48 * H); // 48h avant
    expect(canCancelRendezVous({ dateDebut: RDV, statut: 'CONFIRME', now })).toEqual({
      allowed: true
    });
  });

  it('autorise juste avant la limite (25h avant, délai 24h)', () => {
    const now = new Date(RDV.getTime() - 25 * H);
    expect(canCancelRendezVous({ dateDebut: RDV, statut: 'EN_ATTENTE', now }).allowed).toBe(true);
  });

  it('refuse dans la fenêtre du délai limite (12h avant)', () => {
    const now = new Date(RDV.getTime() - 12 * H);
    expect(canCancelRendezVous({ dateDebut: RDV, statut: 'CONFIRME', now })).toEqual({
      allowed: false,
      reason: 'DEADLINE_PASSED'
    });
  });

  it('refuse pile à l\'instant limite (bord = trop tard)', () => {
    const now = new Date(RDV.getTime() - DEFAULT_CANCELLATION_DEADLINE_HOURS * H);
    expect(canCancelRendezVous({ dateDebut: RDV, statut: 'CONFIRME', now })).toEqual({
      allowed: false,
      reason: 'DEADLINE_PASSED'
    });
  });

  it('refuse un rendez-vous déjà passé', () => {
    const now = new Date(RDV.getTime() + 1 * H);
    expect(canCancelRendezVous({ dateDebut: RDV, statut: 'CONFIRME', now })).toEqual({
      allowed: false,
      reason: 'IN_PAST'
    });
  });

  it('refuse un rendez-vous déjà annulé', () => {
    const now = new Date(RDV.getTime() - 48 * H);
    expect(canCancelRendezVous({ dateDebut: RDV, statut: 'ANNULE', now })).toEqual({
      allowed: false,
      reason: 'ALREADY_CANCELLED'
    });
  });

  it('refuse un rendez-vous terminé', () => {
    const now = new Date(RDV.getTime() - 48 * H);
    expect(canCancelRendezVous({ dateDebut: RDV, statut: 'TERMINE', now })).toEqual({
      allowed: false,
      reason: 'ALREADY_COMPLETED'
    });
  });

  it('applique un délai personnalisé (2h)', () => {
    const now = new Date(RDV.getTime() - 3 * H); // 3h avant, délai 2h → autorisé
    expect(canCancelRendezVous({ dateDebut: RDV, statut: 'CONFIRME', now, deadlineHours: 2 }).allowed).toBe(true);

    const now2 = new Date(RDV.getTime() - 1 * H); // 1h avant, délai 2h → refusé
    expect(canCancelRendezVous({ dateDebut: RDV, statut: 'CONFIRME', now: now2, deadlineHours: 2 })).toEqual({
      allowed: false,
      reason: 'DEADLINE_PASSED'
    });
  });
});
