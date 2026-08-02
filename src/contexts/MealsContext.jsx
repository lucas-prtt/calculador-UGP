import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useStorage } from '../storage/StorageContext';

const MealsContext = createContext(null);

export function MealsProvider({ children }) {
  const storage = useStorage();
  const [meals, setMeals] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storage.get('meals').then((saved) => {
      setMeals(saved || []);
      setLoaded(true);
    });
  }, []);

  const addMeal = useCallback((meal) => {
    setMeals((prev) => {
      const updated = [...prev, { ...meal, id: Date.now().toString() }];
      storage.set('meals', updated);
      return updated;
    });
  }, []);

  const updateMeal = useCallback((id, data) => {
    setMeals((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, ...data } : m));
      storage.set('meals', updated);
      return updated;
    });
  }, []);

  const deleteMeal = useCallback((id) => {
    setMeals((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      storage.set('meals', updated);
      return updated;
    });
  }, []);

  return (
    <MealsContext.Provider value={{ meals, loaded, addMeal, updateMeal, deleteMeal }}>
      {children}
    </MealsContext.Provider>
  );
}

export function useMeals() {
  const context = useContext(MealsContext);
  if (!context) throw new Error('useMeals must be used within MealsProvider');
  return context;
}
