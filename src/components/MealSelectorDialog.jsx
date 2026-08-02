import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useMeals } from '../contexts/MealsContext';

export default function MealSelectorDialog({ onClose, onSelect }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { meals } = useMeals();
  const [search, setSearch] = useState('');

  const filtered = meals.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryColor = isDark ? '#8E8E93' : '#8E8E93';
  const bg = isDark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = isDark ? '#38383A' : '#D1D1D6';
  const inputBg = isDark ? '#2C2C2E' : '#F2F2F7';
  const itemBg = isDark ? '#2C2C2E' : '#F2F2F7';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-full"
        style={{ backgroundColor: bg, borderColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span className="modal-title" style={{ color: textColor }}>
            {t('calculadora.selectMeal')}
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#208AEF', fontSize: 20, cursor: 'pointer' }}
          >
            {'\u2715'}
          </button>
        </div>

        <input
          className="modal-input"
          style={{ backgroundColor: inputBg, borderColor, color: textColor }}
          placeholder={t('calculadora.searchMeal')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div className="empty-text">{t('meals.noMeals')}</div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                style={{
                  display: 'block',
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
                <span style={{ color: textColor, fontSize: 16, fontWeight: 600 }}>{item.name}</span>
                <div style={{ color: secondaryColor, fontSize: 13, marginTop: 2 }}>
                  {item.portion}g — C:{item.carbs} F:{item.fat} P:{item.protein}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
