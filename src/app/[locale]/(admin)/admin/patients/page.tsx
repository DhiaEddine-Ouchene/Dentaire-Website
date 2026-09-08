import { getLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { PatientsClient } from './patients-client';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { title: 'Gestion des Patients', robots: { index: false, follow: false } };
}

export default async function AdminPatientsPage() {
  const supabase = await createClient();
  const locale = await getLocale();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const patients = await prisma.patient.findMany({
    include: {
      rendezVous: {
        include: { motif: true },
        orderBy: { dateDebut: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const serializedPatients = patients.map((p) => {
    const last = p.rendezVous[0];
    return {
      id: p.id,
      nom: p.nom,
      telephone: p.telephone,
      email: p.email,
      notes: p.note,
      createdAt: p.createdAt.toISOString(),
      appointmentsCount: p.rendezVous.length,
      lastAppointment: last
        ? {
            date: last.dateDebut.toISOString(),
            motif: typeof last.motif?.nom === 'object' ? JSON.stringify(last.motif.nom) : String(last.motif?.nom || ''),
            statut: last.statut
          }
        : null
    };
  });

  return <PatientsClient patients={serializedPatients} locale={locale} />;
}
