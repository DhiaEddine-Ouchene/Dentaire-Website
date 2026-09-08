import { getTranslations } from 'next-intl/server';
import { CalendarCheck, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui';
import { siteConfig } from '@/config/site';

/** Bandeau d'appel à l'action final (fond primaire, contraste fort). */
export async function CtaSection() {
  const t = await getTranslations('home.cta');

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-14 text-center shadow-lifted sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -top-16 -end-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -start-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-display-sm font-display text-white">{t('title')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-primary-100">{t('description')}</p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-primary-700 shadow-soft transition-transform hover:scale-[1.02]"
              >
                <CalendarCheck className="h-5 w-5" />
                {t('primary')}
              </Link>
              <a
                href={`tel:${siteConfig.phoneHref}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/70 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Phone className="h-5 w-5" />
                {t('secondary')}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
