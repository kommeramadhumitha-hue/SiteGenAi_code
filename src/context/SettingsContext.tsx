import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { Language, translations, Translations } from '../i18n/translations';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  updateIntegrations: (partial: Partial<AppSettings['integrations']>) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  reducedMotion: false,
  language: 'en',
  defaultExportFormat: 'html',
  integrations: {
    aiProvider: 'gemini',
    aiApiKeyConfigured: false,
    aiApiKeyMasked: '',
    mongoDbConnected: false,
    mongoDbUriConfigured: false,
    githubConnected: false,
    githubUsername: '',
    githubTokenConfigured: false,
    deploymentProviderConnected: false,
    deploymentTokenConfigured: false,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('sitegen_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('sitegen_settings', JSON.stringify(settings));

    // Apply reduced motion class to root
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [settings]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const updateIntegrations = (partial: Partial<AppSettings['integrations']>) => {
    setSettings((prev) => ({
      ...prev,
      integrations: { ...prev.integrations, ...partial },
    }));
  };

  const setLanguage = (lang: Language) => {
    updateSettings({ language: lang });
  };

  const t = translations[settings.language] || translations.en;

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateIntegrations,
        language: settings.language,
        setLanguage,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
