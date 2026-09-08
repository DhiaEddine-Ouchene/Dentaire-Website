import type { LocalizedContent } from '@/lib/i18n-content';
import type { PlaceholderTone } from '@/components/ui/image-placeholder';

/** Catégories de traitement pour le filtre de la galerie. */
export type GalleryCategory = 'whitening' | 'ortho' | 'implant' | 'aesthetic';

export type GalleryCase = {
  id: string;
  category: GalleryCategory;
  featured: boolean;
  image?: string;
  imageBefore: string;
  imageAfter: string;
  /** Teintes des visuels avant/après (placeholders dégradés de secours). */
  toneBefore: PlaceholderTone;
  toneAfter: PlaceholderTone;
  title: LocalizedContent;
  description: LocalizedContent;
};

/**
 * Cas avant/après de démonstration avec images haute définition pour le curseur interactif.
 */
export const galleryCases: GalleryCase[] = [
  {
    id: 'whitening-1',
    category: 'whitening',
    featured: true,
    imageBefore: '/images/gallery/whitening-before.jpg',
    imageAfter: '/images/gallery/whitening-after.jpg',
    image: '/images/gallery/whitening-after.jpg',
    toneBefore: 'ink',
    toneAfter: 'teal',
    title: { fr: 'Blanchiment éclat', ar: 'تبييض مشرق', en: 'Radiant whitening' },
    description: {
      fr: 'Trois teintes gagnées en une seule séance, pour un sourire lumineux et naturel.',
      ar: 'ثلاث درجات أفتح في جلسة واحدة، لابتسامة مشرقة وطبيعية.',
      en: 'Three shades brighter in a single session, for a luminous, natural smile.'
    }
  },

  {
    id: 'implant-1',
    category: 'implant',
    featured: true,
    imageBefore: '/images/gallery/implant-before.png',
    imageAfter: '/images/gallery/implant-after.png',
    image: '/images/gallery/implant-after.png',
    toneBefore: 'ink',
    toneAfter: 'primary',
    title: { fr: 'Implant unitaire', ar: 'زرعة سنّية مفردة', en: 'Single implant' },
    description: {
      fr: 'Remplacement d\'une dent manquante par un implant et une couronne céramique sur mesure.',
      ar: 'استبدال سن مفقودة بزرعة وتاج خزفي مصمم خصيصًا.',
      en: 'A missing tooth replaced with an implant and a custom ceramic crown.'
    }
  },
  {
    id: 'aesthetic-1',
    category: 'aesthetic',
    featured: true,
    imageBefore: '/images/gallery/veneers-before.png',
    imageAfter: '/images/gallery/veneers-after.png',
    image: '/images/gallery/veneers-after.png',
    toneBefore: 'sand',
    toneAfter: 'gold',
    title: { fr: 'Facettes céramiques', ar: 'قشور خزفية', en: 'Ceramic veneers' },
    description: {
      fr: 'Harmonisation du sourire avec des facettes fines pour une esthétique naturelle.',
      ar: 'تنسيق الابتسامة بقشور رقيقة لجمال طبيعي.',
      en: 'A harmonised smile with thin veneers for a natural aesthetic.'
    }
  },
  {
    id: 'aesthetic-2',
    category: 'aesthetic',
    featured: false,
    imageBefore: '/images/gallery/composite-before.png',
    imageAfter: '/images/gallery/composite-after.png',
    image: '/images/gallery/composite-after.png',
    toneBefore: 'ink',
    toneAfter: 'teal',
    title: { fr: 'Composite esthétique', ar: 'ترميم تجميلي', en: 'Aesthetic bonding' },
    description: {
      fr: 'Reconstruction d\'un bord de dent ébréché, invisible et durable.',
      ar: 'ترميم حافة سن مكسورة بشكل غير مرئي ومتين.',
      en: 'A chipped tooth edge rebuilt, invisible and durable.'
    }
  },
  {
    id: 'whitening-2',
    category: 'whitening',
    featured: false,
    imageBefore: '/images/gallery/whitening-before.jpg',
    imageAfter: '/images/gallery/whitening-after.jpg',
    image: '/images/gallery/whitening-after.jpg',
    toneBefore: 'sand',
    toneAfter: 'teal',
    title: { fr: 'Sourire ravivé', ar: 'ابتسامة متجددة', en: 'Revived smile' },
    description: {
      fr: 'Élimination des taches de café et de tabac pour retrouver l\'éclat d\'origine.',
      ar: 'إزالة بقع القهوة والتبغ لاستعادة البريق الأصلي.',
      en: 'Coffee and tobacco stains removed to restore the original glow.'
    }
  }
];
