import { getTranslations, getLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Section, SectionHeading, buttonVariants } from '@/components/ui';
import { galleryCases } from '@/data/gallery';
import { GalleryPreviewCards } from './gallery-preview-cards';

/** Aperçu galerie avant/après (3 cas mis en avant) avec curseur interactif. */
export async function GalleryPreview() {
  const t = await getTranslations('home.gallery');
  const locale = await getLocale();
  const cases = galleryCases.filter((c) => c.featured).slice(0, 3);

  return (
    <Section tone="muted">
      <SectionHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        centered
      />

      <GalleryPreviewCards
        cases={cases}
        locale={locale}
        labelBefore={t('before')}
        labelAfter={t('after')}
      />

      <div className="mt-10 text-center">
        <Link href="/galerie" className={buttonVariants({ variant: 'outline' })}>
          {t('viewAll')}
          <ArrowRight className="h-5 w-5 rtl-flip" />
        </Link>
      </div>
    </Section>
  );
}
