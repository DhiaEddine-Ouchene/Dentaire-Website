'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit2, Trash2, Clock, Power } from 'lucide-react';
import { Sidebar } from '@/components/admin/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getContenu } from '@/lib/i18n-content';
import { cn } from '@/lib/utils';

type Motif = {
  id: string;
  nom: any;
  description: any;
  dureeDefaut: number;
  couleur: string | null;
  actif: boolean;
  ordre: number;
};

type MotifsManagementClientProps = {
  motifs: Motif[];
  locale: string;
  onCreateMotif: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  onUpdateMotif: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  onDeleteMotif: (id: string) => Promise<{ ok: boolean }>;
  onToggleStatus: (id: string) => Promise<{ ok: boolean }>;
};

export function MotifsManagementClient({
  motifs,
  locale,
  onCreateMotif,
  onUpdateMotif,
  onDeleteMotif,
  onToggleStatus
}: MotifsManagementClientProps) {
  const t = useTranslations('admin.motifs');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMotif, setEditingMotif] = useState<Motif | null>(null);

  const handleCreate = () => {
    setEditingMotif(null);
    setModalOpen(true);
  };

  const handleEdit = (motif: Motif) => {
    setEditingMotif(motif);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    await onDeleteMotif(id);
  };

  const handleToggle = async (id: string) => {
    await onToggleStatus(id);
  };

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar onSignOut={() => {}} />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">{t('title')}</h1>
            <p className="mt-1 text-sm text-ink-600">{t('subtitle')}</p>
          </div>
          <Button variant="primary" onClick={handleCreate}>
            <Plus className="h-5 w-5" />
            {t('addMotif')}
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {motifs.map((motif) => (
            <div
              key={motif.id}
              className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-ink-900">
                    {getContenu(motif.nom, locale)}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-ink-600">
                    <Clock className="h-4 w-4" />
                    {motif.dureeDefaut} min
                  </div>
                </div>
                <Badge variant={motif.actif ? 'success' : 'neutral'}>
                  {motif.actif ? t('active') : t('inactive')}
                </Badge>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(motif)}>
                  <Edit2 className="h-4 w-4" />
                  {t('edit')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleToggle(motif.id)}>
                  <Power className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(motif.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {modalOpen && (
          <MotifModal
            motif={editingMotif}
            onClose={() => setModalOpen(false)}
            onSubmit={editingMotif ? onUpdateMotif : onCreateMotif}
          />
        )}
      </main>
    </div>
  );
}

function MotifModal({
  motif,
  onClose,
  onSubmit
}: {
  motif: Motif | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
}) {
  const t = useTranslations('admin.motifs');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    if (motif) formData.append('id', motif.id);
    const result = await onSubmit(formData);
    setSubmitting(false);
    if (result.ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-3xl border border-ink-100 bg-white p-6 shadow-lifted">
        <h2 className="text-xl font-semibold text-ink-900">
          {motif ? t('editTitle') : t('addTitle')}
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input name="nomFr" label={t('nameFr')} required defaultValue={motif?.nom?.fr} />
          <Input name="nomAr" label={t('nameAr')} defaultValue={motif?.nom?.ar} />
          <Input name="nomEn" label={t('nameEn')} defaultValue={motif?.nom?.en} />
          <Input
            name="dureeDefaut"
            type="number"
            label={t('duration')}
            required
            defaultValue={motif?.dureeDefaut ?? 30}
            min={5}
            max={300}
          />
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? t('saving') : t('save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
