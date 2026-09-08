'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/admin/sidebar';
import { CalendarView } from '@/components/admin/calendar-view';
import { AppointmentModal } from '@/components/admin/appointment-modal';

type Appointment = {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  motifId: string;
  motifName: string;
  dateDebut: string;
  dateFin: string;
  statut: 'CONFIRME' | 'ANNULE' | 'TERMINE';
  notes?: string;
};

type Motif = {
  id: string;
  nom: string;
  durationMin: number;
};

type AdminDashboardClientProps = {
  appointments: Appointment[];
  motifs: Motif[];
  locale: string;
  onSignOut: () => void;
  onCreateAppointment: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  onUpdateAppointment: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  onCancelAppointment: (id: string) => Promise<{ ok: boolean }>;
};

export function AdminDashboardClient({
  appointments,
  motifs,
  locale,
  onSignOut,
  onCreateAppointment,
  onUpdateAppointment,
  onCancelAppointment
}: AdminDashboardClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setModalOpen(true);
  };

  const handleEditAppointment = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (apt) {
      setEditingAppointment(apt);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAppointment(null);
  };

  const handleSubmit = async (formData: FormData) => {
    if (editingAppointment) {
      return await onUpdateAppointment(formData);
    } else {
      return await onCreateAppointment(formData);
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar onSignOut={onSignOut} />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <CalendarView
          appointments={appointments}
          locale={locale}
          onAddAppointment={handleAddAppointment}
          onEditAppointment={handleEditAppointment}
        />
      </main>

      {modalOpen && (
        <AppointmentModal
          motifs={motifs}
          appointment={editingAppointment}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          onCancel={editingAppointment ? onCancelAppointment : undefined}
        />
      )}
    </div>
  );
}
