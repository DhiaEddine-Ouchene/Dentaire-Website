'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/admin/sidebar';
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  AlertCircle,
  Users,
  Star,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getContenu } from '@/lib/i18n-content';

type StatisticsClientProps = {
  stats: any;
  locale: string;
};

type PeriodType = 'day' | 'week' | 'month' | 'custom';

const COLORS = {
  primary: '#0066CC',
  secondary: '#00A896',
  accent: '#FF6B35',
  success: '#52B788',
  warning: '#FFB703',
  danger: '#EF476F',
  chart: ['#0066CC', '#00A896', '#FF6B35', '#FFB703', '#8338EC', '#06FFA5', '#EF476F']
};

export function StatisticsClient({ stats, locale }: StatisticsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [period, setPeriod] = useState<PeriodType>((searchParams.get('period') as PeriodType) || 'month');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    if (newPeriod === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
      router.push(`?period=${newPeriod}`);
    }
  };

  const handleCustomDateSubmit = (start: string, end: string) => {
    router.push(`?period=custom&start=${start}&end=${end}`);
    setShowDatePicker(false);
  };

  const labels = {
    title: { fr: 'Statistiques', ar: 'الإحصائيات', en: 'Statistics' },
    subtitle: { fr: 'Vue d\'ensemble de votre activité', ar: 'نظرة عامة على نشاطك', en: 'Overview of your activity' },
    today: { fr: 'Aujourd\'hui', ar: 'اليوم', en: 'Today' },
    thisWeek: { fr: 'Cette semaine', ar: 'هذا الأسبوع', en: 'This Week' },
    thisMonth: { fr: 'Ce mois', ar: 'هذا الشهر', en: 'This Month' },
    custom: { fr: 'Personnalisé', ar: 'مخصص', en: 'Custom' },
    appointments: { fr: 'Rendez-vous', ar: 'المواعيد', en: 'Appointments' },
    revenue: { fr: 'Revenus', ar: 'الإيرادات', en: 'Revenue' },
    overview: { fr: 'Vue d\'ensemble', ar: 'نظرة عامة', en: 'Overview' },
    revenueOverTime: { fr: 'Évolution des revenus', ar: 'تطور الإيرادات', en: 'Revenue Over Time' },
    reliability: { fr: 'Fiabilité de l\'agenda', ar: 'موثوقية الجدول', en: 'Schedule Reliability' },
    services: { fr: 'Services et motifs', ar: 'الخدمات والأسباب', en: 'Services & Reasons' },
    attendance: { fr: 'Fréquentation', ar: 'الحضور', en: 'Attendance' },
    patients: { fr: 'Patients', ar: 'المرضى', en: 'Patients' },
    reviews: { fr: 'Avis', ar: 'الآراء', en: 'Reviews' },
    cancellationRate: { fr: 'Taux d\'annulation', ar: 'معدل الإلغاء', en: 'Cancellation Rate' },
    noShowRate: { fr: 'Taux d\'absence', ar: 'معدل الغياب', en: 'No-Show Rate' },
    fillRate: { fr: 'Taux de remplissage', ar: 'معدل الحجز', en: 'Fill Rate' },
    byCount: { fr: 'Par nombre', ar: 'حسب العدد', en: 'By Count' },
    byRevenue: { fr: 'Par revenus', ar: 'حسب الإيرادات', en: 'By Revenue' },
    byHour: { fr: 'Par heure', ar: 'حسب الساعة', en: 'By Hour' },
    byDay: { fr: 'Par jour', ar: 'حسب اليوم', en: 'By Day' },
    newPatients: { fr: 'Nouveaux patients', ar: 'مرضى جدد', en: 'New Patients' },
    returningPatients: { fr: 'Patients récurrents', ar: 'مرضى عائدون', en: 'Returning Patients' },
    returnRate: { fr: 'Taux de retour', ar: 'معدل العودة', en: 'Return Rate' },
    averageRating: { fr: 'Note moyenne', ar: 'التقييم المتوسط', en: 'Average Rating' },
    totalReviews: { fr: 'Total des avis', ar: 'إجمالي الآراء', en: 'Total Reviews' },
    noData: { fr: 'Pas encore assez de données', ar: 'لا توجد بيانات كافية بعد', en: 'Not enough data yet' }
  };

  const t = (key: keyof typeof labels) => labels[key][locale as 'fr' | 'ar' | 'en'] || labels[key].fr;

  const dayNames = locale === 'ar'
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : locale === 'en'
    ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    : ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        {/* Header with period selector */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-ink-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-ink-600">{t('subtitle')}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => handlePeriodChange('day')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                period === 'day'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-ink-700 hover:bg-ink-50 border border-ink-200'
              }`}
            >
              {t('today')}
            </button>
            <button
              onClick={() => handlePeriodChange('week')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                period === 'week'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-ink-700 hover:bg-ink-50 border border-ink-200'
              }`}
            >
              {t('thisWeek')}
            </button>
            <button
              onClick={() => handlePeriodChange('month')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                period === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-ink-700 hover:bg-ink-50 border border-ink-200'
              }`}
            >
              {t('thisMonth')}
            </button>
            <button
              onClick={() => handlePeriodChange('custom')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                period === 'custom'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-ink-700 hover:bg-ink-50 border border-ink-200'
              }`}
            >
              {t('custom')}
            </button>
          </div>

          {showDatePicker && (
            <CustomDatePicker onSubmit={handleCustomDateSubmit} locale={locale} />
          )}
        </div>

        {/* Section 1 - Overview Cards */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-ink-900">{t('overview')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={<Calendar className="h-6 w-6" />}
              title={t('appointments')}
              value={stats.overview.appointmentsCount.toString()}
              color="primary"
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6" />}
              title={t('revenue')}
              value={`${stats.overview.revenue.toFixed(2)} DH`}
              color="success"
            />
          </div>
        </section>

        {/* Section 2 - Revenue Over Time */}
        <section className="mb-8">
          <ChartCard title={t('revenueOverTime')}>
            {stats.revenueOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.revenueOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    formatter={(value: any) => [`${value.toFixed(2)} DH`, t('revenue')]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={2} dot={{ fill: COLORS.primary }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message={t('noData')} />
            )}
          </ChartCard>
        </section>

        {/* Section 3 - Reliability */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-ink-900">{t('reliability')}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <ReliabilityCard
              title={t('cancellationRate')}
              value={`${stats.reliability.cancellationRate}%`}
              color="warning"
              tooltip="Pourcentage de rendez-vous annulés par rapport au total"
            />
            <ReliabilityCard
              title={t('noShowRate')}
              value={`${stats.reliability.noShowRate}%`}
              color="danger"
              tooltip="Pourcentage de patients qui ne se sont pas présentés"
            />
            <ReliabilityCard
              title={t('fillRate')}
              value={`${stats.reliability.fillRate}%`}
              color="success"
              tooltip="Pourcentage de rendez-vous complétés"
            />
          </div>
        </section>

        {/* Section 4 - Services */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-ink-900">{t('services')}</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title={t('byCount')}>
              {stats.services.byCount.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.services.byCount} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="nom"
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(value) => getContenu(value, locale).substring(0, 20)}
                      width={150}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                      formatter={(value: any, name: string | number | undefined, props: any) => [value, props?.payload?.nom ? getContenu(props.payload.nom, locale) : name?.toString() || '']}
                    />
                    <Bar dataKey="count" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message={t('noData')} />
              )}
            </ChartCard>

            <ChartCard title={t('byRevenue')}>
              {stats.services.byRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.services.byRevenue}
                      dataKey="revenue"
                      nameKey="nom"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry: any) => `${((entry.revenue / stats.services.byRevenue.reduce((sum: number, item: any) => sum + item.revenue, 0)) * 100).toFixed(0)}%`}
                    >
                      {stats.services.byRevenue.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                      formatter={(value: any, name: string | number | undefined, props: any) => [`${value.toFixed(2)} DH`, props?.payload?.nom ? getContenu(props.payload.nom, locale) : name?.toString() || '']}
                    />
                    <Legend
                      formatter={(value, entry: any) => getContenu(entry.payload.nom, locale).substring(0, 25)}
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message={t('noData')} />
              )}
            </ChartCard>
          </div>
        </section>

        {/* Section 5 - Attendance */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-ink-900">{t('attendance')}</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title={t('byHour')}>
              {stats.attendance.byHour.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.attendance.byHour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="hour"
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(value) => `${value}h`}
                    />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                      labelFormatter={(value) => `${value}h`}
                    />
                    <Bar dataKey="count" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message={t('noData')} />
              )}
            </ChartCard>

            <ChartCard title={t('byDay')}>
              {stats.attendance.byDay.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.attendance.byDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(value: any) => {
                        const dayName = dayNames[value as keyof typeof dayNames];
                        return typeof dayName === 'string' ? dayName.substring(0, 3) : String(value);
                      }}
                    />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                      labelFormatter={(value: any) => {
                        const dayName = dayNames[value as keyof typeof dayNames];
                        return typeof dayName === 'string' ? dayName : String(value);
                      }}
                    />
                    <Bar dataKey="count" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message={t('noData')} />
              )}
            </ChartCard>
          </div>
        </section>

        {/* Section 6 - Patients */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-ink-900">{t('patients')}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={<Users className="h-6 w-6" />}
              title={t('newPatients')}
              value={stats.patients.newPatients.toString()}
              color="primary"
            />
            <StatCard
              icon={<Users className="h-6 w-6" />}
              title={t('returningPatients')}
              value={stats.patients.returningPatients.toString()}
              color="secondary"
            />
            <StatCard
              icon={<TrendingUp className="h-6 w-6" />}
              title={t('returnRate')}
              value={`${stats.patients.returnRate}%`}
              color="success"
            />
          </div>
        </section>

        {/* Section 7 - Reviews */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-ink-900">{t('reviews')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              icon={<Star className="h-6 w-6" />}
              title={t('averageRating')}
              value={`${stats.reviews.averageRating} / 5`}
              color="warning"
            />
            <StatCard
              icon={<BarChart3 className="h-6 w-6" />}
              title={t('totalReviews')}
              value={stats.reviews.totalReviews.toString()}
              color="primary"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color = 'primary'
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    secondary: 'bg-teal-50 text-teal-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600'
  };

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-ink-600">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-ink-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
      <h3 className="mb-4 text-base font-semibold text-ink-900">{title}</h3>
      {children}
    </div>
  );
}

function ReliabilityCard({
  title,
  value,
  color,
  tooltip
}: {
  title: string;
  value: string;
  color: 'success' | 'warning' | 'danger';
  tooltip: string;
}) {
  const colorClasses = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className={`rounded-2xl border p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <div className="group relative">
          <AlertCircle className="h-5 w-5 cursor-help opacity-60" />
          <div className="absolute right-0 top-6 z-10 hidden w-48 rounded-lg bg-ink-900 p-2 text-xs text-white group-hover:block">
            {tooltip}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center text-sm text-ink-500">
      {message}
    </div>
  );
}

function CustomDatePicker({ onSubmit, locale }: { onSubmit: (start: string, end: string) => void; locale: string }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  return (
    <div className="mt-4 rounded-lg border border-ink-200 bg-white p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            {locale === 'ar' ? 'من' : locale === 'en' ? 'From' : 'Du'}
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            {locale === 'ar' ? 'إلى' : locale === 'en' ? 'To' : 'Au'}
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => start && end && onSubmit(start, end)}
            disabled={!start || !end}
            className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:bg-ink-300 disabled:cursor-not-allowed"
          >
            {locale === 'ar' ? 'تطبيق' : locale === 'en' ? 'Apply' : 'Appliquer'}
          </button>
        </div>
      </div>
    </div>
  );
}
