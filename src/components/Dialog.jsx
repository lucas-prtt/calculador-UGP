import { createContext, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const DialogContext = createContext(null);

export function DialogProvider({ children }) {
  const { t } = useTranslation();
  const [dialog, setDialog] = useState(null);
  const { isDark } = useTheme();

  const showConfirm = useCallback((message, onConfirm, options) => {
    setDialog({ type: 'confirm', message, onConfirm, confirmLabel: options?.confirmLabel });
  }, []);

  const showAlert = useCallback((message, onClose) => {
    setDialog({ type: 'alert', message, onClose });
  }, []);

  const close = useCallback(() => {
    setDialog(null);
  }, []);

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = isDark ? '#38383A' : '#D1D1D6';

  return (
    <DialogContext.Provider value={{ showConfirm, showAlert }}>
      {children}
      {dialog && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-dialog" style={{ backgroundColor: bg, borderColor, maxWidth: 320 }} onClick={(e) => e.stopPropagation()}>
            <p style={{ color: textColor, fontSize: 16, margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
              {dialog.message}
            </p>
            <div className="modal-buttons" style={{ justifyContent: 'center' }}>
              {dialog.type === 'confirm' ? (
                <>
                  <button className="btn-link" onClick={close}>{t('common.cancel')}</button>
                  <button
                    onClick={() => { dialog.onConfirm(); close(); }}
                    style={{
                      backgroundColor: '#FF3B30',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {dialog.confirmLabel || t('common.delete')}
                  </button>
                </>
              ) : (
                <button
                  className="btn-link"
                  onClick={() => { dialog.onClose?.(); close(); }}
                >
                  {t('common.ok')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within DialogProvider');
  return ctx;
}
