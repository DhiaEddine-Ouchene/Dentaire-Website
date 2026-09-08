import { MessageCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { whatsappLink } from '@/config/site';

/** Bouton WhatsApp flottant (coin bas, adapté RTL). */
export async function WhatsappFab() {
  const t = await getTranslations('footer');
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp')}
      className="fixed bottom-5 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lifted transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}
