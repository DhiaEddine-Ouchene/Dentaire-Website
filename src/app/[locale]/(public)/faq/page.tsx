import { getTranslations, getLocale } from 'next-intl/server';
import { Baby, Frown, HelpCircle, Phone, Plus, Siren, Wallet, type LucideIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Container, Section } from '@/components/ui';
import { buttonVariants } from '@/components/ui/button';
import { faqItems, type FaqCategory } from '@/data/faq';
import { getContenu } from '@/lib/i18n-content';
import { siteConfig } from '@/config/site';

export async function generateMetadata() {
  const t = await getTranslations('faq');
  return { title: t('hero.title'), description: t('hero.description') };
}

/** Ordre d'affichage des catégories + icône associée. */
const categoryOrder: FaqCategory[] = ['pain', 'price', 'children', 'emergency', 'general'];
const categoryIcons: Record<FaqCategory, LucideIcon> = {
  pain: Frown,
  price: Wallet,
  children: Baby,
  emergency: Siren,
  general: HelpCircle
};

/**
 * Page FAQ (PROMPT 9) : questions/réponses en accordéon, regroupées par thème
 * (douleur, prix, enfants, urgences, général). Contenu trilingue via `faqItems`.
 */
export default async function FaqPage() {
  const t = await getTranslations('faq');
  const locale = await getLocale();

  return (
    <>
      {/* Hero */}
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

      {/* Catégories */}
      <Section tone="default">
        <div className="mx-auto max-w-3xl space-y-12">
          {categoryOrder.map((category) => {
            const items = faqItems.filter((f) => f.category === category);
            if (items.length === 0) return null;
            const Icon = categoryIcons[category];

            return (
              <div key={category}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h2 className="font-display text-xl text-ink-900 sm:text-2xl">
                    {t(`categories.${category}`)}
                  </h2>
                </div>

                <div className="space-y-3">
                  {items.map((f) => {
                    const question = getContenu(f.question, locale);
                    return (
                      <details
                        key={question}
                        className="group rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition-shadow open:shadow-card [&_summary::-webkit-details-marker]:hidden"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-start font-semibold text-ink-900">
                          {question}
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-transform duration-300 group-open:rotate-45">
                            <Plus className="h-4 w-4" />
                          </span>
                        </summary>
                        <p className="mt-3 leading-relaxed text-ink-600">
                          {getContenu(f.answer, locale)}
                        </p>
                      </details>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Encore une question ? */}
      <Section tone="muted">
        <div className="mx-auto max-w-2xl rounded-4xl border border-ink-100 bg-white p-8 text-center shadow-card sm:p-12">
          <h2 className="font-display text-2xl text-ink-900">{t('stillQuestion.title')}</h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-ink-600">
            {t('stillQuestion.description')}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/contact" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
              {t('stillQuestion.contactCta')}
            </Link>
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              <Phone className="h-5 w-5" />
              {t('stillQuestion.callCta')}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
