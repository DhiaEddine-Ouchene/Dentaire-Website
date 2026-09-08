import { getTranslations, getLocale } from 'next-intl/server';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import {
  Section,
  SectionHeading,
  Card,
  CardBody,
  CardTitle,
  CardDescription,
  Badge,
  buttonVariants
} from '@/components/ui';
import { ServiceIconBadge } from '@/components/public/service-icon';
import { services } from '@/data/services';
import { getContenu } from '@/lib/i18n-content';

/** Aperçu des services en grille (les 6 mis en avant). */
export async function ServicesPreview() {
  const t = await getTranslations('home.services');
  const locale = await getLocale();
  const featured = services.filter((s) => s.featured).slice(0, 6);

  return (
    <Section tone="default">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
        <Link
          href="/services"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 md:inline-flex"
        >
          {t('viewAll')}
          <ArrowRight className="h-4 w-4 rtl-flip" />
        </Link>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((s) => (
          <Card key={s.slug} interactive>
            <CardBody className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <ServiceIconBadge icon={s.icon} />
                <Badge variant="neutral">
                  <Clock className="h-3.5 w-3.5" />
                  {t('durationLabel', { min: s.durationMin })}
                </Badge>
              </div>
              <CardTitle className="mt-5 text-lg">{getContenu(s.name, locale)}</CardTitle>
              <CardDescription className="flex-1 text-sm">
                {getContenu(s.short, locale)}
              </CardDescription>
              <Link
                href={`/services/${s.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                {t('learnMore')}
                <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link href="/services" className={buttonVariants({ variant: 'outline' })}>
          {t('viewAll')}
        </Link>
      </div>
    </Section>
  );
}
