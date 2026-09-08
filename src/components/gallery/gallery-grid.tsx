'use client';

import { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, ImageComparisonSlider } from '@/components/ui';
import { galleryCases, type GalleryCategory } from '@/data/gallery';
import { getContenu } from '@/lib/i18n-content';
import { cn } from '@/lib/utils';

type Filter = 'all' | GalleryCategory;

// Ordre d'affichage des onglets ; on ne montre que ceux qui ont des cas.
const CATEGORY_ORDER: GalleryCategory[] = ['whitening', 'ortho', 'implant', 'aesthetic'];

/** Galerie avant/après avec curseur interactif de comparaison (PROMPT 6). */
export function GalleryGrid() {
  const t = useTranslations('gallery');
  const locale = useLocale();
  const [filter, setFilter] = useState<Filter>('all');

  // Catégories réellement présentes dans les données.
  const categories = useMemo(
    () => CATEGORY_ORDER.filter((c) => galleryCases.some((g) => g.category === c)),
    []
  );

  const filtered = useMemo(
    () => (filter === 'all' ? galleryCases : galleryCases.filter((c) => c.category === filter)),
    [filter]
  );

  const tabs: Filter[] = ['all', ...categories];

  return (
    <div>
      {/* Onglets de filtre */}
      <div
        role="tablist"
        aria-label={t('hero.title')}
        className="flex flex-wrap justify-center gap-2"
      >
        {tabs.map((tab) => {
          const active = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(tab)}
              className={cn(
                'rounded-full px-5 py-2.5 text-sm font-semibold transition-colors',
                active
                  ? 'bg-primary-600 text-white shadow-soft'
                  : 'bg-white text-ink-600 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 hover:text-ink-900'
              )}
            >
              {t(`filters.${tab}`)}
            </button>
          );
        })}
      </div>

      {/* Grille responsive 1 → 2 → 3 colonnes */}
      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.id} className="overflow-hidden group flex flex-col shadow-card hover:shadow-lifted transition-shadow duration-300">
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-ink-100">
                <ImageComparisonSlider
                  leftImage={c.imageBefore}
                  rightImage={c.imageAfter}
                  altLeft={`${getContenu(c.title, locale)} - ${t('before')}`}
                  altRight={`${getContenu(c.title, locale)} - ${t('after')}`}
                  labelLeft={t('before')}
                  labelRight={t('after')}
                  initialPosition={50}
                  className="h-full w-full"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                  {t(`filters.${c.category}`)}
                </span>
                <h3 className="mt-1.5 font-display text-lg text-ink-900">
                  {getContenu(c.title, locale)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {getContenu(c.description, locale)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-ink-500">{t('empty')}</p>
      )}
    </div>
  );
}
