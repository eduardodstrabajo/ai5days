import React, { useState, FormEvent } from 'react';
import { Leaf, Plus, Check, Trash2, Info, Sparkles, AlertCircle, BookOpen, Utensils, Heart, Calendar } from 'lucide-react';
import { NaturalFood } from '../types';

interface UricLoweringFoodsProps {
  naturalFoods: NaturalFood[];
  onAddNaturalFood: (food: Omit<NaturalFood, 'id' | 'takenDates'>) => void;
  onToggleFoodTaken: (id: string, dateStr: string) => void;
  onDeleteNaturalFood: (id: string) => void;
}

export default function UricLoweringFoods({
  naturalFoods,
  onAddNaturalFood,
  onToggleFoodTaken,
  onDeleteNaturalFood,
}: UricLoweringFoodsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [frequency, setFrequency] = useState<'Daily' | 'During Active Flares' | 'Occasional Maintenance'>('Daily');
  const [category, setCategory] = useState<'Fruit' | 'Vegetable' | 'Beverage' | 'Dairy' | 'Herbal/Seasoning' | 'Other'>('Fruit');
  const [mechanism, setMechanism] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedStrains, setSelectedStrains] = useState<string[]>([]);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleToggleStrain = (id: string) => {
    setSelectedStrains((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getYogurtVerdict = () => {
    if (selectedStrains.length === 0) {
      return {
        status: 'idle',
        title: 'Audit Awaiting Input',
        text: 'Select the probiotic strains listed on your yogurt packaging to run a clinical purine-loading audit.',
        colorClass: 'text-slate-400 border-slate-800 bg-slate-900/50',
        badgeClass: 'bg-slate-800 text-slate-455'
      };
    }

    const hasAvoidStrains = selectedStrains.some((s) => {
      const strain = PROBIOTIC_STRAINS.find((ps) => ps.id === s);
      return strain && strain.type === 'avoid';
    });

    if (hasAvoidStrains) {
      return {
        status: 'avoid',
        title: '🔴 Renal-Loading (Avoid)',
        text: 'Warning: This product contains strain markers (L. casei or L. paracasei) which are shown to place excess filtration load on kidneys, potentially increasing cumulative serum uric acid.',
        colorClass: 'text-rose-450 border-rose-900/40 bg-rose-950/20',
        badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
      };
    }

    return {
      status: 'safe',
      title: '🟢 Gout-Safe Starter Yogurt',
      text: 'Approved: Contains only safe, beneficial starter cultures that metabolize purines, aid digestion, and support renal clearing of uric acid. Ensure it is low-fat and has no added fructose or sugar.',
      colorClass: 'text-emerald-400 border-emerald-900/40 bg-emerald-950/20',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    };
  };

  const verdict = getYogurtVerdict();


  // Raw educational foods database
  const SUPERFOODS_REFERENCE = [
    {
      name: 'Fresh Organic Celery Juice',
      category: 'Vegetable' as const,
      servingSize: '8oz to 12oz unsweetened juice',
      frequency: 'Daily' as const,
      mechanism: 'Acts as a mild natural botanical diuretic that optimizes renal water volume, driving joint-clearing crystalline flushing.',
      notes: 'Also containing luteolin, cell studies indicate it dampens inflammatory NF-kB arthritis pathways in joints.',
    },
    {
      name: 'Unsweetened Lemon Juice',
      category: 'Beverage' as const,
      servingSize: '1 to 2 tablespoons (approx. 15-30ml) fresh squeezed',
      frequency: 'Daily' as const,
      mechanism: 'Pure lemon juice provides abundant Vitamin C and organic citric acid to raise urine pH and help dissolve solid uric precipitates (Healthline Medically Reviewed)',
      notes: 'Unsweetened fresh juice avoids fructose-induced ATP breakdowns while supporting excellent uric filtration in kidneys.',
    },
    {
      name: 'Plain Traditional Yogurt (Low-Fat)',
      category: 'Dairy' as const,
      servingSize: '1 individual pot (approx 150g)',
      frequency: 'Daily' as const,
      mechanism: 'Low-fat plain traditional yogurt proteins support renal clearance. Starter cultures (L. bulgaricus, S. thermophilus, B. lactis, L. acidophilus) help metabolize purines. Avoid products where L. casei or L. paracasei are primary cultures or those with added sugars.',
      notes: 'Choose unsweetened, low-fat traditional starters and inspect labels for strain lists; avoid L. casei / L. paracasei.',
    },

    {
      name: 'Organic Unsweetened Cacao',
      category: 'Other' as const,
      servingSize: '1-2 tbsp pure powder or 1oz dark chocolate (85%+)',
      frequency: 'Daily' as const,
      mechanism: 'Packed with polyphenols and high-potency antioxidants that counteract inflammatory cytokine loops inside uric-lodged joints (PubMed).',
      notes: 'Ensure it is completely sugar-free or unsweetened, as fructose triggers ATP breakdown and elevates systemic uric acid numbers.',
    },
    {
      name: 'Roasted Batatas (Sweet Potatoes)',
      category: 'Vegetable' as const,
      servingSize: '1 medium baked sweet potato (approx 150g)',
      frequency: 'Daily' as const,
      mechanism: 'Highly alkaline carbohydrate source rich in Vitamin C and potassium. Vitamin C acts as a natural uricosuric, boosting renal urate excretion.',
      notes: 'An outstanding, nutrient-dense replacement for white breads or heavy refined starches (Mayo Clinic).',
    },
    {
      name: 'Organic Sesame Seeds',
      category: 'Other' as const,
      servingSize: '1 to 2 tablespoons (approx. 15g)',
      frequency: 'Daily' as const,
      mechanism: 'Low-purine food rich in organic sesamin—a lignan known to suppress oxidative stress and chronic fluid swelling in inflamed tissues (PubMed, 2024).',
      notes: 'Sprinkle on salads or mashed roasted batatas. Contain healthy fats and magnesium that support joint mobility.',
    },
    {
      name: 'Organic Turmeric & Ginger Elixir',
      category: 'Herbal/Seasoning' as const,
      servingSize: '1 mug hot tea or 1oz concentrated extract shot',
      frequency: 'During Active Flares' as const,
      mechanism: 'Blocks cyclooxygenase (COX-2) and highly suppresses inflammatory cytokine swelling in sore foot joints.',
      notes: 'Ideal substitute for NSAIDs during painful microcrystal swelling stages. Best taken with a pinch of black pepper.',
    },
    {
      name: 'Hydrating Cucumbers',
      category: 'Vegetable' as const,
      servingSize: '1 medium cucumber (sliced)',
      frequency: 'Daily' as const,
      mechanism: 'High-alkaline structure pairing 95% pure water volume helps flush solid uric acid precipitates and hydrate joints.',
      notes: 'Eat as a afternoon snack. Low glycemic index supports metabolic wellness and kidney filtration efficiency.',
    },
    {
      name: 'Pure Drinking Water (Flushing)',
      category: 'Beverage' as const,
      servingSize: '250ml (1 glass) - repeated 10x daily',
      frequency: 'Daily' as const,
      mechanism: 'Crucial to prevent kidneys from over-concentrating urine, keeping uric acid fully dissolved so it cannot crystallize.',
      notes: 'The simplest, most scientifically proven method. Keep urine light-straw or clear for total joint defense.',
    },
  ];

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !servingSize.trim()) return;

    onAddNaturalFood({
      name: name.trim(),
      servingSize: servingSize.trim(),
      frequency,
      category,
      mechanism: mechanism.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setName('');
    setServingSize('');
    setMechanism('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleApplySuperfoodPreset = (preset: typeof SUPERFOODS_REFERENCE[0]) => {
    setName(preset.name);
    setCategory(preset.category);
    setServingSize(preset.servingSize);
    setFrequency(preset.frequency);
    setMechanism(preset.mechanism);
    setNotes(preset.notes);
  };

  // Group default listed reference foods so user can quick-add them
  const isFoodTracked = (nameStr: string) => {
    return naturalFoods.some((f) => f.name.toLowerCase() === nameStr.toLowerCase());
  };

  return (
    <div className="space-y-6" id="uric_lowering_foods_container">
      {/* Educational Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/5 rounded-3xl p-6 border border-emerald-500/10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="space-y-2">
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit">
            Clinically Documented Solutions
          </span>
          <h1 className="font-sans font-bold text-2xl text-slate-800 flex items-center gap-2">
            <Leaf className="text-emerald-500 animate-pulse" size={24} />
            Uric Acid-Lowering Superfoods
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Replace processed remedies with safe, organic, plant-powered superfoods. These organic ingredients trigger uric excretion, block joint-swelling reactions, and supply high antioxidants.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-3 rounded-xl transition shadow-md shadow-emerald-900/10 flex items-center justify-center gap-1.5 self-start cursor-pointer transition-all hover:scale-105"
          id="btn_toggle_add_food_form"
        >
          <Plus size={15} />
          {showAddForm ? 'Cancel Form' : 'Register Custom Food'}
        </button>
      </div>

      {/* Register Custom Food Form (Collapsible) */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-white p-6 border border-slate-100 shadow-xs rounded-3xl animate-in fade-in slide-in-from-top-3 duration-200"
          id="add_natural_food_form"
        >
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-50">
            <Sparkles className="text-emerald-500" size={18} />
            <h3 className="font-sans font-bold text-sm text-slate-700">Add Foods to Tracked Diet</h3>
          </div>

          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
              Select Curated Superfood Presets to Auto-fill:
            </span>
            <div className="flex flex-wrap gap-2">
              {SUPERFOODS_REFERENCE.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleApplySuperfoodPreset(preset)}
                  disabled={isFoodTracked(preset.name)}
                  className={`text-xs py-1.5 px-3 rounded-xl border transition text-left cursor-pointer flex items-center gap-1.5 ${
                    isFoodTracked(preset.name)
                      ? 'bg-slate-50 border-slate-100 text-slate-300 pointer-events-none'
                      : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 font-medium'
                  }`}
                >
                  {isFoodTracked(preset.name) ? '✓' : '+'} {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Superfood Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tart Cherry Concentrate"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Suggested Daily Serving *</label>
              <input
                type="text"
                required
                placeholder="e.g. 1 tall glass, 1 cup, 2 tbsp"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Food Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition"
              >
                <option value="Fruit">Fruit / Berries</option>
                <option value="Vegetable">Vegetable / Green</option>
                <option value="Beverage">Beverage / Juice</option>
                <option value="Dairy">Dairy Probiotic</option>
                <option value="Herbal/Seasoning">Herbal / Active Spice</option>
                <option value="Other">Other Beneficial</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Target Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Daily', 'During Active Flares', 'Occasional Maintenance'] as const).map((freq) => (
                  <button
                    type="button"
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                      frequency === freq
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {freq === 'During Active Flares' ? 'Active Flare Use' : freq}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-bold text-slate-500 block mb-1.5">Scientific Mechanism (How it helps lower Uric Acid)</label>
            <input
              type="text"
              placeholder="e.g. Inhibits xanthine oxidase synthesis, highly increases urinary clearings..."
              value={mechanism}
              onChange={(e) => setMechanism(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition"
            />
          </div>

          <div className="mb-5">
            <label className="text-xs font-bold text-slate-500 block mb-1.5">Usage Guidelines / Personal Reminder</label>
            <textarea
              placeholder="e.g. Squeeze fresh first thing in sensory morning on active empty stomach"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-100 focus:bg-white focus:border-emerald-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 hover:shadow-md hover:shadow-emerald-950/10"
          >
            <Check size={16} /> Save Superfood to Watchlist
          </button>
        </form>
      )}

      {/* Main Split Layout: Left Is Checklist, Right Is Scientific Resource Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Daily Checkoff Journal (60% equivalent) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs relative">
            <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-4">
              <div>
                <h2 className="font-sans font-bold text-base text-slate-800 flex items-center gap-2">
                  <Utensils className="text-emerald-500" size={18} />
                  My Superfoods Intake Checklist
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Check off items consumed today to log defensive eating habits</p>
              </div>
              <span className="text-[10px] bg-slate-100 border border-slate-200 font-bold font-mono px-2 py-0.5 rounded-md text-slate-600">
                DATE: {todayStr}
              </span>
            </div>

            {naturalFoods.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center max-w-md mx-auto">
                <Leaf className="text-slate-300 stroke-1 mb-2 animate-bounce" size={40} />
                <h4 className="text-xs font-bold text-slate-600">No tracked superfoods yet</h4>
                <p className="text-[11px] text-slate-400 mt-1 text-center max-w-xs leading-relaxed px-4">
                  Register some foods using the templates or your own diet criteria above. Tracking natural uric acid cleansers reinforces clean joint defense!
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] px-3.5 py-2 rounded-lg transition"
                >
                  Quick Launch Presets Window
                </button>
              </div>
            ) : (
              <div className="space-y-3" id="superfoods_checklist_list">
                {naturalFoods.map((food) => {
                  const isTakenToday = food.takenDates.includes(todayStr);
                  
                  // Compute streak count
                  const lastDaysStreak = computeStreak(food.takenDates);
                  
                  return (
                    <div
                      key={food.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-3 justify-between ${
                        isTakenToday
                          ? 'border-emerald-100 bg-emerald-50/10'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{food.name}</h4>
                          <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            {food.servingSize}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {food.category}
                          </span>
                        </div>

                        {food.mechanism && (
                          <p className="text-[11px] text-slate-500 mt-1 lines-clamp-2 leading-relaxed">
                            <span className="font-semibold text-slate-700">Action:</span> {food.mechanism}
                          </p>
                        )}

                        <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                          {food.frequency && (
                            <span>
                              🎯 Freq: <span className="font-semibold text-slate-600">{food.frequency}</span>
                            </span>
                          )}
                          {lastDaysStreak > 0 && (
                            <span className="text-orange-600 font-semibold flex items-center gap-0.5">
                              🔥 Streak: {lastDaysStreak} {lastDaysStreak === 1 ? 'day' : 'days'}
                            </span>
                          )}
                          {food.notes && (
                            <span className="italic overflow-hidden text-ellipsis truncate block">
                              📝 {food.notes}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-center shrink-0">
                        <button
                          onClick={() => onToggleFoodTaken(food.id, todayStr)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold select-none cursor-pointer transition ${
                            isTakenToday
                              ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-500'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                          }`}
                          id={`btn_log_consume_${food.id}`}
                        >
                          <Check size={13} className={isTakenToday ? 'stroke-[3px]' : ''} />
                          {isTakenToday ? 'Consumed' : 'Log Daily'}
                        </button>
                        
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this tracked superfood?')) {
                              onDeleteNaturalFood(food.id);
                            }
                          }}
                          className="text-slate-300 hover:text-rose-500 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                          title="Remove superfood tracker"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Science Resource Directory (40% equivalent) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-sm">
            <h2 className="font-sans font-bold text-base text-white flex items-center gap-2 mb-4">
              <BookOpen className="text-emerald-400" size={18} />
              The Science of Alkaline & Inhibitor Foods
            </h2>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 uppercase font-bold text-[9px] tracking-wider block">Xanthine Oxidase Inhibitors</span>
                <p>
                  Certain natural compounds, notably **anthocyanins** in Montmorency cherries and **chlorogenic polyphenols** in black coffee, physically interact with xanthine oxidase, the primary liver enzyme that converts purines into uric acid. By reducing active synthesis speed, they emulate a gentle, pharmacological lock on uric spikes.
                </p>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-blue-400 uppercase font-bold text-[9px] tracking-wider block">Alkalization & Crystal Dissolution</span>
                <p>
                  Uric acid solubility is immensely sensible to body fluid pH. In highly acidic environments (pH &lt; 5.5), sodium urate crystals shape and lodge freely in slow-flow joint areas, like the toes. Consuming alkaline-forming elements such as organic **lemon juice** or high water volume hydrates the system and boosts pH, promoting natural crystal dissolution.
                </p>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-teal-400 uppercase font-bold text-[9px] tracking-wider block">Renal Elimination (Uricosurics)</span>
                <p>
                  Superfoods containing rich natural **Vitamin C** (such as strawberries and high-grade citrus fruits) and milk-derived proteins stimulate the kidney nephrons. This enhances filtration efficiency and diminishes renal tubule absorption, accelerating the physical disposal of excess uric acid in our urine output.
                </p>
              </div>

              <div className="flex items-start gap-2 bg-emerald-900/20 p-3.5 rounded-2xl border border-emerald-500/20 text-emerald-300 text-[11px]">
                <Info size={14} className="shrink-0 mt-0.5 text-emerald-400" />
                <span>
                  <strong>Tip:</strong> Maintain a stable intake volume. Drastic diet fluctuations (like drinking 2 liters of undiluted lemon juice in one sitting) might alter localized blood chemistry too rapidly, which can trigger crystals to shed from bone tissue and spark flares. Keep routines moderate and consistent!
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Probiotic Yogurt Strain Checker */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="bg-violet-900/30 text-violet-300 text-[9px] font-bold font-mono px-2.5 py-1 rounded-full border border-violet-500/20 uppercase tracking-wider block w-fit mb-1.5">
                Clinical Yogurt Expert
              </span>
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <Leaf className="text-emerald-400" size={16} />
                Probiotic Strain Auditor
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Select the strains listed on your yogurt packaging to audit renal-loading and purine safety.
              </p>
            </div>

            {/* Strains selection grid */}
            <div className="space-y-2">
              {PROBIOTIC_STRAINS.map((strain) => {
                const isSelected = selectedStrains.includes(strain.id);
                return (
                  <button
                    key={strain.id}
                    type="button"
                    onClick={() => handleToggleStrain(strain.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition select-none flex gap-2 items-start cursor-pointer ${
                      isSelected
                        ? strain.type === 'safe'
                          ? 'bg-emerald-950/20 border-emerald-700/60 text-emerald-300'
                          : 'bg-rose-950/20 border-rose-700/60 text-rose-300'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 text-slate-350'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border mt-0.5 ${
                      isSelected
                        ? strain.type === 'safe'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-rose-600 border-rose-600 text-white'
                        : 'bg-slate-900 border-slate-700 text-transparent'
                    }`}>
                      {isSelected && <Check size={10} className="stroke-[3px]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[11px] font-bold italic">{strain.name}</span>
                        <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded ${
                          strain.type === 'safe' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50' 
                            : 'bg-rose-950 text-rose-450 border border-rose-900/50'
                        }`}>
                          {strain.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">{strain.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Verdict Display */}
            <div className={`p-4 rounded-2xl border transition-all ${verdict.colorClass}`}>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs">{verdict.title}</h4>
                {verdict.status !== 'idle' && (
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${verdict.badgeClass}`}>
                    {verdict.status === 'safe' ? 'Gout-Approved' : 'High Renal Load'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">{verdict.text}</p>
            </div>

            {/* Add to checklist shortcut */}
            {verdict.status === 'safe' && (
              <button
                type="button"
                onClick={() => {
                  if (isFoodTracked('Plain Traditional Yogurt (Low-Fat)')) {
                    alert('Plain Traditional Yogurt (Low-Fat) is already in your superfoods watchlist!');
                    return;
                  }
                  onAddNaturalFood({
                    name: 'Plain Traditional Yogurt (Low-Fat)',
                    servingSize: '1 individual pot (approx 150g)',
                    category: 'Dairy',
                    frequency: 'Daily',
                    mechanism: 'Low-fat plain traditional yogurt proteins support renal clearance. Starter cultures (L. bulgaricus, S. thermophilus, B. lactis, L. acidophilus) help metabolize dietary purines in the GI tract.',
                    notes: 'Probiotic strain audit completed: Verified safe.'
                  });
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={13} /> Add Gout-Safe Yogurt to Watchlist
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Medical Disclaimer Banner */}
      <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-3xl flex items-start gap-3 mt-6">
        <AlertCircle className="text-slate-400 shrink-0 mt-0.5" size={18} />
        <div className="text-xs text-slate-500 leading-normal">
          <strong className="text-slate-700 font-bold block mb-1 font-sans">⚖️ Clinical Supportive Care Disclaimer</strong>
          This application provides supportive care guidelines, water targets, and evidence-based nutritional logs *(Mayo Clinic, Healthline Medically Reviewed)*. This guidance is supportive and cannot replace primary medical treatment, clinical rheumatological examinations, or prescribed medications (such as Allopurinol or Colchicine). Always seek the advice of a qualified healthcare provider regarding any rheumatological condition or pharmacological plan.
        </div>
      </div>

    </div>
  );
}

// Simple helper to compute consecutive daily streaks
function computeStreak(dates: string[]): number {
  if (!dates || dates.length === 0) return 0;
  
  // Sort descending
  const sorted = [...new Set(dates)].sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
  
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  let currentWordStr = today.toISOString().split('T')[0];
  let yesterWordStr = yesterday.toISOString().split('T')[0];
  
  // If today isn't logged and yesterday isn't logged, streak is broken, but if yesterday was logged we can count from it
  if (!sorted.includes(currentWordStr) && !sorted.includes(yesterWordStr)) {
    return 0;
  }
  
  let count = 0;
  let cursor = sorted.includes(currentWordStr) ? today : yesterday;
  
  while (true) {
    const checkStr = cursor.toISOString().split('T')[0];
    if (sorted.includes(checkStr)) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  
  return count;
}

const PROBIOTIC_STRAINS = [
  {
    id: 'bulgaricus',
    name: 'Lactobacillus bulgaricus',
    type: 'safe' as const,
    desc: 'Approved classical starter. Establishes healthy gut flora and reduces purine metabolite absorption (PubMed, 2024).'
  },
  {
    id: 'thermophilus',
    name: 'Streptococcus thermophilus',
    type: 'safe' as const,
    desc: 'Approved co-starter. Breaks down lactose and assists in lowering localized joint inflammatory markers.'
  },
  {
    id: 'lactis',
    name: 'Bifidobacterium lactis',
    type: 'safe' as const,
    desc: 'Approved probiotic. Actively metabolizes dietary nucleosides and purines in the GI tract before absorption (PubMed).'
  },
  {
    id: 'acidophilus',
    name: 'Lactobacillus acidophilus',
    type: 'safe' as const,
    desc: 'Approved probiotic. Maintains low pH in intestines, shielding gut integrity and nutrient clearance.'
  },
  {
    id: 'casei',
    name: 'Lactobacillus casei',
    type: 'avoid' as const,
    desc: 'AVOID / RENAL RISK: May interfere with organic anion transporters (OAT) in renal tubules, raising renal load (Healthline Medically Reviewed).'
  },
  {
    id: 'paracasei',
    name: 'Lactobacillus paracasei',
    type: 'avoid' as const,
    desc: 'AVOID / RENAL RISK: Can negatively alter purine clearance kinetics, placing high filtration demand on kidneys.'
  }
];

