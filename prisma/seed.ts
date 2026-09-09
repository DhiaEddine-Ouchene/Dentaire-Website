import { PrismaClient, JourSemaine } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script de seed pour démonstration
 * Remplit la base avec des données réalistes pour un cabinet dentaire à Chlef, Algérie
 */

async function main() {
  console.log('🌱 Début du seeding...');

  // 1. Nettoyer les données existantes (ordre important pour les contraintes FK)
  console.log('🧹 Nettoyage des données existantes...');
  await prisma.avis.deleteMany();
  await prisma.casGalerie.deleteMany();
  await prisma.rendezVous.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.motif.deleteMany();
  await prisma.horaire.deleteMany();
  await prisma.cabinet.deleteMany();

  // 2. Créer le cabinet
  console.log('🏥 Création du cabinet...');
  const cabinet = await prisma.cabinet.create({
    data: {
      nom: 'Cabinet Modèle',
      dentiste: 'Dr. Karim Benali',
      specialite: { fr: 'Dentiste généraliste & Esthétique', ar: 'طبيب أسنان عام و تجميلي', en: 'General & Cosmetic Dentist' },
      description: {
        fr: 'Cabinet dentaire moderne au cœur de Chlef, offrant des soins de qualité dans une atmosphère accueillante.',
        ar: 'عيادة أسنان حديثة في قلب الشلف، تقدم رعاية ذات جودة في جو ترحيبي.',
        en: 'Modern dental practice in the heart of Chlef, offering quality care in a welcoming atmosphere.'
      },
      telephone: '+213 27 77 12 34',
      email: 'contact@cabinet-modele.dz',
      adresse: '15, Boulevard de la République',
      ville: 'Chlef',
      codePostal: '02000',
      latitude: 36.1653,
      longitude: 1.3347
    }
  });

  // 3. Créer les horaires (dimanche à jeudi : 8h-17h, vendredi fermé, samedi 9h-13h)
  console.log('🕐 Création des horaires...');
  const horaires: Array<{ jour: JourSemaine; heureDebut: string; heureFin: string }> = [
    { jour: JourSemaine.DIMANCHE, heureDebut: '08:00', heureFin: '17:00' },
    { jour: JourSemaine.LUNDI, heureDebut: '08:00', heureFin: '17:00' },
    { jour: JourSemaine.MARDI, heureDebut: '08:00', heureFin: '17:00' },
    { jour: JourSemaine.MERCREDI, heureDebut: '08:00', heureFin: '17:00' },
    { jour: JourSemaine.JEUDI, heureDebut: '08:00', heureFin: '17:00' },
    { jour: JourSemaine.SAMEDI, heureDebut: '09:00', heureFin: '13:00' }
  ];

  for (const h of horaires) {
    await prisma.horaire.create({
      data: { ...h, cabinetId: cabinet.id }
    });
  }

  // 4. Créer les motifs de consultation
  console.log('🦷 Création des motifs de consultation...');
  const motifs = [
    {
      nom: { fr: 'Consultation générale', ar: 'استشارة عامة', en: 'General consultation' },
      description: { fr: 'Examen de routine et bilan dentaire', ar: 'فحص روتيني وتقييم الأسنان', en: 'Routine examination and dental assessment' },
      dureeDefaut: 20,
      prix: 1500,
      couleur: '#3B82F6',
      ordre: 1
    },
    {
      nom: { fr: 'Détartrage', ar: 'إزالة الجير', en: 'Scaling' },
      description: { fr: 'Nettoyage professionnel et détartrage', ar: 'تنظيف احترافي وإزالة الجير', en: 'Professional cleaning and scaling' },
      dureeDefaut: 30,
      prix: 2500,
      couleur: '#10B981',
      ordre: 2
    },
    {
      nom: { fr: 'Plombage / Carie', ar: 'حشو / تسوس', en: 'Filling / Cavity' },
      description: { fr: 'Traitement des caries et plombages', ar: 'علاج التسوس والحشوات', en: 'Cavity treatment and fillings' },
      dureeDefaut: 45,
      prix: 3500,
      couleur: '#F59E0B',
      ordre: 3
    },
    {
      nom: { fr: 'Extraction dentaire', ar: 'خلع الأسنان', en: 'Tooth extraction' },
      description: { fr: 'Extraction simple ou complexe', ar: 'خلع بسيط أو معقد', en: 'Simple or complex extraction' },
      dureeDefaut: 30,
      prix: 2000,
      couleur: '#EF4444',
      ordre: 4
    },
    {
      nom: { fr: 'Blanchiment dentaire', ar: 'تبييض الأسنان', en: 'Teeth whitening' },
      description: { fr: 'Blanchiment professionnel en cabinet', ar: 'تبييض احترافي في العيادة', en: 'Professional in-office whitening' },
      dureeDefaut: 45,
      prix: 8000,
      couleur: '#8B5CF6',
      ordre: 5
    },
    {
      nom: { fr: 'Orthodontie (Consultation)', ar: 'تقويم الأسنان (استشارة)', en: 'Orthodontics (Consultation)' },
      description: { fr: 'Consultation orthodontique et pose d\'appareil', ar: 'استشارة تقويم الأسنان ووضع الجهاز', en: 'Orthodontic consultation and appliance fitting' },
      dureeDefaut: 60,
      prix: 5000,
      couleur: '#EC4899',
      ordre: 6
    },
    {
      nom: { fr: 'Urgence dentaire', ar: 'طوارئ الأسنان', en: 'Dental emergency' },
      description: { fr: 'Prise en charge des urgences', ar: 'رعاية الطوارئ', en: 'Emergency care' },
      dureeDefaut: 30,
      prix: 3000,
      couleur: '#DC2626',
      ordre: 7
    },
    {
      nom: { fr: 'Dévitalisation', ar: 'علاج العصب', en: 'Root canal' },
      description: { fr: 'Traitement de canal radiculaire', ar: 'علاج قناة الجذر', en: 'Root canal treatment' },
      dureeDefaut: 60,
      prix: 7000,
      couleur: '#6366F1',
      ordre: 8
    }
  ];

  const createdMotifs = [];
  for (const m of motifs) {
    const motif = await prisma.motif.create({ data: m });
    createdMotifs.push(motif);
  }

  // 5. Créer les patients
  console.log('👥 Création des patients...');
  const patients = [
    { nom: 'Belkacem', prenom: 'Amina', telephone: '+213 555 12 34 56', email: 'amina.belkacem@email.dz' },
    { nom: 'Mansouri', prenom: 'Mohamed', telephone: '+213 666 78 90 12', email: null },
    { nom: 'Taleb', prenom: 'Fatima', telephone: '+213 777 34 56 78', email: 'fatima.taleb@email.dz' },
    { nom: 'Bouazza', prenom: 'Karim', telephone: '+213 555 90 12 34', email: 'karim.bouazza@email.dz' },
    { nom: 'Cherif', prenom: 'Leila', telephone: '+213 666 56 78 90', email: null }
  ];

  const createdPatients = [];
  for (const p of patients) {
    const patient = await prisma.patient.create({ data: p });
    createdPatients.push(patient);
  }

  // 6. Créer les rendez-vous (passés et à venir)
  console.log('📅 Création des rendez-vous...');

  const now = new Date();
  const appointments = [];

  // Fonction helper pour générer un code de référence
  function generateReferenceCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return `RDV-${code}`;
  }

  // Rendez-vous passés (TERMINE) - 30 derniers jours
  const pastAppointments = [
    { daysAgo: 28, hour: 9, patient: 0, motif: 0 },
    { daysAgo: 25, hour: 10, patient: 1, motif: 1 },
    { daysAgo: 22, hour: 14, patient: 2, motif: 2 },
    { daysAgo: 20, hour: 9, patient: 3, motif: 3 },
    { daysAgo: 18, hour: 11, patient: 4, motif: 0 },
    { daysAgo: 15, hour: 15, patient: 0, motif: 4 }, // Patient récurrent
    { daysAgo: 12, hour: 10, patient: 1, motif: 2 }, // Patient récurrent
    { daysAgo: 10, hour: 13, patient: 2, motif: 5 }, // Patient récurrent
    { daysAgo: 7, hour: 9, patient: 3, motif: 1 }, // Patient récurrent
    { daysAgo: 5, hour: 14, patient: 4, motif: 6 },
    { daysAgo: 3, hour: 11, patient: 0, motif: 7 }, // Patient très récurrent
    { daysAgo: 2, hour: 10, patient: 1, motif: 0 }  // Patient récurrent
  ];

  for (const apt of pastAppointments) {
    const motif = createdMotifs[apt.motif];
    const dateDebut = new Date(now);
    dateDebut.setDate(dateDebut.getDate() - apt.daysAgo);
    dateDebut.setHours(apt.hour, 0, 0, 0);
    const dateFin = new Date(dateDebut.getTime() + motif.dureeDefaut * 60000);

    appointments.push({
      patientId: createdPatients[apt.patient].id,
      motifId: motif.id,
      referenceCode: generateReferenceCode(),
      dateDebut,
      dateFin,
      duree: motif.dureeDefaut,
      statut: 'TERMINE' as const,
      notes: null,
      jetonAnnulation: crypto.randomUUID()
    });
  }

  // 1 ou 2 rendez-vous annulés
  const cancelledAppointments = [
    { daysAgo: 16, hour: 14, patient: 2, motif: 3 },
    { daysAgo: 8, hour: 16, patient: 4, motif: 1 }
  ];

  for (const apt of cancelledAppointments) {
    const motif = createdMotifs[apt.motif];
    const dateDebut = new Date(now);
    dateDebut.setDate(dateDebut.getDate() - apt.daysAgo);
    dateDebut.setHours(apt.hour, 0, 0, 0);
    const dateFin = new Date(dateDebut.getTime() + motif.dureeDefaut * 60000);

    appointments.push({
      patientId: createdPatients[apt.patient].id,
      motifId: motif.id,
      referenceCode: generateReferenceCode(),
      dateDebut,
      dateFin,
      duree: motif.dureeDefaut,
      statut: 'ANNULE' as const,
      notes: 'Annulé par le patient',
      jetonAnnulation: crypto.randomUUID()
    });
  }

  // Rendez-vous à venir (CONFIRME) - 5 prochains jours avec densité variée
  const upcomingAppointments = [
    // Jour +1 : Journée chargée (6 RDV)
    { daysAhead: 1, hour: 8, minute: 30, patient: 0, motif: 0 },
    { daysAhead: 1, hour: 9, minute: 30, patient: 1, motif: 1 },
    { daysAhead: 1, hour: 10, minute: 30, patient: 2, motif: 2 },
    { daysAhead: 1, hour: 12, minute: 0, patient: 3, motif: 3 },
    { daysAhead: 1, hour: 13, minute: 0, patient: 4, motif: 4 },
    { daysAhead: 1, hour: 15, minute: 0, patient: 0, motif: 5 },

    // Jour +2 : Journée moyenne (4 RDV)
    { daysAhead: 2, hour: 9, minute: 0, patient: 1, motif: 6 },
    { daysAhead: 2, hour: 10, minute: 0, patient: 2, motif: 0 },
    { daysAhead: 2, hour: 14, minute: 0, patient: 3, motif: 1 },
    { daysAhead: 2, hour: 15, minute: 30, patient: 4, motif: 7 },

    // Jour +3 : Journée légère (2 RDV)
    { daysAhead: 3, hour: 9, minute: 0, patient: 0, motif: 2 },
    { daysAhead: 3, hour: 14, minute: 0, patient: 1, motif: 3 },

    // Jour +4 : Journée chargée (5 RDV)
    { daysAhead: 4, hour: 8, minute: 30, patient: 2, motif: 4 },
    { daysAhead: 4, hour: 10, minute: 0, patient: 3, motif: 5 },
    { daysAhead: 4, hour: 11, minute: 30, patient: 4, motif: 0 },
    { daysAhead: 4, hour: 13, minute: 30, patient: 0, motif: 1 },
    { daysAhead: 4, hour: 15, minute: 0, patient: 1, motif: 6 },

    // Jour +5 : Journée moyenne (3 RDV)
    { daysAhead: 5, hour: 9, minute: 30, patient: 2, motif: 7 },
    { daysAhead: 5, hour: 11, minute: 0, patient: 3, motif: 2 },
    { daysAhead: 5, hour: 14, minute: 30, patient: 4, motif: 3 }
  ];

  for (const apt of upcomingAppointments) {
    const motif = createdMotifs[apt.motif];
    const dateDebut = new Date(now);
    dateDebut.setDate(dateDebut.getDate() + apt.daysAhead);
    dateDebut.setHours(apt.hour, apt.minute, 0, 0);
    const dateFin = new Date(dateDebut.getTime() + motif.dureeDefaut * 60000);

    appointments.push({
      patientId: createdPatients[apt.patient].id,
      motifId: motif.id,
      referenceCode: generateReferenceCode(),
      dateDebut,
      dateFin,
      duree: motif.dureeDefaut,
      statut: 'CONFIRME' as const,
      notes: null,
      jetonAnnulation: crypto.randomUUID()
    });
  }

  // Insérer tous les rendez-vous
  for (const apt of appointments) {
    await prisma.rendezVous.create({ data: apt });
  }

  console.log(`✅ ${appointments.length} rendez-vous créés`);

  // 7. Créer les avis clients
  console.log('⭐ Création des avis...');
  const avis = [
    {
      patientId: createdPatients[0].id,
      auteur: 'Amina B.',
      note: 5,
      commentaire: 'Excellent accueil et soins de qualité. Le Dr. Benali est très professionnel et à l\'écoute.',
      statut: 'PUBLIE' as const
    },
    {
      patientId: createdPatients[1].id,
      auteur: 'Mohamed M.',
      note: 5,
      commentaire: 'Cabinet très propre et moderne. Les soins sont indolores, je recommande vivement !',
      statut: 'PUBLIE' as const
    },
    {
      patientId: createdPatients[2].id,
      auteur: 'Fatima T.',
      note: 4,
      commentaire: 'Bon dentiste, mais l\'attente peut être un peu longue. Sinon, très satisfaite des soins.',
      statut: 'PUBLIE' as const
    },
    {
      patientId: createdPatients[3].id,
      auteur: 'Karim B.',
      note: 5,
      commentaire: 'Le meilleur cabinet dentaire de Chlef ! Personnel accueillant et équipements modernes.',
      statut: 'PUBLIE' as const
    },
    {
      patientId: null,
      auteur: 'Leila C.',
      note: 3,
      commentaire: 'Les soins sont corrects mais j\'ai trouvé les tarifs un peu élevés.',
      statut: 'PUBLIE' as const
    }
  ];

  for (const a of avis) {
    await prisma.avis.create({ data: a });
  }

  // 8. Créer les photos de galerie
  console.log('📸 Création de la galerie...');
  const galerieItems = [
    {
      titre: { fr: 'Blanchiment dentaire - Résultats spectaculaires', ar: 'تبييض الأسنان - نتائج مذهلة', en: 'Teeth whitening - Spectacular results' },
      description: { fr: 'Blanchiment professionnel en une séance', ar: 'تبييض احترافي في جلسة واحدة', en: 'Professional whitening in one session' },
      categorie: 'whitening',
      imageBefore: 'https://placehold.co/800x600/e0e0e0/666666?text=Avant+Blanchiment',
      imageAfter: 'https://placehold.co/800x600/ffffff/666666?text=Apr%C3%A8s+Blanchiment',
      ordre: 1,
      actif: true
    },
    {
      titre: { fr: 'Blanchiment - Transformation éclatante', ar: 'تبييض - تحول مشرق', en: 'Whitening - Brilliant transformation' },
      description: { fr: 'Sourire éclatant après traitement', ar: 'ابتسامة مشرقة بعد العلاج', en: 'Radiant smile after treatment' },
      categorie: 'whitening',
      imageBefore: 'https://placehold.co/800x600/d4d4d4/555555?text=Avant',
      imageAfter: 'https://placehold.co/800x600/fafafa/555555?text=Apr%C3%A8s',
      ordre: 2,
      actif: true
    },
    {
      titre: { fr: 'Orthodontie - Correction réussie', ar: 'تقويم الأسنان - تصحيح ناجح', en: 'Orthodontics - Successful correction' },
      description: { fr: 'Alignement parfait après 18 mois de traitement', ar: 'محاذاة مثالية بعد 18 شهرًا من العلاج', en: 'Perfect alignment after 18 months of treatment' },
      categorie: 'ortho',
      imageBefore: 'https://placehold.co/800x600/e8e8e8/777777?text=Avant+Ortho',
      imageAfter: 'https://placehold.co/800x600/f5f5f5/777777?text=Apr%C3%A8s+Ortho',
      ordre: 3,
      actif: true
    },
    {
      titre: { fr: 'Orthodontie adolescent', ar: 'تقويم الأسنان للمراهقين', en: 'Teen orthodontics' },
      description: { fr: 'Traitement orthodontique complet', ar: 'علاج تقويم أسنان كامل', en: 'Complete orthodontic treatment' },
      categorie: 'ortho',
      imageBefore: 'https://placehold.co/800x600/dcdcdc/666666?text=Avant',
      imageAfter: 'https://placehold.co/800x600/f0f0f0/666666?text=Apr%C3%A8s',
      ordre: 4,
      actif: true
    },
    {
      titre: { fr: 'Implants dentaires - Pose réussie', ar: 'زراعة الأسنان - نجاح الزرع', en: 'Dental implants - Successful placement' },
      description: { fr: 'Restauration complète avec implants', ar: 'ترميم كامل بالزرعات', en: 'Complete restoration with implants' },
      categorie: 'implant',
      imageBefore: 'https://placehold.co/800x600/e5e5e5/888888?text=Avant+Implants',
      imageAfter: 'https://placehold.co/800x600/fafafa/888888?text=Apr%C3%A8s+Implants',
      ordre: 5,
      actif: true
    },
    {
      titre: { fr: 'Implants - Sourire retrouvé', ar: 'الزرعات - ابتسامة مستعادة', en: 'Implants - Smile restored' },
      description: { fr: 'Remplacement de dents manquantes', ar: 'استبدال الأسنان المفقودة', en: 'Missing teeth replacement' },
      categorie: 'implant',
      imageBefore: 'https://placehold.co/800x600/d8d8d8/777777?text=Avant',
      imageAfter: 'https://placehold.co/800x600/f8f8f8/777777?text=Apr%C3%A8s',
      ordre: 6,
      actif: true
    }
  ];

  for (const g of galerieItems) {
    await prisma.casGalerie.create({ data: g });
  }

  console.log('✅ Seeding terminé avec succès !');
  console.log('');
  console.log('📊 Résumé :');
  console.log(`   - 1 cabinet créé`);
  console.log(`   - ${horaires.length} horaires configurés`);
  console.log(`   - ${motifs.length} motifs de consultation`);
  console.log(`   - ${patients.length} patients`);
  console.log(`   - ${appointments.length} rendez-vous (${pastAppointments.length} passés, ${upcomingAppointments.length} à venir, ${cancelledAppointments.length} annulés)`);
  console.log(`   - ${avis.length} avis clients`);
  console.log(`   - ${galerieItems.length} photos de galerie`);
  console.log('');
  console.log('🎉 La base de données est prête pour la démonstration !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
