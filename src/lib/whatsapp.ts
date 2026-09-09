import { siteConfig } from '@/config/site';

type AppointmentWhatsAppData = {
  patientPhone: string;
  patientName: string;
  referenceCode: string;
  motif: string;
  date: string;
  time: string;
  duration: string;
  cancelUrl: string;
  locale: string;
};

/**
 * Envoie un message WhatsApp de confirmation de rendez-vous automatiquement
 *
 * Note: Cette fonction utilise l'API WhatsApp Business ou un service tiers.
 * Pour l'instant, elle génère le message et le logue. L'intégration complète
 * nécessite une clé API WhatsApp Business.
 */
export async function sendAppointmentConfirmationWhatsApp(data: AppointmentWhatsAppData): Promise<boolean> {
  const isArabic = data.locale === 'ar';
  const isEnglish = data.locale === 'en';

  const greeting = isArabic
    ? `مرحباً ${data.patientName} 👋`
    : isEnglish
    ? `Hello ${data.patientName} 👋`
    : `Bonjour ${data.patientName} 👋`;

  const intro = isArabic
    ? `✅ تم تأكيد موعدك في ${siteConfig.name}`
    : isEnglish
    ? `✅ Your appointment at ${siteConfig.name} is confirmed`
    : `✅ Votre rendez-vous au ${siteConfig.name} est confirmé`;

  const refLabel = isArabic ? '🔖 رمز المرجع' : isEnglish ? '🔖 Reference Code' : '🔖 Code de référence';
  const detailsLabel = isArabic ? '📋 التفاصيل' : isEnglish ? '📋 Details' : '📋 Détails';
  const motifLabel = isArabic ? '• نوع الاستشارة' : isEnglish ? '• Reason' : '• Motif';
  const dateLabel = isArabic ? '📅 التاريخ' : isEnglish ? '📅 Date' : '📅 Date';
  const timeLabel = isArabic ? '🕐 الوقت' : isEnglish ? '🕐 Time' : '🕐 Heure';
  const durationLabel = isArabic ? '⏱️ المدة' : isEnglish ? '⏱️ Duration' : '⏱️ Durée';

  const cancelInfo = isArabic
    ? `\n💡 هل تحتاج إلى التعديل أو الإلغاء؟\nيمكنك إدارة موعدك حتى 24 ساعة قبل الموعد:\n${data.cancelUrl}`
    : isEnglish
    ? `\n💡 Need to modify or cancel?\nYou can manage your appointment up to 24 hours before:\n${data.cancelUrl}`
    : `\n💡 Besoin de modifier ou d'annuler ?\nVous pouvez gérer votre rendez-vous jusqu'à 24h avant :\n${data.cancelUrl}`;

  const footer = isArabic
    ? `\n\n${siteConfig.name}\n📍 ${siteConfig.address}\n📞 ${siteConfig.phoneDisplay}`
    : isEnglish
    ? `\n\n${siteConfig.name}\n📍 ${siteConfig.address}\n📞 ${siteConfig.phoneDisplay}`
    : `\n\n${siteConfig.name}\n📍 ${siteConfig.address}\n📞 ${siteConfig.phoneDisplay}`;

  const message = `${greeting}

${intro}

${refLabel}: *${data.referenceCode}*

${detailsLabel}:
${motifLabel}: ${data.motif}
${dateLabel}: ${data.date}
${timeLabel}: ${data.time}
${durationLabel}: ${data.duration}${cancelInfo}${footer}`;

  // TODO: Intégrer avec l'API WhatsApp Business ou un service comme Twilio
  // Pour l'instant, on logue le message qui serait envoyé
  console.log('📱 Message WhatsApp à envoyer au', data.patientPhone);
  console.log('---');
  console.log(message);
  console.log('---');

  // Exemple d'intégration future avec WhatsApp Business API:
  // if (process.env.WHATSAPP_API_KEY) {
  //   try {
  //     await fetch('https://api.whatsapp.com/send', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         to: data.patientPhone,
  //         type: 'text',
  //         text: { body: message }
  //       })
  //     });
  //     console.log('✅ Message WhatsApp envoyé');
  //     return true;
  //   } catch (error) {
  //     console.error('❌ Erreur WhatsApp:', error);
  //     return false;
  //   }
  // }

  // Pour l'instant, considéré comme "envoyé" (loggé)
  return true;
}
