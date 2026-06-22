import React, { useState, FormEvent } from 'react';
import { Droplet, Plus, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { HydrationLog } from '../types';

interface HydrationTrackerProps {
  log: HydrationLog;
  onUpdateWater: (amount: number) => void;
  onResetWater: () => void;
  onSetTarget: (newTarget: number) => void;
}

export default function HydrationTracker({ log, onUpdateWater, onResetWater, onSetTarget }: HydrationTrackerProps) {
  const [customMl, setCustomMl] = useState<string>('');
  const [lastAdded, setLastAdded] = useState<number | null>(null);
  const [bodyWeight, setBodyWeight] = useState<string>(() => {
    try {
      return localStorage.getItem('gout_body_weight') || '';
    } catch (e) {
      return '';
    }
  });

  const percent = Math.min(100, Math.floor((log.amount / log.target) * 100));

  const handleAddCustom = (e: FormEvent) => {
    e.preventDefault();
    const ml = parseInt(customMl);
    if (!isNaN(ml) && ml > 0) {
      onUpdateWater(ml);
      setLastAdded(ml);
      setCustomMl('');
    }
  };

  const PRESETS = [
    { label: 'Small Glass', value: 250, desc: '8 oz' },
    { label: 'Large Tumbler', value: 500, desc: '16 oz' },
    { label: 'Sports Bottle', value: 750, desc: '24 oz' },
    { label: 'Mega Jug', value: 1000, desc: '32 oz' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition hover:shadow-md" id="hydration_tracker_root">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sans font-semibold text-lg text-slate-800 flex items-center gap-2">
            <Droplet className="text-blue-500 fill-blue-500/10" size={20} />
            Daily Hydration
          </h2>
          <p className="text-xs text-slate-500 mt-1">Flush uric acid naturally with pure water</p>
        </div>
        <button
          onClick={onResetWater}
          className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
          title="Reset daily log"
          id="btn_reset_hydration"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Visual Cup indicator */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-44 h-52 bg-slate-50 border-4 border-slate-200 rounded-b-3xl rounded-t-lg overflow-hidden flex flex-col justify-end shadow-inner">
            {/* Liquid Level wave effect */}
            <motion.div
              className="w-full bg-blue-500 origin-bottom"
              initial={{ height: 0 }}
              animate={{ height: `${percent}%` }}
              transition={{ type: 'spring', stiffness: 30, damping: 10 }}
              style={{
                background: 'linear-gradient(to top, #2563eb, #3b82f6, #60a5fa)',
              }}
            >
              {/* Subtle wave animation */}
              <div className="absolute top-0 left-0 w-[200%] h-4 -mt-2 bg-blue-300 opacity-30 rounded-t-full animate-[wave_4s_infinite_linear]" />
            </motion.div>

            {/* Float text over the visual glass */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 z-10">
              <span className="text-3xl font-bold font-mono tracking-tight text-slate-800 drop-shadow-sm">
                {log.amount}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                / {log.target} ml
              </span>
              <span className="text-sm font-bold text-blue-600 mt-2 bg-white/90 backdrop-blur-xs py-0.5 px-2.5 rounded-full shadow-xs border border-blue-50/50">
                {percent}%
              </span>
            </div>
          </div>
          
          <p className="text-xs text-center text-slate-400 mt-4 italic">
            {percent >= 100 
              ? "🎉 Daily flushing goal achieved! Exceptional!" 
              : "💧 Aim for at least 2,500 mL daily to prevent crystal precipitation."}
          </p>
        </div>

        {/* Action presets and custom logger */}
        <div className="md:col-span-7 flex flex-col justify-between h-full gap-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Log Presets</h3>
            <div className="grid grid-cols-2 gap-3">
                          {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    onUpdateWater(p.value);
                    setLastAdded(p.value);
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 group text-left cursor-pointer transition"
                  id={`preset_${p.value}`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700">{p.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{p.desc}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold font-mono text-slate-600 group-hover:text-blue-600">+{p.value}ml</span>
                    <Plus size={14} className="text-slate-400 group-hover:text-blue-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddCustom} className="mt-2" id="custom_hydration_form">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Log Custom Intake</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="50"
                  max="3000"
                  value={customMl}
                  onChange={(e) => setCustomMl(e.target.value)}
                  placeholder="e.g. 350"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  id="input_custom_water"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  mL
                </span>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-2xl transition shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                id="btn_add_custom_water"
              >
                <Plus size={16} />
                Log
              </button>
            </div>
          </form>

          <div className="mt-4 border-t pt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Body weight & target</h3>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                min="30"
                max="300"
                value={bodyWeight}
                onChange={(e) => setBodyWeight(e.target.value)}
                placeholder="Body weight kg"
                className="w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
                id="input_body_weight"
              />
              <button
                type="button"
                onClick={() => {
                  const kg = Number(bodyWeight);
                  if (!isNaN(kg) && kg > 0) {
                    const computed = Math.round(kg * 30); // 30 ml per kg
                    const newTarget = Math.max(2500, computed);
                    onSetTarget(newTarget);
                    try { localStorage.setItem('gout_body_weight', String(kg)); } catch(e){}
                  }
                }}
                className="bg-emerald-600 text-white px-3 py-2 rounded-2xl text-sm"
                id="btn_apply_body_weight"
              >
                Apply (30ml/kg)
              </button>
              <div className="text-xs text-slate-500 ml-3">Current target: {log.target} ml</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (lastAdded && lastAdded > 0) {
                    onUpdateWater(-lastAdded);
                    setLastAdded(null);
                  }
                }}
                disabled={!lastAdded}
                className={`px-3 py-2 rounded-2xl text-sm ${lastAdded ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                id="btn_undo_water"
              >
                Undo last (+{lastAdded || 0}ml)
              </button>

              <button
                type="button"
                onClick={() => {
                  // clear stored body weight
                  setBodyWeight('');
                  try { localStorage.removeItem('gout_body_weight'); } catch(e){}
                }}
                className="text-xs text-slate-500"
              >
                Clear weight
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
