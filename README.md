# Calculador UGP

A cross-platform app for calculating insulin units and fat-protein units (FPU/UGP/FPE) from meal macronutrients. Built with React, Vite, and Capacitor.

Web version available [here](https://calculadora-ugp.netlify.app/)

## Features

- Calculate carbs/fat/protein totals and derived insulin + UGP values
- Save meals to a persistent library for quick reuse
- Dark/light mode with system preference detection
- Multi-language support: Spanish, English, German, Portuguese
- Data export/import via JSON
- Android and iOS builds via Capacitor

## Tech stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Dev server and bundler |
| Capacitor 7 | Native Android/iOS builds |
| React Router 7 | Client-side routing (HashRouter) |
| i18next + react-i18next | Internationalization (4 languages) |
| localStorage | Key-value persistence |
| lucide-react | Icons |
| Circle Flags (HatScripts) | Circular flag SVGs |

## Project structure

```
src/
  main.jsx                  # Entry point, provider hierarchy
  App.jsx                   # Route definitions
  index.css                 # Global styles
  pages/
    Home.jsx                # Home screen with menu buttons
    Calculadora.jsx         # Calculator: portions, totals, dialogs
    ComidasRegistradas.jsx  # Saved meals CRUD
    Opciones.jsx            # Settings: theme, ratios, export/import
  components/
    AddPortionDialog.jsx    # Choose empty portion or from saved meal
    Dialog.jsx              # Confirm/alert modal provider
    ExportImport.jsx        # JSON export/import
    LanguageSwitcher.jsx    # Circular flag dropdown (4 langs)
    MealCard.jsx            # Saved meal card with edit/delete
    MealFormDialog.jsx      # Add/edit meal form
    MealSelectorDialog.jsx  # Searchable meal picker
    PortionCard.jsx         # Editable macro card
    TotalsBar.jsx           # Calculated results: totals, insulin, UGP
  contexts/
    CalculateContext.jsx    # In-memory portion state
    MealsContext.jsx        # Persisted meals CRUD via localStorage
    ThemeContext.jsx        # Dark/light/system mode
  i18n/
    index.js                # i18next init (fallback 'es')
    locales/                # en, es, de, pt translation files
  storage/
    StorageContext.jsx      # localStorage wrapper (get/set/remove)
  assets/
    flags/                  # Circular flag SVGs (es, en, de, pt)
public/
  assets/images/            # App icons and splash
capacitor.config.json       # Capacitor configuration
```

## Data model

### Meal (persisted in localStorage key `'meals'`)
```json
[
  {
    "id": "1690000000000",
    "name": "Arroz con pollo",
    "portion": 300,
    "carbs": 45,
    "fat": 12,
    "protein": 30
  }
]
```

### Portion (in-memory, not persisted)
```js
{
  id: "1",
  name: "Porción",
  grams: 300,
  carbs: 45,
  fat: 12,
  protein: 30,
  isMeal: true,
  mealId: "1690000000000"
}
```

### Storage keys
| Key | Type | Default | Description |
|---|---|---|---|
| `theme` | `'light'` / `'dark'` / `'system'` | `'system'` | Display mode |
| `language` | `'en'` / `'es'` / `'de'` / `'pt'` | browser lang | UI language |
| `carbsPerUnit` | number | `15` | Grams of carbs per insulin unit |
| `caloriesPerUnit` | number | `150` | Fat+protein calories per UGP unit |
| `meals` | array | `[]` | Saved meal definitions |

## Calculations

```
totalCarbs = sum of all portion carbs
totalFat   = sum of all portion fat
totalProtein = sum of all portion protein

carbsCal    = totalCarbs * 4
fatCal      = totalFat * 9
proteinCal  = totalProtein * 4

insulinUnits = totalCarbs / carbsPerUnit
UGP          = (fatCal + proteinCal) / caloriesPerUnit
```

## Getting started

```bash
npm install
```

### Run in browser (dev)

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

Output goes to `dist/`.

### Preview production build locally

```bash
npm run preview
```

Opens at `http://localhost:4173`.

### Generate app icons and splash screen

Place source images in the `assets/` folder, then run:

```bash
npx capacitor-assets generate --android
```

Source files:
- `assets/icon-only.png` (1024x1024)
- `assets/icon-foreground.png` (1024x1024)
- `assets/icon-background.png` (1024x1024)
- `assets/splash.png` (2732x2732)

### Build Android APK

```bash
npm install @capacitor/android@^7
npx cap add android       # only needed once per clone
npm run cap:build:android
```

This builds the web app, syncs it into Capacitor, and opens Android Studio. From there, use **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate the APK.

### Build iOS app

```bash
npm install @capacitor/ios@^7
npx cap add ios           # only needed once per clone (macOS only)
npm run cap:ios
```
