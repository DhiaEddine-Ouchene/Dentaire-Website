import { getTranslations } from 'next-intl/server';
import { ArrowRight, Star, CalendarCheck, Smile } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Container, buttonVariants } from '@/components/ui';
import { cn } from '@/lib/utils';

/** Section héro de la page d'accueil : accroche, CTA, statistiques, visuel. */
export async function Hero() {
  const t = await getTranslations('home.hero');

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-sand-50 to-white">
      {/* Blobs décoratifs */}
      <div className="pointer-events-none absolute -top-24 -end-24 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -start-24 h-96 w-96 rounded-full bg-accent-100/50 blur-3xl" />

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Colonne texte */}
          <div className="text-center lg:text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-primary-700 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {t('badge')}
            </span>

            <h1 className="mt-6 text-display font-display text-ink-900">{t('title')}</h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-600 lg:mx-0">
              {t('subtitle')}
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <Link href="/reservation" className={cn(buttonVariants({ size: 'lg' }))}>
                <CalendarCheck className="h-5 w-5" />
                {t('ctaPrimary')}
              </Link>
              <Link
                href="/services"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                {t('ctaSecondary')}
                <ArrowRight className="h-5 w-5 rtl-flip" />
              </Link>
            </div>

            {/* Statistiques */}
            <dl className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-4 lg:mx-0">
              {stats.map((s) => (
                <div key={s.label} className="text-center lg:text-start">
                  <dt className="text-2xl font-bold text-primary-700 sm:text-3xl">{s.value}</dt>
                  <dd className="mt-1 text-sm text-ink-600">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Colonne visuelle */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-4xl shadow-lifted border-4 border-white">
              <Image
                src="/images/hero-dentist.jpg"
                alt="Dr. Amine Mansouri — Cabinet Dentaire Le Sourire"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Carte flottante : note */}
            <div className="absolute -bottom-5 -start-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card sm:-start-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                <Star className="h-5 w-5" fill="currentColor" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none text-ink-900">4,9/5</p>
                <div className="mt-1 flex gap-0.5 text-accent-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>

            {/* Carte flottante : disponibilité */}
            <div className="absolute -top-4 -end-2 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-card sm:-end-4">
              <span className="flex h-2.5 w-2.5 rounded-full bg-success" />
              <p className="text-sm font-semibold text-ink-800">
                {t('badge')}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
