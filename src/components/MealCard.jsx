import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export default function MealCard({ meal, onEdit, onDelete }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryColor = isDark ? '#8E8E93' : '#8E8E93';
  const cardBg = isDark ? '#1C1C1E' : '#F2F2F7';

  return (
    <div className="card" style={{ backgroundColor: cardBg }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: textColor, flex: 1 }}>{meal.name}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onEdit}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 18, color: '#208AEF' }}
          >
            {'\u270E'}
          </button>
          <button
            onClick={onDelete}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 16, color: '#FF3B30' }}
          >
            {'\u2715'}
          </button>
        </div>
      </div>
      <div style={{ fontSize: 14, color: secondaryColor, marginTop: 4 }}>
        {t('meals.portion')}: {meal.portion}g
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: textColor }}>
          {t('calculadora.macroC')}: {meal.carbs}g
        </span>
        <span style={{ fontSize: 14, fontWeight: 500, color: textColor }}>
          {t('calculadora.macroF')}: {meal.fat}g
        </span>
        <span style={{ fontSize: 14, fontWeight: 500, color: textColor }}>
          {t('calculadora.macroP')}: {meal.protein}g
        </span>
      </div>
    </div>
  );
}
