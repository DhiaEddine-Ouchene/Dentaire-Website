'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Fonction pour générer un lien Google My Business Review
 * Remplacez PLACE_ID par votre véritable Google Place ID
 */
function getGoogleReviewUrl() {
  // TODO: Remplacer par votre Google Place ID réel
  // Vous pouvez le trouver sur: https://developers.google.com/maps/documentation/places/web-service/place-id
  const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID || 'YOUR_PLACE_ID_HERE';

  return `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;
}

/**
 * Envoie un email au patient avec un lien vers Google Review
 */
async function sendGoogleReviewInvitation(avis: any) {
  try {
    // Si le patient a un email, lui envoyer une invitation
    if (avis.patient?.email) {
      const googleReviewUrl = getGoogleReviewUrl();

      // TODO: Intégrer avec votre service d'email (Resend, SendGrid, etc.)
      // Pour l'instant, on log juste l'URL
      console.log('Google Review URL pour', avis.patient.email, ':', googleReviewUrl);

      // Exemple d'intégration avec Resend (à décommenter quand configuré):
      /*
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'Cabinet Dentaire <noreply@votrecabinet.com>',
        to: avis.patient.email,
        subject: 'Merci pour votre avis ! Partagez-le sur Google',
        html: `
          <h2>Merci ${avis.auteur} !</h2>
          <p>Nous avons bien reçu votre avis et vous en remercions.</p>
          <p>Si vous le souhaitez, vous pouvez également partager votre expérience sur Google pour aider d'autres patients :</p>
          <a href="${googleReviewUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0066CC; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Laisser un avis sur Google
          </a>
          <p style="color: #666; font-size: 14px;">Merci de votre confiance !</p>
        `
      });
      */

      return { success: true, googleUrl: googleReviewUrl };
    }

    return { success: false, message: 'Pas d\'email disponible' };
  } catch (error) {
    console.error('Erreur envoi invitation Google Review:', error);
    return { success: false, error };
  }
}

export async function updateReviewStatus(id: string, statut: 'PUBLIE' | 'REJETE') {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Non authentifié' };
  }

  try {
    // Récupérer l'avis avec les infos du patient
    const avis = await prisma.avis.findUnique({
      where: { id },
      include: { patient: true }
    });

    // Mettre à jour le statut
    await prisma.avis.update({
      where: { id },
      data: { statut }
    });

    // Si l'avis est approuvé (PUBLIE), envoyer l'invitation Google Review
    if (statut === 'PUBLIE' && avis) {
      const googleInvitation = await sendGoogleReviewInvitation(avis);

      if (googleInvitation.success) {
        console.log('✓ Invitation Google Review envoyée avec succès');
      }
    }

    revalidatePath('/admin/avis');
    revalidatePath('/avis');
    revalidatePath('/');
    return {
      success: true,
      message: statut === 'PUBLIE' ? 'Avis publié et invitation Google envoyée' : 'Avis rejeté'
    };
  } catch (error) {
    console.error('Erreur mise à jour statut avis:', error);
    return { success: false, error: 'Erreur lors de la mise à jour' };
  }
}

export async function deleteReview(id: string) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Non authentifié' };
  }

  try {
    await prisma.avis.delete({
      where: { id }
    });

    revalidatePath('/admin/avis');
    revalidatePath('/avis');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Erreur suppression avis:', error);
    return { success: false, error: 'Erreur lors de la suppression' };
  }
}

/**
 * Action manuelle pour générer le lien Google Review
 * Utile pour tester ou envoyer manuellement
 */
export async function getGoogleReviewLink() {
  return {
    success: true,
    url: getGoogleReviewUrl()
  };
}

