import { getLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StatisticsClient } from './statistics-client';
import { getAllStatistics } from '@/lib/statistics';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { title: 'Statistiques', robots: { index: false, follow: false } };
}

export default async function StatistiquesPage({
  searchParams
}: {
  searchParams: Promise<{ period?: string; start?: string; end?: string }>;
}) {
  const supabase = await createClient();
  const locale = await getLocale();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Await searchParams (Next.js 15 App Router)
  const params = await searchParams;
  const period = (params.period as 'day' | 'week' | 'month' | 'custom') || 'month';
  const customStart = params.start ? new Date(params.start) : undefined;
  const customEnd = params.end ? new Date(params.end) : undefined;

  const stats = await getAllStatistics(period, customStart, customEnd);

  return <StatisticsClient stats={stats} locale={locale} />;
}
