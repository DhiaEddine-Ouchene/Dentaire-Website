'use client';

import { useState, useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type AppointmentFormProps = {
  motifs: Array<{ id: string; nom: string; durationMin: number }>;
  appointment?: {
    id: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    motifId: string;
    dateDebut: string;
    notes?: string;
  } | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  onCancel?: (id: string) => Promise<{ ok: boolean }>;
};

export function AppointmentModal({
  motifs,
  appointment,
  onClose,
  onSubmit,
  onCancel
}: AppointmentFormProps) {
  const t = useTranslations('admin.appointments');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const isEdit = !!appointment;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (isEdit) {
      formData.append('id', appointment.id);
    }

    try {
      const result = await onSubmit(formData);
      if (result.ok) {
        onClose();
      } else {
        setError(result.error || t('errors.generic'));
      }
    } catch {
      setError(t('errors.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel() {
    if (!isEdit || !onCancel) return;
    setCancelling(true);
    try {
      const result = await onCancel(appointment.id);
      if (result.ok) {
        onClose();
      }
    } catch {
      setError(t('errors.cancelFailed'));
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-900/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-ink-100 bg-white shadow-lifted">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-100 p-6">
          <h2 className="text-xl font-semibold text-ink-900">
            {isEdit ? t('editTitle') : t('addTitle')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-600 transition-colors hover:bg-ink-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Motif */}
            <div>
              <label htmlFor="motifId" className="mb-2 block text-sm font-medium text-ink-700">
                {t('form.motif')} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <select
                  id="motifId"
                  name="motifId"
                  required
                  defaultValue={appointment?.motifId}
                  className="w-full appearance-none rounded-2xl border border-ink-200 bg-white py-3 pl-12 pr-4 text-ink-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <option value="">{t('form.selectMotif')}</option>
                  {motifs.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nom} ({m.durationMin} min)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                name="date"
                type="date"
                label={t('form.date')}
                required
                defaultValue={
                  appointment
                    ? new Date(appointment.dateDebut).toISOString().split('T')[0]
                    : ''
                }
              />
              <Input
                name="time"
                type="time"
                label={t('form.time')}
                required
                defaultValue={
                  appointment
                    ? new Date(appointment.dateDebut).toTimeString().slice(0, 5)
                    : ''
                }
              />
            </div>

            {/* Patient Info */}
            <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-700">
                {t('form.patientInfo')}
              </h3>
              <div className="space-y-4">
                <Input
                  name="patientName"
                  label={t('form.patientName')}
                  placeholder={t('form.patientNamePlaceholder')}
                  required
                  defaultValue={appointment?.patientName}
                />
                <Input
                  name="patientPhone"
                  type="tel"
                  label={t('form.patientPhone')}
                  placeholder={t('form.patientPhonePlaceholder')}
                  required
                  defaultValue={appointment?.patientPhone}
                  dir="ltr"
                />
                <Input
                  name="patientEmail"
                  type="email"
                  label={t('form.patientEmailOptional')}
                  placeholder={t('form.patientEmailPlaceholder')}
                  defaultValue={appointment?.patientEmail}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Notes */}
            <Textarea
              name="notes"
              label={t('form.notes')}
              placeholder={t('form.notesPlaceholder')}
              defaultValue={appointment?.notes}
              rows={3}
            />
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-error-light bg-error-light/50 px-4 py-3 text-sm text-error-dark">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <div>
              {isEdit && onCancel && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleCancel}
                  disabled={cancelling || submitting}
                >
                  {cancelling ? t('form.cancelling') : t('form.cancelAppointment')}
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
                {t('form.close')}
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting
                  ? t('form.saving')
                  : isEdit
                    ? t('form.saveChanges')
                    : t('form.create')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
