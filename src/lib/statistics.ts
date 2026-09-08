import { prisma } from './prisma';
import { Decimal } from '@prisma/client/runtime/library';

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

export type PeriodType = 'day' | 'week' | 'month' | 'custom';

/**
 * Génère les bornes de dates selon le type de période
 */
export function getDateRange(period: PeriodType, customStart?: Date, customEnd?: Date): DateRange {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  switch (period) {
    case 'day':
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'custom':
      if (!customStart || !customEnd) {
        throw new Error('Custom period requires start and end dates');
      }
      startDate = new Date(customStart);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(customEnd);
      endDate.setHours(23, 59, 59, 999);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { startDate, endDate };
}

/**
 * Section 1 - Vue d'ensemble
 */
export async function getOverviewStats(range: DateRange) {
  const { startDate, endDate } = range;

  // Nombre de rendez-vous sur la période
  const appointmentsCount = await prisma.rendezVous.count({
    where: {
      dateDebut: { gte: startDate, lte: endDate }
    }
  });

  // Revenus de la période (rendez-vous terminés uniquement)
  const completedAppointments = await prisma.rendezVous.findMany({
    where: {
      dateDebut: { gte: startDate, lte: endDate },
      statut: 'TERMINE'
    },
    include: { motif: true }
  });

  const revenue = completedAppointments.reduce((sum, apt) => {
    return sum + (apt.motif.prix ? Number(apt.motif.prix) : 0);
  }, 0);

  return {
    appointmentsCount,
    revenue
  };
}

/**
 * Section 2 - Revenus dans le temps (jour par jour)
 */
export async function getRevenueOverTime(range: DateRange) {
  const { startDate, endDate } = range;

  const appointments = await prisma.rendezVous.findMany({
    where: {
      dateDebut: { gte: startDate, lte: endDate },
      statut: 'TERMINE'
    },
    include: { motif: true },
    orderBy: { dateDebut: 'asc' }
  });

  // Grouper par jour
  const revenueByDay = new Map<string, number>();
  appointments.forEach((apt) => {
    const dateKey = apt.dateDebut.toISOString().split('T')[0];
    const prix = apt.motif.prix ? Number(apt.motif.prix) : 0;
    revenueByDay.set(dateKey, (revenueByDay.get(dateKey) || 0) + prix);
  });

  return Array.from(revenueByDay.entries()).map(([date, revenue]) => ({
    date,
    revenue
  }));
}

/**
 * Section 3 - Fiabilité de l'agenda
 */
export async function getReliabilityStats(range: DateRange) {
  const { startDate, endDate } = range;

  const totalAppointments = await prisma.rendezVous.count({
    where: { dateDebut: { gte: startDate, lte: endDate } }
  });

  const cancelledCount = await prisma.rendezVous.count({
    where: {
      dateDebut: { gte: startDate, lte: endDate },
      statut: 'ANNULE'
    }
  });

  const noShowCount = await prisma.rendezVous.count({
    where: {
      dateDebut: { gte: startDate, lte: endDate },
      statut: 'ABSENT'
    }
  });

  const cancellationRate = totalAppointments > 0 ? (cancelledCount / totalAppointments) * 100 : 0;
  const noShowRate = totalAppointments > 0 ? (noShowCount / totalAppointments) * 100 : 0;

  // Taux de remplissage - simplifié pour l'instant (peut être amélioré avec calcul des créneaux disponibles)
  const completedCount = await prisma.rendezVous.count({
    where: {
      dateDebut: { gte: startDate, lte: endDate },
      statut: 'TERMINE'
    }
  });
  const fillRate = totalAppointments > 0 ? (completedCount / totalAppointments) * 100 : 0;

  return {
    cancellationRate: Math.round(cancellationRate * 10) / 10,
    noShowRate: Math.round(noShowRate * 10) / 10,
    fillRate: Math.round(fillRate * 10) / 10
  };
}

/**
 * Section 4 - Services et motifs
 */
export async function getServiceStats(range: DateRange) {
  const { startDate, endDate } = range;

  const appointments = await prisma.rendezVous.findMany({
    where: {
      dateDebut: { gte: startDate, lte: endDate },
      statut: 'TERMINE'
    },
    include: { motif: true }
  });

  // Grouper par motif
  const statsByMotif = new Map<
    string,
    { nom: any; count: number; revenue: number }
  >();

  appointments.forEach((apt) => {
    const motifId = apt.motifId;
    const existing = statsByMotif.get(motifId);
    const prix = apt.motif.prix ? Number(apt.motif.prix) : 0;

    if (existing) {
      existing.count++;
      existing.revenue += prix;
    } else {
      statsByMotif.set(motifId, {
        nom: apt.motif.nom,
        count: 1,
        revenue: prix
      });
    }
  });

  const serviceStats = Array.from(statsByMotif.values());

  // Trier par nombre de rendez-vous (pour le graphique)
  const byCount = [...serviceStats].sort((a, b) => b.count - a.count);

  // Trier par revenus
  const byRevenue = [...serviceStats].sort((a, b) => b.revenue - a.revenue);

  return { byCount, byRevenue };
}

/**
 * Section 5 - Fréquentation (heures et jours)
 */
export async function getAttendanceStats(range: DateRange) {
  const { startDate, endDate } = range;

  const appointments = await prisma.rendezVous.findMany({
    where: {
      dateDebut: { gte: startDate, lte: endDate },
      statut: { in: ['TERMINE', 'CONFIRME'] }
    },
    select: { dateDebut: true }
  });

  // Grouper par heure
  const byHour = new Map<number, number>();
  for (let h = 8; h <= 18; h++) {
    byHour.set(h, 0);
  }

  appointments.forEach((apt) => {
    const hour = apt.dateDebut.getHours();
    byHour.set(hour, (byHour.get(hour) || 0) + 1);
  });

  // Grouper par jour de la semaine (0 = dimanche, 6 = samedi)
  const byDay = new Map<number, number>();
  for (let d = 0; d < 7; d++) {
    byDay.set(d, 0);
  }

  appointments.forEach((apt) => {
    const day = apt.dateDebut.getDay();
    byDay.set(day, (byDay.get(day) || 0) + 1);
  });

  return {
    byHour: Array.from(byHour.entries()).map(([hour, count]) => ({ hour, count })),
    byDay: Array.from(byDay.entries()).map(([day, count]) => ({ day, count }))
  };
}

/**
 * Section 6 - Patients (nouveaux vs récurrents)
 */
export async function getPatientStats(range: DateRange) {
  const { startDate, endDate } = range;

  // Récupérer tous les patients ayant eu au moins un RDV sur la période
  const patientsWithAppointments = await prisma.patient.findMany({
    where: {
      rendezVous: {
        some: {
          dateDebut: { gte: startDate, lte: endDate }
        }
      }
    },
    include: {
      rendezVous: {
        orderBy: { dateDebut: 'asc' }
      }
    }
  });

  let newPatients = 0;
  let returningPatients = 0;
  let returnRate = 0;

  patientsWithAppointments.forEach((patient) => {
    const appointmentsInPeriod = patient.rendezVous.filter(
      (apt) => apt.dateDebut >= startDate && apt.dateDebut <= endDate
    );

    // Si le premier RDV du patient est dans la période, c'est un nouveau patient
    const firstAppointment = patient.rendezVous[0];
    if (firstAppointment && firstAppointment.dateDebut >= startDate && firstAppointment.dateDebut <= endDate) {
      newPatients++;

      // Vérifier s'il a pris un 2e RDV dans les 6 mois
      if (patient.rendezVous.length > 1) {
        const secondAppointment = patient.rendezVous[1];
        const sixMonthsLater = new Date(firstAppointment.dateDebut);
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

        if (secondAppointment.dateDebut <= sixMonthsLater) {
          returnRate++;
        }
      }
    } else {
      returningPatients++;
    }
  });

  const returnRatePercentage = newPatients > 0 ? (returnRate / newPatients) * 100 : 0;

  return {
    newPatients,
    returningPatients,
    returnRate: Math.round(returnRatePercentage * 10) / 10
  };
}

/**
 * Section 7 - Avis
 */
export async function getReviewStats(range: DateRange) {
  const { startDate, endDate } = range;

  const reviews = await prisma.avis.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      statut: 'PUBLIE'
    },
    select: { note: true, createdAt: true }
  });

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.note, 0) / totalReviews
    : 0;

  // Evolution dans le temps (par jour)
  const ratingOverTime = new Map<string, { sum: number; count: number }>();
  reviews.forEach((review) => {
    const dateKey = review.createdAt.toISOString().split('T')[0];
    const existing = ratingOverTime.get(dateKey);
    if (existing) {
      existing.sum += review.note;
      existing.count++;
    } else {
      ratingOverTime.set(dateKey, { sum: review.note, count: 1 });
    }
  });

  const ratingEvolution = Array.from(ratingOverTime.entries()).map(([date, data]) => ({
    date,
    average: data.sum / data.count
  }));

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingEvolution
  };
}

/**
 * Fonction principale qui récupère toutes les stats
 */
export async function getAllStatistics(period: PeriodType, customStart?: Date, customEnd?: Date) {
  const range = getDateRange(period, customStart, customEnd);

  const [
    overview,
    revenueOverTime,
    reliability,
    services,
    attendance,
    patients,
    reviews
  ] = await Promise.all([
    getOverviewStats(range),
    getRevenueOverTime(range),
    getReliabilityStats(range),
    getServiceStats(range),
    getAttendanceStats(range),
    getPatientStats(range),
    getReviewStats(range)
  ]);

  return {
    period,
    range,
    overview,
    revenueOverTime,
    reliability,
    services,
    attendance,
    patients,
    reviews
  };
}
