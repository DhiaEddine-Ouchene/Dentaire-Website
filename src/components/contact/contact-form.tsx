'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, MessageCircle, Send } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { whatsappLink } from '@/config/site';

type ContactSubmit = (
  raw: unknown
) => Promise<{ ok: true } | { ok: false; error: string }>;

type FieldErrors = { name?: string; message?: string };

/**
 * Formulaire de contact (PROMPT 9).
 * La server action est injectée en prop (même motif que le tunnel de réservation)
 * pour éviter d'importer un module « use server » à travers le groupe de routes.
 */
export function ContactForm({ submit }: { submit: ContactSubmit }) {
  const t = useTranslations('contact.form');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = t('errors.name');
    if (message.trim().length < 10) next.message = t('errors.message');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await submit({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        message: message.trim()
      });
      if (result.ok) {
        setSent(true);
      } else {
        setFormError(t('errors.generic'));
      }
    } catch {
      setFormError(t('errors.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setErrors({});
    setFormError(null);
    setSent(false);
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-ink-100 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-9 w-9" strokeWidth={1.75} />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-ink-900">{t('successTitle')}</h2>
        <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-600">{t('successText')}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={whatsappLink(t('whatsappMessage', { name, message }))}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'primary', size: 'lg' })}
          >
            <MessageCircle className="h-5 w-5" />
            {t('whatsappCta')}
          </a>
          <button
            type="button"
            onClick={reset}
            className={buttonVariants({ variant: 'ghost', size: 'lg' })}
          >
            {t('newMessage')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8"
    >
      <h2 className="text-xl font-semibold text-ink-900">{t('title')}</h2>
      <p className="mt-2 leading-relaxed text-ink-600">{t('description')}</p>

      <div className="mt-6 space-y-4">
        <Input
          label={t('name')}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('namePlaceholder')}
          error={errors.name}
          autoComplete="name"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            autoComplete="email"
            dir="ltr"
          />
          <Input
            label={t('phone')}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('phonePlaceholder')}
            autoComplete="tel"
            dir="ltr"
          />
        </div>

        <Textarea
          label={t('message')}
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('messagePlaceholder')}
          error={errors.message}
        />
      </div>

      {formError && <p className="mt-4 text-sm text-error">{formError}</p>}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
        <Send className="h-5 w-5" />
        {submitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
