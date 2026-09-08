/**
 * Liens de navigation principaux (en-tête public + pied de page).
 * `key` renvoie aux clés de traduction `nav.*` ; `href` est un chemin sans préfixe
 * de langue (géré par next-intl).
 */
export const mainNav = [
  { key: 'home', href: '/' },
  { key: 'services', href: '/services' },
  { key: 'gallery', href: '/galerie' },
  { key: 'about', href: '/a-propos' },
  { key: 'faq', href: '/faq' },
  { key: 'contact', href: '/contact' }
] as const;

export type NavItem = (typeof mainNav)[number];
