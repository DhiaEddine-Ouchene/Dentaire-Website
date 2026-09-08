import { getTranslations } from 'next-intl/server';
import { Phone, MessageCircle, CalendarClock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Container, Section } from '@/components/ui';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig, whatsappLink } from '@/config/site';

export async function generateMetadata() {
  const t = await getTranslations('cancellation');
  // Lien personnel : ne pas indexer.
  return { title: t('title'), robots: { index: false, follow: false } };
}

/**
 * Gestion/annulation d'un rendez-vous via jeton personnel (PROMPT 8).
 * Tant que la base n'est pas branchée, on affiche la référence et on oriente
 * vers un contact direct ; l'annulation en un clic arrivera avec Prisma.
 */
export default async function CancellationPage({
  params
}: {
  params: Promise<{ jeton: string }>;
}) {
  const t = await getTranslations('cancellation');
  const { jeton } = await params;

  return (
    <Section tone="default">
      <Container className="max-w-xl">
        <div className="rounded-3xl border border-ink-200 bg-white p-8 text-center shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <CalendarClock className="h-9 w-9" strokeWidth={1.75} />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-ink-900">{t('title')}</h1>
          <p className="mt-2 text-ink-600">{t('lead')}</p>

          <p className="mt-6 text-xs uppercase tracking-wider text-ink-400">{t('reference')}</p>
          <p className="mt-1 break-all font-mono text-sm text-ink-700">{jeton}</p>

          <p className="mt-6 rounded-2xl bg-ink-50 px-4 py-4 text-sm leading-relaxed text-ink-600">
            {t('notReady')}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className={buttonVariants({ variant: 'primary', size: 'lg' })}
            >
              <Phone className="h-5 w-5" />
              {t('callCta')}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              <MessageCircle className="h-5 w-5" />
              {t('whatsappCta')}
            </a>
          </div>

          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-primary-700 underline-offset-4 hover:underline"
          >
            {t('home')}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
