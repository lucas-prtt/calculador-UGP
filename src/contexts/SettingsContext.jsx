import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useStorage } from '../storage/StorageContext';
import { SLOTS, defaultCurve, curveValueAt, timeToHours, round1, formatTime } from '../utils/carbsCurve';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const storage = useStorage();
  const [carbsPerUnit, setCarbsPerUnitState] = useState(15);
  const [caloriesPerUnit, setCaloriesPerUnitState] = useState(150);
  const [advancedCarbsPerUnit, setAdvancedCarbsPerUnitState] = useState(false);
  const [carbsPerUnitCurve, setCarbsPerUnitCurveState] = useState(null);
  const [hoursOffset, setHoursOffsetState] = useState(0);
  const [curveMin, setCurveMinState] = useState(null);
  const [curveMax, setCurveMaxState] = useState(null);
  const [valueAppearance, setValueAppearanceState] = useState('large');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    storage.get('carbsPerUnit').then((v) => { if (v !== null) setCarbsPerUnitState(v); });
    storage.get('caloriesPerUnit').then((v) => { if (v !== null) setCaloriesPerUnitState(v); });
    storage.get('advancedCarbsPerUnit').then((v) => { if (v !== null) setAdvancedCarbsPerUnitState(v === true); });
    storage.get('carbsPerUnitCurve').then((v) => {
      if (Array.isArray(v) && v.length === SLOTS) setCarbsPerUnitCurveState(v);
    });
    storage.get('hoursOffset').then((v) => { if (v !== null) setHoursOffsetState(v); });
    storage.get('curveMin').then((v) => { if (v !== null) setCurveMinState(v); });
    storage.get('curveMax').then((v) => { if (v !== null) setCurveMaxState(v); });
    storage.get('valueAppearance').then((v) => { if (v !== null) setValueAppearanceState(v); });
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const setCarbsPerUnit = useCallback((v) => setCarbsPerUnitState(v), []);
  const setCaloriesPerUnit = useCallback((v) => setCaloriesPerUnitState(v), []);

  const saveCarbsPerUnit = useCallback((v) => {
    setCarbsPerUnitState(v);
    storage.set('carbsPerUnit', v);
    setCarbsPerUnitCurveState(null);
    storage.remove('carbsPerUnitCurve');
    setCurveMinState(null);
    setCurveMaxState(null);
    storage.remove('curveMin');
    storage.remove('curveMax');
  }, []);

  const saveCaloriesPerUnit = useCallback((v) => {
    setCaloriesPerUnitState(v);
    storage.set('caloriesPerUnit', v);
  }, []);

  const saveAdvancedCarbsPerUnit = useCallback((v) => {
    setAdvancedCarbsPerUnitState(v);
    storage.set('advancedCarbsPerUnit', v);
  }, []);

  const saveHoursOffset = useCallback((v) => {
    setHoursOffsetState(v);
    storage.set('hoursOffset', v);
  }, []);

  const saveCurveRange = useCallback((min, max) => {
    setCurveMinState(min);
    setCurveMaxState(max);
    if (min == null) storage.remove('curveMin'); else storage.set('curveMin', min);
    if (max == null) storage.remove('curveMax'); else storage.set('curveMax', max);
  }, []);

  const saveValueAppearance = useCallback((v) => {
    setValueAppearanceState(v);
    storage.set('valueAppearance', v);
  }, []);

  const saveCarbsPerUnitCurve = useCallback((arr) => {
    const sanitized = Array.isArray(arr) && arr.length === SLOTS ? arr.slice() : defaultCurve(carbsPerUnit);
    setCarbsPerUnitCurveState(sanitized);
    storage.set('carbsPerUnitCurve', sanitized);
  }, [carbsPerUnit]);

  const curve = carbsPerUnitCurve && carbsPerUnitCurve.length === SLOTS
    ? carbsPerUnitCurve
    : defaultCurve(carbsPerUnit);

  const effectiveNow = new Date(now.getTime() + hoursOffset * 60000);

  const currentGramsPerUnit = advancedCarbsPerUnit
    ? round1(curveValueAt(curve, timeToHours(effectiveNow)))
    : carbsPerUnit;

  const currentTimeLabel = formatTime(effectiveNow);

  return (
    <SettingsContext.Provider
      value={{
        carbsPerUnit,
        caloriesPerUnit,
        advancedCarbsPerUnit,
        carbsPerUnitCurve: curve,
        hoursOffset,
        curveMin,
        curveMax,
        valueAppearance,
        currentGramsPerUnit,
        currentTimeLabel,
        setCarbsPerUnit,
        setCaloriesPerUnit,
        saveCarbsPerUnit,
        saveCaloriesPerUnit,
        saveAdvancedCarbsPerUnit,
        saveCarbsPerUnitCurve,
        saveHoursOffset,
        saveCurveRange,
        saveValueAppearance,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
