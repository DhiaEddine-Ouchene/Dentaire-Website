import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/components/ui';
import { FindAppointmentClient } from './find-appointment-client';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titles: Record<string, string> = {
    fr: 'Retrouver mon rendez-vous',
    ar: 'العثور على موعدي',
    en: 'Find My Appointment'
  };

  const descriptions: Record<string, string> = {
    fr: 'Consultez ou annulez votre rendez-vous en entrant votre code de référence et votre numéro de téléphone',
    ar: 'عرض أو إلغاء موعدك عن طريق إدخال رمز المرجع ورقم هاتفك',
    en: 'View or cancel your appointment by entering your reference code and phone number'
  };

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr
  };
}

export default async function FindAppointmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <section className="border-b border-ink-100 bg-gradient-to-b from-primary-50 via-sand-50 to-white">
        <Container className="py-14 text-center sm:py-20">
          <h1 className="text-display-sm font-display text-ink-900">
            {locale === 'ar' ? 'إدارة موعدك' : locale === 'en' ? 'Manage Your Appointment' : 'Gérer votre rendez-vous'}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
            {locale === 'ar'
              ? 'استخدم رمز المرجع ورقم هاتفك للعثور على موعدك وإدارته'
              : locale === 'en'
              ? 'Use your reference code and phone number to find and manage your appointment'
              : 'Utilisez votre code de référence et votre numéro de téléphone pour retrouver et gérer votre rendez-vous'}
          </p>
        </Container>
      </section>

      <Section tone="default">
        <FindAppointmentClient locale={locale} />
      </Section>
    </>
  );
}
