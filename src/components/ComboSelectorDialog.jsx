import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useCombos } from '../contexts/CombosContext';
import { useMeals } from '../contexts/MealsContext';

export default function ComboSelectorDialog({ onClose, onSelect }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { combos } = useCombos();
  const { meals } = useMeals();

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryColor = '#8E8E93';
  const bg = isDark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = isDark ? '#38383A' : '#D1D1D6';
  const itemBg = isDark ? '#2C2C2E' : '#F2F2F7';

  const validCount = (combo) => (combo.mealIds || []).filter((id) => meals.some((m) => m.id === id)).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-full"
        style={{ backgroundColor: bg, borderColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span className="modal-title" style={{ color: textColor }}>
            {t('calculadora.selectCombo')}
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#208AEF', fontSize: 20, cursor: 'pointer' }}
          >
            {'\u2715'}
          </button>
        </div>

        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {combos.length === 0 ? (
            <div className="empty-text">{t('combos.noCombos')}</div>
          ) : (
            combos.map((combo) => (
              <button
                key={combo.id}
                onClick={() => onSelect(combo)}
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
                <span style={{ color: textColor, fontSize: 16, fontWeight: 600 }}>{combo.name}</span>
                <div style={{ color: secondaryColor, fontSize: 13, marginTop: 2 }}>
                  {t('combos.mealCount', { count: validCount(combo) })}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
