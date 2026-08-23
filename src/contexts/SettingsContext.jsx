import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useStorage } from '../storage/StorageContext';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const storage = useStorage();
  const [carbsPerUnit, setCarbsPerUnitState] = useState(15);
  const [caloriesPerUnit, setCaloriesPerUnitState] = useState(150);

  useEffect(() => {
    storage.get('carbsPerUnit').then((v) => { if (v !== null) setCarbsPerUnitState(v); });
    storage.get('caloriesPerUnit').then((v) => { if (v !== null) setCaloriesPerUnitState(v); });
  }, []);

  const setCarbsPerUnit = useCallback((v) => setCarbsPerUnitState(v), []);
  const setCaloriesPerUnit = useCallback((v) => setCaloriesPerUnitState(v), []);

  const saveCarbsPerUnit = useCallback((v) => {
    setCarbsPerUnitState(v);
    storage.set('carbsPerUnit', v);
  }, []);

  const saveCaloriesPerUnit = useCallback((v) => {
    setCaloriesPerUnitState(v);
    storage.set('caloriesPerUnit', v);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        carbsPerUnit,
        caloriesPerUnit,
        setCarbsPerUnit,
        setCaloriesPerUnit,
        saveCarbsPerUnit,
        saveCaloriesPerUnit,
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
