'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { routing } from '@/i18n/routing';

/**
 * Actions admin (PROMPT 10 + 11) : authentification et gestion des rendez-vous.
 */

/** Génère un code de référence court et lisible (ex: RDV-4F82A) */
function generateReferenceCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Évite confusion 0/O, 1/I
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `RDV-${code}`;
}

// Schéma de validation pour un rendez-vous manuel
const appointmentInput = z.object({
  motifId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  patientName: z.string().trim().min(2),
  patientPhone: z.string().trim().min(6),
  patientEmail: z.string().trim().email().optional().or(z.literal('')),
  notes: z.string().trim().optional().or(z.literal(''))
});

/** Déconnexion admin (PROMPT 10) : ferme la session Supabase puis renvoie vers la connexion. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  try {
    await supabase.auth.signOut();
  } catch {
    // Supabase injoignable : on redirige tout de même vers la page de connexion.
  }

  let locale: string = routing.defaultLocale;
  try {
    locale = await getLocale();
  } catch {
    // Langue indisponible : langue par défaut.
  }

  redirect(locale === routing.defaultLocale ? '/admin/login' : `/${locale}/admin/login`);
}

/** Création d'un rendez-vous manuel (PROMPT 11) : patient a appelé par téléphone. */
export async function createAppointment(
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  // Vérification auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: 'UNAUTHORIZED' };
  }

  const parsed = appointmentInput.safeParse({
    motifId: formData.get('motifId'),
    date: formData.get('date'),
    time: formData.get('time'),
    patientName: formData.get('patientName'),
    patientPhone: formData.get('patientPhone'),
    patientEmail: formData.get('patientEmail'),
    notes: formData.get('notes')
  });

  if (!parsed.success) {
    return { ok: false, error: 'VALIDATION' };
  }

  const { motifId, date, time, patientName, patientPhone, patientEmail, notes } = parsed.data;

  try {
    // Récupérer la durée du motif
    const motif = await prisma.motif.findUnique({ where: { id: motifId } });
    if (!motif) {
      return { ok: false, error: 'MOTIF_NOT_FOUND' };
    }

    // Construire les dates de début et fin
    const dateDebut = new Date(`${date}T${time}:00`);
    const dateFin = new Date(dateDebut.getTime() + motif.dureeDefaut * 60000);

    // Trouver ou créer le patient
    let patient = await prisma.patient.findFirst({
      where: { telephone: patientPhone }
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          nom: patientName,
          telephone: patientPhone,
          email: patientEmail || null
        }
      });
    }

    // Créer le rendez-vous
    await prisma.rendezVous.create({
      data: {
        patientId: patient.id,
        motifId: motif.id,
        referenceCode: generateReferenceCode(),
        dateDebut,
        dateFin,
        duree: motif.dureeDefaut,
        statut: 'CONFIRME',
        notes: notes || null,
        jetonAnnulation: crypto.randomUUID()
      }
    });

    revalidatePath('/admin');
    return { ok: true };
  } catch (error) {
    console.error('Create appointment error:', error);
    return { ok: false, error: 'SERVER_ERROR' };
  }
}

/** Mise à jour d'un rendez-vous existant (PROMPT 11). */
export async function updateAppointment(
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: 'UNAUTHORIZED' };
  }

  const id = formData.get('id') as string;
  if (!id) {
    return { ok: false, error: 'VALIDATION' };
  }

  const parsed = appointmentInput.safeParse({
    motifId: formData.get('motifId'),
    date: formData.get('date'),
    time: formData.get('time'),
    patientName: formData.get('patientName'),
    patientPhone: formData.get('patientPhone'),
    patientEmail: formData.get('patientEmail'),
    notes: formData.get('notes')
  });

  if (!parsed.success) {
    return { ok: false, error: 'VALIDATION' };
  }

  const { motifId, date, time, patientName, patientPhone, patientEmail, notes } = parsed.data;

  try {
    const motif = await prisma.motif.findUnique({ where: { id: motifId } });
    if (!motif) {
      return { ok: false, error: 'MOTIF_NOT_FOUND' };
    }

    const dateDebut = new Date(`${date}T${time}:00`);
    const dateFin = new Date(dateDebut.getTime() + motif.dureeDefaut * 60000);

    // Mettre à jour le patient
    const rdv = await prisma.rendezVous.findUnique({
      where: { id },
      include: { patient: true }
    });

    if (!rdv) {
      return { ok: false, error: 'NOT_FOUND' };
    }

    await prisma.patient.update({
      where: { id: rdv.patientId },
      data: {
        nom: patientName,
        telephone: patientPhone,
        email: patientEmail || null
      }
    });

    // Mettre à jour le rendez-vous
    await prisma.rendezVous.update({
      where: { id },
      data: {
        motifId: motif.id,
        dateDebut,
        dateFin,
        duree: motif.dureeDefaut,
        notes: notes || null
      }
    });

    revalidatePath('/admin');
    return { ok: true };
  } catch (error) {
    console.error('Update appointment error:', error);
    return { ok: false, error: 'SERVER_ERROR' };
  }
}

/** Annulation d'un rendez-vous par l'admin (PROMPT 11). */
export async function cancelAppointment(id: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false };
  }

  try {
    await prisma.rendezVous.update({
      where: { id },
      data: { statut: 'ANNULE' }
    });

    revalidatePath('/admin');
    return { ok: true };
  } catch (error) {
    console.error('Cancel appointment error:', error);
    return { ok: false };
  }
}
