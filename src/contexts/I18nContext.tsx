// I18n Context - Provides internationalization functionality
// Follows Single Responsibility Principle - handles only i18n state and translation

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { en, zh, ar, TranslationKeys, SupportedLanguage, defaultLanguage, isRTL } from '../locales';

const translations: Record<SupportedLanguage, TranslationKeys> = {
  en,
  zh,
  ar,
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'optimizely_language';

// Helper function to get nested object value by string path
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Helper function to replace placeholders in translation strings
function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  
  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }, template);
}

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && (stored === 'en' || stored === 'zh' || stored === 'ar')) {
        return stored as SupportedLanguage;
      }
    } catch (error) {
      console.error('Failed to read language from localStorage:', error);
    }
    return defaultLanguage;
  });

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
      // Update document direction and language
      const dir = isRTL(lang) ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
      
      // Notify theme provider of direction change
      window.dispatchEvent(new CustomEvent('languageDirectionChange', { detail: { direction: dir } }));
    } catch (error) {
      console.error('Failed to save language to localStorage:', error);
      setLanguageState(lang);
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    try {
      const translation = getNestedValue(translations[language], key);
      
      if (translation === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      
      return interpolate(translation, params);
    } catch (error) {
      console.error(`Error translating key ${key}:`, error);
      return key;
    }
  }, [language]);

  const direction = isRTL(language) ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRTL: isRTL(language), direction }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
