'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const avisSchema = z.object({
  auteur: z.string().trim().min(2, 'Le nom est requis'),
  note: z.number().min(1, 'La note est requise').max(5),
  commentaire: z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      const trimmed = v?.trim();
      return trimmed && trimmed.length > 0 ? trimmed : null;
    }),
  telephone: z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      const trimmed = v?.trim();
      return trimmed && trimmed.length > 0 ? trimmed : null;
    })
});

export async function submitReview(data: {
  auteur: string;
  note: number;
  commentaire?: string | null;
  telephone?: string | null;
}) {
  try {
    const validated = avisSchema.parse(data);

    // Optionally link to patient if phone is provided
    let patientId: string | undefined;
    if (validated.telephone) {
      const patient = await prisma.patient.findUnique({
        where: { telephone: validated.telephone }
      });
      patientId = patient?.id;
    }

    await prisma.avis.create({
      data: {
        auteur: validated.auteur,
        note: validated.note,
        commentaire: validated.commentaire,
        patientId: patientId || null,
        statut: 'EN_ATTENTE'
      }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erreur soumission avis:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Données invalides' };
    }
    return { success: false, error: 'Erreur lors de la soumission de votre avis' };
  }
}

