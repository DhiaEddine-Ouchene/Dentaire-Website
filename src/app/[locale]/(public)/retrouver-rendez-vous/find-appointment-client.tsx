'use client';

import { useState } from 'react';
import { Search, Calendar, Clock, User, Phone, AlertCircle, CheckCircle, X } from 'lucide-react';
import { findAppointment, cancelAppointment } from './actions';
import { getContenu } from '@/lib/i18n-content';

type AppointmentData = {
  id: string;
  referenceCode: string;
  dateDebut: string;
  dateFin: string;
  duree: number;
  statut: string;
  notes: string | null;
  patient: {
    nom: string;
    prenom: string | null;
    telephone: string;
    email: string | null;
  };
  motif: {
    nom: any;
  };
  jetonAnnulation: string;
};

export function FindAppointmentClient({ locale }: { locale: string }) {
  const [referenceCode, setReferenceCode] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const labels = {
    title: {
      fr: 'Retrouver mon rendez-vous',
      ar: 'العثور على موعدي',
      en: 'Find My Appointment'
    },
    subtitle: {
      fr: 'Entrez votre code de référence et votre numéro de téléphone pour consulter ou annuler votre rendez-vous',
      ar: 'أدخل رمز المرجع ورقم هاتفك لعرض أو إلغاء موعدك',
      en: 'Enter your reference code and phone number to view or cancel your appointment'
    },
    referenceCodeLabel: {
      fr: 'Code de référence',
      ar: 'رمز المرجع',
      en: 'Reference Code'
    },
    referenceCodePlaceholder: {
      fr: 'RDV-XXXXX',
      ar: 'RDV-XXXXX',
      en: 'RDV-XXXXX'
    },
    phoneLabel: {
      fr: 'Numéro de téléphone',
      ar: 'رقم الهاتف',
      en: 'Phone Number'
    },
    phonePlaceholder: {
      fr: '0555 12 34 56',
      ar: '0555 12 34 56',
      en: '0555 12 34 56'
    },
    searchButton: {
      fr: 'Rechercher',
      ar: 'بحث',
      en: 'Search'
    },
    searching: {
      fr: 'Recherche...',
      ar: 'جارٍ البحث...',
      en: 'Searching...'
    },
    appointmentDetails: {
      fr: 'Détails du rendez-vous',
      ar: 'تفاصيل الموعد',
      en: 'Appointment Details'
    },
    motif: {
      fr: 'Motif',
      ar: 'السبب',
      en: 'Reason'
    },
    date: {
      fr: 'Date',
      ar: 'التاريخ',
      en: 'Date'
    },
    time: {
      fr: 'Heure',
      ar: 'الوقت',
      en: 'Time'
    },
    duration: {
      fr: 'Durée',
      ar: 'المدة',
      en: 'Duration'
    },
    patient: {
      fr: 'Patient',
      ar: 'المريض',
      en: 'Patient'
    },
    status: {
      fr: 'Statut',
      ar: 'الحالة',
      en: 'Status'
    },
    cancelButton: {
      fr: 'Annuler ce rendez-vous',
      ar: 'إلغاء هذا الموعد',
      en: 'Cancel This Appointment'
    },
    cancelling: {
      fr: 'Annulation...',
      ar: 'جارٍ الإلغاء...',
      en: 'Cancelling...'
    },
    confirmCancel: {
      fr: 'Êtes-vous sûr de vouloir annuler ce rendez-vous ?',
      ar: 'هل أنت متأكد من إلغاء هذا الموعد؟',
      en: 'Are you sure you want to cancel this appointment?'
    },
    cancelled: {
      fr: 'Rendez-vous annulé avec succès',
      ar: 'تم إلغاء الموعد بنجاح',
      en: 'Appointment cancelled successfully'
    },
    newSearch: {
      fr: 'Nouvelle recherche',
      ar: 'بحث جديد',
      en: 'New Search'
    },
    errorNotFound: {
      fr: 'Aucun rendez-vous trouvé avec ces informations. Vérifiez votre code de référence et votre numéro de téléphone.',
      ar: 'لم يتم العثور على موعد بهذه المعلومات. تحقق من رمز المرجع ورقم هاتفك.',
      en: 'No appointment found with this information. Please check your reference code and phone number.'
    },
    errorTooLate: {
      fr: 'Il est trop tard pour annuler ce rendez-vous (moins de 24h). Veuillez nous contacter directement.',
      ar: 'لقد فات الأوان لإلغاء هذا الموعد (أقل من 24 ساعة). يرجى الاتصال بنا مباشرة.',
      en: 'Too late to cancel this appointment (less than 24h). Please contact us directly.'
    },
    errorUnknown: {
      fr: 'Une erreur est survenue. Veuillez réessayer.',
      ar: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      en: 'An error occurred. Please try again.'
    },
    statusConfirmed: {
      fr: 'Confirmé',
      ar: 'مؤكد',
      en: 'Confirmed'
    },
    statusCompleted: {
      fr: 'Terminé',
      ar: 'مكتمل',
      en: 'Completed'
    },
    minutes: {
      fr: 'min',
      ar: 'دقيقة',
      en: 'min'
    }
  };

  const t = (key: keyof typeof labels) =>
    labels[key][locale as keyof (typeof labels)['title']] || labels[key].fr;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAppointment(null);

    const result = await findAppointment({
      referenceCode: referenceCode.trim(),
      phone: phone.trim()
    });

    setLoading(false);

    if (result.success && result.appointment) {
      setAppointment(result.appointment);
    } else {
      if (result.error === 'NOT_FOUND') {
        setError(t('errorNotFound'));
      } else {
        setError(t('errorUnknown'));
      }
    }
  };

  const handleCancel = async () => {
    if (!confirm(t('confirmCancel'))) return;

    setCancelling(true);
    const result = await cancelAppointment({
      referenceCode: referenceCode.trim(),
      phone: phone.trim()
    });

    setCancelling(false);

    if (result.success) {
      setCancelled(true);
      setAppointment(null);
    } else {
      if (result.error === 'TOO_LATE') {
        setError(t('errorTooLate'));
      } else if (result.error === 'NOT_FOUND') {
        setError(t('errorNotFound'));
      } else {
        setError(t('errorUnknown'));
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Success Message after cancellation */}
      {cancelled && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900">{t('cancelled')}</h3>
              <button
                onClick={() => {
                  setCancelled(false);
                  setReferenceCode('');
                  setPhone('');
                }}
                className="mt-3 text-sm font-medium text-green-700 hover:text-green-800 underline"
              >
                {t('newSearch')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Form */}
      {!appointment && !cancelled && (
        <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <Search className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-ink-900">{t('title')}</h1>
            <p className="mt-2 text-ink-600">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {t('referenceCodeLabel')} *
              </label>
              <input
                type="text"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                placeholder={t('referenceCodePlaceholder')}
                required
                className="w-full rounded-lg border border-ink-200 px-4 py-3 text-sm font-mono uppercase focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {t('phoneLabel')} *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phonePlaceholder')}
                required
                className="w-full rounded-lg border border-ink-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white hover:bg-primary-700 disabled:bg-ink-300 disabled:cursor-not-allowed transition-colors shadow-soft"
            >
              {loading ? t('searching') : t('searchButton')}
            </button>
          </form>
        </div>
      )}

      {/* Appointment Details */}
      {appointment && !cancelled && (
        <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink-900">{t('appointmentDetails')}</h2>
            <button
              onClick={() => {
                setAppointment(null);
                setReferenceCode('');
                setPhone('');
              }}
              className="text-ink-500 hover:text-ink-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Reference Code */}
            <div className="rounded-lg border-2 border-primary-200 bg-primary-50 p-4">
              <p className="text-xs font-medium text-primary-700 mb-1">
                {t('referenceCodeLabel')}
              </p>
              <p className="text-2xl font-bold text-primary-900 tracking-wider">
                {appointment.referenceCode}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <DetailRow
                icon={<Calendar className="h-5 w-5" />}
                label={t('date')}
                value={formatDate(appointment.dateDebut)}
              />
              <DetailRow
                icon={<Clock className="h-5 w-5" />}
                label={t('time')}
                value={`${formatTime(appointment.dateDebut)} - ${formatTime(appointment.dateFin)}`}
              />
              <DetailRow
                icon={<Clock className="h-5 w-5" />}
                label={t('duration')}
                value={`${appointment.duree} ${t('minutes')}`}
              />
              <DetailRow
                icon={<User className="h-5 w-5" />}
                label={t('motif')}
                value={getContenu(appointment.motif.nom, locale)}
              />
              <DetailRow
                icon={<User className="h-5 w-5" />}
                label={t('patient')}
                value={`${appointment.patient.prenom || ''} ${appointment.patient.nom}`}
              />
              <DetailRow
                icon={<Phone className="h-5 w-5" />}
                label={t('phoneLabel')}
                value={appointment.patient.telephone}
              />
              <DetailRow
                icon={<CheckCircle className="h-5 w-5" />}
                label={t('status')}
                value={
                  appointment.statut === 'CONFIRME'
                    ? t('statusConfirmed')
                    : appointment.statut === 'TERMINE'
                    ? t('statusCompleted')
                    : appointment.statut
                }
              />
            </div>

            {/* Cancel Button */}
            {appointment.statut === 'CONFIRME' && (
              <div className="pt-4">
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full rounded-lg border border-red-300 bg-red-50 px-6 py-3 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {cancelling ? t('cancelling') : t('cancelButton')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-ink-100 bg-ink-50/50 p-3">
      <div className="flex-shrink-0 text-primary-600 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-ink-500">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-ink-900">{value}</p>
      </div>
    </div>
  );
}
