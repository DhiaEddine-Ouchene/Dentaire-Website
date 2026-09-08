import { getLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { GalerieClient } from './galerie-client';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { title: 'Gestion de la Galerie', robots: { index: false, follow: false } };
}

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const locale = await getLocale();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const cases = await prisma.casGalerie.findMany({
    orderBy: { ordre: 'asc' }
  });

  return <GalerieClient cases={cases} locale={locale} />;
}
