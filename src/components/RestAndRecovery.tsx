import React, { useState, FormEvent, useEffect } from 'react';
import { Flame, Info, Check, ShieldAlert, Heart, Wind, Moon, Trash2, Plus, Calendar, Star, Smile, BedDouble, HelpCircle, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { FlareLog, SleepLog } from '../types';

interface RestAndRecoveryProps {
  flareLogs: FlareLog[];
  onAddFlareLog: (log: Omit<FlareLog, 'id' | 'status'>) => void;
  onResolveFlareLog: (id: string) => void;
  sleepLogs: SleepLog[];
  onAddSleepLog: (log: Omit<SleepLog, 'id'>) => void;
  onDeleteSleepLog: (id: string) => void;
}

export default function RestAndRecovery({
  flareLogs,
  onAddFlareLog,
  onResolveFlareLog,
  sleepLogs,
  onAddSleepLog,
  onDeleteSleepLog,
}: RestAndRecoveryProps) {
  const [activeSubTab, setActiveSubTab] = useState<'sleep' | 'flares'>('sleep');
  
  // Flare form state
  const [showFlareForm, setShowFlareForm] = useState(false);
  const [joint, setJoint] = useState('Left Big Toe (Podagra)');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [painLevel, setPainLevel] = useState<number>(6);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [remedies, setRemedies] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // Sleep/Rest form state
  const [showSleepForm, setShowSleepForm] = useState(false);
  const [sleepHours, setSleepHours] = useState<string>('8');
  const [sleepQuality, setSleepQuality] = useState<SleepLog['quality']>('Good');
  const [restlessJoints, setRestlessJoints] = useState<boolean>(false);
  const [restSessionType, setRestSessionType] = useState<'Night Sleep' | 'Daytime Joint Rest Only'>('Night Sleep');

  const JOINTS = [
    'Left Big Toe (Podagra)',
    'Right Big Toe (Podagra)',
    'Left Ankle',
    'Right Ankle',
    'Left Knee',
    'Right Knee',
    'Left Wrist',
    'Right Wrist',
    'Elbow Joint',
    'Finger Nodes',
    'Other affected site',
  ];

  const COMMON_TRIGGERS = [
    'Alcohol / Beer / Spirits',
    'Seafood / Shellfish',
    'Sugary Sodas / Fructose',
    'Dehydration (Insufficient water)',
    'Red Meat / Pork / Bacon',
    'Organ Meats / Gravy',
    'Heavy physical joint trauma',
    'Severe Emotional / Systemic Stress',
  ];

  const COMMON_NATURAL_REMEDIES = [
    'Montmorency Tart Cherry Extract',
    'Celery Seed Botanical Extract',
    'Bromelain Pineapple Enzyme',
    'Turmeric / Curcumin Concentrate',
    'Organic Apple Cider Vinegar (ACV)',
    'Alkalizing Ural / Baking Soda',
    'Massive Hydration (Water flushing)',
  ];

  const handleTriggerChange = (t: string) => {
    setTriggers((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleRemedyChange = (r: string) => {
    setRemedies((prev) =>
      prev.includes(r) ? prev.filter((item) => item !== r) : [...prev, r]
    );
  };

  const handleFlareSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddFlareLog({
      startDate,
      joint,
      painLevel,
      triggers,
      remediesTaken: remedies,
      notes: notes.trim() || undefined,
    });
    setTriggers([]);
    setRemedies([]);
    setNotes('');
    setShowFlareForm(false);
  };

  const handleSleepSubmit = (e: FormEvent) => {
    e.preventDefault();
    const hoursNum = parseFloat(sleepHours);
    if (isNaN(hoursNum) || hoursNum <= 0) return;

    onAddSleepLog({
      date: new Date().toISOString().split('T')[0],
      hours: hoursNum,
      quality: sleepQuality,
      restlessJoints,
      meditationCompleted: false,
      isDaytimeRest: restSessionType === 'Daytime Joint Rest Only',
      restType: restSessionType,
    });

    setSleepHours('8');
    setSleepQuality('Good');
    setRestlessJoints(false);
    setRestSessionType('Night Sleep');
    setShowSleepForm(false);
  };

  const copings = [
    {
      title: '1. Elevate Above Your Heart',
      desc: 'Prop your leg or joint up on robust pillows to reduce blood congestion, internal fluid pressure, and throbbing.',
    },
    {
      title: '2. Apply Ice, NEVER Heat',
      desc: 'Localized heat increases vascular flow, welcoming inflammatory white blood cells deeper. Wrap an ice pack inside a wet towel and apply for 15-20 minutes at a time to safely numb pain.',
    },
    {
      title: '3. Hydrate Instantly with Pure Water',
      desc: 'Drink 1-2 liters of pure water immediately. Diluting serum density prompts your kidneys to excrete maximum uric acid.',
    },
    {
      title: '4. Do NOT Shift Body pH Too Rapidly Mid-Attack',
      desc: 'IMPORTANT: If you suffer an active flare, do not suddenly gulp down mega doses of organic acids (like undiluted apple cider vinegar) or massive alkaline juices. Swift changes in joint environment can prompt additional crystals to shed and dissolve unevenly, keeping the nerves firing. Keep your superfood intake at a stable, pre-planned level.',
    },
    {
      title: '5. Cradle From Bed Sheets',
      desc: 'The physical touch of even an ultra-light blanket can feel like broken glass on inflamed pods. Build a tent with a box or laundry basket over the joint to safeguard it.',
    },
  ];

  const getPainLevelDescription = (level: number) => {
    if (level <= 3) return { label: 'Twinge / Mild', bg: 'bg-green-50', color: 'text-green-700' };
    if (level <= 6) return { label: 'Aching / Throbbing', bg: 'bg-amber-50', color: 'text-amber-700' };
    if (level <= 8) return { label: 'Severe / Hot Node', bg: 'bg-orange-50', color: 'text-orange-700' };
    return { label: 'Absolute Pain / Excruciating', bg: 'bg-rose-50', color: 'text-rose-700' };
  };

  const activeFlares = flareLogs.filter((f) => f.status === 'active');
  const resolvedFlares = flareLogs.filter((f) => f.status === 'resolved');

  return (
    <div className="space-y-6" id="rest_and_recovery_root">
      
      {/* 2-Level Nested navigation */}
      <div className="bg-white rounded-3xl p-1.5 border border-slate-100 shadow-xs flex gap-1 animate-in fade-in">
        <button
          onClick={() => setActiveSubTab('sleep')}
          className={`flex-1 py-3 text-xs font-bold rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 ${
            activeSubTab === 'sleep' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Moon size={15} />
          Sleep & Night Rest ({sleepLogs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('flares')}
          className={`flex-1 py-3 text-xs font-bold rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 ${
            activeSubTab === 'flares' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Flame size={15} />
          Flare-Up Journal ({activeFlares.length > 0 ? `${activeFlares.length} Active` : '0 Active'})
        </button>
      </div>

      {/* SUBTAB 2: SLEEP & NIGHT REST */}
      {activeSubTab === 'sleep' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between font-sans">
            <div>
              <h2 className="font-sans font-semibold text-lg text-slate-800 flex items-center gap-2">
                <Moon className="text-indigo-500" size={22} />
                Sleep & Rest Quality Diary
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Optimizing sleep and keeping joint rest cycles elevates natural systemic crystal solubility
              </p>
            </div>
            <button
              onClick={() => setShowSleepForm(!showSleepForm)}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2' rounded-xl transition cursor-pointer select-none"
              id="btn_toggle_add_sleep"
            >
              <Plus size={14} />
              {showSleepForm ? 'Cancel' : 'Log Rest or Sleep'}
            </button>
          </div>

          {showSleepForm && (
            <form onSubmit={handleSleepSubmit} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl" id="add_sleep_form">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Log Sleep / Rest Session</h3>
              
              {/* Rest Type Selector */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Session Type *</label>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRestSessionType('Night Sleep')}
                    className={`flex-1 py-2 px-3 border rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      restSessionType === 'Night Sleep'
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Moon size={13} />
                    Night Sleep
                  </button>
                  <button
                    type="button"
                    onClick={() => setRestSessionType('Daytime Joint Rest Only')}
                    className={`flex-1 py-2 px-3 border rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      restSessionType === 'Daytime Joint Rest Only'
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Wind size={13} />
                    Daytime Joint Rest Only
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">
                    {restSessionType === 'Daytime Joint Rest Only' ? 'Rest Duration (Hours) *' : 'Hours Slept *'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="e.g. 7.5"
                    min="1"
                    max="24"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
                    id="sleep_hours_input"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Estimated Restfulness</label>
                  <select
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
                  >
                    <option value="Excellent">Excellent - Unbroken sleep, fully refreshed</option>
                    <option value="Good">Good - Slept well, minor brief waking</option>
                    <option value="Fair">Fair - Tossed and turned, partially sluggish</option>
                    <option value="Poor">Poor - Severe insomnia, woke fatigued</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 p-3.5 bg-white border border-slate-150/40 rounded-xl">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={restlessJoints}
                    onChange={(e) => setRestlessJoints(e.target.checked)}
                    className="rounded-sm text-indigo-600 focus:ring-indigo-100 border-slate-300 w-4 h-4"
                  />
                  <span>⚠️ Woke up due to hot or restless joints</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Check size={15} /> Save Sleep Log
              </button>
            </form>
          )}

          {sleepLogs.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center">
              <Moon className="text-slate-300 stroke-1 mb-2 animate-bounce" size={32} />
              <h4 className="text-xs font-bold text-slate-600">No sleep logs registered</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                Track night sleep quantity. Balanced rest levels allow the body to handle metabolic wastes seamlessly.
              </p>
            </div>
          ) : (
            <div className="space-y-3" id="sleep_logs_list">
              {sleepLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200/80 transition"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-slate-800 flex items-center gap-1">
                        {log.isDaytimeRest ? (
                          <>
                            <Wind className="text-sky-400" size={13} /> {log.hours} Hours Rested
                          </>
                        ) : (
                          <>
                            <Moon className="text-violet-400" size={13} /> {log.hours} Hours Slept
                          </>
                        )}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.quality === 'Excellent' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        log.quality === 'Good' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        log.quality === 'Fair' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {log.isDaytimeRest ? 'Comfort' : 'Quality'}: {log.quality}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2.5 mt-1.5">
                      {log.restlessJoints && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100/50">
                          ⚠️ joint discomfort noted
                        </span>
                      )}
                    </div>

                    <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mt-1 block">
                      Logged Date: {log.date}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteSleepLog(log.id)}
                    className="text-slate-300 hover:text-rose-500 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                    title="Delete sleep log"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: JOINT FLARE-UP JOURNAL */}
      {activeSubTab === 'flares' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-sans font-semibold text-lg text-slate-800 flex items-center gap-2">
                <Flame className="text-orange-500 fill-orange-500/10 animate-pulse" size={20} />
                Joint Flare-Up Journal
              </h2>
              <p className="text-xs text-slate-500 mt-1">Audit attack dates, joint locations, and natural remedies</p>
            </div>
            <button
              onClick={() => setShowFlareForm(!showFlareForm)}
              className="bg-orange-50 hover:bg-orange-100 border border-orange-200/50 text-orange-700 font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer"
              id="btn_toggle_add_flare"
            >
              <Activity size={14} />
              {showFlareForm ? 'Close Sheet' : 'Log New Attack'}
            </button>
          </div>

          {showFlareForm && (
            <form onSubmit={handleFlareSubmit} className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl duration-200" id="add_flare_form">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Flame className="text-orange-500" size={16} /> Log Flare Attack
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Affected Joint Region</label>
                  <select
                    value={joint}
                    onChange={(e) => setJoint(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition"
                  >
                    {JOINTS.map((j) => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Attack Start Date</label>
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition"
                  />
                </div>
              </div>

              {/* Graphical Pain Slider */}
              <div className="mb-4 bg-white p-4 rounded-xl border border-slate-150 shadow-inner">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-600">Pain Severity Indicator:</span>
                  <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${getPainLevelDescription(painLevel).bg} ${getPainLevelDescription(painLevel).color}`}>
                    Level {painLevel} - {getPainLevelDescription(painLevel).label}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1.5 px-0.5">
                  <span>1 (Mild)</span>
                  <span>4 (Heavy)</span>
                  <span>7 (Splintering)</span>
                  <span>10 (Excruciating)</span>
                </div>
              </div>

              {/* Trigger Foods checkboxes */}
              <div className="mb-4">
                <span className="text-xs font-bold text-slate-600 block mb-2">Suspected flare trigger foods/events:</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-white/70 p-3 rounded-xl border border-slate-100">
                  {COMMON_TRIGGERS.map((ct) => (
                    <label key={ct} className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer p-0.5 hover:text-orange-700 select-none">
                      <input
                        type="checkbox"
                        checked={triggers.includes(ct)}
                        onChange={() => handleTriggerChange(ct)}
                        className="mt-0.5 rounded-sm border-slate-300 text-orange-500 focus:ring-orange-150"
                      />
                      <span>{ct}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Natural Remedies Checkboxes */}
              <div className="mb-4">
                <span className="text-xs font-bold text-slate-600 block mb-2">Natural Remedies took:</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-white/70 p-3 rounded-xl border border-slate-100">
                  {COMMON_NATURAL_REMEDIES.map((cm) => (
                    <label key={cm} className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer p-0.5 hover:text-emerald-700 select-none">
                      <input
                        type="checkbox"
                        checked={remedies.includes(cm)}
                        onChange={() => handleRemedyChange(cm)}
                        className="mt-0.5 rounded-sm border-slate-300 text-emerald-500 focus:ring-emerald-150"
                      />
                      <span>{cm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-slate-600 block mb-1">Incident logs / Joint Swelling severity notes</label>
                <textarea
                  rows={2}
                  placeholder="Record details of swelling, fever heat, or specific symptoms..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition"
                  id="txt_flare_notes"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Check size={15} /> Raise Active Attack Flare Log
              </button>
            </form>
          )}

          {/* ACTIVE ATtacks entries */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider mb-2 block">
                Active Flare Attacks ({activeFlares.length})
              </span>
              {activeFlares.length === 0 ? (
                <div className="p-4 bg-emerald-50/25 border border-emerald-100 rounded-2xl text-center text-xs text-emerald-700 font-semibold flex items-center justify-center gap-2">
                  <Smile size={16} /> No active joint inflammation present of extreme severity. Joints are calm.
                </div>
              ) : (
                <div className="space-y-3.5" id="active_flares_list">
                  {activeFlares.map((f) => (
                    <div key={f.id} className="bg-orange-50/40 border border-orange-100 p-4 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-sm font-bold text-slate-800">{f.joint}</h4>
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${getPainLevelDescription(f.painLevel).bg} ${getPainLevelDescription(f.painLevel).color}`}>
                            Pain: {f.painLevel}/10
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">🗓️ Began on: <strong className="font-semibold text-slate-700">{f.startDate}</strong></p>
                        {f.triggers && f.triggers.length > 0 && (
                          <div className="mt-1.5 text-[11px] text-slate-600">
                            🚨 <span className="font-semibold">Suspected Triggers:</span> {f.triggers.join(', ')}
                          </div>
                        )}
                        {f.remediesTaken && f.remediesTaken.length > 0 && (
                          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
                            🍃 <span className="font-semibold">Applied Natural Remedies:</span> {f.remediesTaken.join(', ')}
                          </div>
                        )}
                        {f.notes && (
                          <p className="text-xs text-slate-500 italic mt-2 border-l-2 border-slate-200 pl-2 bg-slate-50/50 py-1">
                            "{f.notes}"
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onResolveFlareLog(f.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 self-end md:self-center flex items-center gap-1 shadow-xs"
                      >
                        <Check size={13} className="stroke-[3px]" /> Complete & Resolve Flare
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* HISTORIC FLARES */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">
                Historic Flares Journal
              </span>
              {resolvedFlares.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No historical logs registered in local database.</p>
              ) : (
                <div className="divide-y divide-slate-100/50" id="resolved_flares_list">
                  {resolvedFlares.map((f) => (
                    <div key={f.id} className="py-3 flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-slate-700">{f.joint}</h5>
                          <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded">
                            Pain: {f.painLevel}
                          </span>
                          <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 border border-emerald-100/40 rounded">
                            Resolved
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {f.startDate} {f.endDate ? `to ${f.endDate}` : ''}
                        </p>
                        {f.triggers && f.triggers.length > 0 && (
                          <p className="text-[10px] text-slate-500 mt-0.5">Triggers: {f.triggers.join(', ')}</p>
                        )}
                        {f.remediesTaken && f.remediesTaken.length > 0 && (
                          <p className="text-[10px] text-emerald-600 mt-0.5">Remedies: {f.remediesTaken.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
