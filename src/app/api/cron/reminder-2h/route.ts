import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Cron job : rappels automatiques 2h avant le rendez-vous (PROMPT 14).
 * Déclenché toutes les heures.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
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
