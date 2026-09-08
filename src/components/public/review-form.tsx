'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { submitReview } from '@/app/[locale]/(public)/avis/actions';

type ReviewFormProps = {
  locale: string;
};

export function ReviewForm({ locale }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      auteur: formData.get('auteur') as string,
      note: rating,
      commentaire: formData.get('commentaire') as string,
      telephone: formData.get('telephone') as string
    };

    const result = await submitReview(data);
    setLoading(false);

    if (result.success) {
      setSubmitted(true);
      (e.target as HTMLFormElement).reset();
      setRating(0);
    } else {
      alert(result.error);
    }
  };

  const labels = {
    title: {
      fr: 'Laissez-nous votre avis',
      ar: 'شاركنا رأيك',
      en: 'Share Your Review'
    },
    subtitle: {
      fr: 'Votre avis nous aide à améliorer nos services',
      ar: 'رأيك يساعدنا على تحسين خدماتنا',
      en: 'Your feedback helps us improve our services'
    },
    name: {
      fr: 'Votre nom',
      ar: 'اسمك',
      en: 'Your name'
    },
    phone: {
      fr: 'Téléphone (optionnel)',
      ar: 'رقم الهاتف (اختياري)',
      en: 'Phone (optional)'
    },
    rating: {
      fr: 'Note',
      ar: 'التقييم',
      en: 'Rating'
    },
    comment: {
      fr: 'Votre commentaire',
      ar: 'تعليقك',
      en: 'Your comment'
    },
    commentPlaceholder: {
      fr: 'Partagez votre expérience avec nous...',
      ar: 'شارك تجربتك معنا...',
      en: 'Share your experience with us...'
    },
    submit: {
      fr: 'Envoyer mon avis',
      ar: 'إرسال التقييم',
      en: 'Submit Review'
    },
    submitting: {
      fr: 'Envoi en cours...',
      ar: 'جاري الإرسال...',
      en: 'Submitting...'
    },
    successTitle: {
      fr: 'Merci pour votre avis !',
      ar: 'شكرًا لك على رأيك!',
      en: 'Thank you for your review!'
    },
    successMessage: {
      fr: 'Votre avis a été soumis avec succès et sera publié après modération.',
      ar: 'تم إرسال رأيك بنجاح وسيتم نشره بعد المراجعة.',
      en: 'Your review has been submitted successfully and will be published after moderation.'
    },
    submitAnother: {
      fr: 'Soumettre un autre avis',
      ar: 'إرسال رأي آخر',
      en: 'Submit another review'
    }
  };

  const t = (key: keyof typeof labels) => labels[key][locale as keyof typeof labels.title] || labels[key].fr;

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary-100 bg-primary-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <Star className="h-8 w-8 fill-primary-600 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900">{t('successTitle')}</h3>
        <p className="mt-2 text-sm text-ink-600">{t('successMessage')}</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          {t('submitAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-ink-900">{t('title')}</h3>
        <p className="mt-1 text-sm text-ink-600">{t('subtitle')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 mb-2">
          {t('name')} *
        </label>
        <input
          type="text"
          name="auteur"
          required
          minLength={2}
          className="w-full rounded-lg border border-ink-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 mb-2">
          {t('phone')}
        </label>
        <input
          type="tel"
          name="telephone"
          className="w-full rounded-lg border border-ink-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 mb-2">
          {t('rating')} *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-none text-ink-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 mb-2">
          {t('comment')}
        </label>
        <textarea
          name="commentaire"
          rows={4}
          minLength={10}
          placeholder={t('commentPlaceholder')}
          className="w-full rounded-lg border border-ink-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 disabled:bg-ink-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
