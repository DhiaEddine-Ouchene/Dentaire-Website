import { getTranslations } from 'next-intl/server';
import { Stethoscope } from 'lucide-react';
import { LoginForm } from './login-form';
import { signIn } from './actions';

export async function generateMetadata() {
  const t = await getTranslations('admin.login');
  return { title: t('title'), robots: { index: false, follow: false } };
}

/**
 * Page de connexion admin (PROMPT 10) — unique porte d'entrée de l'espace praticien.
 * Rendue hors du groupe (public) : ni en-tête, ni pied de page publics.
 */
export default async function AdminLoginPage() {
  const t = await getTranslations('admin.login');

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-50 via-sand-50 to-white px-4 py-12">
      <div className="w-full max-w-md">
        {/* Marque */}
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-soft">
            <Stethoscope className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-primary-600">
            {t('brand')}
          </p>
        </div>

        <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
          <h1 className="text-2xl font-semibold text-ink-900">{t('title')}</h1>
          <p className="mt-2 text-ink-600">{t('subtitle')}</p>

          <div className="mt-6">
            <LoginForm action={signIn} />
          </div>
        </div>
      </div>
    </main>
  );
}
