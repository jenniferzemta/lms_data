/**
 * Formatting utilities for DataMboa (Cameroon, FCFA, bilingual FR/EN)
 */

export function formatCurrency(amount: number, currency: string = 'FCFA', locale: string = 'fr'): string {
  // Format with thousands separator: e.g. 10 000 FCFA (fr) or 10,000 FCFA (en)
  const formatted = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-FR', {
    maximumFractionDigits: 0
  }).format(amount);

  return `${formatted} ${currency}`;
}

export function formatDuration(minutes: number, locale: string = 'fr'): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return locale === 'en' ? `${remainingMinutes} min` : `${remainingMinutes} min`;
  }
  if (remainingMinutes === 0) {
    return locale === 'en' ? `${hours}h` : `${hours} h`;
  }
  return locale === 'en' ? `${hours}h ${remainingMinutes}min` : `${hours}h ${remainingMinutes}min`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} o`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} Ko`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
