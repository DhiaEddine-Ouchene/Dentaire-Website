import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Français par défaut, arabe (RTL) et anglais.
  locales: ['fr', 'ar', 'en'],
  defaultLocale: 'fr',
  // La locale par défaut (fr) n'a pas de préfixe dans l'URL : "/" = fr,
  // "/ar" = arabe, "/en" = anglais.
  localePrefix: 'as-needed'
});

export type Locale = (typeof routing.locales)[number];
