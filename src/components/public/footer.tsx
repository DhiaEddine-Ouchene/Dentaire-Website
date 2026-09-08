import { getTranslations } from 'next-intl/server';
import { MapPin, Phone, Mail, MessageCircle, Navigation, Facebook, Instagram } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { mainNav } from '@/config/nav';
import { siteConfig, whatsappLink, mapEmbedUrl, mapDirectionsUrl } from '@/config/site';
import { Logo } from './logo';

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="bg-primary-900 text-primary-100">
      <div className="mx-auto w-full max-w-[1320px] px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marque + WhatsApp + réseaux */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo theme="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-200">
              {t('footer.tagline')}
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="h-4 w-4" fill="currentColor" />
              {t('footer.whatsapp')}
            </a>
            <div className="mt-5 flex gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.quickLinks')}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {mainNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-primary-200 transition-colors hover:text-white"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/retrouver-rendez-vous"
                  className="text-sm text-primary-200 transition-colors hover:text-white"
                >
                  {t('common.manageAppointment')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.contact')}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-300" />
                <span className="text-primary-200">
                  {siteConfig.address}
                  <br />
                  {siteConfig.postalCode} {siteConfig.city}, {siteConfig.country}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary-300" />
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="text-primary-200 transition-colors hover:text-white"
                  dir="ltr"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-primary-300" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="break-all text-primary-200 transition-colors hover:text-white"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-300 transition-colors hover:text-white"
                >
                  <Navigation className="h-4 w-4" />
                  {t('footer.directions')}
                </a>
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.hours')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {siteConfig.hours.map((h) => (
                <li key={h.day} className="flex items-center justify-between gap-4">
                  <span className="text-primary-200">{t(`days.${h.day}`)}</span>
                  {'closed' in h ? (
                    <span className="text-primary-400">{t('footer.closed')}</span>
                  ) : (
                    <span className="font-medium text-white" dir="ltr">
                      {h.open} – {h.close}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Carte */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-white/10">
          <iframe
            src={mapEmbedUrl}
            title={siteConfig.name}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-56 w-full border-0 grayscale-[15%]"
          />
        </div>
      </div>

      {/* Barre inférieure */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center justify-between gap-2 px-5 py-6 text-sm text-primary-300 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {t('footer.rights')}
          </p>
          <p>{siteConfig.dentistName}</p>
        </div>
      </div>
    </footer>
  );
}
