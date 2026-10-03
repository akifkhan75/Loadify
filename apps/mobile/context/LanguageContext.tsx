import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import { I18nManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import { I18n } from 'i18n-js';

// Import translations with type safety
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import ur from '../locales/ur.json';

// Create i18n instance
const i18n = new I18n();

// Define language types
export type Language = 'en' | 'ar' | 'ur';

// Define context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: string, ...args: (string | number)[]) => string;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  isLanguageLoaded: boolean;
}

// Create context with default values
export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  t: (key: string) => key,
  dir: 'ltr',
  isRTL: false,
  isLanguageLoaded: false,
});

// Initialize translations with type safety
i18n.translations = { en, ar, ur };
i18n.defaultLocale = 'en';
i18n.locale = 'en';
i18n.fallbacks = true;
i18n.missingTranslationPrefix = 'EE: '; // Mark missing translations

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  const setLanguage = useCallback(async (lang: Language) => {
    try {
      const newIsRTL = lang === 'ar' || lang === 'ur';

      // Apply RTL settings if needed (Android needs app restart)
      if (newIsRTL !== I18nManager.isRTL) {
        I18nManager.forceRTL(newIsRTL);
        if (Platform.OS === 'android') {
          console.warn('RTL change may require app restart on Android');
        }
      }

      // Update i18n and state
      i18n.locale = lang;
      setIsRTL(newIsRTL);
      setLanguageState(lang);

      // Persist language preference
      await AsyncStorage.setItem('@App:language', lang);
    } catch (error) {
      console.error('Language change failed:', error);
      throw error;
    }
  }, []);

  // Translation function with better error handling
  const t = useCallback((key: string, ...args: (string | number)[]) => {
    try {
      let translated = i18n.t(key);
      
      // Handle missing translations
      if (translated.includes('EE:')) {
        console.warn(`Missing translation for key: ${key}`);
        return key;
      }

      // Replace placeholders if provided
      if (args.length > 0) {
        args.forEach((arg, idx) => {
          translated = translated.replace(new RegExp(`\\{${idx}\\}`, 'g'), String(arg));
        });
      }

      return translated;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return key;
    }
  }, []);

  // Load initial language
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        // Try to load saved language
        const savedLang = await AsyncStorage.getItem('@App:language');
        
        if (savedLang && ['en', 'ar', 'ur'].includes(savedLang)) {
          await setLanguage(savedLang as Language);
          setIsLanguageLoaded(true);
          return;
        }
        
        // Fallback to best device language
        const locales = RNLocalize.getLocales();
        const deviceLang = locales[0]?.languageCode;
        const supportedLangs: Language[] = ['en', 'ar', 'ur'];
        const bestMatch = RNLocalize.findBestLanguageTag(supportedLangs);
        
        const langToSet = bestMatch?.languageTag as Language || 'en';
        await setLanguage(langToSet);
        setIsLanguageLoaded(true);
      } catch (error) {
        console.error('Language initialization failed:', error);
        // Ensure we always have a language set
        await setLanguage('en');
        setIsLanguageLoaded(true);
      }
    };

    loadLanguage();
  }, [setLanguage]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<LanguageContextType>(() => ({
    language,
    setLanguage,
    t,
    dir: isRTL ? 'rtl' : 'ltr',
    isRTL,
    isLanguageLoaded,
  }), [language, setLanguage, t, isRTL, isLanguageLoaded]);

  // Optional: Show loading state while language is being initialized
  if (!isLanguageLoaded) {
    return null; // or return <LoadingScreen />;
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};