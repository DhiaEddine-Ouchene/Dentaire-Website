/**
 * Informations du cabinet — source unique pour l'en-tête, le pied de page,
 * la page contact, etc. (Architecture mono-locataire : un déploiement = un cabinet.)
 *
 * Contenu de démonstration réaliste (Algérie). À terme, ces valeurs pourront être
 * alimentées depuis le modèle `Cabinet` en base ; on garde ici les infos statiques
 * utilisées au moment du build.
 */
export const siteConfig = {
  name: 'Cabinet Dentaire Le Sourire',
  dentistName: 'Dr. Amine Belkacem',
  specialty: 'Chirurgien-dentiste · Esthétique & implantologie',
  phoneDisplay: '+213 5 55 12 34 56',
  phoneHref: '+213555123456',
  whatsapp: '213555123456',
  email: 'contact@cabinet-lesourire.dz',
  address: '12, Rue Didouche Mourad',
  city: 'Alger Centre',
  postalCode: '16000',
  country: 'Algérie',
  coords: { lat: 36.7699, lng: 3.0588 },
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com'
  },
  /** Horaires — l'ordre définit l'affichage. `day` renvoie aux clés de traduction `days.*`. */
  hours: [
    { day: 'sunday', open: '09:00', close: '18:00' },
    { day: 'monday', open: '09:00', close: '18:00' },
    { day: 'tuesday', open: '09:00', close: '18:00' },
    { day: 'wednesday', open: '09:00', close: '18:00' },
    { day: 'thursday', open: '09:00', close: '18:00' },
    { day: 'saturday', open: '09:00', close: '13:00' },
    { day: 'friday', closed: true }
  ]
} as const;

export type CabinetHour = (typeof siteConfig.hours)[number];

/** Lien WhatsApp cliquable, avec message pré-rempli optionnel. */
export function whatsappLink(text?: string) {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** URL d'intégration de la carte Google Maps (iframe). */
export const mapEmbedUrl = `https://www.google.com/maps?q=${siteConfig.coords.lat},${siteConfig.coords.lng}&z=15&output=embed`;

/** Lien vers l'itinéraire Google Maps. */
export const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${siteConfig.coords.lat},${siteConfig.coords.lng}`;
