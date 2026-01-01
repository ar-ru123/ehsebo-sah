import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { Language, t, TranslationKey } from '@/constants/i18n';

const LANGUAGE_STORAGE_KEY = 'app_language';

/**
 * Hook for managing app language and translations
 */
export function useLanguage() {
  const [language, setLanguageState] = useState<Language>('ar');
  const [loading, setLoading] = useState(true);

  // Load saved language preference
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'ar' || saved === 'en') {
        setLanguageState(saved);
        // Set RTL for Arabic
        if (saved === 'ar' && !I18nManager.isRTL) {
          I18nManager.forceRTL(true);
        } else if (saved === 'en' && I18nManager.isRTL) {
          I18nManager.forceRTL(false);
        }
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setLoading(false);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguageState(newLanguage);
      
      // Update RTL setting
      const shouldBeRTL = newLanguage === 'ar';
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.forceRTL(shouldBeRTL);
        // Note: App needs to be restarted for RTL changes to take full effect
      }
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
  };

  const translate = (key: TranslationKey): string => {
    return t(key, language);
  };

  return {
    language,
    setLanguage,
    toggleLanguage,
    translate,
    loading,
    isRTL: language === 'ar',
  };
}
