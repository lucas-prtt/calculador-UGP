import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useMeals } from '../contexts/MealsContext';
import { useNavigate } from 'react-router-dom';
import MealCard from '../components/MealCard';
import MealFormDialog from '../components/MealFormDialog';

export default function ComidasRegistradas() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { meals, addMeal, updateMeal, deleteMeal } = useMeals();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const bg = isDark ? '#000000' : '#FFFFFF';
  const headerBorder = isDark ? '#38383A' : '#D1D1D6';

  const handleAdd = () => {
    setEditingMeal(null);
    setDialogVisible(true);
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setDialogVisible(true);
  };

  const handleDelete = (meal) => {
    if (window.confirm(t('meals.deleteMealConfirm'))) {
      deleteMeal(meal.id);
    }
  };

  const handleSave = (data) => {
    if (editingMeal) {
      updateMeal(editingMeal.id, data);
    } else {
      addMeal(data);
    }
    setDialogVisible(false);
    setEditingMeal(null);
  };

  return (
    <div className="page" style={{ backgroundColor: bg }}>
      <div className="header" style={{ borderColor: headerBorder }}>
        <div className="header-left">
          <button className="header-btn" onClick={() => navigate(-1)}>
            {'\u2190'}
          </button>
        </div>
        <span className="header-title" style={{ color: textColor }}>{t('meals.title')}</span>
        <div className="header-right">
          <button className="header-btn" onClick={() => navigate('/')} title="Home">
            {'\u2302'}
          </button>
        </div>
      </div>

      <div className="content">
        {meals.length === 0 ? (
          <div className="empty-text">{t('meals.noMeals')}</div>
        ) : (
          <div className="list">
            {meals.map((item) => (
              <MealCard
                key={item.id}
                meal={item}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bottom-bar-single">
        <button className="btn-primary" onClick={handleAdd}>
          + {t('meals.addMeal')}
        </button>
      </div>

      {dialogVisible && (
        <MealFormDialog
          onClose={() => { setDialogVisible(false); setEditingMeal(null); }}
          onSave={handleSave}
          initial={editingMeal}
        />
      )}
    </div>
  );
}
