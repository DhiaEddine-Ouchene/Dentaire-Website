'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const avisSchema = z.object({
  auteur: z.string().min(2, 'Le nom est requis'),
  note: z.number().min(1).max(5),
  commentaire: z.string().min(10, 'Le commentaire doit contenir au moins 10 caractères').optional(),
  telephone: z.string().optional()
});

export async function submitReview(data: z.infer<typeof avisSchema>) {
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
        commentaire: validated.commentaire || null,
        patientId: patientId || null,
        statut: 'EN_ATTENTE'
      }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erreur soumission avis:', error);
    return { success: false, error: 'Erreur lors de la soumission de votre avis' };
  }
}
