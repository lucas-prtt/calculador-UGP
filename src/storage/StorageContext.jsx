import { createContext, useContext, useCallback } from 'react';

const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  const get = useCallback(async (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }, []);

  const set = useCallback(async (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }, []);

  const remove = useCallback(async (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <StorageContext.Provider value={{ get, set, remove }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within StorageProvider');
  }
  return context;
}
