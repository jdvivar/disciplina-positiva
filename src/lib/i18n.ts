import es from '../i18n/es.json';

const translations: Record<string, Record<string, string>> = { es };

export function t(key: string, locale: string = 'es'): string {
  return translations[locale]?.[key] ?? key;
}

export function getLocale(): string {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const match = path.match(/^\/(es|en)\//);
    return match?.[1] ?? 'es';
  }
  return 'es';
}
