import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { StorageProvider } from './storage/StorageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MealsProvider } from './contexts/MealsContext';
import { CalculateProvider } from './contexts/CalculateContext';
import { DialogProvider } from './components/Dialog';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StorageProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <DialogProvider>
            <MealsProvider>
              <CalculateProvider>
                <HashRouter>
                  <App />
                </HashRouter>
              </CalculateProvider>
            </MealsProvider>
          </DialogProvider>
        </ThemeProvider>
      </I18nextProvider>
    </StorageProvider>
  </React.StrictMode>
);
