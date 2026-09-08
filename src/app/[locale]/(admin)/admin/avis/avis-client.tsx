'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/admin/sidebar';
import { Star, Check, X, Trash2, ExternalLink, Copy } from 'lucide-react';
import { updateReviewStatus, deleteReview, getGoogleReviewLink } from './actions';

type Review = {
  id: string;
  auteur: string;
  note: number;
  commentaire: string | null;
  statut: string;
  createdAt: Date;
};

type AvisClientProps = {
  reviews: Review[];
  locale: string;
};

export function AvisClient({ reviews, locale }: AvisClientProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [googleReviewUrl, setGoogleReviewUrl] = useState<string | null>(null);
  const [showGoogleLink, setShowGoogleLink] = useState(false);
  const [copiedGoogleLink, setCopiedGoogleLink] = useState(false);

  const handleStatusChange = async (id: string, statut: 'PUBLIE' | 'REJETE') => {
    setLoading(id);
    const result = await updateReviewStatus(id, statut);
    setLoading(null);

    if (result.success) {
      if (statut === 'PUBLIE') {
        alert(
          locale === 'ar'
            ? 'تم نشر الرأي بنجاح! تم إرسال دعوة Google Review للمريض.'
            : locale === 'en'
            ? 'Review published! Google Review invitation sent to the patient.'
            : 'Avis publié ! Invitation Google Review envoyée au patient.'
        );
      }
      window.location.reload();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === 'ar' ? 'هل أنت متأكد من الحذف؟' : locale === 'en' ? 'Are you sure you want to delete?' : 'Êtes-vous sûr de vouloir supprimer ?')) {
      setLoading(id);
      const result = await deleteReview(id);
      setLoading(null);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    }
  };

  const handleGetGoogleLink = async () => {
    const result = await getGoogleReviewLink();
    if (result.success && result.url) {
      setGoogleReviewUrl(result.url);
      setShowGoogleLink(true);
    }
  };

  const copyGoogleLink = () => {
    if (googleReviewUrl) {
      navigator.clipboard.writeText(googleReviewUrl);
      setCopiedGoogleLink(true);
      setTimeout(() => setCopiedGoogleLink(false), 2000);
    }
  };

  const pendingReviews = reviews.filter((r) => r.statut === 'EN_ATTENTE');
  const publishedReviews = reviews.filter((r) => r.statut === 'PUBLIE');
  const rejectedReviews = reviews.filter((r) => r.statut === 'REJETE');

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">
              {locale === 'ar' ? 'إدارة الآراء' : locale === 'en' ? 'Reviews Management' : 'Gestion des Avis'}
            </h1>
            <p className="mt-1 text-sm text-ink-600">
              {locale === 'ar'
                ? 'راجع وانشر آراء المرضى'
                : locale === 'en'
                ? 'Review and publish patient feedback'
                : 'Examinez et publiez les retours des patients'}
            </p>
          </div>

          {/* Bouton pour obtenir le lien Google Review */}
          <button
            onClick={handleGetGoogleLink}
            className="flex items-center gap-2 rounded-lg bg-white border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            {locale === 'ar' ? 'رابط Google Review' : locale === 'en' ? 'Google Review Link' : 'Lien Google Review'}
          </button>
        </div>

        {/* Modal Google Review Link */}
        {showGoogleLink && googleReviewUrl && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-blue-900">
                {locale === 'ar' ? 'رابط Google Reviews' : locale === 'en' ? 'Google Reviews Link' : 'Lien Google Reviews'}
              </h3>
              <button onClick={() => setShowGoogleLink(false)} className="text-blue-600 hover:text-blue-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              {locale === 'ar'
                ? 'شارك هذا الرابط مع مرضاك لتشجيعهم على ترك تقييم على Google:'
                : locale === 'en'
                ? 'Share this link with your patients to encourage them to leave a Google review:'
                : 'Partagez ce lien avec vos patients pour les encourager à laisser un avis Google :'}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={googleReviewUrl}
                readOnly
                className="flex-1 rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm"
              />
              <button
                onClick={copyGoogleLink}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
                {copiedGoogleLink
                  ? (locale === 'ar' ? 'تم النسخ!' : locale === 'en' ? 'Copied!' : 'Copié !')
                  : (locale === 'ar' ? 'نسخ' : locale === 'en' ? 'Copy' : 'Copier')}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <ReviewSection
            title={
              locale === 'ar'
                ? `في الانتظار (${pendingReviews.length})`
                : locale === 'en'
                ? `Pending (${pendingReviews.length})`
                : `En attente (${pendingReviews.length})`
            }
            reviews={pendingReviews}
            locale={locale}
            onApprove={(id) => handleStatusChange(id, 'PUBLIE')}
            onReject={(id) => handleStatusChange(id, 'REJETE')}
            onDelete={handleDelete}
            loading={loading}
          />

          <ReviewSection
            title={
              locale === 'ar'
                ? `منشورة (${publishedReviews.length})`
                : locale === 'en'
                ? `Published (${publishedReviews.length})`
                : `Publiés (${publishedReviews.length})`
            }
            reviews={publishedReviews}
            locale={locale}
            onReject={(id) => handleStatusChange(id, 'REJETE')}
            onDelete={handleDelete}
            loading={loading}
          />

          <ReviewSection
            title={
              locale === 'ar'
                ? `مرفوضة (${rejectedReviews.length})`
                : locale === 'en'
                ? `Rejected (${rejectedReviews.length})`
                : `Rejetés (${rejectedReviews.length})`
            }
            reviews={rejectedReviews}
            locale={locale}
            onApprove={(id) => handleStatusChange(id, 'PUBLIE')}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}

function ReviewSection({
  title,
  reviews,
  locale,
  onApprove,
  onReject,
  onDelete,
  loading
}: {
  title: string;
  reviews: Review[];
  locale: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete: (id: string) => void;
  loading: string | null;
}) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-ink-900">{title}</h2>
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-ink-100 bg-white p-6 text-center text-sm text-ink-500">
          {locale === 'ar' ? 'لا توجد آراء' : locale === 'en' ? 'No reviews' : 'Aucun avis'}
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-ink-900">{review.auteur}</h3>
                  <div className="mt-1 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.note
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-none text-ink-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <time className="text-xs text-ink-500">
                  {new Date(review.createdAt).toLocaleDateString(
                    locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR'
                  )}
                </time>
              </div>
              {review.commentaire && (
                <p className="mt-3 text-sm text-ink-700 leading-relaxed">{review.commentaire}</p>
              )}
              <div className="mt-4 flex gap-2">
                {onApprove && (
                  <button
                    onClick={() => onApprove(review.id)}
                    disabled={loading === review.id}
                    className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 transition-colors"
                  >
                    <Check className="h-3 w-3" />
                    {locale === 'ar' ? 'نشر' : locale === 'en' ? 'Publish' : 'Publier'}
                  </button>
                )}
                {onReject && (
                  <button
                    onClick={() => onReject(review.id)}
                    disabled={loading === review.id}
                    className="flex items-center gap-1 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-100 disabled:opacity-50 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    {locale === 'ar' ? 'رفض' : locale === 'en' ? 'Reject' : 'Rejeter'}
                  </button>
                )}
                <button
                  onClick={() => onDelete(review.id)}
                  disabled={loading === review.id}
                  className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  {locale === 'ar' ? 'حذف' : locale === 'en' ? 'Delete' : 'Supprimer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
