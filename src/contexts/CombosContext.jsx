import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useStorage } from '../storage/StorageContext';

const CombosContext = createContext(null);

export function CombosProvider({ children }) {
  const storage = useStorage();
  const [combos, setCombos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storage.get('combos').then((saved) => {
      setCombos(saved || []);
      setLoaded(true);
    });
  }, []);

  const addCombo = useCallback((combo) => {
    setCombos((prev) => {
      const updated = [...prev, { ...combo, id: Date.now().toString() }];
      storage.set('combos', updated);
      return updated;
    });
  }, []);

  const updateCombo = useCallback((id, data) => {
    setCombos((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...data } : c));
      storage.set('combos', updated);
      return updated;
    });
  }, []);

  const deleteCombo = useCallback((id) => {
    setCombos((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      storage.set('combos', updated);
      return updated;
    });
  }, []);

  const replaceCombos = useCallback((newCombos) => {
    const mapped = (newCombos || []).map((c, i) => ({
      id: `${Date.now()}-${i}`,
      name: c.name,
      mealIds: Array.isArray(c.mealIds) ? c.mealIds : [],
    }));
    setCombos(mapped);
    storage.set('combos', mapped);
  }, []);

  return (
    <CombosContext.Provider value={{ combos, loaded, addCombo, updateCombo, deleteCombo, replaceCombos }}>
      {children}
    </CombosContext.Provider>
  );
}

export function useCombos() {
  const context = useContext(CombosContext);
  if (!context) throw new Error('useCombos must be used within CombosProvider');
  return context;
}
