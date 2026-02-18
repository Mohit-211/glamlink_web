import { PromoItem } from '../config';

// Helper functions for promo calculations and formatting

export const isPromoActive = (promo: PromoItem): boolean => {
  const now = new Date();
  const startDate = new Date(promo.startDate);
  const endDate = new Date(promo.endDate);
  return now >= startDate && now <= endDate;
};

export const isPromoExpired = (promo: PromoItem): boolean => {
  const now = new Date();
  const endDate = new Date(promo.endDate);
  return now > endDate;
};

export const getDaysRemaining = (promo: PromoItem): number => {
  const now = new Date();
  const endDate = new Date(promo.endDate);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const formatPromoDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatPromoDateRange = (startDate: string, endDate: string): string => {
  const start = formatPromoDate(startDate);
  const end = formatPromoDate(endDate);
  return `${start} - ${end}`;
};

export const formatCountdownText = (daysRemaining: number): string => {
  if (daysRemaining <= 0) return "Ended";
  if (daysRemaining === 1) return "Ends Today";
  if (daysRemaining <= 7) return `${daysRemaining} Days Left`;
  return `${daysRemaining} Days Remaining`;
};