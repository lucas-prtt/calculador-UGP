import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';

export default function TimeOffsetDialog({ onClose }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { hoursOffset, saveHoursOffset } = useSettings();

  const abs = Math.abs(hoursOffset);
  const [negative, setNegative] = useState(hoursOffset < 0);
  const [hours, setHours] = useState(String(Math.floor(abs / 60)));
  const [minutes, setMinutes] = useState(String(abs % 60));

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = isDark ? '#38383A' : '#D1D1D6';
  const inputBg = isDark ? '#2C2C2E' : '#FFFFFF';

  const handleConfirm = () => {
    const h = Math.max(0, Math.floor(Number(hours) || 0));
    const m = Math.min(59, Math.max(0, Math.floor(Number(minutes) || 0)));
    const total = h * 60 + m;
    saveHoursOffset(negative ? -total : total);
    onClose();
  };

  const inputStyle = {
    height: 40,
    border: `1px solid ${borderColor}`,
    borderRadius: 8,
    padding: '0 12px',
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: inputBg,
    color: textColor,
    width: '100%',
  };

  const signBtn = (active) => ({
    flex: 1,
    height: 40,
    border: `1px solid ${borderColor}`,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 600,
    cursor: 'pointer',
    backgroundColor: active ? '#208AEF' : inputBg,
    color: active ? '#FFFFFF' : textColor,
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ backgroundColor: bg, borderColor, maxWidth: 320 }} onClick={(e) => e.stopPropagation()}>
        <span className="modal-title" style={{ color: textColor }}>
          {t('settings.hoursOffset')}
        </span>

        <div style={{ display: 'flex', gap: 10 }}>
          <button style={signBtn(!negative)} onClick={() => setNegative(false)}>+</button>
          <button style={signBtn(negative)} onClick={() => setNegative(true)}>-</button>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="field-label" style={{ color: textColor, textAlign: 'center' }}>{t('settings.hours')}</div>
            <input
              style={inputStyle}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="0"
            />
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label" style={{ color: textColor, textAlign: 'center' }}>{t('settings.minutes')}</div>
            <input
              style={inputStyle}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              type="number"
              inputMode="numeric"
              min="0"
              max="59"
              placeholder="0"
            />
          </div>
        </div>

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
