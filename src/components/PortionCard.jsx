import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useMeals } from '../contexts/MealsContext';
import { useDialog } from './Dialog';

export default function PortionCard({ portion, onUpdate, onRemove }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { meals, addMeal } = useMeals();
  const { showConfirm } = useDialog();
  const [registerVisible, setRegisterVisible] = useState(false);
  const [registerGrams, setRegisterGrams] = useState('');

  const meal = portion.isMeal ? meals.find((m) => m.id === portion.mealId) : null;

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryColor = isDark ? '#8E8E93' : '#8E8E93';
  const cardBg = isDark ? '#1C1C1E' : '#F2F2F7';
  const inputBg = isDark ? '#2C2C2E' : '#FFFFFF';
  const inputBorder = isDark ? '#38383A' : '#D1D1D6';
  const disabledBg = isDark ? '#1A1A1C' : '#E9E9ED';

  const canRegister = !portion.isMeal && portion.name.trim() !== '';

  const handleGramsChange = (value) => {
    const grams = Number(value) || 0;
    if (portion.isMeal && meal) {
      const ratio = grams / meal.portion;
      onUpdate(portion.id, {
        grams,
        carbs: Math.round(meal.carbs * ratio * 100) / 100,
        fat: Math.round(meal.fat * ratio * 100) / 100,
        protein: Math.round(meal.protein * ratio * 100) / 100,
      });
    }
  };

  const handleMacroChange = (field, value) => {
    if (portion.isMeal) return;
    onUpdate(portion.id, { [field]: Number(value) || 0 });
  };

  const handleNameChange = (value) => {
    onUpdate(portion.id, { name: value });
  };

  const handleRegister = () => {
    const grams = Number(registerGrams) || 100;
    addMeal({
      name: portion.name.trim(),
      portion: grams,
      carbs: portion.carbs,
      fat: portion.fat,
      protein: portion.protein,
    });
    setRegisterVisible(false);
    setRegisterGrams('');
  };

  const handleRemove = () => {
    showConfirm(t('calculadora.deletePortionConfirm'), () => {
      onRemove(portion.id);
    });
  };

  const macroValue = (val) => (val != null ? String(val) : '');

  const inputStyle = (disabled) => ({
    flex: 1,
    minWidth: 0,
    height: 28,
    border: `1px solid ${inputBorder}`,
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 13,
    padding: 0,
    backgroundColor: disabled ? disabledBg : inputBg,
    color: disabled ? secondaryColor : textColor,
  });

  return (
    <>
      <div className="card" style={{ backgroundColor: cardBg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input
            value={portion.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder={t('calculadora.portionName')}
            readOnly={portion.isMeal}
            style={{
              fontSize: 15,
              fontWeight: 600,
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: textColor,
              padding: 0,
              height: 24,
            }}
          />
          {canRegister && (
            <button
              onClick={() => { setRegisterGrams(''); setRegisterVisible(true); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 14 }}
            >
              {'\uD83D\uDCBE'}
            </button>
          )}
          <button
            onClick={handleRemove}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 16, color: '#FF3B30' }}
          >
            {'\u2715'}
          </button>
        </div>

        {portion.isMeal && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4, gap: 4 }}>
            <span style={{ fontSize: 13, color: textColor }}>g:</span>
            <input
              className="input-small"
              style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textColor }}
              value={macroValue(portion.grams)}
              onChange={(e) => handleGramsChange(e.target.value)}
              type="number"
              inputMode="numeric"
              placeholder="0"
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: secondaryColor, width: 12 }}>
              {t('calculadora.macroC')}
            </span>
            <input
              value={macroValue(portion.carbs)}
              onChange={(e) => handleMacroChange('carbs', e.target.value)}
              type="number"
              readOnly={portion.isMeal}
              placeholder="0"
              style={inputStyle(portion.isMeal)}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: secondaryColor, width: 12 }}>
              {t('calculadora.macroF')}
            </span>
            <input
              value={macroValue(portion.fat)}
              onChange={(e) => handleMacroChange('fat', e.target.value)}
              type="number"
              readOnly={portion.isMeal}
              placeholder="0"
              style={inputStyle(portion.isMeal)}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: secondaryColor, width: 12 }}>
              {t('calculadora.macroP')}
            </span>
            <input
              value={macroValue(portion.protein)}
              onChange={(e) => handleMacroChange('protein', e.target.value)}
              type="number"
              readOnly={portion.isMeal}
              placeholder="0"
              style={inputStyle(portion.isMeal)}
            />
          </div>
        </div>
      </div>

      {registerVisible && (
        <div className="modal-overlay" onClick={() => setRegisterVisible(false)}>
          <div className="modal-dialog" style={{
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            borderColor: inputBorder,
          }} onClick={(e) => e.stopPropagation()}>
            <span className="modal-title" style={{ color: textColor }}>
              {t('calculadora.gramsForMeal')}
            </span>
            <input
              className="modal-input-big"
              style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textColor }}
              value={registerGrams}
              onChange={(e) => setRegisterGrams(e.target.value)}
              type="number"
              autoFocus
              placeholder="100"
            />
            <div className="modal-buttons">
              <button className="btn-link" onClick={() => setRegisterVisible(false)}>
                {t('common.cancel')}
              </button>
              <button
                onClick={handleRegister}
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
      )}
    </>
  );
}
