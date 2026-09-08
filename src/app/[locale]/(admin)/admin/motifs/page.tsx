import { getTranslations, getLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { getContenu } from '@/lib/i18n-content';
import { redirect } from 'next/navigation';
import { MotifsManagementClient } from './motifs-client';
import {
  createMotif,
  updateMotif,
  deleteMotif,
  toggleMotifStatus
} from './actions';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const t = await getTranslations('admin.motifs');
  return { title: t('title'), robots: { index: false, follow: false } };
}

/**
 * Page de gestion des motifs de consultation (PROMPT 12).
 * CRUD complet avec durées par défaut éditables.
 */
export default async function MotifsManagementPage() {
  const supabase = await createClient();
  const locale = await getLocale();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Charger tous les motifs
  const motifs = await prisma.motif.findMany({
    orderBy: { ordre: 'asc' }
  });

  const motifsForClient = motifs.map((m) => ({
    id: m.id,
    nom: m.nom as any,
    description: m.description as any,
    dureeDefaut: m.dureeDefaut,
    couleur: m.couleur,
    actif: m.actif,
    ordre: m.ordre
  }));

  return (
    <MotifsManagementClient
      motifs={motifsForClient}
      locale={locale}
      onCreateMotif={createMotif}
      onUpdateMotif={updateMotif}
      onDeleteMotif={deleteMotif}
      onToggleStatus={toggleMotifStatus}
    />
  );
}
