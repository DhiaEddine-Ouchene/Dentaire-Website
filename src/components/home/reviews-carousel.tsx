'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui';
import { reviews, averageRating } from '@/data/reviews';
import { getContenu } from '@/lib/i18n-content';
import { cn } from '@/lib/utils';

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn('flex gap-0.5 text-accent-500', className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4" fill={i < rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
      ))}
    </div>
  );
}

/** Carrousel d'avis Google (démo) — autodéfilement + navigation manuelle. */
export function ReviewsCarousel() {
  const t = useTranslations('home.reviews');
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const count = reviews.length;

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count]);

  const review = reviews[index];
  const dateLabel = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(
    new Date(review.date)
  );

  return (
    <Section tone="warm">
      <SectionHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        centered
      />

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <Stars rating={5} />
        <span className="text-sm font-medium text-ink-600">
          {averageRating.toLocaleString(locale)} · {t('basedOn', { count })}
        </span>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <div className="rounded-3xl bg-white p-8 shadow-card sm:p-10">
          <Quote className="h-9 w-9 text-primary-200 rtl-flip" fill="currentColor" />
          <Stars rating={review.rating} className="mt-4" />
          <blockquote className="mt-4 text-lg leading-relaxed text-ink-700">
            {getContenu(review.text, locale)}
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700">
              {review.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-ink-900">{review.author}</p>
              <p className="text-sm text-ink-500">{dateLabel}</p>
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={t('previous')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-600"
          >
            <ChevronLeft className="h-5 w-5 rtl-flip" />
          </button>

          <div className="flex items-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t('goTo', { index: i + 1 })}
                aria-current={i === index}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === index ? 'w-6 bg-primary-600' : 'w-2 bg-ink-200 hover:bg-ink-300'
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={t('next')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-600"
          >
            <ChevronRight className="h-5 w-5 rtl-flip" />
          </button>
        </div>
      </div>
    </Section>
  );
}
