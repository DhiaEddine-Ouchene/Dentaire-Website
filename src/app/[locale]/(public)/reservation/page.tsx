import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/components/ui';
import { BookingWizard } from '@/components/reservation/booking-wizard';
import { services, getServiceBySlug } from '@/data/services';
import { weeklyHoursFromSite } from '@/lib/booking';
import { getAvailableSlots, requestBooking } from './actions';

export async function generateMetadata() {
  const t = await getTranslations('reservation.hero');
  return { title: t('title'), description: t('description') };
}

/**
 * Page de prise de rendez-vous (PROMPT 8).
 * Serveur : prépare les données sérialisables (motifs, jours fermés) et injecte
 * les server actions ; le stepper interactif vit dans `BookingWizard` (client).
 */
export default async function ReservationPage({
  searchParams
}: {
  searchParams: Promise<{ motif?: string }>;
}) {
  const t = await getTranslations('reservation.hero');
  const { motif } = await searchParams;

  // Motif prérempli depuis `?motif=<slug>` (uniquement si le slug existe).
  const initialMotifId = motif && getServiceBySlug(motif) ? motif : null;

  // Sous-ensemble sérialisable des services pour l'étape 1.
  const motifs = services.map((s) => ({
    slug: s.slug,
    icon: s.icon,
    durationMin: s.durationMin,
    name: s.name,
    short: s.short
  }));

  // Jours de fermeture (index JS `getDay`) déduits des horaires du cabinet.
  const week = weeklyHoursFromSite();
  const closedWeekdays = [0, 1, 2, 3, 4, 5, 6].filter((d) => !week[d] || week[d]!.length === 0);

  return (
    <>
      <section className="border-b border-ink-100 bg-gradient-to-b from-primary-50 via-sand-50 to-white">
        <Container className="py-14 text-center sm:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-600">
            {t('eyebrow')}
          </p>
          <h1 className="text-display-sm font-display text-ink-900">{t('title')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
            {t('description')}
          </p>
        </Container>
      </section>

      <Section tone="default">
        <BookingWizard
          motifs={motifs}
          initialMotifId={initialMotifId}
          closedWeekdays={closedWeekdays}
          getSlots={getAvailableSlots}
          submitBooking={requestBooking}
        />
      </Section>
    </>
  );
}
