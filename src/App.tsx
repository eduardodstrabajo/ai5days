import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Heart,
  Droplet,
  Leaf,
  Flame,
  Activity,
  Sparkles,
  Download,
  Upload,
  User,
  ShieldAlert,
  Wind,
  Plus,
  Moon,
  Watch,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';

// Subcomponents
import Dashboard from './components/Dashboard';
import HydrationTracker from './components/HydrationTracker';
import UricLoweringFoods from './components/UricLoweringFoods';
import RestAndRecovery from './components/RestAndRecovery';
import SmartwatchMonitor from './components/SmartwatchMonitor';
import FoodScanner from './components/FoodScanner';
import ExerciseTracker from './components/ExerciseTracker';
import StretchDollIcon from './components/StretchDollIcon';
import Symptoms from './components/Symptoms';
import FootPainIcon from './components/FootPainIcon';
import HighCuisine from './components/HighCuisine';
import LowPurineDetails from './components/LowPurineDetails';
import ModeratePurineDetails from './components/ModeratePurineDetails';
import HighPurineDetails from './components/HighPurineDetails';
import AICoachChat from './components/AICoachChat';

// Types
import { FlareLog, HydrationLog, UricAcidLog, NaturalFood, ExerciseLog, SleepLog, SymptomLog } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Persistent States using localStorage
  const [flareLogs, setFlareLogs] = useState<FlareLog[]>([]);
  const [hydration, setHydration] = useState<HydrationLog>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    target: 2500,
  });
  const [uricAcidLogs, setUricAcidLogs] = useState<UricAcidLog[]>([]);
  const [naturalFoods, setNaturalFoods] = useState<NaturalFood[]>([]);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomLog[]>([]);

  // State variables for notifications/import errors
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load state from localStorage on boot
  useEffect(() => {
    // 1. Flares
    const localFlares = localStorage.getItem('gout_flares');
    if (localFlares) {
      try {
        const parsed: FlareLog[] = JSON.parse(localFlares);
        // Remove any seeded sample flares so default audited attacks reflect user's data
        const userFlares = parsed.filter((f) => !(f && typeof (f as any).id === 'string' && (f as any).id.startsWith('seed-flare-')));
        // If only seed data existed, persist the cleaned empty array
        if (userFlares.length !== parsed.length) {
          localStorage.setItem('gout_flares', JSON.stringify(userFlares));
        }
        setFlareLogs(userFlares);
      } catch (e) {
        // Malformed storage: reset to empty
        const initialFlares: FlareLog[] = [];
        setFlareLogs(initialFlares);
        localStorage.setItem('gout_flares', JSON.stringify(initialFlares));
      }
    } else {
      // Default to zero audited attacks until the user logs any flares
      const initialFlares: FlareLog[] = [];
      setFlareLogs(initialFlares);
      localStorage.setItem('gout_flares', JSON.stringify(initialFlares));
    }

    // 2. Natural Lowering Foods Watchlist
    const sampleFoods: NaturalFood[] = [
      {
        id: 'seed-food-lemon',
        name: 'Unsweetened Lemon Juice',
        servingSize: '1 to 2 tablespoons (approx. 15-30ml) fresh squeezed',
        frequency: 'Daily',
        mechanism: 'Pure lemon juice provides abundant Vitamin C and organic citric acid to raise urine pH and help dissolve solid uric precipitates (Healthline Medically Reviewed)',
        category: 'Beverage',
        takenDates: [],
        notes: 'Unsweetened fresh juice avoids fructose-induced ATP breakdowns while supporting excellent uric filtration in kidneys.',
      },
      {
        id: 'seed-food-yogurt',
        name: 'Plain Traditional Yogurt (Low-Fat)',
        servingSize: '1 individual pot',
        frequency: 'Daily',
        mechanism: 'Low-fat plain traditional yogurt proteins support renal excretion. Starter cultures (L. bulgaricus, S. thermophilus, B. lactis, L. acidophilus) help metabolize purines. Avoid products listing L. casei or L. paracasei or added sugars.',
        category: 'Dairy',
        takenDates: [],
        notes: 'Choose unsweetened, low-fat traditional starters. Inspect label to ensure L. casei / L. paracasei are not primary cultures.',
      },

      {
        id: 'seed-food-batata',
        name: 'Roasted Batatas (Sweet Potatoes)',
        servingSize: '1 medium baked potato',
        frequency: 'Daily',
        mechanism: 'Highly alkaline, rich in potassium & Vitamin C. Vitamin C stimulates uricosuric excretory processes in nephrons',
        category: 'Vegetable',
        takenDates: [],
        notes: 'Incredible nutrient-dense option for daily carbohydrate needs (Mayo Clinic).',
      },
      {
        id: 'seed-food-cacao',
        name: 'Organic Unsweetened Cacao',
        servingSize: '1-2 tbsp pure powder or 1oz dark chocolate (85%+)',
        frequency: 'Daily',
        mechanism: 'Antioxidant polyphenols suppress inflammatory pathways inside joint tissues (PubMed)',
        category: 'Other',
        takenDates: [],
        notes: 'Must be completely unsweetened, as sugar/fructose causes elevated uric production.',
      },
      {
        id: 'seed-food-sesame',
        name: 'Organic Sesame Seeds',
        servingSize: '1 to 2 tablespoons (approx. 15g)',
        frequency: 'Daily',
        mechanism: 'Organic sesamin suppresses system oxidation and helps relieve fluid tension in joint tissues (PubMed, 2024)',
        category: 'Other',
        takenDates: [],
        notes: 'Sprinkle over roasted batata or salad. Rich in magnesium for soft tissue relaxation.',
      }
    ];

    const localFoods = localStorage.getItem('gout_natural_foods');
    if (localFoods) {
      let parsed: NaturalFood[] = JSON.parse(localFoods);
      
      // Filter out removed items: cherries and coffee
      let filtered = parsed.filter(f => 
        f.id !== 'seed-food-cherry' && 
        f.id !== 'seed-food-coffee' && 
        f.name.toLowerCase() !== 'organic tart cherries' && 
        f.name.toLowerCase() !== 'polyphenol-rich black coffee'
      );

      // Check if Warm Lemon Water is there, and update it to Unsweetened Lemon Juice
      let updated = filtered.map(f => {
        if (
          f.id === 'seed-food-lemon' || 
          f.name.toLowerCase() === 'warm lemon water infusion' || 
          f.name.toLowerCase() === 'warm lemon water'
        ) {
          return {
            ...f,
            id: 'seed-food-lemon',
            name: 'Unsweetened Lemon Juice',
            servingSize: '1 to 2 tablespoons (approx. 15-30ml) fresh squeezed',
            mechanism: 'Pure lemon juice provides abundant Vitamin C and organic citric acid to raise urine pH and help dissolve solid uric precipitates (Healthline Medically Reviewed)',
            category: 'Beverage' as const,
            notes: 'Unsweetened fresh juice avoids fructose-induced ATP breakdowns while supporting excellent uric filtration in kidneys.',
          };
        }
        if (
          f.id === 'seed-food-yogurt' ||
          f.name.toLowerCase() === 'plain traditional yogurt (low-fat)'
        ) {
          return {
            ...f,
            id: 'seed-food-yogurt',
            name: 'Plain Traditional Yogurt (Low-Fat)',
            servingSize: '1 individual pot',
            mechanism: 'Low-fat plain traditional yogurt proteins support renal excretion. Starter cultures (L. bulgaricus, S. thermophilus, B. lactis, L. acidophilus) help metabolize purines. Avoid products listing L. casei or L. paracasei or added sugars.',
            category: 'Dairy' as const,
            notes: 'Stick to low-fat plain unsweetened types. Inspect label to ensure it does NOT list L. casei or L. paracasei strain markers.',
          };
        }
        return f;
      });

      let hasUpdates = false;

      for (const food of sampleFoods) {
        if (!updated.some(f => f.id === food.id || f.name.toLowerCase() === food.name.toLowerCase())) {
          updated.push(food);
          hasUpdates = true;
        }
      }

      if (filtered.length !== parsed.length || hasUpdates || JSON.stringify(parsed) !== JSON.stringify(updated)) {
        setNaturalFoods(updated);
        localStorage.setItem('gout_natural_foods', JSON.stringify(updated));
      } else {
        setNaturalFoods(parsed);
      }
    } else {
      setNaturalFoods(sampleFoods);
      localStorage.setItem('gout_natural_foods', JSON.stringify(sampleFoods));
    }

    // 3. Uric Acid Logs
    const localUA = localStorage.getItem('gout_ua_logs');
    if (localUA) {
      setUricAcidLogs(JSON.parse(localUA));
    } else {
      // Seed historical progression logs
      const sampleUA: UricAcidLog[] = [
        { id: 'seed-ua-1', date: '2026-03-12', value: 7.9, notes: 'Routine clinical draw. Severe Hyperuricemia.' },
        { id: 'seed-ua-2', date: '2026-05-15', value: 6.8, notes: 'Post-onset blood testing' },
        { id: 'seed-ua-3', date: '2026-06-10', value: 5.8, notes: 'Fasting draw. Target goal <6.0 achieved!' },
      ];
      setUricAcidLogs(sampleUA);
      localStorage.setItem('gout_ua_logs', JSON.stringify(sampleUA));
    }

    // 4. Exercises
    const localExercises = localStorage.getItem('gout_exercises');
    if (localExercises) {
      setExerciseLogs(JSON.parse(localExercises));
    } else {
      const sampleExercises: ExerciseLog[] = [
        {
          id: 'seed-ex-1',
          date: '2026-06-18',
          activityType: 'Walking',
          duration: 30,
          jointStrain: 2,
          remissionPhase: true,
          notes: 'Nice morning walk. No toe pressure felt.',
        },
      ];
      setExerciseLogs(sampleExercises);
      localStorage.setItem('gout_exercises', JSON.stringify(sampleExercises));
    }

    // 5. Sleep logs
    const localSleep = localStorage.getItem('gout_sleep');
    if (localSleep) {
      setSleepLogs(JSON.parse(localSleep));
    } else {
      const sampleSleep: SleepLog[] = [
        {
          id: 'seed-sl-1',
          date: '2026-06-19',
          hours: 8,
          quality: 'Excellent',
          restlessJoints: false,
          meditationCompleted: true,
        },
      ];
      setSleepLogs(sampleSleep);
      localStorage.setItem('gout_sleep', JSON.stringify(sampleSleep));
    }

    // 6. Symptom logs (user-reported symptoms like pain, swelling)
    const localSymptoms = localStorage.getItem('gout_symptoms');
    if (localSymptoms) {
      try {
        setSymptoms(JSON.parse(localSymptoms));
      } catch (e) {
        setSymptoms([]);
        localStorage.setItem('gout_symptoms', JSON.stringify([]));
      }
    } else {
      setSymptoms([]);
      localStorage.setItem('gout_symptoms', JSON.stringify([]));
    }

    // 6. Hydration with daily reset check
    const localHydration = localStorage.getItem('gout_hydration');
    const todayStr = new Date().toISOString().split('T')[0];

    // If body weight is stored, compute minimum target (30 ml/kg) but keep 2500ml default
    let weightTarget: number | null = null;
    try {
      const bw = localStorage.getItem('gout_body_weight');
      if (bw) {
        const kg = Number(bw);
        if (!isNaN(kg) && kg > 0) {
          weightTarget = Math.max(2500, Math.round(kg * 30));
        }
      }
    } catch (e) {
      weightTarget = null;
    }

    if (localHydration) {
      const parsedHydration: HydrationLog = JSON.parse(localHydration);
      const baseTarget = parsedHydration.target || 2500;
      const finalTarget = weightTarget ?? baseTarget;
      if (parsedHydration.date === todayStr) {
        setHydration({ ...parsedHydration, target: finalTarget });
        // persist updated target if changed
        localStorage.setItem('gout_hydration', JSON.stringify({ ...parsedHydration, target: finalTarget }));
      } else {
        // Different day! Reset amount to zero but use computed or existing target
        const resetHydration: HydrationLog = {
          date: todayStr,
          amount: 0,
          target: finalTarget,
        };
        setHydration(resetHydration);
        localStorage.setItem('gout_hydration', JSON.stringify(resetHydration));
      }
    } else {
      const defaultHydration: HydrationLog = {
        date: todayStr,
        amount: 0,
        target: weightTarget ?? 2500,
      };
      setHydration(defaultHydration);
      localStorage.setItem('gout_hydration', JSON.stringify(defaultHydration));
    }
  }, []);

  // Save states to localstorage helpers
  const saveFlares = (newFlares: FlareLog[]) => {
    setFlareLogs(newFlares);
    localStorage.setItem('gout_flares', JSON.stringify(newFlares));
  };

  const saveNaturalFoods = (newFoods: NaturalFood[]) => {
    setNaturalFoods(newFoods);
    localStorage.setItem('gout_natural_foods', JSON.stringify(newFoods));
  };

  const saveUA = (newUA: UricAcidLog[]) => {
    setUricAcidLogs(newUA);
    localStorage.setItem('gout_ua_logs', JSON.stringify(newUA));
  };

  const saveHydration = (newHydration: HydrationLog) => {
    setHydration(newHydration);
    localStorage.setItem('gout_hydration', JSON.stringify(newHydration));
  };

  // State handlers
  const handleUpdateWater = (amount: number) => {
    const updated = {
      ...hydration,
      amount: hydration.amount + amount,
    };
    saveHydration(updated);
    triggerAlert(`Logged +${amount}ml water! Keep flushing!`, 'success');
  };

  const handleResetWater = () => {
    if (confirm('Are you sure you want to clear raw water intake for today?')) {
      const updated = { ...hydration, amount: 0 };
      saveHydration(updated);
      triggerAlert('Daily water cleared.', 'info');
    }
  };

  const handleAddNaturalFood = (foodInfo: Omit<NaturalFood, 'id' | 'takenDates'>) => {
    const newFood: NaturalFood = {
      ...foodInfo,
      id: 'food-' + Date.now(),
      takenDates: [],
    };
    const updated = [...naturalFoods, newFood];
    saveNaturalFoods(updated);
    triggerAlert(`Tracked: ${newFood.name} added to watchlist!`, 'success');
  };

  const handleToggleFoodTaken = (id: string, dateStr: string) => {
    const updated = naturalFoods.map((s) => {
      if (s.id === id) {
        const alreadyTaken = s.takenDates.includes(dateStr);
        return {
          ...s,
          takenDates: alreadyTaken 
            ? s.takenDates.filter((d) => d !== dateStr) 
            : [...s.takenDates, dateStr],
        };
      }
      return s;
    });
    saveNaturalFoods(updated);
    triggerAlert('Superfood intake checklist updated!', 'success');
  };

  const handleDeleteNaturalFood = (id: string) => {
    const updated = naturalFoods.filter((s) => s.id !== id);
    saveNaturalFoods(updated);
    triggerAlert('Superfood card removed from watchlist.', 'info');
  };

  const saveExercises = (newExs: ExerciseLog[]) => {
    setExerciseLogs(newExs);
    localStorage.setItem('gout_exercises', JSON.stringify(newExs));
  };

  const saveSleep = (newSleeps: SleepLog[]) => {
    setSleepLogs(newSleeps);
    localStorage.setItem('gout_sleep', JSON.stringify(newSleeps));
  };

  const saveSymptoms = (newSymptoms: SymptomLog[]) => {
    setSymptoms(newSymptoms);
    localStorage.setItem('gout_symptoms', JSON.stringify(newSymptoms));
  };

  const handleAddFlareLog = (logData: Omit<FlareLog, 'id' | 'status'>) => {
    const newFlare: FlareLog = {
      ...logData,
      id: 'flare-' + Date.now(),
      status: 'active',
    };
    const updated = [newFlare, ...flareLogs];
    saveFlares(updated);
    triggerAlert('Joint Flare logged! Please review our active relief steps.', 'info');
    setActiveTab('rest'); // Auto route to rest & recovery tab
  };

  const handleResolveFlareLog = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = flareLogs.map((f) => {
      if (f.id === id) {
        return {
          ...f,
          endDate: today,
          status: 'resolved' as const,
        };
      }
      return f;
    });
    saveFlares(updated);
    triggerAlert('Flare resolved! Congratulations on achieving relief.', 'success');
  };

  const handleAddExercise = (log: Omit<ExerciseLog, 'id'>) => {
    const newLog: ExerciseLog = {
      ...log,
      id: 'ex-' + Date.now(),
    };
    const updated = [newLog, ...exerciseLogs];
    saveExercises(updated);
    triggerAlert(`Exercise: ${newLog.activityType} logged!`, 'success');
  };

  const handleDeleteExercise = (id: string) => {
    const updated = exerciseLogs.filter((e) => e.id !== id);
    saveExercises(updated);
    triggerAlert('Exercise log deleted.', 'info');
  };

  const handleAddSleep = (log: Omit<SleepLog, 'id'>) => {
    const newLog: SleepLog = {
      ...log,
      id: 'sleep-' + Date.now(),
    };
    const updated = [newLog, ...sleepLogs];
    saveSleep(updated);
    triggerAlert('Sleep session logged!', 'success');
  };

  const handleDeleteSleep = (id: string) => {
    const updated = sleepLogs.filter((s) => s.id !== id);
    saveSleep(updated);
    triggerAlert('Sleep log deleted.', 'info');
  };

  // Symptoms handlers
  const handleAddSymptom = (log: Omit<SymptomLog, 'id'>) => {
    const newLog: SymptomLog = {
      ...log,
      id: 'sym-' + Date.now(),
    };
    const updated = [newLog, ...symptoms];
    saveSymptoms(updated);
    triggerAlert('Symptom recorded.', 'success');
  };

  const handleDeleteSymptom = (id: string) => {
    const updated = symptoms.filter((s) => s.id !== id);
    saveSymptoms(updated);
    triggerAlert('Symptom entry deleted.', 'info');
  };

  const handleAddUALog = (logData: Omit<UricAcidLog, 'id'>) => {
    const newUA: UricAcidLog = {
      ...logData,
      id: 'ua-' + Date.now(),
    };
    const updated = [newUA, ...uricAcidLogs];
    saveUA(updated);
    if (newUA.value < 6.0) {
      triggerAlert(`Added: ${newUA.value} mg/dL - Excellent! Below therapeutic threshold.`, 'success');
    } else {
      triggerAlert(`Added: ${newUA.value} mg/dL. Keep working with doctors. Goal is <6.0.`, 'info');
    }
  };

  // AI coach skill executor: called by AICoachChat when Gemini suggests tool calls
  // Modified: Gemi Coach runs in read-only mode in-app. Block any skill that would mutate application state.
  const handleExecuteSkill = (name: string, args: any): string | null => {
    // Allowed read-only informational skill names (variants included)
    const readOnlySkills = new Set([
      'research',
      'research_skill',
      'yourt-expert',
      'yourt_expert',
      'yourt expert',
      'meat-expert',
      'meat_expert',
      'cooking-best-practices',
      'cooking_best_practices',
      'high-cuisine',
      'summary',
    ]);

    try {
      if (readOnlySkills.has(name)) {
        // Provide a short confirmation that information is displayed; do NOT mutate app state.
        return `Displayed read-only information for "${name}". No changes were made to your journal.`;
      }

      // Block any skill execution that would change app state in read-only mode
      console.warn(`Blocked skill execution (read-only mode): ${name}`, args);
      return null;
    } catch (e) {
      console.error('Skill execution error (read-only mode)', e);
      return null;
    }
  };

  // Import / Export backup helpers
  const handleExportBackup = () => {
    const backupData = {
      flareLogs,
      naturalFoods,
      uricAcidLogs,
      hydration,
      symptoms,
      version: '1.0.0',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gout_companion_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    triggerAlert('Natural care journal downloaded as backup JSON.', 'success');
  };

  const handleImportBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const importedFoods = json.naturalFoods || json.supplements || json.medications;
        if (json.flareLogs && importedFoods && json.uricAcidLogs) {
          saveFlares(json.flareLogs);
          saveNaturalFoods(importedFoods);
          saveUA(json.uricAcidLogs);
          if (json.hydration) {
            saveHydration(json.hydration);
          }
          triggerAlert('Joint care records imported successfully!', 'success');
        } else {
          throw new Error('Missing indices');
        }
      } catch (err) {
        triggerAlert('Error decoding backup file. Make sure file format remains unmodified.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const triggerAlert = (text: string, type: 'success' | 'error' | 'info') => {
    setAlertMsg({ text, type });
    setTimeout(() => {
      setAlertMsg(null);
    }, 4500);
  };

  const activeFlareExists = flareLogs.some((f) => f.status === 'active');
  const activeFlare = flareLogs.find((f) => f.status === 'active') || null;

  // Menu Tabs definitions
  const TABS = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: Activity },
    { id: 'ai-coach', label: 'Gemi Coach', icon: BookOpen },
    { id: 'scanner', label: 'Diet (AI Food Scanner)', icon: Sparkles },
    { id: 'hydration', label: 'Hydration (Water tracker)', icon: Droplet },
    { id: 'rest', label: 'Monitoring Rest', icon: Moon, badge: activeFlareExists ? 'Active' : undefined, textCol: activeFlareExists ? 'text-rose-600 font-bold' : '' },
    { id: 'exercise', label: 'Exercise & Mobility', icon: StretchDollIcon },
    { id: 'natural-foods', label: 'Natural Lowering Foods', icon: Leaf },
    { id: 'low-purine', label: 'Low-Purine (Safe)', icon: Leaf },
    { id: 'moderate-purine', label: 'Moderate-Purine', icon: Sparkles },
    { id: 'high-purine', label: 'High-Purine (Avoid)', icon: Flame },
    { id: 'cooking-best-practices', label: 'Cooking Best Practices', icon: Sparkles },
    { id: 'uric-acid', label: 'Monitor in Real Time with Smart Watch', icon: Watch },
    // Symptoms placed at the bottom of the sidebar
    { id: 'symptoms', label: 'Symptoms', icon: FootPainIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      
      {/* Top Banner Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
              <Heart className="fill-white" size={17} />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-900 block font-sans">Gout Companion</span>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Therapeutic Care</span>
            </div>
          </div>

          {/* Backup data buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="text-slate-500 hover:text-slate-800 font-semibold text-xs px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
              title="Download backup file"
              id="btn_export"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Export Backup</span>
            </button>
            <label
              className="text-slate-500 hover:text-slate-800 font-semibold text-xs px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
              title="Upload backup file"
            >
              <Upload size={13} />
              <span className="hidden sm:inline">Import Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
                id="file_uploader"
              />
            </label>
          </div>
        </div>
      </header>

      {/* Main Tabbed Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 w-full" id="main_app_layout">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1" id="sidebar_tabs">
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm sticky top-24 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3.5 block mb-2">Track & Restore</span>
            
            <div className="flex flex-col gap-1">
              {TABS.map((tab) => {
                const IconComp = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold select-none cursor-pointer text-left transition duration-150 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    id={`tab_${tab.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComp size={16} className={isSelected ? 'text-white' : 'text-slate-400'} />
                      <span className={tab.textCol}>{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick alert bar inside sidebar if present */}
            {alertMsg && (
              <div className={`mt-4 p-3 rounded-2xl border text-xs leading-relaxed animate-in fade-in zoom-in-95 duration-150 ${
                alertMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                  : alertMsg.type === 'error'
                    ? 'bg-rose-50 text-rose-800 border-rose-100'
                    : 'bg-blue-50 text-blue-800 border-blue-100'
              }`}>
                {alertMsg.text}
              </div>
            )}
          </div>
        </aside>

        {/* Tab content panel */}
        <main className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            id="tab_content_wrapper"
          >
            {activeTab === 'dashboard' && (
              <Dashboard
                userEmail="Anonymous Patient Journal"
                flareLogs={flareLogs}
                hydration={hydration}
                uricAcidLogs={uricAcidLogs}
                naturalFoods={naturalFoods}
                onAddWater={handleUpdateWater}
                onToggleFood={handleToggleFoodTaken}
                onSetTab={setActiveTab}
              />
            )}

            {activeTab === 'rest' && (
              <RestAndRecovery
                flareLogs={flareLogs}
                onAddFlareLog={handleAddFlareLog}
                onResolveFlareLog={handleResolveFlareLog}
                sleepLogs={sleepLogs}
                onAddSleepLog={handleAddSleep}
                onDeleteSleepLog={handleDeleteSleep}
              />
            )}

            {activeTab === 'scanner' && (
              <FoodScanner
                naturalFoods={naturalFoods}
                onAddNaturalFood={handleAddNaturalFood}
              />
            )}

            {activeTab === 'hydration' && (
              <HydrationTracker
                log={hydration}
                onUpdateWater={handleUpdateWater}
                onResetWater={handleResetWater}
                onSetTarget={(newTarget: number) => {
                  const updated = { ...hydration, target: newTarget };
                  saveHydration(updated);
                  triggerAlert(`Hydration target updated to ${newTarget} ml`, 'success');
                }}
              />
            )}

            {activeTab === 'exercise' && (
              <ExerciseTracker
                exerciseLogs={exerciseLogs}
                flareLogs={flareLogs}
                onAddExercise={handleAddExercise}
                onDeleteExercise={handleDeleteExercise}
              />
            )}

            {activeTab === 'uric-acid' && (
              <SmartwatchMonitor
                logs={uricAcidLogs}
                onAddLog={handleAddUALog}
              />
            )}

            {activeTab === 'natural-foods' && (
              <UricLoweringFoods
                naturalFoods={naturalFoods}
                onAddNaturalFood={handleAddNaturalFood}
                onToggleFoodTaken={handleToggleFoodTaken}
                onDeleteNaturalFood={handleDeleteNaturalFood}
              />
            )}

            {activeTab === 'ai-coach' && (
              <AICoachChat
                onExecuteSkill={handleExecuteSkill}
                activeFlareExists={activeFlareExists}
                activeFlareJoint={activeFlare ? activeFlare.joint : undefined}
              />
            )}

            {activeTab === 'cooking-best-practices' && (
              <HighCuisine />
            )}

            {activeTab === 'low-purine' && (
              <LowPurineDetails />
            )}

            {activeTab === 'moderate-purine' && (
              <ModeratePurineDetails />
            )}

            {activeTab === 'high-purine' && (
              <HighPurineDetails />
            )}

            {activeTab === 'symptoms' && (
              <Symptoms
                symptoms={symptoms}
                onAddSymptom={handleAddSymptom}
                onDeleteSymptom={handleDeleteSymptom}
              />
            )}
          </motion.div>
        </main>

      </div>

      {/* Footer credits with instructions on adding secrets */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-8 text-xs text-slate-400 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-center text-[10px] leading-relaxed max-w-4xl mx-auto border-b border-slate-100 pb-4">
            <span className="font-semibold text-slate-500 block mb-1">⚖️ Clinical Supportive Care Disclaimer</span>
            This application and its components (including the AI Food Analyst, Probiotic Strain Auditor, hydration and exercise trackers) are intended for educational and supportive care tracking only. The content and metrics (including purine indexes) are built upon peer-reviewed studies *(PubMed, Healthline Medically Reviewed)* and cannot replace professional medical diagnosis, rheumatology consults, or prescribed pharmacotherapies (such as Allopurinol or Colchicine). Always seek the advice of your physician before making clinical, dietary, or supplement adjustments.
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span>&copy; 2026 Gout Companion.</span>
            <div className="flex items-center gap-1 text-slate-300">
              <span>To customize food queries: Add</span>
              <code className="bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded-md text-[10px] uppercase font-bold border border-slate-200/50">GEMINI_API_KEY</code>
              <span>in standard AI Studio Secrets menu.</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
