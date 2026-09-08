import { getTranslations, getLocale } from 'next-intl/server';
import { ArrowRight, Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Section, SectionHeading, buttonVariants } from '@/components/ui';
import { faqItems } from '@/data/faq';
import { getContenu } from '@/lib/i18n-content';

/**
 * FAQ courte (accordéon natif <details>, sans JS) — questions mises en avant.
 */
export async function FaqPreview() {
  const t = await getTranslations('home.faq');
  const locale = await getLocale();
  const items = faqItems.filter((f) => f.featured).slice(0, 5);

  return (
    <Section tone="default">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
          centered
        />

        <div className="mt-10 space-y-3">
          {items.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition-shadow open:shadow-card [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-start font-semibold text-ink-900">
                {getContenu(f.question, locale)}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-transform duration-300 group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink-600">{getContenu(f.answer, locale)}</p>
            </details>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/faq" className={buttonVariants({ variant: 'ghost' })}>
            {t('viewAll')}
            <ArrowRight className="h-5 w-5 rtl-flip" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
