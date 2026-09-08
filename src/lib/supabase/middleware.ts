import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

/**
 * Protection de l'espace admin (PROMPT 10).
 *
 * L'admin vit sous `[locale]/(admin)/admin/…`. On rafraîchit la session Supabase
 * et on redirige selon l'état de connexion. La réponse passée en argument est celle
 * déjà produite par le middleware next-intl (elle porte la réécriture de langue).
 */

/** Sépare le préfixe de langue éventuel : "/en/admin" → { locale:"en", rest:"/admin" }. */
function splitLocale(pathname: string): { locale: string; rest: string } {
  const segment = pathname.split('/')[1];
  if ((routing.locales as readonly string[]).includes(segment)) {
    const rest = pathname.slice(segment.length + 1);
    return { locale: segment, rest: rest === '' ? '/' : rest };
  }
  return { locale: routing.defaultLocale, rest: pathname };
}

/** Construit un chemin admin en respectant le préfixe de langue (fr = sans préfixe). */
function localizedPath(locale: string, sub: string): string {
  return locale === routing.defaultLocale ? sub : `/${locale}${sub}`;
}

/** Vrai si l'URL (avec ou sans préfixe de langue) cible l'espace admin. */
export function isAdminPath(pathname: string): boolean {
  const { rest } = splitLocale(pathname);
  return rest === '/admin' || rest.startsWith('/admin/');
}

export async function updateAdminSession(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const { locale, rest } = splitLocale(request.nextUrl.pathname);
  const isLoginPage = rest === '/admin/login';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const redirectTo = (sub: string): NextResponse => {
    const target = request.nextUrl.clone();
    target.pathname = localizedPath(locale, sub);
    target.search = '';
    return NextResponse.redirect(target);
  };

  // Auth non configurée (identifiants absents) : on verrouille l'admin sur la page de connexion
  // plutôt que d'exposer un tableau de bord non protégé.
  if (!supabaseUrl || !supabaseAnonKey) {
    return isLoginPage ? response : redirectTo('/admin/login');
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[]
      ) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      }
    }
  });

  let isAuthenticated = false;
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    isAuthenticated = Boolean(user);
  } catch {
    // Identifiants factices / Supabase injoignable : considéré comme non connecté.
    isAuthenticated = false;
  }

  // Visiteur non connecté sur une page protégée → page de connexion.
  if (!isAuthenticated && !isLoginPage) {
    return redirectTo('/admin/login');
  }

  // Déjà connecté sur la page de connexion → tableau de bord.
  if (isAuthenticated && isLoginPage) {
    return redirectTo('/admin');
  }

  return response;
}
