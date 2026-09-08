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
  searchParams: { period?: string; start?: string; end?: string };
}) {
  const supabase = await createClient();
  const locale = await getLocale();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const period = (searchParams.period as 'day' | 'week' | 'month' | 'custom') || 'month';
  const customStart = searchParams.start ? new Date(searchParams.start) : undefined;
  const customEnd = searchParams.end ? new Date(searchParams.end) : undefined;

  const stats = await getAllStatistics(period, customStart, customEnd);

  return <StatisticsClient stats={stats} locale={locale} />;
}
