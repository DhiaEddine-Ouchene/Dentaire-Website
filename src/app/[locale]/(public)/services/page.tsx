import { getTranslations, getLocale } from 'next-intl/server';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import {
  Container,
  Section,
  Card,
  CardBody,
  CardTitle,
  CardDescription,
  Badge
} from '@/components/ui';
import { ServiceIconBadge } from '@/components/public/service-icon';
import { services } from '@/data/services';
import { getContenu } from '@/lib/i18n-content';

export async function generateMetadata() {
  const t = await getTranslations('services.hero');
  return { title: t('title'), description: t('description') };
}

/** Page listant tous les services du cabinet — grille de cartes (PROMPT 5). */
export default async function ServicesPage() {
  const t = await getTranslations('services');
  const locale = await getLocale();

  return (
    <>
      {/* En-tête de page */}
      <section className="border-b border-ink-100 bg-gradient-to-b from-primary-50 via-sand-50 to-white">
        <Container className="py-14 text-center sm:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-600">
            {t('hero.eyebrow')}
          </p>
          <h1 className="text-display-sm font-display text-ink-900">{t('hero.title')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
            {t('hero.description')}
          </p>
        </Container>
      </section>

      {/* Grille de services */}
      <Section tone="default">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
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
      </Section>
    </>
  );
}
