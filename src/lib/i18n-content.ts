// Contenu multilingue stocké en base (champs Json sur Motif, Cabinet).
// `fr` est toujours requis ; `ar` / `en` sont optionnels et retombent sur `fr`.
export type LocalizedContent = {
  fr: string;
  ar?: string;
  en?: string;
};

/**
 * Renvoie le contenu dans la langue demandée, avec repli sur le français
 * si la traduction est absente ou vide.
 */
export function getContenu(
  content: LocalizedContent | null | undefined,
  locale: string
): string {
  if (!content) return '';
  const key = locale as keyof LocalizedContent;
  const value = content[key];
  if (value && value.trim().length > 0) return value;
  return content.fr ?? '';
}
