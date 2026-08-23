import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useCombos } from '../contexts/CombosContext';
import { useMeals } from '../contexts/MealsContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useDialog } from '../components/Dialog';
import ComboFormDialog from '../components/ComboFormDialog';

export default function Combos() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { combos, addCombo, updateCombo, deleteCombo } = useCombos();
  const { meals } = useMeals();
  const { showConfirm } = useDialog();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryColor = '#8E8E93';
  const bg = isDark ? '#000000' : '#FFFFFF';
  const cardBg = isDark ? '#1C1C1E' : '#F2F2F7';
  const headerBorder = isDark ? '#38383A' : '#D1D1D6';

  const validCount = (combo) => (combo.mealIds || []).filter((id) => meals.some((m) => m.id === id)).length;

  const handleAdd = () => { setEditingCombo(null); setDialogVisible(true); };
  const handleEdit = (combo) => { setEditingCombo(combo); setDialogVisible(true); };
  const handleDelete = (combo) => {
    showConfirm(t('combos.deleteComboConfirm'), () => deleteCombo(combo.id), { confirmLabel: t('common.confirm') });
  };
  const handleSave = (data) => {
    if (editingCombo) updateCombo(editingCombo.id, data);
    else addCombo(data);
    setDialogVisible(false);
    setEditingCombo(null);
  };

  return (
    <div className="page" style={{ backgroundColor: bg }}>
      <div className="header" style={{ borderColor: headerBorder }}>
        <div className="header-left">
          <button className="header-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} color="#208AEF" />
          </button>
        </div>
        <span className="header-title" style={{ color: textColor }}>{t('combos.title')}</span>
        <div className="header-right">
          <button className="header-btn" onClick={() => navigate('/')} title={t('common.home')}>
            <Home size={24} color="#208AEF" />
          </button>
        </div>
      </div>

      <div className="content">
        {combos.length === 0 ? (
          <div className="empty-text">{t('combos.noCombos')}</div>
        ) : (
          <div className="list">
            {combos.map((combo) => (
              <div className="card" key={combo.id} style={{ backgroundColor: cardBg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 17, fontWeight: 600, color: textColor, flex: 1 }}>{combo.name}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleEdit(combo)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 18, color: '#208AEF' }}
                    >
                      {'\u270E'}
                    </button>
                    <button
                      onClick={() => handleDelete(combo)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 16, color: '#FF3B30' }}
                    >
                      {'\u2715'}
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 14, color: secondaryColor, marginTop: 4 }}>
                  {t('combos.mealCount', { count: validCount(combo) })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bottom-bar-single">
        <button className="btn-primary" onClick={handleAdd}>
          + {t('combos.addCombo')}
        </button>
      </div>

      {dialogVisible && (
        <ComboFormDialog
          onClose={() => { setDialogVisible(false); setEditingCombo(null); }}
          onSave={handleSave}
          initial={editingCombo}
        />
      )}
    </div>
  );
}
