import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useStorage } from '../storage/StorageContext';
import { useMeals } from '../contexts/MealsContext';
import { useDialog } from './Dialog';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import i18n from '../i18n';

const KNOWN_SETTINGS = ['theme', 'language', 'carbsPerUnit', 'caloriesPerUnit', 'advancedCarbsPerUnit', 'carbsPerUnitCurve'];

export default function ExportImport() {
  const { t } = useTranslation();
  const storage = useStorage();
  const { meals, addMeal } = useMeals();
  const { setTheme, isDark } = useTheme();
  const { showAlert } = useDialog();

  const cardBg = isDark ? '#1C1C1E' : '#F2F2F7';

  const buildExportData = async () => {
    const theme = await storage.get('theme');
    const language = await storage.get('language');
    const carbsPerUnit = await storage.get('carbsPerUnit');
    const caloriesPerUnit = await storage.get('caloriesPerUnit');
    const advancedCarbsPerUnit = await storage.get('advancedCarbsPerUnit');
    const carbsPerUnitCurve = await storage.get('carbsPerUnitCurve');

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: {
        theme: theme || 'system',
        language: language || i18n.language,
        carbsPerUnit: carbsPerUnit ?? 15,
        caloriesPerUnit: caloriesPerUnit ?? 150,
        advancedCarbsPerUnit: advancedCarbsPerUnit ?? false,
        carbsPerUnitCurve: carbsPerUnitCurve ?? null,
      },
      meals,
    };
  };

  const applyImportData = (data) => {
    if (data.settings) {
      for (const key of KNOWN_SETTINGS) {
        if (data.settings[key] !== undefined) {
          if (key === 'language') {
            i18n.changeLanguage(data.settings[key]);
            storage.set('language', data.settings[key]);
          } else if (key === 'theme') {
            setTheme(data.settings[key]);
          } else {
            storage.set(key, data.settings[key]);
          }
        }
      }
    }

    if (data.meals?.length) {
      for (const meal of data.meals) {
        addMeal({
          name: meal.name,
          portion: meal.portion,
          carbs: meal.carbs,
          fat: meal.fat,
          protein: meal.protein,
        });
      }
    }
  };

  const handleExport = async () => {
    try {
      const data = await buildExportData();
      const json = JSON.stringify(data, null, 2);

      const result = await Filesystem.writeFile({
        path: 'export.json',
        data: json,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });

      await Share.share({
        title: t('settings.saveExportAs'),
        text: t('settings.exportData'),
        url: result.uri,
        dialogTitle: t('settings.saveExportAs'),
      });
    } catch (err) {
      if (err?.message !== 'Share canceled') {
        showAlert(t('settings.exportError'));
      }
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          applyImportData(data);
          showAlert(t('settings.importSuccess'));
        } catch {
          showAlert(t('settings.importError'));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="card" style={{ backgroundColor: cardBg, padding: 8 }}>
      <button
        onClick={handleExport}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#208AEF',
          fontSize: 16,
          fontWeight: 500,
          cursor: 'pointer',
          padding: '14px 16px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {t('settings.exportData')}
      </button>

      <div style={{ height: 1, backgroundColor: isDark ? '#38383A' : '#D1D1D6', margin: '0 16px' }} />

      <button
        onClick={handleImport}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#208AEF',
          fontSize: 16,
          fontWeight: 500,
          cursor: 'pointer',
          padding: '14px 16px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {t('settings.importData')}
      </button>
    </div>
  );
}
