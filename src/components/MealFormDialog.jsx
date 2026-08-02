import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export default function MealFormDialog({ onClose, onSave, initial }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const [name, setName] = useState('');
  const [portion, setPortion] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setPortion(String(initial.portion));
      setCarbs(String(initial.carbs));
      setFat(String(initial.fat));
      setProtein(String(initial.protein));
    }
  }, [initial]);

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = isDark ? '#38383A' : '#D1D1D6';
  const inputBg = isDark ? '#2C2C2E' : '#F2F2F7';

  const handleSave = () => {
    if (!name.trim() || !portion) return;
    onSave({
      name: name.trim(),
      portion: Number(portion),
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      protein: Number(protein) || 0,
    });
    if (!initial) {
      setName('');
      setPortion('');
      setCarbs('');
      setFat('');
      setProtein('');
    }
  };

  const inputStyle = {
    height: 40,
    border: `1px solid ${borderColor}`,
    borderRadius: 8,
    padding: '0 12px',
    fontSize: 16,
    backgroundColor: inputBg,
    color: textColor,
    width: '100%',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ backgroundColor: bg, borderColor }} onClick={(e) => e.stopPropagation()}>
        <span className="modal-title" style={{ color: textColor }}>
          {initial ? t('meals.editMeal') : t('meals.addMeal')}
        </span>

        <div>
          <div className="field-label" style={{ color: textColor }}>{t('meals.name')}</div>
          <input
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('meals.name')}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div className="field-label" style={{ color: textColor }}>{t('meals.portion')}</div>
            <input
              style={inputStyle}
              value={portion}
              onChange={(e) => setPortion(e.target.value)}
              type="number"
              inputMode="numeric"
              placeholder="100"
            />
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label" style={{ color: textColor }}>{t('meals.carbs')}</div>
            <input
              style={inputStyle}
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              type="number"
              inputMode="numeric"
              placeholder="0"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div className="field-label" style={{ color: textColor }}>{t('meals.fat')}</div>
            <input
              style={inputStyle}
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              type="number"
              inputMode="numeric"
              placeholder="0"
            />
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label" style={{ color: textColor }}>{t('meals.protein')}</div>
            <input
              style={inputStyle}
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              type="number"
              inputMode="numeric"
              placeholder="0"
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn-link" onClick={onClose}>{t('common.cancel')}</button>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: '#208AEF',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('meals.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
