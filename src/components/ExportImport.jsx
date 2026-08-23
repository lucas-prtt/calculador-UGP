import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useStorage } from '../storage/StorageContext';
import { useMeals } from '../contexts/MealsContext';
import { useSettings } from '../contexts/SettingsContext';
import { useDialog } from './Dialog';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import LZString from 'lz-string';
import i18n from '../i18n';

export default function ExportImport() {
  const { t } = useTranslation();
  const storage = useStorage();
  const { meals, replaceMeals } = useMeals();
  const { setTheme, isDark } = useTheme();
  const { saveCarbsPerUnit, saveCaloriesPerUnit, saveAdvancedCarbsPerUnit, saveHoursOffset, saveCarbsPerUnitCurve, saveCurveRange, saveValueAppearance } = useSettings();
  const { showAlert } = useDialog();

  const cardBg = isDark ? '#1C1C1E' : '#F2F2F7';

  const buildExportData = async () => {
    const theme = await storage.get('theme');
    const language = await storage.get('language');
    const carbsPerUnit = await storage.get('carbsPerUnit');
    const caloriesPerUnit = await storage.get('caloriesPerUnit');
    const advancedCarbsPerUnit = await storage.get('advancedCarbsPerUnit');
    const carbsPerUnitCurve = await storage.get('carbsPerUnitCurve');
    const hoursOffset = await storage.get('hoursOffset');
    const curveMin = await storage.get('curveMin');
    const curveMax = await storage.get('curveMax');
    const valueAppearance = await storage.get('valueAppearance');

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
        hoursOffset: hoursOffset ?? 0,
        curveMin: curveMin ?? null,
        curveMax: curveMax ?? null,
        valueAppearance: valueAppearance ?? 'large',
      },
      meals,
    };
  };

  const applyImportData = (data) => {
    const s = data.settings;
    if (s) {
      if (s.theme !== undefined) setTheme(s.theme);
      if (s.language !== undefined) {
        i18n.changeLanguage(s.language);
        storage.set('language', s.language);
      }
      if (s.carbsPerUnit !== undefined) saveCarbsPerUnit(s.carbsPerUnit);
      if (s.caloriesPerUnit !== undefined) saveCaloriesPerUnit(s.caloriesPerUnit);
      if (s.advancedCarbsPerUnit !== undefined) saveAdvancedCarbsPerUnit(!!s.advancedCarbsPerUnit);
      if (s.hoursOffset !== undefined) saveHoursOffset(s.hoursOffset);
      if (Array.isArray(s.carbsPerUnitCurve)) saveCarbsPerUnitCurve(s.carbsPerUnitCurve);
      if (s.curveMin !== undefined && s.curveMax !== undefined) saveCurveRange(s.curveMin, s.curveMax);
      if (s.valueAppearance !== undefined) saveValueAppearance(s.valueAppearance);
    }

    if (Array.isArray(data.meals)) {
      replaceMeals(data.meals);
    }
  };

  const handleExport = async () => {
    try {
      const data = await buildExportData();
      const json = JSON.stringify(data);
      const compressed = LZString.compressToBase64(json);

      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const filename = `UGP_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}_export.json.lz64`;

      if (Capacitor.isNativePlatform()) {
        const result = await Filesystem.writeFile({
          path: filename,
          data: compressed,
          directory: Directory.Cache,
          encoding: Encoding.UTF8,
        });

        await Share.share({
          title: t('settings.saveExportAs'),
          text: t('settings.exportData'),
          url: result.uri,
          dialogTitle: t('settings.saveExportAs'),
        });
      } else {
        const blob = new Blob([compressed], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      if (err?.message !== 'Share canceled') {
        showAlert(t('settings.exportError'));
      }
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.lz64,.json,application/json,text/plain';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const text = String(ev.target.result).trim();
          let data;
          if (text.startsWith('{') || text.startsWith('[')) {
            data = JSON.parse(text);
          } else {
            const json = LZString.decompressFromBase64(text);
            data = json ? JSON.parse(json) : null;
          }
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
