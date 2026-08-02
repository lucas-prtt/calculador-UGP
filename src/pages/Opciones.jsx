import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useStorage } from '../storage/StorageContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import ExportImport from '../components/ExportImport';

export default function Opciones() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, isDark, setTheme } = useTheme();
  const storage = useStorage();

  const [carbs, setCarbs] = useState('15');
  const [calories, setCalories] = useState('150');

  useEffect(() => {
    storage.get('carbsPerUnit').then((v) => { if (v !== null) setCarbs(String(v)); });
    storage.get('caloriesPerUnit').then((v) => { if (v !== null) setCalories(String(v)); });
  }, []);

  const saveCarbs = (value) => {
    setCarbs(value);
    const num = Number(value);
    if (num > 0) storage.set('carbsPerUnit', num);
  };

  const saveCalories = (value) => {
    setCalories(value);
    const num = Number(value);
    if (num > 0) storage.set('caloriesPerUnit', num);
  };

  const restoreDefaults = () => {
    setCarbs('15');
    setCalories('150');
    storage.set('carbsPerUnit', 15);
    storage.set('caloriesPerUnit', 150);
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
          <button className="header-btn" onClick={() => navigate('/')} title="Home">
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
            style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textColor }}
            value={carbs}
            onChange={(e) => saveCarbs(e.target.value)}
            placeholder="15"
          />
        </div>

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

        <ExportImport />

        <button
          className="btn-danger"
          onClick={restoreDefaults}
          style={{ backgroundColor: cardBg }}
        >
          {t('settings.restoreDefaults')}
        </button>
      </div>
    </div>
  );
}
