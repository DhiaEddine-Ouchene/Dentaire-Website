'use client';

import { Card, ImageComparisonSlider } from '@/components/ui';
import type { GalleryCase } from '@/data/gallery';
import { getContenu } from '@/lib/i18n-content';

export function GalleryPreviewCards({
  cases,
  locale,
  labelBefore,
  labelAfter
}: {
  cases: GalleryCase[];
  locale: string;
  labelBefore: string;
  labelAfter: string;
}) {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cases.map((c) => (
        <Card
          key={c.id}
          className="overflow-hidden group flex flex-col shadow-card hover:shadow-lifted transition-shadow duration-300"
        >
          <div className="relative aspect-[16/11] w-full overflow-hidden bg-ink-100">
            <ImageComparisonSlider
              leftImage={c.imageBefore}
              rightImage={c.imageAfter}
              altLeft={`${getContenu(c.title, locale)} - ${labelBefore}`}
              altRight={`${getContenu(c.title, locale)} - ${labelAfter}`}
              labelLeft={labelBefore}
              labelRight={labelAfter}
              initialPosition={50}
              className="h-full w-full"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-display text-lg text-ink-900">{getContenu(c.title, locale)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {getContenu(c.description, locale)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
