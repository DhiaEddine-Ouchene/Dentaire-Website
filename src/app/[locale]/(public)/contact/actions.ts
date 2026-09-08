'use server';

import { z } from 'zod';

// Validation stricte côté serveur du formulaire de contact.
const contactInput = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.union([z.string().trim().email(), z.literal('')]).optional(),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(10).max(2000)
});

export type ContactResult = { ok: true } | { ok: false; error: 'VALIDATION' | 'UNKNOWN' };

/**
 * Traite un message du formulaire de contact (PROMPT 9).
 *
 * Étape UI : on valide les données ; l'envoi effectif de l'email au cabinet et
 * l'accusé de réception au visiteur seront branchés au prompt rappels/notifications
 * (même canal que les confirmations de rendez-vous). En attendant, le composant
 * client propose un repli WhatsApp pré-rempli, immédiatement exploitable.
 */
export async function sendContactMessage(raw: unknown): Promise<ContactResult> {
  const parsed = contactInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'VALIDATION' };

  // TODO (prompt rappels/notifications) : envoyer l'email au cabinet + accusé de réception.
  return { ok: true };
}
