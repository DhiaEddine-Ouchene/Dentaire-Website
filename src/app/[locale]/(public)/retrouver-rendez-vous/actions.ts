'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const findAppointmentSchema = z.object({
  referenceCode: z.string().min(3),
  phone: z.string().min(6)
});

export async function findAppointment(data: { referenceCode: string; phone: string }) {
  try {
    const validated = findAppointmentSchema.parse(data);

    // Chercher le rendez-vous par code de référence ET téléphone du patient
    const appointment = await prisma.rendezVous.findFirst({
      where: {
        referenceCode: validated.referenceCode.toUpperCase(),
        patient: {
          telephone: validated.phone
        },
        statut: { not: 'ANNULE' } // Ne pas montrer les rendez-vous déjà annulés
      },
      include: {
        patient: true,
        motif: true
      }
    });

    if (!appointment) {
      return {
        success: false,
        error: 'NOT_FOUND'
      };
    }

    return {
      success: true,
      appointment: {
        id: appointment.id,
        referenceCode: appointment.referenceCode,
        dateDebut: appointment.dateDebut.toISOString(),
        dateFin: appointment.dateFin.toISOString(),
        duree: appointment.duree,
        statut: appointment.statut,
        notes: appointment.notes,
        patient: {
          nom: appointment.patient.nom,
          prenom: appointment.patient.prenom,
          telephone: appointment.patient.telephone,
          email: appointment.patient.email
        },
        motif: {
          nom: appointment.motif.nom
        },
        jetonAnnulation: appointment.jetonAnnulation
      }
    };
  } catch (error) {
    console.error('Erreur recherche rendez-vous:', error);
    return {
      success: false,
      error: 'UNKNOWN'
    };
  }
}

export async function cancelAppointment(data: { referenceCode: string; phone: string }) {
  try {
    const validated = findAppointmentSchema.parse(data);

    // Trouver le rendez-vous
    const appointment = await prisma.rendezVous.findFirst({
      where: {
        referenceCode: validated.referenceCode.toUpperCase(),
        patient: {
          telephone: validated.phone
        },
        statut: { not: 'ANNULE' }
      }
    });

    if (!appointment) {
      return {
        success: false,
        error: 'NOT_FOUND'
      };
    }

    // Vérifier le délai d'annulation (24h par défaut)
    const now = new Date();
    const appointmentDate = new Date(appointment.dateDebut);
    const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24) {
      return {
        success: false,
        error: 'TOO_LATE'
      };
    }

    // Annuler le rendez-vous
    await prisma.rendezVous.update({
      where: { id: appointment.id },
      data: { statut: 'ANNULE' }
    });

    revalidatePath('/admin');
    revalidatePath('/admin/patients');

    return { success: true };
  } catch (error) {
    console.error('Erreur annulation rendez-vous:', error);
    return {
      success: false,
      error: 'UNKNOWN'
    };
  }
}
