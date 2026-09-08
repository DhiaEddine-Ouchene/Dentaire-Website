import { getLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/admin/sidebar';
import { Settings, Building2, Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { title: 'Paramètres du Cabinet', robots: { index: false, follow: false } };
}

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const locale = await getLocale();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const cabinet = await prisma.cabinet.findFirst();

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-ink-900">
            {locale === 'ar' ? 'إعدادات العيادة' : locale === 'en' ? 'Clinic Settings' : 'Paramètres du Cabinet'}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            {locale === 'ar'
              ? 'معلومات العيادة، أوقات العمل وقواعد الحجز'
              : locale === 'en'
              ? 'Clinic contact info, operating hours and booking rules'
              : 'Informations de contact, horaires d’ouverture et règles de réservation.'}
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-ink-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary-600" />
              {locale === 'ar' ? 'معلومات عامة' : locale === 'en' ? 'General Information' : 'Informations Générales'}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
              <div className="rounded-xl border border-ink-100 p-4">
                <span className="text-xs text-ink-500 font-medium">
                  {locale === 'ar' ? 'اسم العيادة' : locale === 'en' ? 'Clinic Name' : 'Nom du cabinet'}
                </span>
                <p className="mt-1 font-semibold text-ink-900">{cabinet?.nom || 'Cabinet Le Sourire'}</p>
              </div>

              <div className="rounded-xl border border-ink-100 p-4">
                <span className="text-xs text-ink-500 font-medium">
                  {locale === 'ar' ? 'العنوان' : locale === 'en' ? 'Address' : 'Adresse'}
                </span>
                <p className="mt-1 font-semibold text-ink-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-ink-400 shrink-0" />
                  {cabinet?.adresse || 'Alger Centre, Algérie'}
                </p>
              </div>

              <div className="rounded-xl border border-ink-100 p-4">
                <span className="text-xs text-ink-500 font-medium">
                  {locale === 'ar' ? 'الهاتف' : locale === 'en' ? 'Phone' : 'Téléphone'}
                </span>
                <p className="mt-1 font-semibold text-ink-900 flex items-center gap-1.5" dir="ltr">
                  <Phone className="h-4 w-4 text-ink-400 shrink-0" />
                  {cabinet?.telephone || '0555 12 34 56'}
                </p>
              </div>

              <div className="rounded-xl border border-ink-100 p-4">
                <span className="text-xs text-ink-500 font-medium">
                  {locale === 'ar' ? 'البريد الإلكتروني' : locale === 'en' ? 'Email' : 'E-mail'}
                </span>
                <p className="mt-1 font-semibold text-ink-900 flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-ink-400 shrink-0" />
                  {cabinet?.email || 'contact@cabinet-lesourire.dz'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-ink-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              {locale === 'ar' ? 'قواعد الحجز' : locale === 'en' ? 'Booking Rules' : 'Règles de Réservation'}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
              <div className="rounded-xl border border-ink-100 p-4">
                <span className="text-xs text-ink-500 font-medium">
                  {locale === 'ar' ? 'المهلة الدنيا للحجز' : locale === 'en' ? 'Min notice' : 'Délai minimum'}
                </span>
                <p className="mt-1 font-semibold text-ink-900">
                  2 {locale === 'ar' ? 'ساعات' : locale === 'en' ? 'hours' : 'heures'}
                </p>
              </div>

              <div className="rounded-xl border border-ink-100 p-4">
                <span className="text-xs text-ink-500 font-medium">
                  {locale === 'ar' ? 'الأفق الأقصى للحجز' : locale === 'en' ? 'Max horizon' : 'Horizon maximum'}
                </span>
                <p className="mt-1 font-semibold text-ink-900">
                  60 {locale === 'ar' ? 'يوماً' : locale === 'en' ? 'days' : 'jours'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
