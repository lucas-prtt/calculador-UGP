import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStorage } from './storage/StorageContext';
import { useTheme } from './contexts/ThemeContext';
import Home from './pages/Home';
import Calculadora from './pages/Calculadora';
import ComidasRegistradas from './pages/ComidasRegistradas';
import Opciones from './pages/Opciones';
import ConfigurarPorHora from './pages/ConfigurarPorHora';

function AppRoutes() {
  const { i18n, t } = useTranslation();
  const storage = useStorage();
  const location = useLocation();

  useEffect(() => {
    storage.get('language').then((saved) => {
      if (saved) {
        i18n.changeLanguage(saved);
      } else {
        const lang = (navigator.language || 'es').split('-')[0];
        const supported = ['en', 'es', 'de', 'pt'];
        i18n.changeLanguage(supported.includes(lang) ? lang : 'es');
      }
    });
  }, []);

  useEffect(() => {
    document.title = t('appTitle');
  }, [t, i18n.language]);

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/calculadora" element={<Calculadora />} />
      <Route path="/comidas-registradas" element={<ComidasRegistradas />} />
      <Route path="/opciones" element={<Opciones />} />
      <Route path="/configurar-por-hora" element={<ConfigurarPorHora />} />
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
