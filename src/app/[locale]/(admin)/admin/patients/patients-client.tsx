'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/admin/sidebar';
import { Users, Search, Phone, Mail, Calendar, Clock, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

type SerializedPatient = {
  id: string;
  nom: string;
  telephone: string;
  email: string | null;
  notes: string | null;
  createdAt: string;
  appointmentsCount: number;
  lastAppointment: {
    date: string;
    motif: string;
    statut: string;
  } | null;
};

type PatientsClientProps = {
  patients: SerializedPatient[];
  locale: string;
};

export function PatientsClient({ patients, locale }: PatientsClientProps) {
  const [search, setSearch] = useState('');

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      p.nom.toLowerCase().includes(q) ||
      p.telephone.toLowerCase().includes(q) ||
      (p.email && p.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">
              {locale === 'ar' ? 'المرضى' : locale === 'en' ? 'Patients' : 'Gestion des Patients'}
            </h1>
            <p className="mt-1 text-sm text-ink-600">
              {locale === 'ar'
                ? 'قائمة المرضى المسجلين ومواعيدهم'
                : locale === 'en'
                ? 'List of registered patients and their appointment history'
                : 'Consultez la liste des patients et leur historique de rendez-vous.'}
            </p>
          </div>

          <div className="w-full sm:w-72">
            <div className="relative">
              <Input
                placeholder={
                  locale === 'ar'
                    ? 'بحث بالاسم، الهاتف...'
                    : locale === 'en'
                    ? 'Search by name, phone...'
                    : 'Rechercher par nom, téléphone...'
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-10"
              />
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-ink-100 bg-white p-12 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <Users className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-ink-900">
              {patients.length === 0
                ? locale === 'ar'
                  ? 'لا يوجد مرضى حالياً'
                  : locale === 'en'
                  ? 'No patients yet'
                  : 'Aucun patient enregistré'
                : locale === 'ar'
                ? 'لا توجد نتائج'
                : locale === 'en'
                ? 'No results found'
                : 'Aucun résultat trouvé'}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
              {patients.length === 0
                ? locale === 'ar'
                  ? 'سيظهر المرضى تلقائياً هنا بمجرد حجزهم لموعد جديد.'
                  : locale === 'en'
                  ? 'Patients will automatically appear here once an appointment is booked.'
                  : 'Les patients apparaîtront automatiquement ici dès qu’un rendez-vous est pris.'
                : locale === 'ar'
                ? 'جرب البحث بكلمات أخرى.'
                : locale === 'en'
                ? 'Try searching with different keywords.'
                : 'Essayez avec un autre terme de recherche.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((patient) => (
              <div
                key={patient.id}
                className="flex flex-col justify-between rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                        {patient.nom.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink-900">{patient.nom}</h3>
                        <p className="text-xs text-ink-500">
                          {patient.appointmentsCount}{' '}
                          {patient.appointmentsCount > 1
                            ? locale === 'ar' ? 'مواعيد' : locale === 'en' ? 'appointments' : 'rendez-vous'
                            : locale === 'ar' ? 'موعد' : locale === 'en' ? 'appointment' : 'rendez-vous'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-ink-700">
                    <a
                      href={`tel:${patient.telephone}`}
                      className="flex items-center gap-2 hover:text-primary-600"
                      dir="ltr"
                    >
                      <Phone className="h-4 w-4 text-ink-400" />
                      <span>{patient.telephone}</span>
                    </a>

                    {patient.email && (
                      <a
                        href={`mailto:${patient.email}`}
                        className="flex items-center gap-2 truncate hover:text-primary-600"
                      >
                        <Mail className="h-4 w-4 shrink-0 text-ink-400" />
                        <span className="truncate">{patient.email}</span>
                      </a>
                    )}

                    {patient.lastAppointment && (
                      <div className="flex items-center gap-2 text-xs text-ink-600">
                        <Calendar className="h-4 w-4 shrink-0 text-ink-400" />
                        <span>
                          {locale === 'ar' ? 'آخر موعد:' : locale === 'en' ? 'Last:' : 'Dernier :'}{' '}
                          {new Date(patient.lastAppointment.date).toLocaleDateString(locale, {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    {patient.notes && (
                      <div className="flex items-start gap-2 text-xs text-ink-600">
                        <FileText className="h-4 w-4 shrink-0 text-ink-400" />
                        <span className="line-clamp-2">{patient.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-ink-100 pt-3 flex justify-between items-center text-xs text-ink-500">
                  <span>
                    {locale === 'ar' ? 'مسجل منذ:' : locale === 'en' ? 'Added:' : 'Inscrit le :'}{' '}
                    {new Date(patient.createdAt).toLocaleDateString(locale, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <a
                    href={`https://wa.me/${patient.telephone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
