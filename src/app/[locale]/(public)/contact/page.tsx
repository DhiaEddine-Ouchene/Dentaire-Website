import { getTranslations } from 'next-intl/server';
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { Container, Section } from '@/components/ui';
import { buttonVariants } from '@/components/ui/button';
import { ContactForm } from '@/components/contact/contact-form';
import { siteConfig, whatsappLink, mapEmbedUrl, mapDirectionsUrl } from '@/config/site';
import { sendContactMessage } from './actions';

export async function generateMetadata() {
  const t = await getTranslations('contact');
  return { title: t('hero.title'), description: t('hero.description') };
}

/**
 * Page Contact (PROMPT 9) : coordonnées, formulaire simple, horaires et carte.
 * `tDays` traduit les jours (namespace `days`), distinct du namespace `contact`.
 */
export default async function ContactPage() {
  const t = await getTranslations('contact');
  const tDays = await getTranslations('days');

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

      {/* Formulaire + coordonnées */}
      <Section tone="default">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ContactForm submit={sendContactMessage} />

          <div className="space-y-6">
            {/* Coordonnées */}
            <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="text-xl font-semibold text-ink-900">{t('info.title')}</h2>
              <ul className="mt-6 space-y-5">
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <MapPin className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-500">{t('info.addressLabel')}</p>
                    <p className="mt-0.5 text-ink-800">
                      {siteConfig.address}
                      <br />
                      {siteConfig.postalCode} {siteConfig.city}, {siteConfig.country}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Phone className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-500">{t('info.phoneLabel')}</p>
                    <a
                      href={`tel:${siteConfig.phoneHref}`}
                      dir="ltr"
                      className="mt-0.5 inline-block text-ink-800 transition-colors hover:text-primary-700"
                    >
                      {siteConfig.phoneDisplay}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Mail className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-500">{t('info.emailLabel')}</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="mt-0.5 inline-block break-all text-ink-800 transition-colors hover:text-primary-700"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </li>
              </ul>

              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'outline', size: 'md', className: 'mt-6 w-full' })}
              >
                <MessageCircle className="h-5 w-5" />
                {t('info.whatsappCta')}
              </a>
            </div>

            {/* Horaires */}
            <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Clock className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h2 className="text-xl font-semibold text-ink-900">{t('info.hoursTitle')}</h2>
              </div>
              <dl className="mt-6 divide-y divide-ink-100">
                {siteConfig.hours.map((h) => (
                  <div key={h.day} className="flex items-center justify-between py-2.5">
                    <dt className="text-ink-700">{tDays(h.day)}</dt>
                    <dd className={'closed' in h ? 'text-ink-400' : 'font-medium text-ink-900'}>
                      {'closed' in h ? t('closed') : <span dir="ltr">{`${h.open} – ${h.close}`}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Section>

      {/* Carte */}
      <Section tone="muted">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl text-ink-900">{t('mapTitle')}</h2>
          <a
            href={mapDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'ghost', size: 'md' })}
          >
            <Navigation className="h-5 w-5" />
            {t('info.directions')}
          </a>
        </div>
        <div className="mt-6 overflow-hidden rounded-4xl border border-ink-100 shadow-card">
          <iframe
            src={mapEmbedUrl}
            title={t('mapTitle')}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[380px] w-full border-0"
          />
        </div>
      </Section>
    </>
  );
}
