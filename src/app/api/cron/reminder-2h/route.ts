import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Cron job : rappels automatiques 2h avant le rendez-vous (PROMPT 14).
 * Déclenché par un service cron externe (ex: cron-job.org) toutes les 15 minutes.
 *
 * Sécurité : Requiert un header `x-cron-secret` correspondant à CRON_SECRET.
 */
export async function GET(request: Request) {
  // Vérification du secret pour les services cron externes
  const cronSecretHeader = request.headers.get('x-cron-secret');
  const cronSecret = process.env.CRON_SECRET;

  // Si CRON_SECRET est défini, il doit correspondre au header
  if (!cronSecret) {
    console.warn('⚠️ CRON_SECRET non défini - route cron non protégée');
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
  }

  if (cronSecretHeader !== cronSecret) {
    console.error('❌ Tentative d\'accès non autorisée à la route cron');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const in3Hours = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const appointments = await prisma.rendezVous.findMany({
      where: {
        statut: 'CONFIRME',
        dateDebut: {
          gte: in2Hours,
          lte: in3Hours
        }
      },
      include: {
        patient: true,
        motif: true
      }
    });

    console.log(`Found ${appointments.length} appointments for 2h reminder`);

    for (const apt of appointments) {
      const message = `Rappel : Rendez-vous dans 2h aujourd'hui à ${apt.dateDebut.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}. Cabinet Le Sourire.`;
      console.log(`2h reminder prepared for patient ${apt.patient.nom}: ${message}`);
    }

    return NextResponse.json({
      success: true,
      count: appointments.length,
      message: `2h reminders prepared for ${appointments.length} appointments`
    });
  } catch (error) {
    console.error('2h reminder cron error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
