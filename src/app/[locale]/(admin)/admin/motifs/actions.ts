'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

/**
 * Actions pour la gestion des motifs (PROMPT 12).
 */

const motifInput = z.object({
  nomFr: z.string().trim().min(2),
  nomAr: z.string().trim().optional().or(z.literal('')),
  nomEn: z.string().trim().optional().or(z.literal('')),
  descriptionFr: z.string().trim().optional().or(z.literal('')),
  descriptionAr: z.string().trim().optional().or(z.literal('')),
  descriptionEn: z.string().trim().optional().or(z.literal('')),
  dureeDefaut: z.coerce.number().int().min(5).max(300),
  couleur: z.string().trim().optional().or(z.literal(''))
});

async function checkAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

export async function createMotif(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await checkAuth())) {
    return { ok: false, error: 'UNAUTHORIZED' };
  }

  const parsed = motifInput.safeParse({
    nomFr: formData.get('nomFr'),
    nomAr: formData.get('nomAr'),
    nomEn: formData.get('nomEn'),
    descriptionFr: formData.get('descriptionFr'),
    descriptionAr: formData.get('descriptionAr'),
    descriptionEn: formData.get('descriptionEn'),
    dureeDefaut: formData.get('dureeDefaut'),
    couleur: formData.get('couleur')
  });

  if (!parsed.success) {
    return { ok: false, error: 'VALIDATION' };
  }

  const { nomFr, nomAr, nomEn, descriptionFr, descriptionAr, descriptionEn, dureeDefaut, couleur } = parsed.data;

  try {
    // Obtenir le prochain ordre
    const maxOrdre = await prisma.motif.findFirst({
      select: { ordre: true },
      orderBy: { ordre: 'desc' }
    });

    const nom: any = { fr: nomFr };
    if (nomAr) nom.ar = nomAr;
    if (nomEn) nom.en = nomEn;

    const description: any = {};
    if (descriptionFr) description.fr = descriptionFr;
    if (descriptionAr) description.ar = descriptionAr;
    if (descriptionEn) description.en = descriptionEn;

    await prisma.motif.create({
      data: {
        nom,
        description: Object.keys(description).length > 0 ? description : null,
        dureeDefaut,
        couleur: couleur || null,
        ordre: (maxOrdre?.ordre ?? 0) + 1
      }
    });

    revalidatePath('/admin/motifs');
    return { ok: true };
  } catch (error) {
    console.error('Create motif error:', error);
    return { ok: false, error: 'SERVER_ERROR' };
  }
}

export async function updateMotif(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await checkAuth())) {
    return { ok: false, error: 'UNAUTHORIZED' };
  }

  const id = formData.get('id') as string;
  if (!id) {
    return { ok: false, error: 'VALIDATION' };
  }

  const parsed = motifInput.safeParse({
    nomFr: formData.get('nomFr'),
    nomAr: formData.get('nomAr'),
    nomEn: formData.get('nomEn'),
    descriptionFr: formData.get('descriptionFr'),
    descriptionAr: formData.get('descriptionAr'),
    descriptionEn: formData.get('descriptionEn'),
    dureeDefaut: formData.get('dureeDefaut'),
    couleur: formData.get('couleur')
  });

  if (!parsed.success) {
    return { ok: false, error: 'VALIDATION' };
  }

  const { nomFr, nomAr, nomEn, descriptionFr, descriptionAr, descriptionEn, dureeDefaut, couleur } = parsed.data;

  try {
    const nom: any = { fr: nomFr };
    if (nomAr) nom.ar = nomAr;
    if (nomEn) nom.en = nomEn;

    const description: any = {};
    if (descriptionFr) description.fr = descriptionFr;
    if (descriptionAr) description.ar = descriptionAr;
    if (descriptionEn) description.en = descriptionEn;

    await prisma.motif.update({
      where: { id },
      data: {
        nom,
        description: Object.keys(description).length > 0 ? description : null,
        dureeDefaut,
        couleur: couleur || null
      }
    });

    revalidatePath('/admin/motifs');
    return { ok: true };
  } catch (error) {
    console.error('Update motif error:', error);
    return { ok: false, error: 'SERVER_ERROR' };
  }
}

export async function deleteMotif(id: string): Promise<{ ok: boolean }> {
  if (!(await checkAuth())) {
    return { ok: false };
  }

  try {
    // Vérifier si le motif est utilisé
    const count = await prisma.rendezVous.count({
      where: { motifId: id }
    });

    if (count > 0) {
      return { ok: false };
    }

    await prisma.motif.delete({ where: { id } });
    revalidatePath('/admin/motifs');
    return { ok: true };
  } catch (error) {
    console.error('Delete motif error:', error);
    return { ok: false };
  }
}

export async function toggleMotifStatus(id: string): Promise<{ ok: boolean }> {
  if (!(await checkAuth())) {
    return { ok: false };
  }

  try {
    const motif = await prisma.motif.findUnique({ where: { id } });
    if (!motif) {
      return { ok: false };
    }

    await prisma.motif.update({
      where: { id },
      data: { actif: !motif.actif }
    });

    revalidatePath('/admin/motifs');
    return { ok: true };
  } catch (error) {
    console.error('Toggle motif status error:', error);
    return { ok: false };
  }
}
