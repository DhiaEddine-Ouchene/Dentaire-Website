import { Header } from '@/components/public/header';
import { Footer } from '@/components/public/footer';
import { WhatsappFab } from '@/components/public/whatsapp-fab';

// Layout de l'espace public : en-tête collant, contenu, pied de page, bouton WhatsApp.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappFab />
    </div>
  );
}
