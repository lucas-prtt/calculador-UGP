import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export default function TempValueDialog({ initial, onClose, onConfirm }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [value, setValue] = useState(String(initial ?? ''));

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = isDark ? '#38383A' : '#D1D1D6';
  const inputBg = isDark ? '#2C2C2E' : '#FFFFFF';

  const handleConfirm = () => {
    const num = Number(value);
    if (num > 0) onConfirm(num);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ backgroundColor: bg, borderColor, maxWidth: 320 }} onClick={(e) => e.stopPropagation()}>
        <span className="modal-title" style={{ color: textColor }}>
          {t('calculadora.tempValue')}
        </span>
        <input
          className="modal-input-big"
          style={{ backgroundColor: inputBg, borderColor, color: textColor }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          inputMode="decimal"
          autoFocus
          placeholder={String(initial ?? '')}
        />
        <div className="modal-buttons">
          <button className="btn-link" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            style={{
              backgroundColor: '#208AEF',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
