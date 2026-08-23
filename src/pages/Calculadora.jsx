import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useCalculate } from '../contexts/CalculateContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Settings } from 'lucide-react';
import { useDialog } from '../components/Dialog';
import PortionCard from '../components/PortionCard';
import AddPortionDialog from '../components/AddPortionDialog';
import SettingsDialog from '../components/SettingsDialog';
import TotalsBar from '../components/TotalsBar';

export default function Calculadora() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { portions, addEmptyPortion, addMealPortion, updatePortion, removePortion, clearAll } = useCalculate();
  const { showConfirm } = useDialog();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#000000' : '#FFFFFF';
  const headerBorder = isDark ? '#38383A' : '#D1D1D6';

  const handleDeleteAll = () => {
    if (portions.length === 0) return;
    showConfirm(t('calculadora.deleteAllConfirm'), clearAll);
  };

  return (
    <div className="page" style={{ backgroundColor: bg }}>
      <div className="header" style={{ borderColor: headerBorder }}>
        <div className="header-left" style={{ width: 96 }}>
          <button className="header-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} color="#208AEF" />
          </button>
        </div>
        <span className="header-title" style={{ color: textColor }}>{t('calculadora.title')}</span>
        <div className="header-right" style={{ width: 96, gap: 4 }}>
          <button className="header-btn" onClick={() => setSettingsVisible(true)} title={t('home.settings')}>
            <Settings size={24} color="#208AEF" />
          </button>
          <button className="header-btn" onClick={() => navigate('/')} title="Home">
            <Home size={24} color="#208AEF" />
          </button>
        </div>
      </div>

      <div className="content" style={{ backgroundColor: bg }}>
        {portions.length === 0 ? (
          <div className="empty-text">{t('calculadora.addPortion')}</div>
        ) : (
          <div className="list">
            {portions.map((item) => (
              <PortionCard key={item.id} portion={item} onUpdate={updatePortion} onRemove={removePortion} />
            ))}
          </div>
        )}
      </div>

      {portions.length > 0 && (
        <div style={{ padding: '12px 16px 0', flexShrink: 0 }}>
          <TotalsBar portions={portions} />
        </div>
      )}

      <div className="bottom-bar">
        <button className="btn-primary" style={{ flex: 1 }} onClick={() => setDialogVisible(true)}>
          + {t('calculadora.addPortion')}
        </button>
        {portions.length > 0 && (
          <button className="btn-danger-text" onClick={handleDeleteAll}>
            {t('calculadora.deleteAll')}
          </button>
        )}
      </div>

      {dialogVisible && (
        <AddPortionDialog
          onClose={() => setDialogVisible(false)}
          onAddEmpty={addEmptyPortion}
          onAddMeal={addMealPortion}
        />
      )}

      {settingsVisible && (
        <SettingsDialog onClose={() => setSettingsVisible(false)} />
      )}
    </div>
  );
}
