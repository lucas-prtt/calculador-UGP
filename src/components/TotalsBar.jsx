import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';

export default function TotalsBar({ portions, overrideValue = null }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { currentGramsPerUnit, caloriesPerUnit, valueAppearance } = useSettings();

  const gramsPerUnit = overrideValue != null ? overrideValue : currentGramsPerUnit;

  const bg = isDark ? '#1C1C1E' : '#F2F2F7';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const accentColor = '#208AEF';
  const borderColor = isDark ? '#38383A' : '#D1D1D6';

  const totalCarbs = portions.reduce((s, p) => s + (p.carbs || 0), 0);
  const totalFat = portions.reduce((s, p) => s + (p.fat || 0), 0);
  const totalProtein = portions.reduce((s, p) => s + (p.protein || 0), 0);
  const carbsCal = totalCarbs * 4;
  const fatCal = totalFat * 9;
  const proteinCal = totalProtein * 4;
  const totalCal = carbsCal + fatCal + proteinCal;
  const insulinUnits = gramsPerUnit > 0 ? totalCarbs / gramsPerUnit : 0;
  const ugp = caloriesPerUnit > 0 ? (fatCal + proteinCal) / caloriesPerUnit : 0;

  const Row = ({ children }) => (
    <div style={{ display: 'flex' }}>{children}</div>
  );

  const Col = ({ label, value, big }) => (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: textColor, marginBottom: 2 }}>{label}</div>
      <div style={{
        fontSize: big ? 20 : 14,
        fontWeight: big ? 800 : 600,
        color: big ? accentColor : textColor,
      }}>
        {value}
      </div>
    </div>
  );

  const LineRow = ({ label, value, big }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0' }}>
      <span style={{ fontSize: 13, color: textColor }}>{label}</span>
      <span style={{
        fontSize: big ? 18 : 14,
        fontWeight: big ? 800 : 600,
        color: big ? accentColor : textColor,
      }}>
        {value}
      </span>
    </div>
  );

  const Divider = () => (
    <div style={{ borderTop: `1px solid ${borderColor}`, margin: '8px 0' }} />
  );

  return (
    <div style={{
      borderRadius: 14,
      border: `1px solid ${borderColor}`,
      backgroundColor: bg,
      padding: 14,
    }}>
      {valueAppearance === 'small' ? (
        <>
          <LineRow label={t('calculadora.insulinUnitsShort')} value={insulinUnits.toFixed(2)} big />
          <Divider />
          <LineRow label={t('calculadora.ugp')} value={ugp.toFixed(2)} big />
          <Divider />
          <LineRow label={t('calculadora.totalCalories')} value={`${totalCal.toFixed(0)} ${t('common.kcal')}`} />
        </>
      ) : valueAppearance === 'medium' ? (
        <>
          <LineRow label={t('calculadora.totalCarbsShort')} value={`${totalCarbs.toFixed(1)}${t('common.gram')}`} />
          <LineRow label={t('calculadora.totalFatShort')} value={`${totalFat.toFixed(1)}${t('common.gram')}`} />
          <LineRow label={t('calculadora.totalProteinShort')} value={`${totalProtein.toFixed(1)}${t('common.gram')}`} />
          <Divider />
          <LineRow label={t('calculadora.carbsCaloriesShort')} value={`${carbsCal.toFixed(0)} ${t('common.kcal')}`} />
          <LineRow label={t('calculadora.fatCaloriesShort')} value={`${fatCal.toFixed(0)} ${t('common.kcal')}`} />
          <LineRow label={t('calculadora.proteinCaloriesShort')} value={`${proteinCal.toFixed(0)} ${t('common.kcal')}`} />
          <Divider />
          <LineRow label={t('calculadora.insulinUnitsShort')} value={insulinUnits.toFixed(2)} big />
          <LineRow label={t('calculadora.ugp')} value={ugp.toFixed(2)} big />
        </>
      ) : (
        <>
          <Row>
            <Col label={t('calculadora.totalCarbs')} value={`${totalCarbs.toFixed(1)}${t('common.gram')}`} />
            <Col label={t('calculadora.totalFat')} value={`${totalFat.toFixed(1)}${t('common.gram')}`} />
            <Col label={t('calculadora.totalProtein')} value={`${totalProtein.toFixed(1)}${t('common.gram')}`} />
          </Row>

          <Divider />

          <Row>
            <Col label={t('calculadora.carbsCalories')} value={`${carbsCal.toFixed(0)} ${t('common.kcal')}`} />
            <Col label={t('calculadora.fatCalories')} value={`${fatCal.toFixed(0)} ${t('common.kcal')}`} />
            <Col label={t('calculadora.proteinCalories')} value={`${proteinCal.toFixed(0)} ${t('common.kcal')}`} />
          </Row>

          <Divider />

          <Row>
            <Col label={t('calculadora.insulinUnits')} value={insulinUnits.toFixed(2)} big />
            <Col label={t('calculadora.ugp')} value={ugp.toFixed(2)} big />
          </Row>
        </>
      )}
    </div>
  );
}
