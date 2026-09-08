'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const galerieSchema = z.object({
  titre: z.object({
    fr: z.string().min(1),
    ar: z.string().optional(),
    en: z.string().optional()
  }),
  description: z.object({
    fr: z.string().optional(),
    ar: z.string().optional(),
    en: z.string().optional()
  }).optional(),
  categorie: z.enum(['whitening', 'ortho', 'implant', 'aesthetic']),
  imageBefore: z.string().url(),
  imageAfter: z.string().url(),
  featured: z.boolean().default(false)
});

export async function createGalleryCase(data: z.infer<typeof galerieSchema>) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Non authentifié' };
  }

  try {
    const validated = galerieSchema.parse(data);

    const maxOrdre = await prisma.casGalerie.findFirst({
      orderBy: { ordre: 'desc' },
      select: { ordre: true }
    });

    await prisma.casGalerie.create({
      data: {
        ...validated,
        ordre: (maxOrdre?.ordre ?? -1) + 1
      }
    });

    revalidatePath('/admin/galerie');
    revalidatePath('/galerie');
    return { success: true };
  } catch (error) {
    console.error('Erreur création cas galerie:', error);
    return { success: false, error: 'Erreur lors de la création' };
  }
}

export async function updateGalleryCase(id: string, data: Partial<z.infer<typeof galerieSchema>>) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Non authentifié' };
  }

  try {
    await prisma.casGalerie.update({
      where: { id },
      data
    });

    revalidatePath('/admin/galerie');
    revalidatePath('/galerie');
    return { success: true };
  } catch (error) {
    console.error('Erreur mise à jour cas galerie:', error);
    return { success: false, error: 'Erreur lors de la mise à jour' };
  }
}

export async function deleteGalleryCase(id: string) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Non authentifié' };
  }

  try {
    await prisma.casGalerie.delete({
      where: { id }
    });

    revalidatePath('/admin/galerie');
    revalidatePath('/galerie');
    return { success: true };
  } catch (error) {
    console.error('Erreur suppression cas galerie:', error);
    return { success: false, error: 'Erreur lors de la suppression' };
  }
}

export async function uploadImageToSupabase(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Non authentifié' };
  }

  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'Aucun fichier fourni' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Erreur upload Supabase:', uploadError);
      return { success: false, error: 'Erreur lors du téléversement' };
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from('public').getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Erreur upload image:', error);
    return { success: false, error: 'Erreur lors du téléversement' };
  }
}
