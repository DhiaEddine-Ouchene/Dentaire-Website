import type { LocalizedContent } from '@/lib/i18n-content';

export type FaqCategory = 'pain' | 'price' | 'children' | 'emergency' | 'general';

export type FaqItem = {
  category: FaqCategory;
  /** Mis en avant sur la page d'accueil (aperçu court). */
  featured: boolean;
  question: LocalizedContent;
  answer: LocalizedContent;
};

/** Questions fréquentes — page d'accueil (aperçu) + page FAQ complète. */
export const faqItems: FaqItem[] = [
  {
    category: 'pain',
    featured: true,
    question: { fr: 'Les soins sont-ils douloureux ?', ar: 'هل العلاجات مؤلمة؟', en: 'Are treatments painful?' },
    answer: {
      fr: "Non. Nous utilisons une anesthésie locale efficace et des techniques modernes pour que les soins soient indolores. Votre confort est notre priorité à chaque étape.",
      ar: 'لا. نستخدم تخديرًا موضعيًا فعّالًا وتقنيات حديثة لجعل العلاجات غير مؤلمة. راحتك أولويتنا في كل خطوة.',
      en: 'No. We use effective local anaesthesia and modern techniques so treatments are painless. Your comfort is our priority at every step.'
    }
  },
  {
    category: 'price',
    featured: true,
    question: { fr: 'Acceptez-vous la CNAS et la CASNOS ?', ar: 'هل تقبلون CNAS و CASNOS؟', en: 'Do you accept CNAS and CASNOS?' },
    answer: {
      fr: 'Oui, nous sommes conventionnés et acceptons la CNAS et la CASNOS. Un devis détaillé vous est toujours remis avant tout traitement, sans surprise.',
      ar: 'نعم، نحن متعاقدون ونقبل CNAS و CASNOS. يُسلّم لك دائمًا تقدير مفصّل قبل أي علاج دون مفاجآت.',
      en: 'Yes, we are contracted and accept CNAS and CASNOS. A detailed quote is always provided before any treatment, with no surprises.'
    }
  },
  {
    category: 'price',
    featured: true,
    question: { fr: 'Comment connaître le prix d\'un traitement ?', ar: 'كيف أعرف سعر العلاج؟', en: 'How do I find out the price of a treatment?' },
    answer: {
      fr: "Après la consultation, un devis clair et détaillé vous est remis. Nous prenons le temps d'expliquer chaque poste afin que vous décidiez en toute transparence.",
      ar: 'بعد الاستشارة، يُسلّم لك تقدير واضح ومفصّل. نأخذ الوقت لشرح كل بند لتقرر بكل شفافية.',
      en: 'After the consultation you receive a clear, detailed quote. We take time to explain each item so you can decide with full transparency.'
    }
  },
  {
    category: 'children',
    featured: true,
    question: { fr: 'À partir de quel âge amener mon enfant ?', ar: 'من أي عمر أحضر طفلي؟', en: 'From what age should I bring my child?' },
    answer: {
      fr: "Dès l'apparition des premières dents, une visite vers 1 an est idéale pour habituer l'enfant. Nous accueillons les plus jeunes en douceur, dans une ambiance rassurante.",
      ar: 'منذ ظهور الأسنان الأولى، تُعدّ زيارة حوالي عمر السنة مثالية لتعويد الطفل. نستقبل الصغار بلطف في أجواء مطمئنة.',
      en: 'As soon as the first teeth appear, a visit around age 1 is ideal to get your child used to it. We welcome little ones gently, in a reassuring setting.'
    }
  },
  {
    category: 'emergency',
    featured: true,
    question: { fr: 'Que faire en cas d\'urgence dentaire ?', ar: 'ماذا أفعل في حالة طوارئ الأسنان؟', en: 'What should I do in a dental emergency?' },
    answer: {
      fr: "Contactez-nous par téléphone ou WhatsApp dès que possible : nous réservons chaque jour des créneaux pour les urgences (douleur vive, dent cassée, gonflement) afin de vous soulager rapidement.",
      ar: 'اتصل بنا هاتفيًا أو عبر واتساب في أقرب وقت: نحجز يوميًا مواعيد للطوارئ (ألم حاد، سن مكسورة، تورم) لتخفيف ألمك بسرعة.',
      en: 'Call us or message on WhatsApp as soon as possible: we keep daily slots for emergencies (severe pain, broken tooth, swelling) to relieve you quickly.'
    }
  },
  {
    category: 'general',
    featured: false,
    question: { fr: 'Faut-il un rendez-vous ou puis-je venir directement ?', ar: 'هل أحتاج موعدًا أم يمكنني الحضور مباشرة؟', en: 'Do I need an appointment or can I just come in?' },
    answer: {
      fr: 'Nous fonctionnons sur rendez-vous pour limiter votre attente. Vous pouvez réserver en ligne en quelques clics, par téléphone ou via WhatsApp.',
      ar: 'نعمل بنظام المواعيد لتقليل انتظارك. يمكنك الحجز عبر الإنترنت بنقرات قليلة، أو هاتفيًا أو عبر واتساب.',
      en: 'We work by appointment to limit your wait. You can book online in a few clicks, by phone, or via WhatsApp.'
    }
  },
  {
    category: 'pain',
    featured: false,
    question: { fr: 'J\'ai peur du dentiste, comment m\'accompagnez-vous ?', ar: 'أخاف من طبيب الأسنان، كيف ترافقونني؟', en: 'I\'m afraid of the dentist — how do you help?' },
    answer: {
      fr: "L'appréhension est très fréquente et nous la prenons au sérieux. Nous expliquons chaque geste, avançons à votre rythme et proposons des pauses. Pour les patients très anxieux, des solutions de sédation douce existent : parlons-en en consultation.",
      ar: 'القلق شائع جدًا ونتعامل معه بجدية. نشرح كل خطوة، ونتقدّم وفق وتيرتك، ونقترح فترات راحة. وللمرضى شديدي القلق تتوفّر حلول تهدئة لطيفة: لنتحدث عنها في الاستشارة.',
      en: 'Anxiety is very common and we take it seriously. We explain every step, move at your pace and offer breaks. For very anxious patients, gentle sedation options exist — let\'s discuss it at your consultation.'
    }
  },
  {
    category: 'price',
    featured: false,
    question: { fr: 'Proposez-vous des facilités de paiement ?', ar: 'هل تقدّمون تسهيلات في الدفع؟', en: 'Do you offer payment facilities?' },
    answer: {
      fr: "Pour les traitements importants (implants, orthodontie, prothèses), un paiement échelonné peut être mis en place. Nous en définissons ensemble les modalités lors de la remise du devis.",
      ar: 'بالنسبة للعلاجات الكبيرة (الزرعات، التقويم، التركيبات)، يمكن ترتيب دفع مقسّط. نحدّد معًا الشروط عند تسليم التقدير.',
      en: 'For major treatments (implants, orthodontics, prosthetics), instalment payment can be arranged. We define the terms together when the quote is issued.'
    }
  },
  {
    category: 'children',
    featured: false,
    question: { fr: 'Comment préparer mon enfant à sa première visite ?', ar: 'كيف أُهيّئ طفلي لزيارته الأولى؟', en: 'How do I prepare my child for their first visit?' },
    answer: {
      fr: "Parlez-en positivement, sans dramatiser ni promettre « qu'il n'y aura rien ». La première visite est avant tout une prise de contact ludique : l'enfant découvre le cabinet, s'installe dans le fauteuil et rencontre l'équipe en confiance.",
      ar: 'تحدّث عنها بإيجابية دون تهويل ودون وعد بأن «لا شيء سيحدث». الزيارة الأولى هي قبل كل شيء تعارف ممتع: يكتشف الطفل العيادة، ويجلس على الكرسي، ويتعرّف على الفريق بثقة.',
      en: 'Talk about it positively, without dramatising or promising “nothing will happen”. The first visit is mainly a playful introduction: your child discovers the practice, sits in the chair and meets the team with confidence.'
    }
  },
  {
    category: 'emergency',
    featured: false,
    question: { fr: 'Une dent définitive a été expulsée, que faire ?', ar: 'سقطت سن دائمة كاملة، ماذا أفعل؟', en: 'A permanent tooth was knocked out — what should I do?' },
    answer: {
      fr: "Agissez vite : saisissez la dent par la couronne (jamais la racine), rincez-la brièvement si besoin et conservez-la dans du lait ou de la salive. Contactez-nous immédiatement — réimplantée dans l'heure, ses chances de survie sont bien meilleures.",
      ar: 'تصرّف بسرعة: أمسك السن من التاج (لا الجذر أبدًا)، اشطفها بسرعة عند الحاجة واحفظها في الحليب أو اللعاب. اتصل بنا فورًا — إعادة زرعها خلال ساعة يرفع فرص بقائها كثيرًا.',
      en: 'Act fast: hold the tooth by the crown (never the root), rinse it briefly if needed and keep it in milk or saliva. Contact us immediately — re-implanted within the hour, its chances of survival are far better.'
    }
  },
  {
    category: 'general',
    featured: false,
    question: { fr: 'À quelle fréquence faire un contrôle et un détartrage ?', ar: 'كم مرّة يُنصح بالفحص وإزالة الجير؟', en: 'How often should I have a check-up and scaling?' },
    answer: {
      fr: "Un contrôle une à deux fois par an suffit pour la plupart des patients, avec un détartrage annuel. Ce rythme peut être adapté selon votre situation (gencives sensibles, tabac, orthodontie).",
      ar: 'يكفي معظم المرضى فحص مرّة إلى مرّتين سنويًا مع إزالة جير سنوية. يمكن تعديل هذا الإيقاع حسب حالتك (لثة حساسة، تدخين، تقويم).',
      en: 'A check-up once or twice a year is enough for most patients, with annual scaling. This rhythm can be adjusted to your situation (sensitive gums, smoking, orthodontics).'
    }
  },
  {
    category: 'general',
    featured: false,
    question: { fr: 'Combien de temps dure un rendez-vous ?', ar: 'كم يستغرق الموعد؟', en: 'How long does an appointment last?' },
    answer: {
      fr: "Cela dépend du soin : comptez environ 30 minutes pour une consultation ou un détartrage, et jusqu'à une heure ou plus pour certains traitements. La durée estimée vous est indiquée au moment de la réservation.",
      ar: 'يعتمد على نوع العلاج: نحو 30 دقيقة للاستشارة أو إزالة الجير، وحتى ساعة أو أكثر لبعض العلاجات. تُعرض لك المدة التقديرية عند الحجز.',
      en: 'It depends on the treatment: around 30 minutes for a consultation or scaling, and up to an hour or more for some procedures. The estimated duration is shown when you book.'
    }
  }
];
