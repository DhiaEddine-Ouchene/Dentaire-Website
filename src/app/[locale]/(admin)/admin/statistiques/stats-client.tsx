'use client';

import { Sidebar } from '@/components/admin/sidebar';
import { useTranslations } from 'next-intl';
import { getContenu } from '@/lib/i18n-content';
import { BarChart3, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useState } from 'react';

type StatsClientProps = {
  stats: {
    day: { appointments: number; revenue: number };
    week: { appointments: number; revenue: number };
    month: { appointments: number; revenue: number };
    year: { appointments: number; revenue: number };
    topMotif: { nom: any; count: number } | null;
  };
  locale: string;
};

type TimePeriod = 'day' | 'week' | 'month' | 'year';

export function StatsClient({ stats, locale }: StatsClientProps) {
  const t = useTranslations('admin.stats');
  const [period, setPeriod] = useState<TimePeriod>('month');

  const currentStats = stats[period];

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-ink-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-ink-600">{t('subtitle')}</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setPeriod('day')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              period === 'day'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-ink-700 hover:bg-ink-50 border border-ink-200'
            }`}
          >
            {locale === 'ar' ? 'اليوم' : locale === 'en' ? 'Today' : 'Aujourd\'hui'}
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              period === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-ink-700 hover:bg-ink-50 border border-ink-200'
            }`}
          >
            {locale === 'ar' ? 'هذا الأسبوع' : locale === 'en' ? 'This Week' : 'Cette semaine'}
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              period === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-ink-700 hover:bg-ink-50 border border-ink-200'
            }`}
          >
            {locale === 'ar' ? 'هذا الشهر' : locale === 'en' ? 'This Month' : 'Ce mois'}
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              period === 'year'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-ink-700 hover:bg-ink-50 border border-ink-200'
            }`}
          >
            {locale === 'ar' ? 'هذا العام' : locale === 'en' ? 'This Year' : 'Cette année'}
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Clock className="h-6 w-6" />}
            title={
              locale === 'ar'
                ? 'المواعيد المكتملة'
                : locale === 'en'
                ? 'Completed Appointments'
                : 'Rendez-vous terminés'
            }
            value={currentStats.appointments.toString()}
            description={getPeriodLabel(period, locale)}
          />
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title={locale === 'ar' ? 'الإيرادات' : locale === 'en' ? 'Revenue' : 'Revenus'}
            value={`${currentStats.revenue.toFixed(2)} DH`}
            description={getPeriodLabel(period, locale)}
          />
          {stats.topMotif && (
            <StatCard
              icon={<TrendingUp className="h-6 w-6" />}
              title={t('topMotif')}
              value={getContenu(stats.topMotif.nom, locale)}
              description={t('requestedTimes', { count: stats.topMotif.count })}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function getPeriodLabel(period: TimePeriod, locale: string): string {
  const labels = {
    day: { fr: "Aujourd'hui", ar: 'اليوم', en: 'Today' },
    week: { fr: 'Cette semaine', ar: 'هذا الأسبوع', en: 'This week' },
    month: { fr: 'Ce mois', ar: 'هذا الشهر', en: 'This month' },
    year: { fr: 'Cette année', ar: 'هذا العام', en: 'This year' }
  };
  return labels[period][locale as keyof typeof labels.day] || labels[period].fr;
}

function StatCard({
  icon,
  title,
  value,
  description
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-ink-600">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-ink-900">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-500">{description}</p>
    </div>
  );
}
