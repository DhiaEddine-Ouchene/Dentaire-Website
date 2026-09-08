import { Resend } from 'resend';
import { siteConfig } from '@/config/site';

const resend = new Resend(process.env.RESEND_API_KEY);

type AppointmentEmailData = {
  patientName: string;
  patientEmail: string;
  referenceCode: string;
  motif: string;
  date: string;
  time: string;
  duration: string;
  cancelUrl: string;
  locale: string;
};

/**
 * Envoie un email de confirmation de rendez-vous automatiquement
 */
export async function sendAppointmentConfirmationEmail(data: AppointmentEmailData): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY non configuré - email non envoyé');
    return false;
  }

  if (!data.patientEmail) {
    console.log('ℹ️ Pas d\'email fourni par le patient - email non envoyé');
    return false;
  }

  const isArabic = data.locale === 'ar';
  const isEnglish = data.locale === 'en';

  const subject = isArabic
    ? `تأكيد موعدك - ${data.referenceCode}`
    : isEnglish
    ? `Your Appointment Confirmation - ${data.referenceCode}`
    : `Confirmation de votre rendez-vous - ${data.referenceCode}`;

  const greeting = isArabic
    ? `مرحباً ${data.patientName}،`
    : isEnglish
    ? `Hello ${data.patientName},`
    : `Bonjour ${data.patientName},`;

  const intro = isArabic
    ? 'تم تأكيد موعدك بنجاح في عيادتنا.'
    : isEnglish
    ? 'Your appointment has been successfully confirmed at our clinic.'
    : 'Votre rendez-vous a été confirmé avec succès dans notre cabinet.';

  const detailsTitle = isArabic ? 'تفاصيل موعدك:' : isEnglish ? 'Appointment Details:' : 'Détails de votre rendez-vous :';
  const refLabel = isArabic ? 'رمز المرجع' : isEnglish ? 'Reference Code' : 'Code de référence';
  const motifLabel = isArabic ? 'نوع الاستشارة' : isEnglish ? 'Reason' : 'Motif';
  const dateLabel = isArabic ? 'التاريخ' : isEnglish ? 'Date' : 'Date';
  const timeLabel = isArabic ? 'الوقت' : isEnglish ? 'Time' : 'Heure';
  const durationLabel = isArabic ? 'المدة' : isEnglish ? 'Duration' : 'Durée';

  const importantNote = isArabic
    ? '**ملاحظة مهمة:** احتفظ برمز المرجع الخاص بك لإدارة موعدك.'
    : isEnglish
    ? '**Important:** Keep your reference code to manage your appointment.'
    : '**Important :** Conservez votre code de référence pour gérer votre rendez-vous.';

  const cancelTitle = isArabic ? 'هل تحتاج إلى الإلغاء أو التعديل؟' : isEnglish ? 'Need to Cancel or Modify?' : 'Besoin d\'annuler ou de modifier ?';
  const cancelText = isArabic
    ? `يمكنك إلغاء أو تعديل موعدك حتى 24 ساعة قبل الموعد المحدد.`
    : isEnglish
    ? 'You can cancel or modify your appointment up to 24 hours before the scheduled time.'
    : 'Vous pouvez annuler ou modifier votre rendez-vous jusqu\'à 24 heures avant l\'heure prévue.';

  const cancelButton = isArabic ? 'إدارة موعدي' : isEnglish ? 'Manage My Appointment' : 'Gérer mon rendez-vous';

  const footer = isArabic
    ? 'شكراً لثقتكم بنا. نتطلع لرؤيتكم قريباً!'
    : isEnglish
    ? 'Thank you for your trust. We look forward to seeing you soon!'
    : 'Merci de votre confiance. À bientôt !';

  const htmlContent = `
<!DOCTYPE html>
<html lang="${data.locale}" dir="${isArabic ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">${siteConfig.name}</h1>
              <div style="margin-top: 20px; padding: 12px 24px; background-color: rgba(255, 255, 255, 0.2); border-radius: 8px; display: inline-block;">
                <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 500;">${refLabel}</p>
                <p style="margin: 4px 0 0 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 2px;">${data.referenceCode}</p>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">${greeting}</p>
              <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">${intro}</p>

              <div style="background-color: #f0fdfa; border-left: 4px solid #0d9488; padding: 20px; margin-bottom: 30px; border-radius: 6px;">
                <h2 style="margin: 0 0 15px 0; color: #0d9488; font-size: 18px; font-weight: 600;">${detailsTitle}</h2>
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">${motifLabel}</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: ${isArabic ? 'left' : 'right'};">${data.motif}</td>
                  </tr>
                  <tr style="border-top: 1px solid #d1fae5;">
                    <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">${dateLabel}</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: ${isArabic ? 'left' : 'right'};">${data.date}</td>
                  </tr>
                  <tr style="border-top: 1px solid #d1fae5;">
                    <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">${timeLabel}</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: ${isArabic ? 'left' : 'right'};">${data.time}</td>
                  </tr>
                  <tr style="border-top: 1px solid #d1fae5;">
                    <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">${durationLabel}</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: ${isArabic ? 'left' : 'right'};">${data.duration}</td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">${importantNote}</p>

              <!-- Cancel Section -->
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">${cancelTitle}</h3>
                <p style="margin: 0 0 15px 0; color: #78350f; font-size: 14px; line-height: 1.6;">${cancelText}</p>
                <a href="${data.cancelUrl}" style="display: inline-block; background-color: #0d9488; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600;">${cancelButton}</a>
              </div>

              <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">${footer}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${siteConfig.name}</p>
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 13px;">${siteConfig.address}</p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                ${siteConfig.phone} • ${siteConfig.email}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    await resend.emails.send({
      from: `${siteConfig.name} <noreply@${process.env.RESEND_DOMAIN || 'dentaire.com'}>`,
      to: data.patientEmail,
      subject,
      html: htmlContent
    });

    console.log('✅ Email de confirmation envoyé à:', data.patientEmail);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}
