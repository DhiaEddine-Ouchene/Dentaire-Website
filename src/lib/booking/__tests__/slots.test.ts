import { describe, it, expect } from 'vitest';
import {
  computeAvailableSlots,
  resolveMotifDuration,
  timeToMinutes,
  overlaps,
  toBusyIntervals,
  DEFAULT_MOTIF_DURATION_MIN,
  type WeeklyHours
} from '../index';

// Horaires de test : lundi 09:00–12:00 puis 14:00–17:00 (coupure déjeuner).
// Dimanche fermé (pas d'entrée). Index JS : 1 = lundi, 0 = dimanche.
const HOURS: WeeklyHours = {
  1: [
    { open: '09:00', close: '12:00' },
    { open: '14:00', close: '17:00' }
  ]
};

// 2026-01-05 est un lundi ; 2026-01-04 un dimanche.
const MONDAY = new Date(2026, 0, 5);
const SUNDAY = new Date(2026, 0, 4);
// « maintenant » très en amont pour ne pas filtrer les créneaux du jour.
const FAR_PAST = new Date(2020, 0, 1);

const at = (h: number, m = 0) => new Date(2026, 0, 5, h, m);

describe('timeToMinutes', () => {
  it('convertit une heure murale en minutes', () => {
    expect(timeToMinutes('00:00')).toBe(0);
    expect(timeToMinutes('09:30')).toBe(570);
    expect(timeToMinutes('23:59')).toBe(1439);
  });

  it('renvoie NaN pour une entrée invalide', () => {
    expect(timeToMinutes('9h30')).toBeNaN();
    expect(timeToMinutes('24:00')).toBeNaN();
    expect(timeToMinutes('12:60')).toBeNaN();
  });
});

describe('resolveMotifDuration', () => {
  it('garde une durée valide', () => {
    expect(resolveMotifDuration(45)).toBe(45);
  });

  it('applique la durée par défaut pour un motif inconnu ou invalide', () => {
    expect(resolveMotifDuration(undefined)).toBe(DEFAULT_MOTIF_DURATION_MIN);
    expect(resolveMotifDuration(null)).toBe(DEFAULT_MOTIF_DURATION_MIN);
    expect(resolveMotifDuration(0)).toBe(DEFAULT_MOTIF_DURATION_MIN);
    expect(resolveMotifDuration(-15)).toBe(DEFAULT_MOTIF_DURATION_MIN);
  });
});

describe('overlaps', () => {
  it('détecte un chevauchement', () => {
    expect(overlaps({ start: at(9), end: at(10) }, { start: at(9, 30), end: at(10, 30) })).toBe(true);
  });

  it('ne considère pas le contact bord-à-bord comme un conflit', () => {
    expect(overlaps({ start: at(9), end: at(9, 30) }, { start: at(9, 30), end: at(10) })).toBe(false);
  });
});

describe('computeAvailableSlots', () => {
  it('renvoie une liste vide un jour de fermeture', () => {
    const slots = computeAvailableSlots({
      date: SUNDAY,
      durationMin: 30,
      hours: HOURS,
      busy: [],
      now: FAR_PAST
    });
    expect(slots).toEqual([]);
  });

  it('génère des créneaux sur toute la journée quand rien n\'est réservé', () => {
    const slots = computeAvailableSlots({
      date: MONDAY,
      durationMin: 30,
      hours: HOURS,
      busy: [],
      slotStepMin: 30,
      now: FAR_PAST
    });
    // Matin 09:00→12:00 : 6 créneaux de 30 min. Après-midi 14:00→17:00 : 6.
    expect(slots).toHaveLength(12);
    expect(slots[0].start).toEqual(at(9, 0));
    expect(slots[0].end).toEqual(at(9, 30));
    // Dernier créneau du matin commence à 11:30 (se termine à 12:00).
    expect(slots[5].start).toEqual(at(11, 30));
    // Premier créneau de l'après-midi.
    expect(slots[6].start).toEqual(at(14, 0));
  });

  it('ne propose pas de créneau dépassant l\'heure de fermeture', () => {
    const slots = computeAvailableSlots({
      date: MONDAY,
      durationMin: 45,
      hours: { 1: [{ open: '09:00', close: '10:00' }] },
      busy: [],
      slotStepMin: 15,
      now: FAR_PAST
    });
    // 09:00 (→09:45) et 09:15 (→10:00) tiennent ; 09:30 (→10:15) déborde.
    expect(slots).toHaveLength(2);
    expect(slots[slots.length - 1].end).toEqual(at(10, 0));
  });

  it('exclut les créneaux en conflit avec un rendez-vous existant', () => {
    const busy = toBusyIntervals([
      { dateDebut: at(9, 30), dateFin: at(10, 0), statut: 'CONFIRME' }
    ]);
    const slots = computeAvailableSlots({
      date: MONDAY,
      durationMin: 30,
      hours: { 1: [{ open: '09:00', close: '11:00' }] },
      busy,
      slotStepMin: 30,
      now: FAR_PAST
    });
    // 09:30 est pris → il reste 09:00, 10:00, 10:30.
    const starts = slots.map((s) => s.start.getTime());
    expect(starts).toContain(at(9, 0).getTime());
    expect(starts).not.toContain(at(9, 30).getTime());
    expect(starts).toContain(at(10, 0).getTime());
    expect(starts).toContain(at(10, 30).getTime());
  });

  it('libère le créneau quand le rendez-vous est ANNULÉ', () => {
    const busy = toBusyIntervals([
      { dateDebut: at(9, 0), dateFin: at(9, 30), statut: 'ANNULE' }
    ]);
    const slots = computeAvailableSlots({
      date: MONDAY,
      durationMin: 30,
      hours: { 1: [{ open: '09:00', close: '10:00' }] },
      busy,
      slotStepMin: 30,
      now: FAR_PAST
    });
    // Le RDV annulé ne bloque rien : 09:00 redevient disponible.
    expect(slots.map((s) => s.start.getTime())).toContain(at(9, 0).getTime());
  });

  it('filtre les créneaux déjà passés / trop proches (jour même)', () => {
    // « maintenant » = lundi 10:10 → les créneaux avant 10:10 disparaissent.
    const now = at(10, 10);
    const slots = computeAvailableSlots({
      date: MONDAY,
      durationMin: 30,
      hours: { 1: [{ open: '09:00', close: '12:00' }] },
      busy: [],
      slotStepMin: 30,
      now
    });
    // 09:00, 09:30, 10:00 sont passés ; le premier proposé est 10:30.
    expect(slots[0].start).toEqual(at(10, 30));
  });

  it('respecte un délai de réservation minimal (minLeadMin)', () => {
    const now = at(9, 0);
    const slots = computeAvailableSlots({
      date: MONDAY,
      durationMin: 30,
      hours: { 1: [{ open: '09:00', close: '12:00' }] },
      busy: [],
      slotStepMin: 30,
      now,
      minLeadMin: 120 // il faut réserver au moins 2h à l'avance
    });
    // Premier créneau réservable : 11:00.
    expect(slots[0].start).toEqual(at(11, 0));
  });

  it('utilise la durée par défaut via resolveMotifDuration pour un motif inconnu', () => {
    const duration = resolveMotifDuration(undefined);
    const slots = computeAvailableSlots({
      date: MONDAY,
      durationMin: duration,
      hours: { 1: [{ open: '09:00', close: '10:00' }] },
      busy: [],
      slotStepMin: 30,
      now: FAR_PAST
    });
    // Durée par défaut = 30 → 09:00 et 09:30 dans une plage d'1h.
    expect(slots).toHaveLength(2);
  });
});
