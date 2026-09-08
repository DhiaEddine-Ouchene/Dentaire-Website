import { getTranslations } from 'next-intl/server';
import {
  CheckCircle2,
  Ear,
  Feather,
  FileText,
  Microscope,
  UserRound,
  type LucideIcon
} from 'lucide-react';
import Image from 'next/image';
import { Container, Section, SectionHeading } from '@/components/ui';
import { CtaSection } from '@/components/home/cta-section';

export async function generateMetadata() {
  const t = await getTranslations('about');
  return { title: t('hero.title'), description: t('hero.description') };
}

/** Valeurs de la philosophie de soin — icônes alignées sur l'ordre des messages. */
const valueIcons: LucideIcon[] = [Ear, Feather, FileText, Microscope];

/**
 * Page « À propos » (PROMPT 9) : portrait du dentiste, parcours et philosophie.
 * Contenu de démonstration réaliste, entièrement piloté par les traductions.
 */
export default async function AboutPage() {
  const t = await getTranslations('about');

  const highlights = t.raw('intro.highlights') as string[];
  const journey = t.raw('journey.items') as { year: string; title: string; text: string }[];
  const values = t.raw('philosophy.values') as { title: string; text: string }[];

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

      {/* Portrait + biographie */}
      <Section tone="default">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-4xl border-4 border-white shadow-lifted">
            <Image
              src="/images/hero-dentist.jpg"
              alt={t('intro.name')}
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <span className="absolute bottom-4 start-4 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-ink-800 backdrop-blur shadow-sm">
              {t('intro.name')} — {t('intro.role')}
            </span>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">{t('intro.name')}</h2>
            <p className="mt-1 text-primary-600">{t('intro.role')}</p>

            <p className="mt-6 leading-relaxed text-ink-600">{t('intro.p1')}</p>
            <p className="mt-4 leading-relaxed text-ink-600">{t('intro.p2')}</p>

            <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-ink-500">
              {t('intro.highlightsTitle')}
            </p>
            <ul className="mt-4 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" strokeWidth={2} />
                  <span className="text-ink-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Parcours (frise verticale) */}
      <Section tone="muted">
        <SectionHeading
          eyebrow={t('journey.eyebrow')}
          title={t('journey.title')}
          centered
        />
        <ol className="mx-auto mt-12 max-w-2xl">
          {journey.map((item, index) => (
            <li key={item.year} className="flex gap-5">
              <div className="flex flex-col items-center">
                <span className="inline-flex h-14 min-w-[3.5rem] items-center justify-center rounded-2xl bg-primary-500 px-3 text-sm font-bold text-white">
                  {item.year}
                </span>
                {index < journey.length - 1 && <span className="w-px flex-1 bg-ink-200" />}
              </div>
              <div className={index < journey.length - 1 ? 'pb-10' : ''}>
                <h3 className="text-lg font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Visite du cabinet & Notre équipe */}
      <Section tone="muted">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-4xl border-4 border-white shadow-lifted">
            <Image
              src="/images/clinic-reception.jpg"
              alt={t('spaces.clinicTitle')}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white">
                <span className="rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  {t('spaces.clinicBadge')}
                </span>
                <h3 className="mt-2 text-lg sm:text-xl font-bold leading-snug">{t('spaces.clinicTitle')}</h3>
              </div>
            </div>
          </div>

          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-4xl border-4 border-white shadow-lifted">
            <Image
              src="/images/clinic-team.jpg"
              alt={t('spaces.teamTitle')}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white">
                <span className="rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  {t('spaces.teamBadge')}
                </span>
                <h3 className="mt-2 text-lg sm:text-xl font-bold leading-snug">{t('spaces.teamTitle')}</h3>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Philosophie de soin */}
      <Section tone="default">
        <SectionHeading
          eyebrow={t('philosophy.eyebrow')}
          title={t('philosophy.title')}
          description={t('philosophy.description')}
          centered
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = valueIcons[index] ?? Feather;
            return (
              <div
                key={value.title}
                className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink-900">{value.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{value.text}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
