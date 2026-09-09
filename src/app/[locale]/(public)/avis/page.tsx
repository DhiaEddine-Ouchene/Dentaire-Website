import { getLocale } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ReviewForm } from '@/components/public/review-form';
import { prisma } from '@/lib/prisma';
import { getContenu } from '@/lib/i18n-content';
import { Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const titles = {
    fr: 'Avis et Témoignages',
    ar: 'الآراء والشهادات',
    en: 'Reviews & Testimonials'
  };
  return { title: titles[locale as keyof typeof titles] || titles.fr };
}

export default async function AvisPage() {
  const locale = await getLocale();

  // Récupérer les avis publiés
  const publishedReviews = await prisma.avis.findMany({
    where: { statut: 'PUBLIE' },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  const labels = {
    pageTitle: {
      fr: 'Avis de nos patients',
      ar: 'آراء مرضانا',
      en: 'Patient Reviews'
    },
    pageSubtitle: {
      fr: 'Découvrez ce que nos patients disent de leur expérience',
      ar: 'اكتشف ما يقوله مرضانا عن تجربتهم',
      en: 'See what our patients say about their experience'
    },
    noReviews: {
      fr: 'Aucun avis publié pour le moment',
      ar: 'لا توجد آراء منشورة حاليًا',
      en: 'No reviews published yet'
    }
  };

  const t = (key: keyof typeof labels) => labels[key][locale as keyof typeof labels.pageTitle] || labels[key].fr;

  return (
    <Section className="py-16">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">{t('pageTitle')}</h1>
            <p className="mt-3 text-lg text-ink-600">{t('pageSubtitle')}</p>
          </div>

          <div className="mb-16">
            <ReviewForm locale={locale} />
          </div>

          <div className="space-y-6">
            {publishedReviews.length === 0 ? (
              <div className="rounded-2xl border border-ink-100 bg-ink-50 p-8 text-center text-ink-600">
                {t('noReviews')}
              </div>
            ) : (
              publishedReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-ink-900">{review.auteur}</h3>
                      <div className="mt-1 flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.note
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-none text-ink-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <time className="text-xs text-ink-500">
                      {new Date(review.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR')}
                    </time>
                  </div>
                  {review.commentaire && (
                    <p className="mt-3 text-sm text-ink-700 leading-relaxed">{review.commentaire}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
