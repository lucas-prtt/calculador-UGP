import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';

export default function CurveRangeDialog({ onClose }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { carbsPerUnit, curveMin, curveMax, saveCurveRange } = useSettings();

  const defaultMin = 0;
  const defaultMax = carbsPerUnit * 4;

  const [min, setMin] = useState(String(curveMin != null ? curveMin : defaultMin));
  const [max, setMax] = useState(String(curveMax != null ? curveMax : defaultMax));

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = isDark ? '#38383A' : '#D1D1D6';
  const inputBg = isDark ? '#2C2C2E' : '#FFFFFF';

  const handleConfirm = () => {
    const mn = Number(min);
    const mx = Number(max);
    if (Number.isFinite(mn) && Number.isFinite(mx) && mn >= 0 && mx > mn) {
      saveCurveRange(mn, mx);
    }
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ backgroundColor: bg, borderColor, maxWidth: 320 }} onClick={(e) => e.stopPropagation()}>
        <span className="modal-title" style={{ color: textColor }}>
          {t('settings.curveRange')}
        </span>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="field-label" style={{ color: textColor, textAlign: 'center' }}>{t('settings.minValue')}</div>
            <input
              style={inputStyle}
              value={min}
              onChange={(e) => setMin(e.target.value)}
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="0"
            />
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label" style={{ color: textColor, textAlign: 'center' }}>{t('settings.maxValue')}</div>
            <input
              style={inputStyle}
              value={max}
              onChange={(e) => setMax(e.target.value)}
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="60"
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
