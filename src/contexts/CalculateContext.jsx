import { createContext, useContext, useState, useCallback } from 'react';

let nextId = 1;

const CalculateContext = createContext(null);

export function CalculateProvider({ children }) {
  const [portions, setPortions] = useState([]);

  const addEmptyPortion = useCallback(() => {
    const id = (nextId++).toString();
    setPortions((prev) => [
      ...prev,
      {
        id,
        name: '',
        grams: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
        isMeal: false,
        mealId: null,
      },
    ]);
  }, []);

  const addMealPortion = useCallback((meal, grams) => {
    const id = (nextId++).toString();
    const ratio = grams / meal.portion;
    setPortions((prev) => [
      ...prev,
      {
        id,
        name: meal.name,
        grams,
        carbs: Math.round(meal.carbs * ratio * 100) / 100,
        fat: Math.round(meal.fat * ratio * 100) / 100,
        protein: Math.round(meal.protein * ratio * 100) / 100,
        isMeal: true,
        mealId: meal.id,
        baseMeal: meal,
      },
    ]);
  }, []);

  const updatePortion = useCallback((id, data) => {
    setPortions((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const removePortion = useCallback((id) => {
    setPortions((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setPortions([]);
  }, []);

  return (
    <CalculateContext.Provider
      value={{ portions, addEmptyPortion, addMealPortion, updatePortion, removePortion, clearAll }}
    >
      {children}
    </CalculateContext.Provider>
  );
}

export function useCalculate() {
  const context = useContext(CalculateContext);
  if (!context) throw new Error('useCalculate must be used within CalculateProvider');
  return context;
}
