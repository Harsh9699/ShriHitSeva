import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Very basic dictionary for core UI elements
const translations = {
  en: {
    'nav.home': 'Home',
    'nav.vaani': 'Vaani Library',
    'nav.calendar': 'Calendar',
    'nav.philosophy': 'Philosophy',
    'nav.naamJap': 'Naam Jap',
    'nav.community': 'Community',
    'nav.explore': 'Explore',
    
    'jap.title': 'Naam Jap',
    'jap.subtitle': 'Sadhana Tool',
    'jap.path': 'The Path of Nitya Vihar',
    'jap.tap': 'Tap to Chant',
    'jap.total': 'Total Malas',
    'jap.daily': 'Daily Sadhana',
    'jap.niyam': 'Nitya Niyam',
    'jap.desc': 'Track, save, and visualize your spiritual progress over time.',
    'jap.target': 'Target',
    'jap.today': "Today's Progress",
    'jap.save': 'Save Progress',
    'jap.saved': 'Saved!',
    'jap.analytics': 'Sadhana Analytics',
    'jap.last28': 'Last 28 Days (Monthly Overview)',
    'jap.missed': 'Missed',
    'jap.perfect': 'Perfect',

    'home.explore': 'Explore Vaanis',
    'home.ask': 'Ask Harivanshi'
  },
  hi: {
    'nav.home': 'मुख्य पृष्ठ',
    'nav.vaani': 'वाणी संग्रह',
    'nav.calendar': 'उत्सव कैलेंडर',
    'nav.philosophy': 'दर्शन',
    'nav.naamJap': 'नाम जप',
    'nav.community': 'समुदाय',
    'nav.explore': 'खोजें',
    
    'jap.title': 'नाम जप',
    'jap.subtitle': 'साधना उपकरण',
    'jap.path': 'नित्य विहार का मार्ग',
    'jap.tap': 'जप के लिए छुएं',
    'jap.total': 'कुल मालाएँ',
    'jap.daily': 'दैनिक साधना',
    'jap.niyam': 'नित्य नियम',
    'jap.desc': 'अपनी आध्यात्मिक प्रगति को ट्रैक करें और सहेजें।',
    'jap.target': 'लक्ष्य',
    'jap.today': "आज की प्रगति",
    'jap.save': 'प्रगति सहेजें',
    'jap.saved': 'सहेजा गया!',
    'jap.analytics': 'साधना विश्लेषण',
    'jap.last28': 'पिछले 28 दिन (मासिक अवलोकन)',
    'jap.missed': 'चूक गए',
    'jap.perfect': 'संपूर्ण',

    'home.explore': 'वाणियाँ खोजें',
    'home.ask': 'हरिवंशी से पूछें'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string): string => {
    const dict = translations[language];
    return (dict as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
