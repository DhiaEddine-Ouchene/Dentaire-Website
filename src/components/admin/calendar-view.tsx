'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';
import { fr, ar, enUS, type Locale } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Clock, User, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type AppointmentStatus = 'CONFIRME' | 'ANNULE' | 'TERMINE';

type Appointment = {
  id: string;
  patientName: string;
  patientPhone: string;
  motifName: string;
  dateDebut: string; // ISO datetime
  dateFin: string;
  statut: AppointmentStatus;
};

type CalendarViewProps = {
  appointments: Appointment[];
  locale: string;
  onAddAppointment: () => void;
  onEditAppointment: (id: string) => void;
};

const localeMap = { fr, ar, en: enUS };

export function CalendarView({
  appointments,
  locale,
  onAddAppointment,
  onEditAppointment
}: CalendarViewProps) {
  const t = useTranslations('admin.calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');

  const dateLocale = localeMap[locale as keyof typeof localeMap] || fr;

  // Generate days for week view
  const weekDays = useMemo(() => {
    if (view === 'day') return [currentDate];
    const start = startOfWeek(currentDate, { locale: dateLocale });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate, view, dateLocale]);

  // Filter appointments for visible days
  const visibleAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const aptDate = parseISO(apt.dateDebut);
      return weekDays.some((day) => isSameDay(aptDate, day));
    });
  }, [appointments, weekDays]);

  // Group appointments by day
  const appointmentsByDay = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {};
    weekDays.forEach((day) => {
      const key = format(day, 'yyyy-MM-dd');
      grouped[key] = visibleAppointments
        .filter((apt) => isSameDay(parseISO(apt.dateDebut), day))
        .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut));
    });
    return grouped;
  }, [weekDays, visibleAppointments]);

  const goToPrevious = () => {
    setCurrentDate((d) => addDays(d, view === 'day' ? -1 : -7));
  };

  const goToNext = () => {
    setCurrentDate((d) => addDays(d, view === 'day' ? 1 : 7));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const variants = {
      CONFIRME: 'success' as const,
      ANNULE: 'error' as const,
      TERMINE: 'neutral' as const
    };
    return <Badge variant={variants[status]}>{t(`status.${status}`)}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-ink-600">
            {format(currentDate, view === 'day' ? 'EEEE d MMMM yyyy' : 'MMMM yyyy', {
              locale: dateLocale
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="md" onClick={goToToday}>
            {t('today')}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="md" onClick={goToPrevious}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="md" onClick={goToNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex rounded-xl border border-ink-200 bg-white">
            <button
              type="button"
              onClick={() => setView('day')}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                view === 'day'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-ink-600 hover:text-ink-900'
              )}
            >
              {t('viewDay')}
            </button>
            <button
              type="button"
              onClick={() => setView('week')}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                view === 'week'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-ink-600 hover:text-ink-900'
              )}
            >
              {t('viewWeek')}
            </button>
          </div>
          <Button variant="primary" size="md" onClick={onAddAppointment}>
            <Plus className="h-5 w-5" />
            {t('addAppointment')}
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-3xl border border-ink-100 bg-white shadow-soft">
        {view === 'day' ? (
          <DayView
            day={currentDate}
            appointments={appointmentsByDay[format(currentDate, 'yyyy-MM-dd')] || []}
            locale={locale}
            dateLocale={dateLocale}
            onEdit={onEditAppointment}
            getStatusBadge={getStatusBadge}
            t={t}
          />
        ) : (
          <WeekView
            days={weekDays}
            appointmentsByDay={appointmentsByDay}
            dateLocale={dateLocale}
            onEdit={onEditAppointment}
            getStatusBadge={getStatusBadge}
            t={t}
          />
        )}
      </div>
    </div>
  );
}

function DayView({
  day,
  appointments,
  locale,
  dateLocale,
  onEdit,
  getStatusBadge,
  t
}: {
  day: Date;
  appointments: Appointment[];
  locale: string;
  dateLocale: Locale;
  onEdit: (id: string) => void;
  getStatusBadge: (status: AppointmentStatus) => React.ReactNode;
  t: any;
}) {
  return (
    <div className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-ink-900">
        {format(day, 'EEEE d MMMM', { locale: dateLocale })}
      </h2>
      {appointments.length === 0 ? (
        <div className="rounded-2xl bg-ink-50 px-4 py-12 text-center">
          <Calendar className="mx-auto h-8 w-8 text-ink-400" />
          <p className="mt-3 text-sm text-ink-500">{t('noAppointments')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onEdit={() => onEdit(apt.id)}
              getStatusBadge={getStatusBadge}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WeekView({
  days,
  appointmentsByDay,
  dateLocale,
  onEdit,
  getStatusBadge,
  t
}: {
  days: Date[];
  appointmentsByDay: Record<string, Appointment[]>;
  dateLocale: Locale;
  onEdit: (id: string) => void;
  getStatusBadge: (status: AppointmentStatus) => React.ReactNode;
  t: any;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[768px] grid-cols-7">
        {days.map((day, i) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayAppointments = appointmentsByDay[dayKey] || [];
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={dayKey}
              className={cn(
                'border-e border-ink-100 p-3 last:border-e-0',
                i === 0 && 'border-s-0'
              )}
            >
              <div
                className={cn(
                  'mb-3 text-center',
                  isToday && 'rounded-xl bg-primary-50 p-2'
                )}
              >
                <p className="text-xs font-medium uppercase text-ink-500">
                  {format(day, 'EEE', { locale: dateLocale })}
                </p>
                <p
                  className={cn(
                    'mt-1 text-lg font-semibold',
                    isToday ? 'text-primary-700' : 'text-ink-900'
                  )}
                >
                  {format(day, 'd')}
                </p>
              </div>
              <div className="space-y-2">
                {dayAppointments.map((apt) => (
                  <button
                    key={apt.id}
                    type="button"
                    onClick={() => onEdit(apt.id)}
                    className="w-full rounded-xl border border-ink-100 bg-white p-2 text-left text-xs transition-shadow hover:shadow-soft"
                  >
                    <p className="font-medium text-ink-900">{format(parseISO(apt.dateDebut), 'HH:mm')}</p>
                    <p className="mt-1 text-ink-600 line-clamp-1">{apt.patientName}</p>
                    <p className="mt-1 text-ink-500 line-clamp-1">{apt.motifName}</p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AppointmentCard({
  appointment,
  onEdit,
  getStatusBadge,
  t
}: {
  appointment: Appointment;
  onEdit: () => void;
  getStatusBadge: (status: AppointmentStatus) => React.ReactNode;
  t: any;
}) {
  const startTime = format(parseISO(appointment.dateDebut), 'HH:mm');
  const endTime = format(parseISO(appointment.dateFin), 'HH:mm');

  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex w-full items-start gap-4 rounded-2xl border border-ink-100 bg-white p-4 text-left transition-all hover:border-primary-300 hover:shadow-soft"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <Clock className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-ink-900">
              {startTime} – {endTime}
            </p>
            <p className="mt-0.5 text-sm text-ink-600">{appointment.motifName}</p>
          </div>
          {getStatusBadge(appointment.statut)}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-600">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {appointment.patientName}
          </span>
          <span className="flex items-center gap-1.5" dir="ltr">
            <Phone className="h-4 w-4" />
            {appointment.patientPhone}
          </span>
        </div>
      </div>
    </button>
  );
}
