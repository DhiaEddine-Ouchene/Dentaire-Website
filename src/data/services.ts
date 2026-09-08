import type { LocalizedContent } from '@/lib/i18n-content';

/** Clés d'icônes (voir `service-icon.tsx` pour le rendu). */
export type ServiceIcon =
  | 'consultation'
  | 'cleaning'
  | 'whitening'
  | 'cavity'
  | 'implant'
  | 'ortho'
  | 'crown'
  | 'pediatric'
  | 'emergency';

export type Service = {
  slug: string;
  icon: ServiceIcon;
  /** Durée par défaut en minutes (préremplit la réservation). */
  durationMin: number;
  featured: boolean;
  name: LocalizedContent;
  short: LocalizedContent;
  long: LocalizedContent;
  /** À quoi s'attendre — points clés du déroulé. */
  steps: LocalizedContent[];
};

/**
 * Catalogue des services — source unique pour la page d'accueil (aperçu),
 * la page Services et le préremplissage du motif de réservation.
 * Le contenu réel des motifs administrables vivra en base (modèle Motif) ;
 * cette liste sert de contenu vitrine cohérent et de valeurs par défaut.
 */
export const services: Service[] = [
  {
    slug: 'consultation',
    icon: 'consultation',
    durationMin: 30,
    featured: true,
    name: { fr: 'Consultation & bilan', ar: 'استشارة وتشخيص', en: 'Consultation & check-up' },
    short: {
      fr: 'Un examen complet pour évaluer votre santé bucco-dentaire et établir un plan de soins personnalisé.',
      ar: 'فحص شامل لتقييم صحة فمك ووضع خطة علاج مخصصة.',
      en: 'A complete exam to assess your oral health and build a personalised care plan.'
    },
    long: {
      fr: "La consultation est la première étape de votre prise en charge. Nous prenons le temps d'écouter vos attentes, d'examiner vos dents et vos gencives, et de réaliser si besoin une radiographie. Vous repartez avec un diagnostic clair et un devis détaillé, sans engagement.",
      ar: 'الاستشارة هي الخطوة الأولى في رعايتك. نستمع إلى احتياجاتك، ونفحص أسنانك ولثتك، ونجري صورة إشعاعية عند الحاجة. تغادر بتشخيص واضح وتقدير مفصّل دون أي التزام.',
      en: 'The consultation is the first step of your care. We take time to listen, examine your teeth and gums, and take an X-ray if needed. You leave with a clear diagnosis and a detailed, no-obligation quote.'
    },
    steps: [
      { fr: 'Entretien sur vos antécédents et vos attentes', ar: 'حوار حول تاريخك الطبي وتطلعاتك', en: 'Discussion of your history and expectations' },
      { fr: 'Examen clinique et radiographique', ar: 'فحص سريري وإشعاعي', en: 'Clinical and X-ray examination' },
      { fr: 'Plan de traitement et devis clair', ar: 'خطة علاج وتقدير واضح', en: 'Treatment plan and clear quote' }
    ]
  },
  {
    slug: 'detartrage',
    icon: 'cleaning',
    durationMin: 30,
    featured: true,
    name: { fr: 'Détartrage & hygiène', ar: 'إزالة الجير والعناية', en: 'Scaling & hygiene' },
    short: {
      fr: 'Un nettoyage professionnel qui élimine tartre et plaque pour des gencives saines et un sourire éclatant.',
      ar: 'تنظيف احترافي يزيل الجير والبلاك من أجل لثة سليمة وابتسامة مشرقة.',
      en: 'A professional cleaning that removes tartar and plaque for healthy gums and a brighter smile.'
    },
    long: {
      fr: "Le détartrage prévient les caries et les maladies des gencives. À l'aide d'ultrasons doux, nous retirons le tartre accumulé, puis polissons vos dents. Une séance recommandée deux fois par an pour préserver durablement votre santé bucco-dentaire.",
      ar: 'إزالة الجير تقي من التسوس وأمراض اللثة. باستخدام الموجات فوق الصوتية اللطيفة نزيل الجير المتراكم ثم نلمّع أسنانك. ننصح بجلستين سنويًا للحفاظ على صحة فمك.',
      en: 'Scaling prevents cavities and gum disease. Using gentle ultrasound we remove built-up tartar, then polish your teeth. Recommended twice a year to protect your oral health long term.'
    },
    steps: [
      { fr: 'Évaluation de la plaque et du tartre', ar: 'تقييم البلاك والجير', en: 'Plaque and tartar assessment' },
      { fr: 'Détartrage aux ultrasons', ar: 'إزالة الجير بالموجات فوق الصوتية', en: 'Ultrasonic scaling' },
      { fr: 'Polissage et conseils d\'hygiène', ar: 'تلميع ونصائح للعناية', en: 'Polishing and hygiene advice' }
    ]
  },
  {
    slug: 'blanchiment',
    icon: 'whitening',
    durationMin: 60,
    featured: true,
    name: { fr: 'Blanchiment dentaire', ar: 'تبييض الأسنان', en: 'Teeth whitening' },
    short: {
      fr: 'Retrouvez un sourire plus blanc grâce à un traitement sûr, encadré et adapté à la sensibilité de vos dents.',
      ar: 'استعد ابتسامة أكثر بياضًا بفضل علاج آمن ومتابَع ومناسب لحساسية أسنانك.',
      en: 'Get a whiter smile with a safe, supervised treatment tailored to your sensitivity.'
    },
    long: {
      fr: "Notre blanchiment professionnel éclaircit la teinte de vos dents de plusieurs nuances en une à deux séances. Réalisé au fauteuil sous contrôle, il est bien plus efficace et sûr que les kits du commerce. Un gel désensibilisant protège l'émail.",
      ar: 'يعمل التبييض الاحترافي على تفتيح لون أسنانك عدة درجات في جلسة أو جلستين. يتم في العيادة تحت إشراف، وهو أكثر فعالية وأمانًا من المنتجات التجارية. جل مزيل للحساسية يحمي المينا.',
      en: 'Our professional whitening lightens your teeth by several shades in one or two sessions. Done in-chair under supervision, it is far more effective and safe than store kits. A desensitising gel protects the enamel.'
    },
    steps: [
      { fr: 'Contrôle de la santé des dents', ar: 'فحص صحة الأسنان', en: 'Dental health check' },
      { fr: 'Protection des gencives', ar: 'حماية اللثة', en: 'Gum protection' },
      { fr: 'Application du gel éclaircissant', ar: 'تطبيق جل التبييض', en: 'Application of the whitening gel' }
    ]
  },
  {
    slug: 'soins-caries',
    icon: 'cavity',
    durationMin: 45,
    featured: true,
    name: { fr: 'Soins & caries', ar: 'علاج التسوس', en: 'Fillings & cavities' },
    short: {
      fr: 'Traitement des caries avec des composites esthétiques, invisibles et durables, dans le respect de vos dents.',
      ar: 'علاج التسوس بحشوات تجميلية غير مرئية ومتينة مع الحفاظ على أسنانك.',
      en: 'Cavity treatment with aesthetic, invisible and durable composite fillings.'
    },
    long: {
      fr: "Nous soignons les caries au stade le plus précoce possible pour préserver un maximum de dent saine. Les obturations en composite, assorties à la couleur de vos dents, sont invisibles et résistantes. L'anesthésie locale rend le soin totalement indolore.",
      ar: 'نعالج التسوس في أبكر مرحلة ممكنة للحفاظ على أكبر قدر من السن السليم. الحشوات المركبة المطابقة للون أسنانك غير مرئية ومتينة. التخدير الموضعي يجعل العلاج غير مؤلم تمامًا.',
      en: 'We treat cavities as early as possible to preserve healthy tooth structure. Composite fillings, matched to your tooth colour, are invisible and strong. Local anaesthesia makes the treatment completely painless.'
    },
    steps: [
      { fr: 'Anesthésie locale confortable', ar: 'تخدير موضعي مريح', en: 'Comfortable local anaesthesia' },
      { fr: 'Nettoyage de la carie', ar: 'تنظيف التسوس', en: 'Cleaning the cavity' },
      { fr: 'Obturation esthétique', ar: 'حشو تجميلي', en: 'Aesthetic filling' }
    ]
  },
  {
    slug: 'implants',
    icon: 'implant',
    durationMin: 90,
    featured: true,
    name: { fr: 'Implants dentaires', ar: 'زراعة الأسنان', en: 'Dental implants' },
    short: {
      fr: 'Remplacez une ou plusieurs dents manquantes par une solution fixe, naturelle et durable dans le temps.',
      ar: 'استبدل سنًا مفقودة أو أكثر بحل ثابت وطبيعي ودائم.',
      en: 'Replace one or more missing teeth with a fixed, natural and long-lasting solution.'
    },
    long: {
      fr: "L'implant est une racine artificielle en titane qui remplace la dent perdue et supporte une couronne sur mesure. C'est aujourd'hui la solution la plus proche de la dent naturelle, sans toucher aux dents voisines. Nous planifions chaque pose avec précision.",
      ar: 'الزرعة هي جذر اصطناعي من التيتانيوم يحل محل السن المفقودة ويحمل تاجًا مصممًا خصيصًا. إنها اليوم الحل الأقرب للسن الطبيعية دون المساس بالأسنان المجاورة. نخطط لكل عملية بدقة.',
      en: 'An implant is a titanium root that replaces a lost tooth and supports a custom crown. It is the closest solution to a natural tooth, without touching neighbouring teeth. We plan every placement precisely.'
    },
    steps: [
      { fr: 'Bilan et imagerie 3D', ar: 'تقييم وتصوير ثلاثي الأبعاد', en: 'Assessment and 3D imaging' },
      { fr: 'Pose de l\'implant', ar: 'وضع الزرعة', en: 'Implant placement' },
      { fr: 'Pose de la couronne définitive', ar: 'تركيب التاج النهائي', en: 'Final crown fitting' }
    ]
  },
  {
    slug: 'orthodontie',
    icon: 'ortho',
    durationMin: 45,
    featured: true,
    name: { fr: 'Orthodontie', ar: 'تقويم الأسنان', en: 'Orthodontics' },
    short: {
      fr: 'Alignez vos dents en douceur, avec des solutions discrètes adaptées aux enfants comme aux adultes.',
      ar: 'قوّم أسنانك بلطف بحلول خفية مناسبة للأطفال والبالغين.',
      en: 'Gently align your teeth with discreet solutions for children and adults alike.'
    },
    long: {
      fr: "Un bon alignement améliore l'esthétique du sourire mais aussi la mastication et l'hygiène. Nous proposons des traitements adaptés à chaque âge, y compris des gouttières transparentes quasi invisibles pour les adultes soucieux de discrétion.",
      ar: 'المحاذاة الجيدة تحسّن جمال الابتسامة وكذلك المضغ والنظافة. نقدم علاجات مناسبة لكل عمر، بما في ذلك التقويم الشفاف شبه المرئي للبالغين.',
      en: 'Good alignment improves not just the look of your smile but also chewing and hygiene. We offer treatments for every age, including near-invisible clear aligners for discreet adults.'
    },
    steps: [
      { fr: 'Analyse de l\'alignement', ar: 'تحليل المحاذاة', en: 'Alignment analysis' },
      { fr: 'Choix de l\'appareil adapté', ar: 'اختيار الجهاز المناسب', en: 'Choosing the right appliance' },
      { fr: 'Suivi régulier des progrès', ar: 'متابعة منتظمة للتقدم', en: 'Regular progress follow-up' }
    ]
  }
];

/** Recherche un service par son slug. */
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
