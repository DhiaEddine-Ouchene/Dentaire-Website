import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight, CalendarCheck, Clock, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import {
  Container,
  Section,
  Card,
  CardBody,
  CardTitle,
  CardDescription,
  Badge,
  buttonVariants
} from '@/components/ui';
import { ServiceIconBadge } from '@/components/public/service-icon';
import { services, getServiceBySlug } from '@/data/services';
import { getContenu } from '@/lib/i18n-content';
import { siteConfig } from '@/config/site';

type Props = { params: Promise<{ locale: string; slug: string }> };

// Prégénère une page pour chaque service (SSG), combinée aux locales du parent.
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: getContenu(service.name, locale),
    description: getContenu(service.short, locale)
  };
}

/** Page détail d'un service : description longue, déroulé, réservation (PROMPT 5). */
export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const t = await getTranslations('services');
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      {/* En-tête du service */}
      <section className="border-b border-ink-100 bg-gradient-to-b from-primary-50 via-sand-50 to-white">
        <Container className="py-10 sm:py-14">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4 rtl-flip" />
            {t('detail.back')}
          </Link>

          <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
            <ServiceIconBadge icon={service.icon} className="h-16 w-16" />
            <div>
              <h1 className="text-display-sm font-display text-ink-900">
                {getContenu(service.name, locale)}
              </h1>
              <p className="mt-2 max-w-2xl text-lg leading-relaxed text-ink-600">
                {getContenu(service.short, locale)}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Contenu détaillé + carte de réservation */}
      <Section tone="default">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl text-ink-900">{t('detail.aboutTitle')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              {getContenu(service.long, locale)}
            </p>

            <div className="my-8 relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-2 border-ink-100 shadow-soft">
              <Image
                src="/images/hero-dentist-treatment.jpg"
                alt={getContenu(service.name, locale)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>

            <h2 className="mt-10 font-display text-2xl text-ink-900">{t('detail.expectTitle')}</h2>
            <ol className="mt-6 space-y-4">
              {service.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                    {i + 1}
                  </span>
                  <p className="pt-1 leading-relaxed text-ink-700">{getContenu(step, locale)}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Carte de réservation (préremplit le motif) */}
          <aside className="lg:col-span-1">
            <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card lg:sticky lg:top-24">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-ink-500">{t('detail.durationLabel')}</p>
                  <p className="text-lg font-semibold text-ink-900">
                    {t('detail.durationValue', { min: service.durationMin })}
                  </p>
                </div>
              </div>

              <Link
                href={`/reservation?motif=${service.slug}`}
                className={buttonVariants({ size: 'lg', className: 'mt-6 w-full' })}
              >
                <CalendarCheck className="h-5 w-5" />
                {t('detail.book')}
              </Link>
              <a
                href={`tel:${siteConfig.phoneHref}`}
                className={buttonVariants({ variant: 'ghost', className: 'mt-2 w-full' })}
              >
                <Phone className="h-5 w-5" />
                {t('detail.callCta')}
              </a>

              <p className="mt-4 text-sm leading-relaxed text-ink-500">{t('detail.reassure')}</p>
            </div>
          </aside>
        </div>
      </Section>

      {/* Autres soins */}
      <Section tone="muted">
        <h2 className="font-display text-2xl text-ink-900">{t('detail.otherTitle')}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((s) => (
            <Card key={s.slug} interactive className="h-full">
              <CardBody className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-3">
                  <ServiceIconBadge icon={s.icon} />
                  <Badge variant="neutral">
                    <Clock className="h-3.5 w-3.5" />
                    {t('durationLabel', { min: s.durationMin })}
                  </Badge>
                </div>
                <CardTitle className="mt-5">{getContenu(s.name, locale)}</CardTitle>
                <CardDescription className="flex-1">{getContenu(s.short, locale)}</CardDescription>
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  {t('learnMore')}
                  <ArrowRight className="h-4 w-4 rtl-flip" />
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/services" className={buttonVariants({ variant: 'outline' })}>
            {t('detail.viewAll')}
            <ArrowRight className="h-5 w-5 rtl-flip" />
          </Link>
        </div>
      </Section>
    </>
  );
}
