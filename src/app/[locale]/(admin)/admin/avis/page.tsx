import { getLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AvisClient } from './avis-client';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { title: 'Gestion des Avis', robots: { index: false, follow: false } };
}

export default async function AdminAvisPage() {
  const supabase = await createClient();
  const locale = await getLocale();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const reviews = await prisma.avis.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <AvisClient reviews={reviews} locale={locale} />;
}
