import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { isAdminPath, updateAdminSession } from './lib/supabase/middleware';

// Middleware de routage des langues (next-intl).
const intlMiddleware = createMiddleware(routing);

/**
 * On exécute toujours next-intl (détection/réécriture de langue), puis on superpose
 * la protection Supabase pour les routes de l'espace admin (PROMPT 10).
 */
export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  if (isAdminPath(request.nextUrl.pathname)) {
    return updateAdminSession(request, response);
  }

  return response;
}

export const config = {
  // Ignore les routes API, les fichiers internes Next et les fichiers statiques.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
