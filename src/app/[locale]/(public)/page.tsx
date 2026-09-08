import { Hero } from '@/components/home/hero';
import { TrustSection } from '@/components/home/trust-section';
import { ServicesPreview } from '@/components/home/services-preview';
import { GalleryPreview } from '@/components/home/gallery-preview';
import { ReviewsCarousel } from '@/components/home/reviews-carousel';
import { ReviewSubmissionSection } from '@/components/home/review-submission';
import { FaqPreview } from '@/components/home/faq-preview';
import { CtaSection } from '@/components/home/cta-section';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { getLocale } from 'next-intl/server';

// Page d'accueil — vitrine du cabinet (PROMPT 4).
export default async function HomePage() {
  const locale = await getLocale();

  return (
    <>
      <Hero />
      <TrustSection />
      <ServicesPreview />
      <GalleryPreview />
      <ReviewsCarousel />

      {/* Section pour laisser un avis - visible pour les visiteurs */}
      <Section className="bg-ink-50 py-16">
        <Container>
          <ReviewSubmissionSection locale={locale} />
        </Container>
      </Section>

      <FaqPreview />
      <CtaSection />
    </>
  );
}
