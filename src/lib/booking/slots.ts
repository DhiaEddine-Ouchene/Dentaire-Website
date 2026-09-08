/**
 * Calcul des créneaux disponibles (PROMPT 7).
 *
 * Fonction PURE : elle reçoit les horaires d'ouverture et les rendez-vous
 * existants en paramètres — aucune dépendance base/réseau, donc testable.
 *
 * Convention de fuseau : tous les calculs se font en heure LOCALE du serveur.
 * En mono-tenant, le déploiement doit être réglé sur le fuseau du cabinet
 * (les heures « 09:00 » sont des heures murales locales).
 */
import {
  DEFAULT_MIN_LEAD_MIN,
  DEFAULT_MOTIF_DURATION_MIN,
  DEFAULT_SLOT_STEP_MIN
} from './constants';
import { hasConflict, type Slot, type TimeRange } from './overlap';

/** Plage d'ouverture d'une journée, en heures murales « HH:mm ». */
export type OpeningInterval = { open: string; close: string };

/**
 * Horaires hebdomadaires : index de jour JS (0 = dimanche … 6 = samedi)
 * → liste de plages d'ouverture (permet une coupure déjeuner : 2 plages).
 * Un jour absent ou avec une liste vide est fermé.
 */
export type WeeklyHours = Record<number, OpeningInterval[] | undefined>;

export type ComputeSlotsOptions = {
  /** Jour ciblé (seule la partie date compte ; l'heure est ignorée). */
  date: Date;
  /** Durée du rendez-vous en minutes (voir `resolveMotifDuration`). */
  durationMin: number;
  /** Horaires d'ouverture hebdomadaires. */
  hours: WeeklyHours;
  /** Rendez-vous déjà réservés, en intervalles occupés (ANNULÉS déjà exclus). */
  busy: TimeRange[];
  /** Granularité des débuts de créneau (défaut 15 min). */
  slotStepMin?: number;
  /** Instant « maintenant » (défaut : `new Date()`) — filtre les créneaux passés. */
  now?: Date;
  /** Délai minimal avant un créneau réservable le jour même (minutes). */
  minLeadMin?: number;
};

/** "09:30" → 570 (minutes depuis minuit). Renvoie NaN si invalide. */
export function timeToMinutes(hm: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hm.trim());
  if (!match) return NaN;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return NaN;
  return h * 60 + m;
}

/** Renvoie une Date au même jour que `day`, à `minutes` depuis minuit (heure locale). */
function atMinutes(day: Date, minutes: number): Date {
  const d = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
  d.setMinutes(minutes);
  return d;
}

/**
 * Résout la durée à appliquer pour un motif donné.
 * Gère le cas « motif inconnu » : durée par défaut générique.
 */
export function resolveMotifDuration(dureeDefaut?: number | null): number {
  return typeof dureeDefaut === 'number' && Number.isFinite(dureeDefaut) && dureeDefaut > 0
    ? Math.round(dureeDefaut)
    : DEFAULT_MOTIF_DURATION_MIN;
}

/**
 * Calcule les créneaux disponibles pour une journée, en tenant compte de la
 * durée du motif et des rendez-vous existants. Renvoie une liste triée par
 * heure de début ; vide si le cabinet est fermé ce jour-là.
 */
export function computeAvailableSlots(options: ComputeSlotsOptions): Slot[] {
  const {
    date,
    durationMin,
    hours,
    busy,
    slotStepMin = DEFAULT_SLOT_STEP_MIN,
    now = new Date(),
    minLeadMin = DEFAULT_MIN_LEAD_MIN
  } = options;

  if (!Number.isFinite(durationMin) || durationMin <= 0) return [];
  if (!Number.isFinite(slotStepMin) || slotStepMin <= 0) return [];

  const intervals = hours[date.getDay()] ?? [];
  if (intervals.length === 0) return [];

  // Aucun créneau ne peut commencer avant cet instant (jour même).
  const earliestStart = new Date(now.getTime() + minLeadMin * 60_000);

  const slots: Slot[] = [];

  for (const interval of intervals) {
    const openM = timeToMinutes(interval.open);
    const closeM = timeToMinutes(interval.close);
    if (Number.isNaN(openM) || Number.isNaN(closeM) || closeM <= openM) continue;

    // Le créneau doit tenir entièrement avant la fermeture.
    for (let startM = openM; startM + durationMin <= closeM; startM += slotStepMin) {
      const start = atMinutes(date, startM);
      const end = atMinutes(date, startM + durationMin);

      if (start.getTime() < earliestStart.getTime()) continue; // créneau passé/trop proche
      if (hasConflict({ start, end }, busy)) continue; // chevauche un rendez-vous

      slots.push({ start, end });
    }
  }

  slots.sort((a, b) => a.start.getTime() - b.start.getTime());
  return slots;
}
