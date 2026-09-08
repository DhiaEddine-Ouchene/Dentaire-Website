'use server';

import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { routing } from '@/i18n/routing';

/**
 * Connexion admin (PROMPT 10) — Supabase Auth par e-mail / mot de passe.
 * L'espace patient reste anonyme : cette authentification ne concerne que le praticien.
 */

const loginInput = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

export type LoginErrorCode = 'VALIDATION' | 'CREDENTIALS' | 'CONFIG';
export type LoginState = { error: LoginErrorCode | null };

/** Redirige vers le tableau de bord en conservant la langue courante. */
async function dashboardPath(): Promise<string> {
  let locale: string = routing.defaultLocale;
  try {
    locale = await getLocale();
  } catch {
    // Contexte de langue indisponible : on retombe sur la langue par défaut.
  }
  return locale === routing.defaultLocale ? '/admin' : `/${locale}/admin`;
}

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginInput.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });
  if (!parsed.success) {
    return { error: 'VALIDATION' };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: 'CONFIG' };
  }

  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) {
      return { error: 'CREDENTIALS' };
    }
  } catch {
    // Supabase injoignable (identifiants factices, réseau…) : message générique.
    return { error: 'CREDENTIALS' };
  }

  // Succès : la session (cookie) est posée par le client serveur. On rejoint le dashboard.
  redirect(await dashboardPath());
}
