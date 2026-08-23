import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';

export default function SettingsDialog({ onClose }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { carbsPerUnit, saveCarbsPerUnit } = useSettings();

  const [value, setValue] = useState(String(carbsPerUnit));

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = isDark ? '#38383A' : '#D1D1D6';
  const inputBg = isDark ? '#2C2C2E' : '#FFFFFF';

  const handleConfirm = () => {
    const num = Number(value);
    if (num > 0) saveCarbsPerUnit(num);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ backgroundColor: bg, borderColor }} onClick={(e) => e.stopPropagation()}>
        <span className="modal-title" style={{ color: textColor }}>
          {t('settings.carbsPerUnit')}
        </span>
        <input
          className="modal-input-big"
          style={{ backgroundColor: inputBg, borderColor, color: textColor }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          inputMode="numeric"
          autoFocus
          placeholder="15"
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
