'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { LoginState } from './actions';

type LoginAction = (state: LoginState, formData: FormData) => Promise<LoginState>;

const initialState: LoginState = { error: null };

/**
 * Formulaire de connexion admin.
 * La server action est injectée en prop (même motif que la réservation / le contact),
 * puis pilotée par `useActionState` pour l'état d'erreur et le statut « en cours ».
 */
export function LoginForm({ action }: { action: LoginAction }) {
  const t = useTranslations('admin.login');
  const [state, formAction, pending] = useActionState(action, initialState);

  const errorMessage = state.error ? t(`errors.${state.error.toLowerCase()}`) : null;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <Input
        name="email"
        type="email"
        label={t('email')}
        placeholder={t('emailPlaceholder')}
        autoComplete="email"
        required
        dir="ltr"
      />
      <Input
        name="password"
        type="password"
        label={t('password')}
        autoComplete="current-password"
        required
        dir="ltr"
      />

      {errorMessage && (
        <p
          role="alert"
          className="rounded-2xl border border-error-light bg-error-light/50 px-4 py-3 text-sm text-error-dark"
        >
          {errorMessage}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        <LogIn className="h-5 w-5" />
        {pending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
