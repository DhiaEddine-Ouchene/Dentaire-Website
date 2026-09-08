'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  HelpCircle,
  Mail,
  MessageCircle
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { ServiceIconBadge } from '@/components/public/service-icon';
import { getContenu } from '@/lib/i18n-content';
import { siteConfig, whatsappLink } from '@/config/site';
import {
  DEFAULT_CANCELLATION_DEADLINE_HOURS,
  DEFAULT_MOTIF_DURATION_MIN
} from '@/lib/booking/constants';
import { cn } from '@/lib/utils';
import { UNKNOWN_MOTIF, type MotifOption, type SlotDTO } from './types';

type SlotsResponse = { ok: boolean; durationMin: number; slots: SlotDTO[] };
type SubmitResult = { ok: true; referenceCode: string; jeton: string; locale: string } | { ok: false; error: string };

type BookingWizardProps = {
  motifs: MotifOption[];
  initialMotifId: string | null;
  /** Index de jours JS (`getDay`, 0 = dimanche) où le cabinet est fermé. */
  closedWeekdays: number[];
  getSlots: (raw: { dateISO: string; motifId: string | null }) => Promise<SlotsResponse>;
  submitBooking: (raw: unknown, locale: string) => Promise<SubmitResult>;
};

const DAYS_AHEAD = 21;
const STEP_COUNT = 4;

/** `YYYY-MM-DD` en heure locale (évite le décalage de jour d'un toISOString UTC). */
function toDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function BookingWizard({
  motifs,
  initialMotifId,
  closedWeekdays,
  getSlots,
  submitBooking
}: BookingWizardProps) {
  const t = useTranslations('reservation');
  const locale = useLocale();

  const [step, setStep] = useState(0);
  const [motifId, setMotifId] = useState<string | null>(initialMotifId);

  const [dateISO, setDateISO] = useState<string | null>(null);
  const [slots, setSlots] = useState<SlotDTO[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slot, setSlot] = useState<SlotDTO | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [jeton, setJeton] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const stepLabels = [t('steps.motif'), t('steps.schedule'), t('steps.details'), t('steps.confirm')];

  // Durée estimée du motif (connue côté client, sans attendre le serveur).
  const selectedMotif = useMemo(
    () => (motifId && motifId !== UNKNOWN_MOTIF ? motifs.find((m) => m.slug === motifId) ?? null : null),
    [motifId, motifs]
  );
  const durationMin = selectedMotif?.durationMin ?? DEFAULT_MOTIF_DURATION_MIN;

  const motifLabel = motifId
    ? motifId === UNKNOWN_MOTIF
      ? t('motif.unknownTitle')
      : getContenu(selectedMotif?.name, locale)
    : '';

  // Bande de dates : les prochains jours, jours de fermeture désactivés.
  const days = useMemo(() => {
    const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const monthFmt = new Intl.DateTimeFormat(locale, { month: 'short' });
    const todayISO = toDateISO(new Date());
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: DAYS_AHEAD }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = toDateISO(d);
      return {
        iso,
        weekday: weekdayFmt.format(d),
        dayNum: d.getDate(),
        month: monthFmt.format(d),
        disabled: closedWeekdays.includes(d.getDay()),
        isToday: iso === todayISO
      };
    });
  }, [locale, closedWeekdays]);

  const longDateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }),
    [locale]
  );
  const formattedDate = useMemo(() => {
    if (!dateISO) return '';
    const [y, m, d] = dateISO.split('-').map(Number);
    return longDateFmt.format(new Date(y, m - 1, d));
  }, [dateISO, longDateFmt]);

  // Chargement des créneaux à chaque changement de date ou de motif (durée).
  const reqRef = useRef(0);
  useEffect(() => {
    if (!dateISO) return;
    const reqId = ++reqRef.current;
    setSlotsLoading(true);
    setSlot(null);
    getSlots({ dateISO, motifId })
      .then((res) => {
        if (reqId !== reqRef.current) return; // réponse obsolète
        setSlots(res.ok ? res.slots : []);
      })
      .catch(() => {
        if (reqId !== reqRef.current) return;
        setSlots([]);
      })
      .finally(() => {
        if (reqId === reqRef.current) setSlotsLoading(false);
      });
  }, [dateISO, motifId, getSlots]);

  function validateDetails() {
    const errs: { name?: string; phone?: string; email?: string } = {};
    if (name.trim().length < 2) errs.name = t('errors.nameRequired');
    const p = phone.trim();
    if (p.length === 0) errs.phone = t('errors.phoneRequired');
    else if (!/^[+\d][\d\s().-]{5,29}$/.test(p)) errs.phone = t('errors.phoneInvalid');
    const e = email.trim();
    if (e.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) errs.email = t('errors.emailInvalid');
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleConfirm() {
    if (!validateDetails() || !slot || !dateISO) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitBooking({
        motifId,
        dateISO,
        slotStartISO: slot.startISO,
        slotEndISO: slot.endISO,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        notes: notes.trim() || undefined
      }, locale);
      if (res.ok) {
        setJeton(res.jeton);
        setReferenceCode(res.referenceCode);
        setStep(3);
      } else {
        setSubmitError(t('errors.generic'));
      }
    } catch {
      setSubmitError(t('errors.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setStep(0);
    setMotifId(initialMotifId);
    setDateISO(null);
    setSlots([]);
    setSlot(null);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setFieldErrors({});
    setSubmitError(null);
    setJeton(null);
    setCopied(false);
  }

  // Lien d'annulation personnel (préfixe de locale « as-needed » : fr sans préfixe).
  const cancelPath = `${locale === 'fr' ? '' : `/${locale}`}/annulation/${jeton ?? ''}`;
  const [cancelUrl, setCancelUrl] = useState('');
  useEffect(() => {
    if (jeton) setCancelUrl(`${window.location.origin}${cancelPath}`);
  }, [jeton, cancelPath]);

  async function copyCancelLink() {
    try {
      await navigator.clipboard.writeText(cancelUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponible : le lien reste visible/cliquable */
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* En-tête de progression */}
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-ink-500">
          {t('stepCounter', { current: step + 1, total: STEP_COUNT })}
        </p>
        <ProgressStepsInline steps={stepLabels} current={step} />
      </div>

      {/* ÉTAPE 1 — Motif */}
      {step === 0 && (
        <div key="motif" className="animate-fade-in">
          <StepTitle title={t('motif.title')} subtitle={t('motif.subtitle')} />
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {motifs.map((m) => (
              <MotifCard
                key={m.slug}
                selected={motifId === m.slug}
                onClick={() => setMotifId(m.slug)}
                icon={<ServiceIconBadge icon={m.icon} />}
                title={getContenu(m.name, locale)}
                description={getContenu(m.short, locale)}
                meta={t('motif.durationLabel', { min: m.durationMin })}
              />
            ))}
            <MotifCard
              selected={motifId === UNKNOWN_MOTIF}
              onClick={() => setMotifId(UNKNOWN_MOTIF)}
              icon={
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand-100 text-primary-600">
                  <HelpCircle className="h-7 w-7" strokeWidth={1.75} />
                </span>
              }
              title={t('motif.unknownTitle')}
              description={t('motif.unknownDescription')}
            />
          </div>
        </div>
      )}

      {/* ÉTAPE 2 — Date & créneau */}
      {step === 1 && (
        <div key="schedule" className="animate-fade-in">
          <StepTitle title={t('schedule.title')} subtitle={t('schedule.subtitle')} />

          <div className="mt-5 flex items-center gap-2 text-sm text-ink-600">
            <Clock className="h-4 w-4 text-primary-500" />
            <span>{t('schedule.durationNote', { min: durationMin })}</span>
          </div>

          {/* Bande de dates */}
          <p className="mt-6 mb-2 text-sm font-medium text-ink-800">{t('schedule.pickDate')}</p>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
            {days.map((d) => {
              const active = d.iso === dateISO;
              return (
                <button
                  key={d.iso}
                  type="button"
                  disabled={d.disabled}
                  onClick={() => setDateISO(d.iso)}
                  className={cn(
                    'flex w-16 shrink-0 flex-col items-center rounded-2xl border py-2.5 transition-colors',
                    d.disabled && 'cursor-not-allowed opacity-40',
                    !d.disabled && active && 'border-primary-500 bg-primary-500 text-white shadow-soft',
                    !d.disabled && !active && 'border-ink-200 bg-white text-ink-800 hover:border-primary-300'
                  )}
                >
                  <span className={cn('text-xs capitalize', active ? 'text-white/80' : 'text-ink-500')}>
                    {d.isToday ? t('schedule.today') : d.weekday}
                  </span>
                  <span className="text-lg font-semibold leading-tight">{d.dayNum}</span>
                  <span className={cn('text-xs capitalize', active ? 'text-white/80' : 'text-ink-500')}>
                    {d.month}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-1 text-xs text-ink-400">{t('schedule.closedHint')}</p>

          {/* Grille de créneaux */}
          <p className="mt-6 mb-2 text-sm font-medium text-ink-800">{t('schedule.pickSlot')}</p>
          {!dateISO ? (
            <p className="rounded-2xl bg-ink-50 px-4 py-6 text-center text-sm text-ink-500">
              {t('schedule.selectDateFirst')}
            </p>
          ) : slotsLoading ? (
            <p className="rounded-2xl bg-ink-50 px-4 py-6 text-center text-sm text-ink-500">
              {t('schedule.loading')}
            </p>
          ) : slots.length === 0 ? (
            <p className="rounded-2xl bg-ink-50 px-4 py-6 text-center text-sm text-ink-500">
              {t('schedule.empty')}
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((s) => {
                const active = slot?.startISO === s.startISO;
                return (
                  <button
                    key={s.startISO}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={cn(
                      'rounded-xl border py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'border-primary-500 bg-primary-500 text-white shadow-soft'
                        : 'border-ink-200 bg-white text-ink-800 hover:border-primary-300'
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ÉTAPE 3 — Coordonnées */}
      {step === 2 && (
        <div key="details" className="animate-fade-in">
          <StepTitle title={t('details.title')} subtitle={t('details.subtitle')} />

          <Summary
            className="mt-6"
            motifLabel={motifLabel}
            date={formattedDate}
            time={slot ? `${slot.label} – ${slot.endLabel}` : ''}
            durationLabel={t('summary.durationValue', { min: durationMin })}
            labels={{
              motif: t('summary.motif'),
              date: t('summary.date'),
              time: t('summary.time'),
              duration: t('summary.duration')
            }}
            onEditMotif={() => setStep(0)}
            onEditSchedule={() => setStep(1)}
            editLabel={t('summary.edit')}
          />

          <div className="mt-6 space-y-4">
            <Input
              label={t('details.name')}
              required
              autoComplete="name"
              placeholder={t('details.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name}
            />
            <Input
              label={t('details.phone')}
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t('details.phonePlaceholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={fieldErrors.phone}
            />
            <Input
              label={t('details.emailOptional')}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t('details.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
            />
            <Textarea
              label={t('details.notes')}
              placeholder={t('details.notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {submitError && <p className="mt-4 text-sm text-error">{submitError}</p>}
        </div>
      )}

      {/* ÉTAPE 4 — Confirmation */}
      {step === 3 && jeton && referenceCode && (
        <div key="confirm" className="animate-fade-in text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 className="h-9 w-9" strokeWidth={1.75} />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-ink-900">{t('confirmation.title')}</h2>
          <p className="mx-auto mt-2 max-w-md text-ink-600">{t('confirmation.subtitle')}</p>

          {/* Code de référence */}
          <div className="mt-6 rounded-2xl border-2 border-primary-200 bg-primary-50 p-6">
            <p className="text-sm font-medium text-primary-700 mb-2">
              {locale === 'ar' ? 'رمز المرجع الخاص بك' : locale === 'en' ? 'Your Reference Code' : 'Votre code de référence'}
            </p>
            <p className="text-3xl font-bold text-primary-900 tracking-wider">{referenceCode}</p>
            <p className="mt-2 text-xs text-primary-600">
              {locale === 'ar'
                ? 'احتفظ بهذا الرمز لإدارة موعدك'
                : locale === 'en'
                ? 'Keep this code to manage your appointment'
                : 'Conservez ce code pour gérer votre rendez-vous'}
            </p>
          </div>

          {/* Confirmation automatique envoyée */}
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-green-900">
                  {locale === 'ar'
                    ? 'تم إرسال التأكيد تلقائيًا'
                    : locale === 'en'
                    ? 'Confirmation sent automatically'
                    : 'Confirmation envoyée automatiquement'}
                </p>
                <p className="mt-1 text-sm text-green-700">
                  {locale === 'ar'
                    ? 'تم إرسال تأكيد موعدك عبر البريد الإلكتروني و WhatsApp (إن وجد). ستتلقى تذكيرًا قبل موعدك.'
                    : locale === 'en'
                    ? 'Your appointment confirmation has been sent via email and WhatsApp (if provided). You will receive a reminder before your appointment.'
                    : 'La confirmation de votre rendez-vous a été envoyée par email et WhatsApp (si fourni). Vous recevrez un rappel avant votre rendez-vous.'}
                </p>
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          <Summary
            className="mt-8 text-left"
            motifLabel={motifLabel}
            date={formattedDate}
            time={slot ? `${slot.label} – ${slot.endLabel}` : ''}
            durationLabel={t('summary.durationValue', { min: durationMin })}
            patient={`${name.trim()} · ${phone.trim()}`}
            labels={{
              motif: t('summary.motif'),
              date: t('summary.date'),
              time: t('summary.time'),
              duration: t('summary.duration'),
              patient: t('summary.patient')
            }}
          />

          {/* Annulation / Gestion */}
          <div className="mt-8 rounded-2xl border border-ink-200 bg-ink-50/60 p-5 text-left">
            <h3 className="font-semibold text-ink-900">
              {locale === 'ar' ? 'هل تحتاج إلى تعديل أو إلغاء؟' : locale === 'en' ? 'Need to modify or cancel?' : 'Besoin de modifier ou d\'annuler ?'}
            </h3>
            <p className="mt-1 text-sm text-ink-600">
              {locale === 'ar'
                ? `استخدم رمز المرجع ورقم هاتفك لإدارة موعدك. يمكنك الإلغاء حتى ${DEFAULT_CANCELLATION_DEADLINE_HOURS} ساعة قبل الموعد.`
                : locale === 'en'
                ? `Use your reference code and phone number to manage your appointment. You can cancel up to ${DEFAULT_CANCELLATION_DEADLINE_HOURS} hours before.`
                : `Utilisez votre code de référence et votre numéro de téléphone pour gérer votre rendez-vous. Vous pouvez annuler jusqu'à ${DEFAULT_CANCELLATION_DEADLINE_HOURS} h avant.`}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/retrouver-rendez-vous"
                className={buttonVariants({ variant: 'secondary', size: 'md' })}
              >
                {locale === 'ar' ? 'إدارة موعدي' : locale === 'en' ? 'Manage My Appointment' : 'Gérer mon rendez-vous'}
              </Link>
              <Button variant="ghost" onClick={copyCancelLink}>
                <Copy className="h-4 w-4" />
                {copied
                  ? (locale === 'ar' ? 'تم النسخ' : locale === 'en' ? 'Copied' : 'Copié')
                  : (locale === 'ar' ? 'نسخ الرابط' : locale === 'en' ? 'Copy Link' : 'Copier le lien')}
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={resetAll}
            className="mt-6 text-sm font-medium text-primary-700 underline-offset-4 hover:underline"
          >
            {locale === 'ar' ? 'حجز موعد آخر' : locale === 'en' ? 'Book Another Appointment' : 'Prendre un autre rendez-vous'}
          </button>
        </div>
      )}

      {/* Navigation */}
      {step < 3 && (
        <div className="mt-10 flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              {t('nav.back')}
            </Button>
          ) : (
            <span />
          )}

          {step === 0 && (
            <Button disabled={motifId === null} onClick={() => setStep(1)}>
              {t('nav.next')}
            </Button>
          )}
          {step === 1 && (
            <Button disabled={!slot} onClick={() => setStep(2)}>
              {t('nav.next')}
            </Button>
          )}
          {step === 2 && (
            <Button disabled={submitting} onClick={handleConfirm}>
              {submitting ? t('nav.submitting') : t('nav.confirm')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Sous-composants ---------- */

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">{title}</h2>
      <p className="mt-1.5 text-ink-600">{subtitle}</p>
    </div>
  );
}

function MotifCard({
  selected,
  onClick,
  icon,
  title,
  description,
  meta
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  meta?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex items-start gap-4 rounded-2xl border p-4 text-left transition-all',
        selected
          ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/25'
          : 'border-ink-200 bg-white hover:border-primary-300'
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0">
        <span className="block font-semibold text-ink-900">{title}</span>
        <span className="mt-0.5 block text-sm leading-snug text-ink-600 line-clamp-2">{description}</span>
        {meta && (
          <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary-700">
            <Clock className="h-3.5 w-3.5" />
            {meta}
          </span>
        )}
      </span>
    </button>
  );
}

function Summary({
  className,
  motifLabel,
  date,
  time,
  durationLabel,
  patient,
  labels,
  onEditMotif,
  onEditSchedule,
  editLabel
}: {
  className?: string;
  motifLabel: string;
  date: string;
  time: string;
  durationLabel: string;
  patient?: string;
  labels: { motif: string; date: string; time: string; duration: string; patient?: string };
  onEditMotif?: () => void;
  onEditSchedule?: () => void;
  editLabel?: string;
}) {
  return (
    <dl className={cn('rounded-2xl border border-ink-200 bg-white p-5 text-sm', className)}>
      <SummaryRow label={labels.motif} value={motifLabel} onEdit={onEditMotif} editLabel={editLabel} />
      <SummaryRow label={labels.date} value={date} onEdit={onEditSchedule} editLabel={editLabel} />
      <SummaryRow label={labels.time} value={time} onEdit={onEditSchedule} editLabel={editLabel} />
      <SummaryRow label={labels.duration} value={durationLabel} />
      {patient && labels.patient && <SummaryRow label={labels.patient} value={patient} />}
    </dl>
  );
}

function SummaryRow({
  label,
  value,
  onEdit,
  editLabel
}: {
  label: string;
  value: string;
  onEdit?: () => void;
  editLabel?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-b border-ink-100 py-2 last:border-0">
      <dt className="text-ink-500">{label}</dt>
      <dd className="flex items-center gap-3 text-right font-medium text-ink-900">
        <span className="capitalize">{value}</span>
        {onEdit && editLabel && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-medium text-primary-700 underline-offset-2 hover:underline"
          >
            {editLabel}
          </button>
        )}
      </dd>
    </div>
  );
}

/** En-tête de progression (pastilles + connecteurs), aligné sur le design system. */
function ProgressStepsInline({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center">
      {steps.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'todo';
        const isLast = i === steps.length - 1;
        return (
          <li key={label} className={cn('flex items-center', !isLast && 'flex-1')}>
            <div className="flex items-center gap-2">
              <span
                aria-current={state === 'active' ? 'step' : undefined}
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300',
                  state === 'done' && 'bg-primary-600 text-white',
                  state === 'active' && 'bg-primary-600 text-white ring-4 ring-primary-100',
                  state === 'todo' && 'bg-ink-100 text-ink-400'
                )}
              >
                {state === 'done' ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
              </span>
              <span
                className={cn(
                  'hidden whitespace-nowrap text-sm font-medium sm:block',
                  state === 'todo' ? 'text-ink-400' : 'text-ink-800'
                )}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <span
                className={cn(
                  'mx-2 h-px flex-1 transition-colors duration-300 sm:mx-3',
                  i < current ? 'bg-primary-400' : 'bg-ink-200'
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
