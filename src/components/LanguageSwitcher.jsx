import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useStorage } from '../storage/StorageContext';
import EnFlag from '../assets/flags/en.svg';
import EsFlag from '../assets/flags/es.svg';
import DeFlag from '../assets/flags/de.svg';
import PtFlag from '../assets/flags/pt.svg';

const FLAGS = { en: EnFlag, es: EsFlag, de: DeFlag, pt: PtFlag };
const LANGUAGES = ['en', 'es', 'de', 'pt'];

function CircleFlag({ code, size }) {
  const src = FLAGS[code] || EsFlag;
  return (
    <img
      src={src}
      alt={code}
      style={{ width: size, height: size, borderRadius: '50%', display: 'block', flexShrink: 0 }}
    />
  );
}

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { isDark } = useTheme();
  const storage = useStorage();
  const [visible, setVisible] = useState(false);

  const currentLang = i18n.language || 'es';

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    storage.set('language', code);
    setVisible(false);
  };

  const triggerBg = isDark ? '#1C1C1E' : '#F2F2F7';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const borderColor = isDark ? '#38383A' : '#D1D1D6';
  const dropdownBg = isDark ? '#1C1C1E' : '#FFFFFF';
  const selectedBg = isDark ? '#2C2C2E' : '#F2F2F7';

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setVisible(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 12px',
          borderRadius: 14,
          border: `1px solid ${borderColor}`,
          background: triggerBg,
          gap: 9,
          width: 200,
          cursor: 'pointer',
        }}
      >
        <CircleFlag code={currentLang} size={36} />
        <span style={{ color: textColor, fontSize: 20, fontWeight: 500, lineHeight: '24px' }}>
          {t(`languages.${currentLang}`)}
        </span>
        <span style={{ color: textColor, fontSize: 18, marginLeft: 'auto' }}>{'\u25BE'}</span>
      </button>

      {visible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
          }}
          onClick={() => setVisible(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 56,
              right: 16,
              minWidth: 200,
              borderRadius: 12,
              border: `1px solid ${borderColor}`,
              background: dropdownBg,
              padding: '8px 4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {LANGUAGES.map((code) => (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 8,
                  width: '100%',
                  border: 'none',
                  background: code === currentLang ? selectedBg : 'transparent',
                  cursor: 'pointer',
                  gap: 12,
                }}
              >
                <CircleFlag code={code} size={32} />
                <span style={{ color: textColor, fontSize: 16, flex: 1, textAlign: 'left' }}>
                  {t(`languages.${code}`)}
                </span>
                {code === currentLang && (
                  <span style={{ color: '#208AEF', fontSize: 16, fontWeight: 700 }}>{'\u2713'}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
