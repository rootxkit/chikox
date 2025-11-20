'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'en'
            ? 'bg-accent text-text-alternative'
            : 'text-neutral hover:text-accent hover:bg-background-secondary'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ge')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'ge'
            ? 'bg-accent text-text-alternative'
            : 'text-neutral hover:text-accent hover:bg-background-secondary'
        }`}
      >
        GE
      </button>
    </div>
  );
}
