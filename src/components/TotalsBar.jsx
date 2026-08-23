import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';

export default function TotalsBar({ portions }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { currentGramsPerUnit, caloriesPerUnit } = useSettings();

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
  const insulinUnits = currentGramsPerUnit > 0 ? totalCarbs / currentGramsPerUnit : 0;
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
      <Row>
        <Col label={t('calculadora.totalCarbs')} value={`${totalCarbs.toFixed(1)}g`} />
        <Col label={t('calculadora.totalFat')} value={`${totalFat.toFixed(1)}g`} />
        <Col label={t('calculadora.totalProtein')} value={`${totalProtein.toFixed(1)}g`} />
      </Row>

      <Divider />

      <Row>
        <Col label={t('calculadora.carbsCalories')} value={`${carbsCal.toFixed(0)} kcal`} />
        <Col label={t('calculadora.fatCalories')} value={`${fatCal.toFixed(0)} kcal`} />
        <Col label={t('calculadora.proteinCalories')} value={`${proteinCal.toFixed(0)} kcal`} />
      </Row>

      <Divider />

      <Row>
        <Col label={t('calculadora.insulinUnits')} value={insulinUnits.toFixed(2)} big />
        <Col label={t('calculadora.ugp')} value={ugp.toFixed(2)} big />
      </Row>
    </div>
  );
}
