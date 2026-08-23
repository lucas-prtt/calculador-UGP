import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useDialog } from '../components/Dialog';
import ExportImport from '../components/ExportImport';
import TimeOffsetDialog from '../components/TimeOffsetDialog';
import CurveRangeDialog from '../components/CurveRangeDialog';
import { formatOffset } from '../utils/carbsCurve';

export default function Opciones() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, isDark, setTheme } = useTheme();
  const { carbsPerUnit, caloriesPerUnit, advancedCarbsPerUnit, hoursOffset, curveMin, curveMax, valueAppearance, saveCarbsPerUnit, saveCaloriesPerUnit, saveAdvancedCarbsPerUnit, saveHoursOffset, saveValueAppearance } = useSettings();
  const { showConfirm } = useDialog();

  const [carbs, setCarbs] = useState(String(carbsPerUnit));
  const [calories, setCalories] = useState(String(caloriesPerUnit));
  const [offsetVisible, setOffsetVisible] = useState(false);
  const [rangeVisible, setRangeVisible] = useState(false);

  const rangeMin = curveMin != null ? curveMin : 0;
  const rangeMax = curveMax != null ? curveMax : carbsPerUnit * 4;

  useEffect(() => {
    setCarbs(String(carbsPerUnit));
    setCalories(String(caloriesPerUnit));
  }, [carbsPerUnit, caloriesPerUnit]);

  const saveCarbs = (value) => {
    setCarbs(value);
    const num = Number(value);
    if (num > 0) saveCarbsPerUnit(num);
  };

  const saveCalories = (value) => {
    setCalories(value);
    const num = Number(value);
    if (num > 0) saveCaloriesPerUnit(num);
  };

  const restoreDefaults = () => {
    showConfirm(t('settings.restoreDefaultsConfirm'), () => {
      setCarbs('15');
      setCalories('150');
      saveCarbsPerUnit(15);
      saveCaloriesPerUnit(150);
      saveAdvancedCarbsPerUnit(false);
      saveHoursOffset(0);
      saveValueAppearance('large');
    }, { confirmLabel: t('common.restore') });
  };

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#000000' : '#FFFFFF';
  const cardBg = isDark ? '#1C1C1E' : '#F2F2F7';
  const inputBg = isDark ? '#2C2C2E' : '#FFFFFF';
  const inputBorder = isDark ? '#38383A' : '#D1D1D6';
  const headerBorder = isDark ? '#38383A' : '#D1D1D6';

  return (
    <div className="page" style={{ backgroundColor: bg }}>
      <div className="header" style={{ borderColor: headerBorder }}>
        <div className="header-left">
          <button className="header-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} color="#208AEF" />
          </button>
        </div>
        <span className="header-title" style={{ color: textColor }}>{t('settings.title')}</span>
        <div className="header-right">
          <button className="header-btn" onClick={() => navigate('/')} title={t('common.home')}>
            <Home size={24} color="#208AEF" />
          </button>
        </div>
      </div>

      <div className="content" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="card" style={{
          backgroundColor: cardBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
        }}>
          <span style={{ color: textColor, fontSize: 16 }}>{t('settings.darkMode')}</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="card" style={{
          backgroundColor: cardBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
        }}>
          <span style={{ color: textColor, fontSize: 16, flex: 1 }}>{t('settings.carbsPerUnit')}</span>
          <input
            type="number"
            className="input-field"
            style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textColor, opacity: advancedCarbsPerUnit ? 0.4 : 1 }}
            value={carbs}
            onChange={(e) => saveCarbs(e.target.value)}
            placeholder="15"
            disabled={advancedCarbsPerUnit}
          />
        </div>

        <div className="card" style={{
          backgroundColor: cardBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
        }}>
          <span style={{ color: textColor, fontSize: 16, flex: 1 }}>{t('settings.advancedCarbsPerUnit')}</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={advancedCarbsPerUnit}
              onChange={(e) => saveAdvancedCarbsPerUnit(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {advancedCarbsPerUnit && (
          <button className="btn-primary" onClick={() => navigate('/configurar-por-hora')}>
            {t('settings.configureByHour')}
          </button>
        )}

        {advancedCarbsPerUnit && (
          <div
            className="card"
            onClick={() => setOffsetVisible(true)}
            style={{
              backgroundColor: cardBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              cursor: 'pointer',
            }}
          >
            <span style={{ color: textColor, fontSize: 16, flex: 1 }}>{t('settings.hoursOffset')}</span>
            <span style={{ color: '#208AEF', fontSize: 16, fontWeight: 600 }}>{formatOffset(hoursOffset)}</span>
          </div>
        )}

        {advancedCarbsPerUnit && (
          <div
            className="card"
            onClick={() => setRangeVisible(true)}
            style={{
              backgroundColor: cardBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              cursor: 'pointer',
            }}
          >
            <span style={{ color: textColor, fontSize: 16, flex: 1 }}>{t('settings.curveRange')}</span>
            <span style={{ color: '#208AEF', fontSize: 16, fontWeight: 600 }}>{rangeMin} – {rangeMax}</span>
          </div>
        )}

        <div className="card" style={{
          backgroundColor: cardBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
        }}>
          <span style={{ color: textColor, fontSize: 16, flex: 1 }}>{t('settings.caloriesPerUnit')}</span>
          <input
            type="number"
            className="input-field"
            style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textColor }}
            value={calories}
            onChange={(e) => saveCalories(e.target.value)}
            placeholder="150"
          />
        </div>

        <div className="card" style={{ backgroundColor: cardBg, padding: 16 }}>
          <span style={{ color: textColor, fontSize: 16, display: 'block', marginBottom: 12 }}>{t('settings.valueAppearance')}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => saveValueAppearance('large')}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: 8,
                border: `1px solid ${valueAppearance === 'large' ? '#208AEF' : inputBorder}`,
                backgroundColor: valueAppearance === 'large' ? '#208AEF' : inputBg,
                color: valueAppearance === 'large' ? '#FFFFFF' : textColor,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t('settings.appearanceLarge')}
            </button>
            <button
              onClick={() => saveValueAppearance('medium')}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: 8,
                border: `1px solid ${valueAppearance === 'medium' ? '#208AEF' : inputBorder}`,
                backgroundColor: valueAppearance === 'medium' ? '#208AEF' : inputBg,
                color: valueAppearance === 'medium' ? '#FFFFFF' : textColor,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t('settings.appearanceMedium')}
            </button>
            <button
              onClick={() => saveValueAppearance('small')}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: 8,
                border: `1px solid ${valueAppearance === 'small' ? '#208AEF' : inputBorder}`,
                backgroundColor: valueAppearance === 'small' ? '#208AEF' : inputBg,
                color: valueAppearance === 'small' ? '#FFFFFF' : textColor,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t('settings.appearanceSmall')}
            </button>
          </div>
        </div>

        <ExportImport />

        <button
          className="btn-danger"
          onClick={restoreDefaults}
          style={{ backgroundColor: cardBg }}
        >
          {t('settings.restoreDefaults')}
        </button>
      </div>

      {offsetVisible && <TimeOffsetDialog onClose={() => setOffsetVisible(false)} />}
      {rangeVisible && <CurveRangeDialog onClose={() => setRangeVisible(false)} />}
    </div>
  );
}
