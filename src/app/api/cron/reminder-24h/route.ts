import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Cron job : rappels automatiques 24h avant le rendez-vous (PROMPT 14).
 * À configurer dans vercel.json ou via l'interface Vercel Cron.
 * Déclenché quotidiennement, ex: à 9h.
 */
export async function GET(request: Request) {
  // Vérification du secret Vercel Cron
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in25Hours = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // Rendez-vous confirmés dans les prochaines 24-25h
    const appointments = await prisma.rendezVous.findMany({
      where: {
        statut: 'CONFIRME',
        dateDebut: {
          gte: in24Hours,
          lte: in25Hours
        }
      },
      include: {
        patient: true,
        motif: true
      }
    });

    console.log(`Found ${appointments.length} appointments for 24h reminder`);

    // TODO: Intégration email/WhatsApp/SMS
    // Pour chaque rendez-vous, envoyer via:
    // - Email: service comme Resend, SendGrid, etc.
    // - WhatsApp: API WhatsApp Business
    // - SMS: Twilio, etc.

    // Points d'intégration préparés:
    for (const apt of appointments) {
      const message = `Rappel : Vous avez rendez-vous demain le ${apt.dateDebut.toLocaleDateString('fr-FR')} à ${apt.dateDebut.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}. Cabinet Le Sourire.`;

      // await sendEmail(apt.patient.email, message);
      // await sendWhatsApp(apt.patient.telephone, message);
      // await sendSMS(apt.patient.telephone, message);

      console.log(`Reminder prepared for patient ${apt.patient.nom}: ${message}`);
    }

    return NextResponse.json({
      success: true,
      count: appointments.length,
      message: `24h reminders prepared for ${appointments.length} appointments`
    });
  } catch (error) {
    console.error('24h reminder cron error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
