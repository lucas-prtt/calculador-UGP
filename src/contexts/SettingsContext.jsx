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
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    storage.get('carbsPerUnit').then((v) => { if (v !== null) setCarbsPerUnitState(v); });
    storage.get('caloriesPerUnit').then((v) => { if (v !== null) setCaloriesPerUnitState(v); });
    storage.get('advancedCarbsPerUnit').then((v) => { if (v !== null) setAdvancedCarbsPerUnitState(v === true); });
    storage.get('carbsPerUnitCurve').then((v) => {
      if (Array.isArray(v) && v.length === SLOTS) setCarbsPerUnitCurveState(v);
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const setCarbsPerUnit = useCallback((v) => setCarbsPerUnitState(v), []);
  const setCaloriesPerUnit = useCallback((v) => setCaloriesPerUnitState(v), []);

  const saveCarbsPerUnit = useCallback((v) => {
    setCarbsPerUnitState(v);
    storage.set('carbsPerUnit', v);
    setCarbsPerUnitCurveState(null);
    storage.remove('carbsPerUnitCurve');
  }, []);

  const saveCaloriesPerUnit = useCallback((v) => {
    setCaloriesPerUnitState(v);
    storage.set('caloriesPerUnit', v);
  }, []);

  const saveAdvancedCarbsPerUnit = useCallback((v) => {
    setAdvancedCarbsPerUnitState(v);
    storage.set('advancedCarbsPerUnit', v);
  }, []);

  const saveCarbsPerUnitCurve = useCallback((arr) => {
    const sanitized = Array.isArray(arr) && arr.length === SLOTS ? arr.slice() : defaultCurve(carbsPerUnit);
    setCarbsPerUnitCurveState(sanitized);
    storage.set('carbsPerUnitCurve', sanitized);
  }, [carbsPerUnit]);

  const curve = carbsPerUnitCurve && carbsPerUnitCurve.length === SLOTS
    ? carbsPerUnitCurve
    : defaultCurve(carbsPerUnit);

  const currentGramsPerUnit = advancedCarbsPerUnit
    ? round1(curveValueAt(curve, timeToHours(now)))
    : carbsPerUnit;

  const currentTimeLabel = formatTime(now);

  return (
    <SettingsContext.Provider
      value={{
        carbsPerUnit,
        caloriesPerUnit,
        advancedCarbsPerUnit,
        carbsPerUnitCurve: curve,
        currentGramsPerUnit,
        currentTimeLabel,
        setCarbsPerUnit,
        setCaloriesPerUnit,
        saveCarbsPerUnit,
        saveCaloriesPerUnit,
        saveAdvancedCarbsPerUnit,
        saveCarbsPerUnitCurve,
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
