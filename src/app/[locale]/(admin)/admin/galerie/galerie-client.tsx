'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/admin/sidebar';
import { getContenu } from '@/lib/i18n-content';
import Image from 'next/image';
import { Image as ImageIcon, Sparkles, Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import { createGalleryCase, updateGalleryCase, deleteGalleryCase, uploadImageToSupabase } from './actions';

type GalleryCase = {
  id: string;
  titre: any;
  description?: any;
  categorie: string;
  imageBefore: string;
  imageAfter: string;
  featured: boolean;
  actif: boolean;
};

type GalerieClientProps = {
  cases: GalleryCase[];
  locale: string;
};

export function GalerieClient({ cases, locale }: GalerieClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingCase, setEditingCase] = useState<GalleryCase | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (caseToEdit?: GalleryCase) => {
    setEditingCase(caseToEdit || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCase(null);
  };

  const handleDelete = async (id: string) => {
    const message =
      locale === 'ar'
        ? 'هل أنت متأكد من الحذف؟'
        : locale === 'en'
        ? 'Are you sure you want to delete this case?'
        : 'Êtes-vous sûr de vouloir supprimer cette réalisation ?';

    if (!confirm(message)) return;

    setLoading(true);
    const result = await deleteGalleryCase(id);
    setLoading(false);
    if (result.success) {
      window.location.reload();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">
              {locale === 'ar' ? 'معرض الصور (قبل / بعد)' : locale === 'en' ? 'Before / After Gallery' : 'Galerie Avant / Après'}
            </h1>
            <p className="mt-1 text-sm text-ink-600">
              {locale === 'ar'
                ? 'إدارة الحالات السريرية المعروضة على الموقع'
                : locale === 'en'
                ? 'Manage clinical cases shown on the public website'
                : 'Gérez les cas cliniques présentés sur la page galerie'}
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {locale === 'ar' ? 'إضافة حالة' : locale === 'en' ? 'Add Case' : 'Ajouter un cas'}
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
            >
              <div className="relative h-40 w-full overflow-hidden bg-ink-100">
                <Image
                  src={item.imageAfter}
                  alt={getContenu(item.titre, locale)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 capitalize">
                    {item.categorie}
                  </span>
                  {item.featured && (
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                      <Sparkles className="h-3.5 w-3.5" />
                      {locale === 'ar' ? 'مميز' : locale === 'en' ? 'Featured' : 'Mis en avant'}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-semibold text-ink-900">
                  {getContenu(item.titre, locale)}
                </h3>
                <p className="mt-1 text-xs text-ink-600 line-clamp-2">
                  {item.description ? getContenu(item.description, locale) : ''}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-ink-100 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-200 transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                    {locale === 'ar' ? 'تعديل' : locale === 'en' ? 'Edit' : 'Modifier'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    {locale === 'ar' ? 'حذف' : locale === 'en' ? 'Delete' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <GalleryModal
          caseData={editingCase}
          locale={locale}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

function GalleryModal({
  caseData,
  locale,
  onClose
}: {
  caseData: GalleryCase | null;
  locale: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [beforeImage, setBeforeImage] = useState(caseData?.imageBefore || '');
  const [afterImage, setAfterImage] = useState(caseData?.imageAfter || '');
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

  const handleImageUpload = async (file: File, type: 'before' | 'after') => {
    const formData = new FormData();
    formData.append('file', file);

    if (type === 'before') setUploadingBefore(true);
    else setUploadingAfter(true);

    const result = await uploadImageToSupabase(formData);

    if (type === 'before') setUploadingBefore(false);
    else setUploadingAfter(false);

    if (result.success && result.url) {
      if (type === 'before') setBeforeImage(result.url);
      else setAfterImage(result.url);
    } else {
      alert(result.error || 'Upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      titre: {
        fr: formData.get('titre_fr') as string,
        ar: formData.get('titre_ar') as string || undefined,
        en: formData.get('titre_en') as string || undefined
      },
      description: {
        fr: formData.get('description_fr') as string || undefined,
        ar: formData.get('description_ar') as string || undefined,
        en: formData.get('description_en') as string || undefined
      },
      categorie: formData.get('categorie') as any,
      imageBefore: beforeImage,
      imageAfter: afterImage,
      featured: formData.get('featured') === 'on'
    };

    let result;
    if (caseData) {
      result = await updateGalleryCase(caseData.id, data);
    } else {
      result = await createGalleryCase(data);
    }

    setLoading(false);
    if (result.success) {
      window.location.reload();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink-900">
            {caseData
              ? (locale === 'ar' ? 'تعديل الحالة' : locale === 'en' ? 'Edit Case' : 'Modifier le cas')
              : (locale === 'ar' ? 'إضافة حالة جديدة' : locale === 'en' ? 'Add New Case' : 'Ajouter un nouveau cas')}
          </h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">
              {locale === 'ar' ? 'الفئة' : locale === 'en' ? 'Category' : 'Catégorie'}
            </label>
            <select
              name="categorie"
              defaultValue={caseData?.categorie || 'whitening'}
              required
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="whitening">Whitening / {locale === 'ar' ? 'تبييض' : 'Blanchiment'}</option>
              <option value="ortho">Orthodontics / {locale === 'ar' ? 'تقويم' : 'Orthodontie'}</option>
              <option value="implant">Implant / {locale === 'ar' ? 'زرعة' : 'Implant'}</option>
              <option value="aesthetic">Aesthetic / {locale === 'ar' ? 'تجميل' : 'Esthétique'}</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {locale === 'ar' ? 'صورة قبل' : locale === 'en' ? 'Before Image' : 'Image Avant'}
              </label>
              <div className="relative">
                {beforeImage ? (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg border border-ink-200">
                    <Image src={beforeImage} alt="Before" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setBeforeImage('')}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-ink-300 hover:border-primary-500 transition-colors">
                    <Upload className="h-8 w-8 text-ink-400" />
                    <span className="mt-2 text-xs text-ink-500">
                      {uploadingBefore ? (locale === 'ar' ? 'جاري الرفع...' : locale === 'en' ? 'Uploading...' : 'Téléversement...') : (locale === 'ar' ? 'انقر للرفع' : locale === 'en' ? 'Click to upload' : 'Cliquer pour téléverser')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'before');
                      }}
                      disabled={uploadingBefore}
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {locale === 'ar' ? 'صورة بعد' : locale === 'en' ? 'After Image' : 'Image Après'}
              </label>
              <div className="relative">
                {afterImage ? (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg border border-ink-200">
                    <Image src={afterImage} alt="After" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setAfterImage('')}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-ink-300 hover:border-primary-500 transition-colors">
                    <Upload className="h-8 w-8 text-ink-400" />
                    <span className="mt-2 text-xs text-ink-500">
                      {uploadingAfter ? (locale === 'ar' ? 'جاري الرفع...' : locale === 'en' ? 'Uploading...' : 'Téléversement...') : (locale === 'ar' ? 'انقر للرفع' : locale === 'en' ? 'Click to upload' : 'Cliquer pour téléverser')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'after');
                      }}
                      disabled={uploadingAfter}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">
              {locale === 'ar' ? 'العنوان (فرنسي)' : locale === 'en' ? 'Title (French)' : 'Titre (Français)'} *
            </label>
            <input
              type="text"
              name="titre_fr"
              defaultValue={caseData?.titre?.fr || ''}
              required
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {locale === 'ar' ? 'العنوان (عربي)' : locale === 'en' ? 'Title (Arabic)' : 'Titre (Arabe)'}
              </label>
              <input
                type="text"
                name="titre_ar"
                defaultValue={caseData?.titre?.ar || ''}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {locale === 'ar' ? 'العنوان (إنجليزي)' : locale === 'en' ? 'Title (English)' : 'Titre (Anglais)'}
              </label>
              <input
                type="text"
                name="titre_en"
                defaultValue={caseData?.titre?.en || ''}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">
              {locale === 'ar' ? 'الوصف (فرنسي)' : locale === 'en' ? 'Description (French)' : 'Description (Français)'}
            </label>
            <textarea
              name="description_fr"
              defaultValue={caseData?.description?.fr || ''}
              rows={2}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {locale === 'ar' ? 'الوصف (عربي)' : locale === 'en' ? 'Description (Arabic)' : 'Description (Arabe)'}
              </label>
              <textarea
                name="description_ar"
                defaultValue={caseData?.description?.ar || ''}
                rows={2}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                {locale === 'ar' ? 'الوصف (إنجليزي)' : locale === 'en' ? 'Description (English)' : 'Description (Anglais)'}
              </label>
              <textarea
                name="description_en"
                defaultValue={caseData?.description?.en || ''}
                rows={2}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              defaultChecked={caseData?.featured || false}
              className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="featured" className="text-sm text-ink-700">
              {locale === 'ar' ? 'مميز' : locale === 'en' ? 'Featured' : 'Mis en avant'}
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
            >
              {locale === 'ar' ? 'إلغاء' : locale === 'en' ? 'Cancel' : 'Annuler'}
            </button>
            <button
              type="submit"
              disabled={loading || !beforeImage || !afterImage}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:bg-ink-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? (locale === 'ar' ? 'جاري الحفظ...' : locale === 'en' ? 'Saving...' : 'Enregistrement...')
                : (locale === 'ar' ? 'حفظ' : locale === 'en' ? 'Save' : 'Enregistrer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
