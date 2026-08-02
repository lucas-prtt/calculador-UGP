import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useStorage } from '../storage/StorageContext';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const storage = useStorage();
  const [theme, setThemeState] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);
    const handler = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    storage.get('theme').then((saved) => {
      setThemeState(saved || 'system');
      setLoaded(true);
    });
  }, []);

  const isDark = theme === 'system'
    ? systemDark
    : theme === 'dark';

  const setTheme = useCallback((mode) => {
    setThemeState(mode);
    storage.set('theme', mode);
  }, []);

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, loaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
