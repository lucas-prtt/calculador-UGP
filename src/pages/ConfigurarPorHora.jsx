import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import CarbsCurveChart from '../components/CarbsCurveChart';

export default function ConfigurarPorHora() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { carbsPerUnit, carbsPerUnitCurve, saveCarbsPerUnitCurve } = useSettings();

  const [draft, setDraft] = useState(carbsPerUnitCurve);

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#000000' : '#FFFFFF';
  const headerBorder = isDark ? '#38383A' : '#D1D1D6';

  const handleSave = () => {
    saveCarbsPerUnitCurve(draft);
    navigate(-1);
  };

  return (
    <div className="page" style={{ backgroundColor: bg }}>
      <div className="header" style={{ borderColor: headerBorder }}>
        <div className="header-left">
          <button className="header-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} color="#208AEF" />
          </button>
        </div>
        <span className="header-title" style={{ color: textColor }}>{t('settings.configureByHour')}</span>
        <div className="header-right">
          <button className="header-btn" onClick={() => navigate('/')} title="Home">
            <Home size={24} color="#208AEF" />
          </button>
        </div>
      </div>

      <div className="content" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 8px 0', overflow: 'hidden' }}>
        <div style={{ fontSize: 13, color: '#8E8E93', textAlign: 'center', flexShrink: 0, padding: '4px 8px' }}>
          {t('settings.dragHint')}
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' }}>
          <CarbsCurveChart curve={draft} maxValue={carbsPerUnit * 4} onChange={setDraft} />
        </div>
      </div>

      <div className="bottom-bar-single">
        <button className="btn-primary" onClick={handleSave}>
          {t('settings.save')}
        </button>
      </div>
    </div>
  );
}
