'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServiceBySlug } from '@/data/services';
import {
  computeAvailableSlots,
  resolveMotifDuration,
  weeklyHoursFromSite,
  toBusyIntervals
} from '@/lib/booking';
import { UNKNOWN_MOTIF, type SlotDTO } from '@/components/reservation/types';
import { revalidatePath } from 'next/cache';
import { sendAppointmentConfirmationEmail } from '@/lib/email';
import { sendAppointmentConfirmationWhatsApp } from '@/lib/whatsapp';
import { getContenu } from '@/lib/i18n-content';

// NB : `UNKNOWN_MOTIF` et `SlotDTO` vivent dans un module neutre car un fichier
// « use server » ne peut exporter que des fonctions asynchrones.

/** Génère un code de référence court et lisible (ex: RDV-4F82A) */
function generateReferenceCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Évite confusion 0/O, 1/I
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `RDV-${code}`;
}

/** Durée applicable au motif : durée du soin choisi, ou durée par défaut si inconnu. */
function durationForMotif(motifId: string | null): number {
  if (motifId && motifId !== UNKNOWN_MOTIF) {
    const service = getServiceBySlug(motifId);
    if (service) return resolveMotifDuration(service.durationMin);
  }
  return resolveMotifDuration(undefined);
}

const slotsInput = z.object({
  dateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  motifId: z.string().nullable()
});

// Formateur d'heure murale (24 h) aligné sur le fuseau du serveur = celui du cabinet.
const timeFmt = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

/**
 * Renvoie les créneaux disponibles pour une date et un motif donnés.
 * S'appuie sur la logique pure de `@/lib/booking` (PROMPT 7).
 */
export async function getAvailableSlots(raw: {
  dateISO: string;
  motifId: string | null;
}): Promise<{ ok: boolean; durationMin: number; slots: SlotDTO[] }> {
  const parsed = slotsInput.safeParse(raw);
  if (!parsed.success) return { ok: false, durationMin: 0, slots: [] };

  const [year, month, day] = parsed.data.dateISO.split('-').map(Number);
  const date = new Date(year, month - 1, day); // minuit, heure locale
  const durationMin = durationForMotif(parsed.data.motifId);

  // Récupérer les rendez-vous existants du jour pour calculer les créneaux occupés
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59);

  const existingAppointments = await prisma.rendezVous.findMany({
    where: {
      dateDebut: { gte: startOfDay, lte: endOfDay },
      statut: { not: 'ANNULE' } // Les rendez-vous annulés libèrent leurs créneaux
    },
    select: {
      dateDebut: true,
      dateFin: true,
      statut: true
    }
  });

  const busy = toBusyIntervals(existingAppointments);

  const slots = computeAvailableSlots({
    date,
    durationMin,
    hours: weeklyHoursFromSite(),
    busy,
    now: new Date()
  });

  return {
    ok: true,
    durationMin,
    slots: slots.map((s) => ({
      startISO: s.start.toISOString(),
      endISO: s.end.toISOString(),
      label: timeFmt.format(s.start),
      endLabel: timeFmt.format(s.end)
    }))
  };
}

const bookingInput = z.object({
  motifId: z.string().nullable(),
  dateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotStartISO: z.string().datetime(),
  slotEndISO: z.string().datetime(),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(30),
  email: z.union([z.string().trim().email(), z.literal('')]).optional(),
  notes: z.string().trim().max(1000).optional()
});

export type BookingResult =
  | { ok: true; referenceCode: string; jeton: string; locale: string }
  | { ok: false; error: 'VALIDATION' | 'CONFLICT' | 'UNKNOWN' };

/**
 * Enregistre une demande de rendez-vous immédiatement en base de données.
 *
 * 1. Trouve ou crée le patient via son téléphone
 * 2. Vérifie qu'il n'y a pas de conflit de créneau
 * 3. Trouve le motif correspondant (ou utilise un motif par défaut)
 * 4. Insère le rendez-vous avec statut CONFIRME
 * 5. Envoie automatiquement email + WhatsApp de confirmation
 */
export async function requestBooking(raw: unknown, locale: string = 'fr'): Promise<BookingResult> {
  const parsed = bookingInput.safeParse(raw);
  if (!parsed.success) {
    console.error('Validation error:', parsed.error);
    return { ok: false, error: 'VALIDATION' };
  }

  const { motifId, slotStartISO, slotEndISO, name, phone, email, notes } = parsed.data;

  try {
    // 1. Trouver ou créer le patient
    let patient = await prisma.patient.findUnique({
      where: { telephone: phone }
    });

    if (!patient) {
      // Séparer prénom et nom si possible
      const nameParts = name.trim().split(' ');
      const prenom = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : undefined;
      const nom = nameParts.length > 1 ? nameParts[nameParts.length - 1] : name.trim();

      patient = await prisma.patient.create({
        data: {
          nom,
          prenom,
          telephone: phone,
          email: email || null
        }
      });
    } else if (email && !patient.email) {
      // Mettre à jour l'email si fourni et pas déjà présent
      patient = await prisma.patient.update({
        where: { id: patient.id },
        data: { email }
      });
    }

    // 2. Trouver le motif correspondant
    let motifRecord = null;
    if (motifId && motifId !== UNKNOWN_MOTIF) {
      const service = getServiceBySlug(motifId);
      if (service) {
        // Chercher le motif dans la base par son nom en français
        motifRecord = await prisma.motif.findFirst({
          where: {
            nom: {
              path: ['fr'],
              equals: service.name.fr
            }
          }
        });
      }
    }

    // Si pas de motif trouvé, utiliser le premier motif actif comme fallback
    if (!motifRecord) {
      motifRecord = await prisma.motif.findFirst({
        where: { actif: true },
        orderBy: { ordre: 'asc' }
      });

      if (!motifRecord) {
        console.error('Aucun motif actif trouvé dans la base de données');
        return { ok: false, error: 'UNKNOWN' };
      }
    }

    // 3. Vérifier les conflits de créneaux
    const startDate = new Date(slotStartISO);
    const endDate = new Date(slotEndISO);

    const conflicts = await prisma.rendezVous.findMany({
      where: {
        statut: { not: 'ANNULE' },
        OR: [
          // Nouveau RDV commence pendant un RDV existant
          {
            AND: [
              { dateDebut: { lte: startDate } },
              { dateFin: { gt: startDate } }
            ]
          },
          // Nouveau RDV se termine pendant un RDV existant
          {
            AND: [
              { dateDebut: { lt: endDate } },
              { dateFin: { gte: endDate } }
            ]
          },
          // Nouveau RDV englobe un RDV existant
          {
            AND: [
              { dateDebut: { gte: startDate } },
              { dateFin: { lte: endDate } }
            ]
          }
        ]
      }
    });

    if (conflicts.length > 0) {
      console.error('Conflit de créneaux détecté');
      return { ok: false, error: 'CONFLICT' };
    }

    // 4. Générer le code de référence et le jeton d'annulation
    const referenceCode = generateReferenceCode();
    const jeton = crypto.randomUUID();

    // 5. Calculer la durée en minutes
    const dureeMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

    // 6. Créer le rendez-vous avec statut CONFIRME
    await prisma.rendezVous.create({
      data: {
        patientId: patient.id,
        motifId: motifRecord.id,
        referenceCode,
        dateDebut: startDate,
        dateFin: endDate,
        duree: dureeMinutes,
        statut: 'CONFIRME', // Directement confirmé !
        notes: notes || null,
        jetonAnnulation: jeton
      }
    });

    // 7. Revalider les caches
    revalidatePath('/admin');
    revalidatePath('/admin/patients');

    // 8. Formater les données pour les notifications
    const longDateFmt = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const timeFmt = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const formattedDate = longDateFmt.format(startDate);
    const formattedTime = `${timeFmt.format(startDate)} – ${timeFmt.format(endDate)}`;
    const motifLabel = getContenu(motifRecord.nom as any, locale);
    const durationLabel = locale === 'ar'
      ? `${dureeMinutes} دقيقة`
      : locale === 'en'
      ? `${dureeMinutes} min`
      : `${dureeMinutes} min`;

    // Construire l'URL d'annulation
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const localePrefix = locale === 'fr' ? '' : `/${locale}`;
    const cancelUrl = `${baseUrl}${localePrefix}/annulation/${jeton}`;

    // 9. Envoyer les notifications automatiquement
    const emailData = {
      patientName: name,
      patientEmail: email || '',
      referenceCode,
      motif: motifLabel,
      date: formattedDate,
      time: formattedTime,
      duration: durationLabel,
      cancelUrl,
      locale
    };

    const whatsappData = {
      patientPhone: phone,
      patientName: name,
      referenceCode,
      motif: motifLabel,
      date: formattedDate,
      time: formattedTime,
      duration: durationLabel,
      cancelUrl,
      locale
    };

    // Envoyer les notifications en parallèle (sans bloquer la réponse)
    Promise.all([
      sendAppointmentConfirmationEmail(emailData),
      sendAppointmentConfirmationWhatsApp(whatsappData)
    ]).catch((error) => {
      console.error('Erreur lors de l\'envoi des notifications:', error);
      // Ne pas bloquer le flux même si les notifications échouent
    });

    console.log('✅ Rendez-vous créé avec succès:', {
      referenceCode,
      patient: patient.nom,
      date: startDate.toISOString(),
      motif: motifRecord.nom
    });

    return { ok: true, referenceCode, jeton, locale };
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    return { ok: false, error: 'UNKNOWN' };
  }
}

