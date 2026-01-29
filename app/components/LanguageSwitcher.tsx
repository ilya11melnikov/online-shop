'use client';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale(); // Текущий язык из URL (ru или en)
  const router = useRouter();
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Отображаем полное название в зависимости от локали
  const currentDisplayLang = locale === 'ru' ? 'Русский' : 'English';

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Русский', value: 'ru' }
  ];

  const handleSelect = (langValue: string, langLabel: string) => {
    // 1. Сохраняем выбор в память (как ты и хотел)
    localStorage.setItem('app_lang', langLabel);
    
    // 2. Логика переключения URL (чтобы сайт реально сменил язык)
    const segments = pathname.split('/');
    segments[1] = langValue;
    const newPath = segments.join('/');
    
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="switch" onMouseLeave={() => setIsOpen(false)}>
      <div className="switch__lang" onClick={() => setIsOpen(!isOpen)}>
        <span className="switch__lang-current">{currentDisplayLang}</span>
        <img 
          src="/arrow.svg" 
          alt="arrow" 
          className={`switch__icon ${isOpen ? 'switch__icon--active' : ''}`} 
        />
      </div>
      
      {isOpen && (
        <div className="switch__dropdown">
          {languages
            .filter(lang => lang.value !== locale)
            .map(lang => (
              <div 
                key={lang.value} 
                className="switch__item" 
                onClick={() => handleSelect(lang.value, lang.label)}
              >
                {lang.label}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}