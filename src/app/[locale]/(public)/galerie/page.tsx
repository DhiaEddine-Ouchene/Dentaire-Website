import { getTranslations } from 'next-intl/server';
import { CalendarCheck, Info } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Container, Section, buttonVariants } from '@/components/ui';
import { GalleryGrid } from '@/components/gallery/gallery-grid';

export async function generateMetadata() {
  const t = await getTranslations('gallery.hero');
  return { title: t('title'), description: t('description') };
}

/** Page galerie avant/après avec filtres par traitement (PROMPT 6). */
export default async function GalleryPage() {
  const t = await getTranslations('gallery');

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

      {/* Galerie filtrable */}
      <Section tone="default">
        <GalleryGrid />

        {/* Avertissement déontologique */}
        <div className="mx-auto mt-12 flex max-w-2xl items-start gap-3 rounded-2xl bg-ink-50 p-4 text-sm leading-relaxed text-ink-500">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />
          <p>{t('disclaimer')}</p>
        </div>

        {/* Appel à l'action */}
        <div className="mt-8 text-center">
          <Link href="/reservation" className={buttonVariants({ size: 'lg' })}>
            <CalendarCheck className="h-5 w-5" />
            {t('cta')}
          </Link>
        </div>
      </Section>
    </>
  );
}
