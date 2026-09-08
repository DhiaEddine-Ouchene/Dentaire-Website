import { getTranslations } from 'next-intl/server';
import { Award, ShieldCheck, Microscope, HeartHandshake } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui';

/** Section « confiance » : les 4 raisons clés de choisir le cabinet. */
export async function TrustSection() {
  const t = await getTranslations('home.trust');

  const items = [
    { icon: Award, title: t('experienceTitle'), text: t('experienceText') },
    { icon: ShieldCheck, title: t('insuranceTitle'), text: t('insuranceText') },
    { icon: Microscope, title: t('technologyTitle'), text: t('technologyText') },
    { icon: HeartHandshake, title: t('comfortTitle'), text: t('comfortText') }
  ];

  return (
    <Section tone="warm">
      <SectionHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        centered
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-card"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <h3 className="mt-5 font-display text-lg text-ink-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
