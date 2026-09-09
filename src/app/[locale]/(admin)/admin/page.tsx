import { getTranslations, getLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { getContenu } from '@/lib/i18n-content';
import { AdminDashboardClient } from './dashboard-client';
import { signOut, createAppointment, updateAppointment, cancelAppointment } from './actions';

// Le tableau de bord lit la session (cookies) : rendu à la demande, jamais prérendu.
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const t = await getTranslations('admin.dashboard');
  return { title: t('title'), robots: { index: false, follow: false } };
}

/**
 * Tableau de bord admin (PROMPT 11) : vue calendrier des rendez-vous avec sidebar navigation.
 * L'accès est filtré par le middleware ; la session est déjà vérifiée.
 */
export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const locale = await getLocale();

  // Vérification de la session (redondant avec le middleware, mais garantit l'accès aux données)
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    // Le middleware devrait déjà avoir redirigé, mais on s'assure
    return null;
  }

  // Charger les rendez-vous des 30 derniers jours et 30 prochains jours (pour couvrir aujourd'hui, hier et les semaines à venir)
  const now = new Date();
  const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const appointments = await prisma.rendezVous.findMany({
    where: {
      dateDebut: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      patient: true,
      motif: true
    },
    orderBy: {
      dateDebut: 'asc'
    }
  });

  // Charger les motifs pour le formulaire
  const motifs = await prisma.motif.findMany({
    orderBy: { nom: 'asc' }
  });

  // Transformer les données pour le client
  const appointmentsForClient = appointments.map((apt) => ({
    id: apt.id,
    patientName: apt.patient.nom,
    patientPhone: apt.patient.telephone,
    patientEmail: apt.patient.email || undefined,
    motifId: apt.motifId,
    motifName: getContenu(apt.motif.nom as any, locale),
    dateDebut: apt.dateDebut.toISOString(),
    dateFin: apt.dateFin.toISOString(),
    statut: apt.statut as 'CONFIRME' | 'ANNULE' | 'TERMINE',
    notes: apt.notes || undefined
  }));

  const motifsForClient = motifs.map((m) => ({
    id: m.id,
    nom: getContenu(m.nom as any, locale),
    durationMin: m.dureeDefaut
  }));

  return (
    <AdminDashboardClient
      appointments={appointmentsForClient}
      motifs={motifsForClient}
      locale={locale}
      onSignOut={signOut}
      onCreateAppointment={createAppointment}
      onUpdateAppointment={updateAppointment}
      onCancelAppointment={cancelAppointment}
    />
  );
}
