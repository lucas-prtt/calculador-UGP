import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useMeals } from '../contexts/MealsContext';

export default function ComboFormDialog({ onClose, onSave, initial }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { meals } = useMeals();

  const [name, setName] = useState(initial?.name || '');
  const [selected, setSelected] = useState(initial?.mealIds || []);

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryColor = '#8E8E93';
  const bg = isDark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = isDark ? '#38383A' : '#D1D1D6';
  const inputBg = isDark ? '#2C2C2E' : '#F2F2F7';
  const itemBg = isDark ? '#2C2C2E' : '#F2F2F7';

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), mealIds: selected });
    if (!initial) {
      setName('');
      setSelected([]);
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
      <div
        className="modal-dialog modal-dialog-full"
        style={{ backgroundColor: bg, borderColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="modal-title" style={{ color: textColor }}>
          {initial ? t('combos.editCombo') : t('combos.addCombo')}
        </span>

        <div>
          <div className="field-label" style={{ color: textColor }}>{t('combos.name')}</div>
          <input
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('combos.name')}
          />
        </div>

        <div className="field-label" style={{ color: textColor, marginTop: 4 }}>{t('combos.selectMeals')}</div>

        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {meals.length === 0 ? (
            <div className="empty-text">{t('meals.noMeals')}</div>
          ) : (
            meals.map((meal) => {
              const checked = selected.includes(meal.id);
              return (
                <button
                  key={meal.id}
                  onClick={() => toggle(meal.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    border: 'none',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 6,
                    backgroundColor: itemBg,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 16, color: checked ? '#208AEF' : secondaryColor }}>{checked ? '\u2611' : '\u2610'}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ color: textColor, fontSize: 16, fontWeight: 600 }}>{meal.name}</span>
                    <div style={{ color: secondaryColor, fontSize: 13, marginTop: 2 }}>
                      {meal.portion}{t('common.gram')} — {t('calculadora.macroC')}:{meal.carbs} {t('calculadora.macroF')}:{meal.fat} {t('calculadora.macroP')}:{meal.protein}
                    </div>
                  </span>
                </button>
              );
            })
          )}
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
