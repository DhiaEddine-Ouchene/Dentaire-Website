'use client';

import { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { submitReview } from '@/app/[locale]/(public)/avis/actions';
import { useTranslations } from 'next-intl';

type ReviewSectionProps = {
  locale: string;
};

export function ReviewSubmissionSection({ locale }: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (rating === 0) {
      setErrorMessage(t('errorRating'));
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      auteur: formData.get('auteur') as string,
      note: rating,
      commentaire: formData.get('commentaire') as string,
      telephone: formData.get('telephone') as string
    };

    try {
      const result = await submitReview(data);
      if (result.success) {
        setSubmitted(true);
        setShowForm(false);
        setRating(0);
        setErrorMessage(null);
      } else {
        setErrorMessage(result.error || t('errorGeneric'));
      }
    } catch {
      setErrorMessage(t('errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    title: {
      fr: 'Partagez votre expérience',
      ar: 'شارك تجربتك',
      en: 'Share Your Experience'
    },
    subtitle: {
      fr: 'Votre avis compte pour nous et aide d\'autres patients',
      ar: 'رأيك مهم بالنسبة لنا ويساعد المرضى الآخرين',
      en: 'Your feedback matters and helps other patients'
    },
    leaveReview: {
      fr: 'Laisser un avis',
      ar: 'اترك رأيك',
      en: 'Leave a Review'
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
      fr: 'Votre note',
      ar: 'تقييمك',
      en: 'Your rating'
    },
    comment: {
      fr: 'Votre commentaire',
      ar: 'تعليقك',
      en: 'Your comment'
    },
    commentPlaceholder: {
      fr: 'Partagez votre expérience avec notre cabinet...',
      ar: 'شارك تجربتك مع عيادتنا...',
      en: 'Share your experience with our practice...'
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
    cancel: {
      fr: 'Annuler',
      ar: 'إلغاء',
      en: 'Cancel'
    },
    successTitle: {
      fr: 'Merci pour votre avis !',
      ar: 'شكرًا لك على رأيك!',
      en: 'Thank you for your review!'
    },
    successMessage: {
      fr: 'Votre avis a été soumis avec succès. Il sera publié après vérification par notre équipe.',
      ar: 'تم إرسال رأيك بنجاح. سيتم نشره بعد التحقق من قبل فريقنا.',
      en: 'Your review has been submitted successfully. It will be published after verification by our team.'
    },
    close: {
      fr: 'Fermer',
      ar: 'إغلاق',
      en: 'Close'
    },
    errorGeneric: {
      fr: 'Une erreur est survenue lors de la soumission de votre avis.',
      ar: 'حدث خطأ أثناء إرسال تقييمك.',
      en: 'An error occurred while submitting your review.'
    },
    errorRating: {
      fr: 'Veuillez sélectionner une note.',
      ar: 'يرجى تحديد تقييم.',
      en: 'Please select a rating.'
    }
  };

  const t = (key: keyof typeof labels) =>
    labels[key][locale as keyof (typeof labels)['title']] || labels[key].fr;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Success Message */}
      {submitted && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900">{t('successTitle')}</h3>
              <p className="mt-2 text-sm text-green-700">{t('successMessage')}</p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

      {/* Call to Action Card */}
      {!showForm ? (
        <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-8 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <Star className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-ink-900">{t('title')}</h3>
          <p className="mt-2 text-ink-600">{t('subtitle')}</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 rounded-lg bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 transition-colors shadow-soft"
          >
            {t('leaveReview')}
          </button>
        </div>
      ) : (
        /* Review Form */
        <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card sm:p-8">
          <h3 className="text-xl font-semibold text-ink-900 mb-6">{t('title')}</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {t('name')} *
              </label>
              <input
                type="text"
                name="auteur"
                required
                minLength={2}
                className="w-full rounded-lg border border-ink-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {t('phone')}
              </label>
              <input
                type="tel"
                name="telephone"
                className="w-full rounded-lg border border-ink-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-3">
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
                    className="transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded"
                  >
                    <Star
                      className={`h-10 w-10 transition-colors ${
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
                placeholder={t('commentPlaceholder')}
                className="w-full rounded-lg border border-ink-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors resize-none"
              />
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setRating(0);
                }}
                className="flex-1 rounded-lg border border-ink-200 px-6 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="flex-1 rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 disabled:bg-ink-300 disabled:cursor-not-allowed transition-colors shadow-soft"
              >
                {loading ? t('submitting') : t('submit')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
