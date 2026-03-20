// Locale exports
export { en } from './en';
export { zh } from './zh';
export { ar } from './ar';
export type { TranslationKeys } from './en';

export const supportedLanguages = {
  en: 'English',
  zh: '中文',
  ar: 'العربية',
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

export const defaultLanguage: SupportedLanguage = 'en';

// RTL languages configuration
export const rtlLanguages: SupportedLanguage[] = ['ar'];

export const isRTL = (language: SupportedLanguage): boolean => {
  return rtlLanguages.includes(language);
};
