import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const bg = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const buttonBg = isDark ? '#1C1C1E' : '#F2F2F7';
  const headerBorder = isDark ? '#38383A' : '#D1D1D6';

  return (
    <div className="page" style={{ backgroundColor: bg }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        paddingTop: 12,
        borderBottom: `1px solid ${headerBorder}`,
      }}>
        <div style={{ flex: 1 }} />
        <LanguageSwitcher />
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
        gap: 16,
      }}>
        <button
          onClick={() => navigate('/calculadora')}
          style={{
            backgroundColor: buttonBg,
            color: textColor,
            border: 'none',
            width: '100%',
            padding: '18px',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          {t('home.calculate')}
        </button>
        <button
          onClick={() => navigate('/comidas-registradas')}
          style={{
            backgroundColor: buttonBg,
            color: textColor,
            border: 'none',
            width: '100%',
            padding: '18px',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          {t('home.registeredMeals')}
        </button>
        <button
          onClick={() => navigate('/opciones')}
          style={{
            backgroundColor: buttonBg,
            color: textColor,
            border: 'none',
            width: '100%',
            padding: '18px',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          {t('home.settings')}
        </button>
      </div>
    </div>
  );
}
