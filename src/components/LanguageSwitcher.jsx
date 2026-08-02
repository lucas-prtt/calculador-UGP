import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useStorage } from '../storage/StorageContext';

const LANGUAGES = ['en', 'es', 'de', 'pt'];

function CircleFlag({ code, size }) {
  const v = size / 36;
  const s = (n) => (n * v).toFixed(1);
  const stripW = s(12);
  const stripY1 = s(12);
  const stripY2 = s(24);
  const halfW = s(18);

  const flags = {
    es: <g><rect width="36" height={stripW} fill="#AA151B"/><rect y={stripY1} width="36" height={stripW} fill="#F1BF00"/><rect y={stripY2} width="36" height={stripW} fill="#AA151B"/></g>,
    de: <g><rect width="36" height={stripW} fill="#000000"/><rect y={stripY1} width="36" height={stripW} fill="#DD0000"/><rect y={stripY2} width="36" height={stripW} fill="#FFCC00"/></g>,
    pt: <g><rect width={halfW} height="36" fill="#006600"/><rect x={halfW} width={halfW} height="36" fill="#FF0000"/><circle cx={halfW} cy="18" r={s(5.5)} fill="#FF0" opacity="0.6"/></g>,
    en: <g><rect width="36" height="36" fill="#012169"/><polygon points="0,0 16,18 0,36" fill="#C8102E"/><polygon points="36,0 20,18 36,36" fill="#C8102E"/><polygon points="0,15 21,18 0,21" fill="#FFFFFF"/><polygon points="36,15 15,18 36,21" fill="#FFFFFF"/><polygon points="15,0 18,0 18,36 15,36" fill="#FFFFFF"/><polygon points="21,0 18,0 18,36 21,36" fill="#C8102E"/><polygon points="0,15 0,12 36,18 36,21" fill="#C8102E"/></g>,
  };

  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
      <svg viewBox="0 0 36 36" width={size} height={size} style={{ display: 'block' }}>
        {flags[code] || flags.es}
      </svg>
    </div>
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
