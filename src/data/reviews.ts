import type { LocalizedContent } from '@/lib/i18n-content';

export type Review = {
  author: string;
  rating: number; // 1 à 5
  /** Date ISO (affichée relativement / formatée selon la locale). */
  date: string;
  text: LocalizedContent;
};

/**
 * Avis de démonstration (style Google). En production, les avis publiés
 * proviennent du modèle `Avis` (statut PUBLIE) ou de l'API Google Reviews.
 */
export const reviews: Review[] = [
  {
    author: 'Yasmine B.',
    rating: 5,
    date: '2025-07-12',
    text: {
      fr: "Accueil chaleureux et équipe très professionnelle. Le docteur prend le temps d'expliquer chaque étape. Je n'ai plus peur du dentiste !",
      ar: 'استقبال دافئ وفريق محترف جدًا. يشرح الطبيب كل خطوة بعناية. لم أعد أخاف من طبيب الأسنان!',
      en: 'Warm welcome and a very professional team. The doctor takes time to explain each step. I am no longer afraid of the dentist!'
    }
  },
  {
    author: 'Karim M.',
    rating: 5,
    date: '2025-06-03',
    text: {
      fr: 'Cabinet moderne et impeccable. Mon blanchiment a donné un résultat naturel, exactement ce que je voulais. Je recommande vivement.',
      ar: 'عيادة حديثة ونظيفة تمامًا. أعطى التبييض نتيجة طبيعية، تمامًا كما أردت. أنصح بها بشدة.',
      en: 'Modern, spotless practice. My whitening looked natural, exactly what I wanted. Highly recommend.'
    }
  },
  {
    author: 'Sofia L.',
    rating: 5,
    date: '2025-05-21',
    text: {
      fr: "J'ai posé un implant ici et tout s'est parfaitement passé, sans douleur. Le suivi après l'intervention est vraiment rassurant.",
      ar: 'زرعت سنًا هنا وسار كل شيء على ما يرام دون ألم. المتابعة بعد العملية مطمئنة حقًا.',
      en: 'I had an implant placed here and everything went perfectly, pain-free. The aftercare follow-up is truly reassuring.'
    }
  },
  {
    author: 'Nadia R.',
    rating: 5,
    date: '2025-04-09',
    text: {
      fr: 'Mes enfants adorent venir ! Le docteur est patient et pédagogue avec eux. Un vrai cabinet familial de confiance.',
      ar: 'يحب أطفالي المجيء! الطبيب صبور ولطيف معهم. عيادة عائلية موثوقة حقًا.',
      en: 'My kids love coming! The doctor is patient and great with them. A truly trustworthy family practice.'
    }
  },
  {
    author: 'Amine T.',
    rating: 5,
    date: '2025-03-15',
    text: {
      fr: 'Prise de rendez-vous simple, très peu d\'attente, et des explications claires sur les tarifs. Service au top.',
      ar: 'حجز موعد بسيط، انتظار قليل جدًا، وشرح واضح للأسعار. خدمة ممتازة.',
      en: 'Easy booking, very little waiting, and clear explanations about pricing. Top-notch service.'
    }
  }
];

/** Note moyenne calculée sur les avis. */
export const averageRating =
  Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
