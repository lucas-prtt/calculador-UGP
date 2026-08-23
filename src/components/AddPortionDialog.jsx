import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useMeals } from '../contexts/MealsContext';
import { useCombos } from '../contexts/CombosContext';
import MealSelectorDialog from './MealSelectorDialog';
import ComboSelectorDialog from './ComboSelectorDialog';

export default function AddPortionDialog({ onClose, onAddEmpty, onAddMeal, onAddCombo }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { meals } = useMeals();
  const { combos } = useCombos();
  const [showMealSelector, setShowMealSelector] = useState(false);
  const [showComboSelector, setShowComboSelector] = useState(false);

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = isDark ? '#38383A' : '#D1D1D6';
  const inputBg = isDark ? '#2C2C2E' : '#F2F2F7';
  const placeholderColor = isDark ? '#636366' : '#C7C7CC';

  const handleClose = () => {
    setShowMealSelector(false);
    setShowComboSelector(false);
    onClose();
  };

  const handleSelectMeal = (meal) => {
    setShowMealSelector(false);
    onAddMeal(meal, meal.portion);
    onClose();
  };

  const handleSelectCombo = (combo) => {
    setShowComboSelector(false);
    onAddCombo(combo);
    onClose();
  };

  if (showMealSelector) {
    return (
      <MealSelectorDialog
        onClose={() => setShowMealSelector(false)}
        onSelect={handleSelectMeal}
      />
    );
  }

  if (showComboSelector) {
    return (
      <ComboSelectorDialog
        onClose={() => setShowComboSelector(false)}
        onSelect={handleSelectCombo}
      />
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-dialog" style={{ backgroundColor: bg, borderColor }} onClick={(e) => e.stopPropagation()}>
        <span className="modal-title" style={{ color: textColor }}>
          {t('calculadora.addPortion')}
        </span>

        <button
          onClick={() => { onAddEmpty(); handleClose(); }}
          style={{
            backgroundColor: inputBg,
            color: textColor,
            border: 'none',
            padding: 16,
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          {t('calculadora.emptyPortion')}
        </button>

        <button
          onClick={() => {
            if (meals.length === 0) return;
            setShowMealSelector(true);
          }}
          disabled={meals.length === 0}
          style={{
            backgroundColor: inputBg,
            color: meals.length === 0 ? placeholderColor : textColor,
            border: 'none',
            padding: 16,
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 500,
            cursor: meals.length === 0 ? 'default' : 'pointer',
            textAlign: 'center',
          }}
        >
          {t('calculadora.fromMeal')}
          {meals.length === 0 && (
            <div style={{ fontSize: 12, marginTop: 4, color: placeholderColor }}>
              {t('meals.noMeals')}
            </div>
          )}
        </button>

        <button
          onClick={() => {
            if (combos.length === 0) return;
            setShowComboSelector(true);
          }}
          disabled={combos.length === 0}
          style={{
            backgroundColor: inputBg,
            color: combos.length === 0 ? placeholderColor : textColor,
            border: 'none',
            padding: 16,
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 500,
            cursor: combos.length === 0 ? 'default' : 'pointer',
            textAlign: 'center',
          }}
        >
          {t('calculadora.fromCombo')}
          {combos.length === 0 && (
            <div style={{ fontSize: 12, marginTop: 4, color: placeholderColor }}>
              {t('combos.noCombos')}
            </div>
          )}
        </button>

        <button className="btn-link" onClick={handleClose}>
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );
}
