import React, { useState, FormEvent } from 'react';
import { Plus, Check, Info, Trash2, Calendar, AlertTriangle, Eye } from 'lucide-react';
import { ExerciseLog, FlareLog } from '../types';
import StretchDollIcon from './StretchDollIcon';

interface ExerciseTrackerProps {
  exerciseLogs: ExerciseLog[];
  flareLogs: FlareLog[];
  onAddExercise: (log: Omit<ExerciseLog, 'id'>) => void;
  onDeleteExercise: (id: string) => void;
}

export default function ExerciseTracker({
  exerciseLogs,
  flareLogs,
  onAddExercise,
  onDeleteExercise,
}: ExerciseTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [activityType, setActivityType] = useState<ExerciseLog['activityType']>('Walking');
  const [duration, setDuration] = useState<string>('');
  const [jointStrain, setJointStrain] = useState<number>(1);
  const [notes, setNotes] = useState('');

  const activeFlare = flareLogs.find((f) => f.status === 'active');
  const isInRemission = !activeFlare;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration <= 0) return;

    onAddExercise({
      date: new Date().toISOString().split('T')[0],
      activityType,
      duration: parsedDuration,
      jointStrain,
      remissionPhase: isInRemission,
      notes: notes.trim() || undefined,
    });

    setDuration('');
    setJointStrain(1);
    setNotes('');
    setShowForm(false);
  };

  const getStrainColor = (level: number) => {
    if (level <= 2) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (level <= 5) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  return (
    <div className="space-y-6" id="exercise_tracker_root">
      
      {/* State Banner depending on whether direct joint inflammation exists */}
      {activeFlare ? (
        <div className="bg-rose-50 border border-rose-200/60 rounded-3xl p-5 flex gap-4 text-rose-900 animate-pulse">
          <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-sans font-bold text-sm">Strict Joint Rest Phase Active 🛑</h3>
            <p className="text-xs text-rose-700 mt-1 leading-relaxed">
              An active flare-up is logged on your <strong className="font-semibold">{activeFlare.joint}</strong> (Pain Level: {activeFlare.painLevel}/10). 
              To avoid permanent articular cartilage micro-abrasions, <strong className="font-semibold">avoid any weight-bearing exercises or dynamic range mobility</strong> on this site. 
              Prioritize horizontal rest, cold therapy compress, and massive water intake. Resume gentle stretches only once completely resolved.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/40 border border-emerald-100 rounded-3xl p-5 flex gap-4 text-emerald-900">
          <Info className="text-emerald-600 shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-sans font-bold text-sm">Remission & Metabolic Circulation Active 💫</h3>
            <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
              Your systemic joints are currently silent. Sustained low-impact cardiovascular workouts (like swimming, spinning, or brisk walking) are crucial now. 
              Steady pulse increases general renal blood supply, assisting your body in flushing accumulated uric crystals out of distal joint capsules.
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-sans font-semibold text-lg text-slate-800 flex items-center gap-2">
              <StretchDollIcon className="text-indigo-500" size={22} />
              Exercise & Low-Impact Mobility
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Gently stimulate metabolic circulation while shielding joints from high-impact stress
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer select-none"
            id="btn_toggle_add_exercise"
          >
            <Plus size={14} />
            {showForm ? 'Cancel' : 'Log Exercise'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200" id="add_exercise_form">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Log Joint-Safe Exercise</h3>

            {activeFlare && (
              <div className="mb-4 bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 font-medium">
                ⚠️ Take caution: You currently have an active flare. Only log non-weightbearing bed stretches or upper body passive exercises if deemed appropriate.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Low-Impact Activity Type</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
                >
                  <option value="Walking">Brisk Walking (Remission phase)</option>
                  <option value="Cycling">Gentle Spinning / Stationary Cycling</option>
                  <option value="Swimming">Hydro-Therapeutic Swimming (Zero joint compression)</option>
                  <option value="Stretching/Yoga">Gentle Yoga / Range Stretches</option>
                  <option value="Flexibility">Dedicated Flexibility / Stretching Session</option>
                  <option value="Calisthenics">Low-Impact Calisthenics (Bodyweight)</option>
                  <option value="Elliptical">Impact-Free Elliptical</option>
                  <option value="Other">Other Non-Impact Exercise</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Duration (minutes)*</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 30"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
                  id="exercise_duration_input"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-500">Joint Strain / Load Intensity</label>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Level {jointStrain}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={jointStrain}
                onChange={(e) => setJointStrain(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1.5 uppercase">
                <span>1 - Couch/Zero Impact</span>
                <span>5 - Moderate Elasticity</span>
                <span>10 - Heavy Resistance</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 block mb-1">Session Notes (Joint sensation, fatigue)</label>
              <textarea
                rows={2}
                placeholder="e.g. Rested heels. Left ankle felt pristine. Continued deep metabolic breathing."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
                id="exercise_notes_input"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
            >
              <Check size={15} /> Save Logged activity
            </button>
          </form>
        )}

        {/* Workout history list */}
        {exerciseLogs.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center">
            <StretchDollIcon className="text-slate-300 stroke-1 mb-2 animate-bounce" size={32} />
            <h4 className="text-xs font-bold text-slate-600">No exercises logged</h4>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              Regular low-impact exercise dramatically enhances systemic uric flush. Log your gentle workouts here to retain progress.
            </p>
          </div>
        ) : (
          <div className="space-y-3" id="exercise_logs_list">
            {exerciseLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200/80 transition"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-800">{log.activityType}</h4>
                    <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {log.duration} mins
                    </span>
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${getStrainColor(log.jointStrain)}`}>
                      Strain: {log.jointStrain}/10
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      log.remissionPhase ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' : 'bg-red-50 text-red-700 border border-red-100/50'
                    }`}>
                      {log.remissionPhase ? 'Remission' : 'Flare Mode'}
                    </span>
                  </div>
                  {log.notes && (
                    <p className="text-[11px] text-slate-400 italic mt-1 leading-snug">
                      💡 {log.notes}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                    <Calendar size={11} /> {log.date}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteExercise(log.id)}
                  className="text-slate-300 hover:text-rose-500 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  title="Delete exercise entry"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guidelines Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
        <h3 className="font-sans font-semibold text-sm text-white flex items-center gap-2">
          <Info size={16} className="text-indigo-400" />
          Evidence-Based Exercise & Mobility Guidance
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          Goals: maintain cardiovascular health, reduce weight when needed, restore joint range and functional strength, and avoid actions that worsen acute inflammation or prolong recovery.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1">Recommendations (Remission)</h4>
            <ul className="text-[11px] text-slate-300 mt-2 list-disc ml-4 space-y-1">
              <li>Target ≥150 min/week moderate aerobic activity (e.g., brisk walking, cycling, swimming) or 75 min vigorous — break into short sessions.</li>
              <li>Strength training 2×/week: bodyweight or light resistance; focus on controlled movement and joint-friendly progressions.</li>
              <li>Flexibility & mobility 3×/week: short dedicated sessions or post-exercise stretching to preserve range (ankle/foot emphasis).</li>
              <li>Low-impact calisthenics (twice weekly): squats to a chair, assisted lunges, step-ups — keep reps moderate and avoid fatigue.</li>
              <li>Progress load slowly (10–20% volume increase weekly) and prefer zero-load modes if distal joints are frequently symptomatic.</li>
            </ul>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1">Safety & Flare rules</h4>
            <ul className="text-[11px] text-slate-300 mt-2 list-disc ml-4 space-y-1">
              <li>Active flare: rest the affected joint(s); use non‑weightbearing range-of-motion, breathing, and gentle isometrics only.</li>
              <li>Never train to exhaustion — avoid sessions causing pronounced fatigue or poor next‑day recovery; fatigue may worsen systemic inflammation.</li>
              <li>Avoid high-impact, torsional, or heavy-load movements while joints are unstable or inflamed.</li>
              <li>Warm up, cool down, hydrate, wear supportive footwear, and stop if pain, swelling, fever, or systemic symptoms develop.</li>
              <li>Seek physiotherapy or rheumatology review when chronic mobility loss, frequent flares, or persistent pain occur.</li>
            </ul>
          </div>
        </div>

        <div className="pt-3 text-[11px] text-slate-300">
          Practical 1‑week sample (beginner, low-impact)
          <ul className="list-disc ml-4 mt-1 space-y-1 text-[11px]">
            <li>Mon: 25–30 min brisk walk + 10 min ankle/foot mobility.</li>
            <li>Tue: Flexibility session 20 min (gentle yoga/stretching).</li>
            <li>Wed: 20–30 min cycling or pool walking; light calisthenics (2 sets × 8–10 reps) focusing on form.</li>
            <li>Thu: Rest or 15 min easy mobility & breathing.</li>
            <li>Fri: 30 min brisk walk + strength (bodyweight) 2×10 controlled reps.</li>
            <li>Sat: Flexibility 20 min; balance drills 10 min.</li>
            <li>Sun: Rest or gentle 20 min swim; monitor fatigue and joint response.</li>
          </ul>
        </div>

        <div className="pt-3 text-[10px] text-slate-400">
          Evidence: weight loss RCTs reduce gout burden; WHO physical activity targets apply; ACR/NHS guidance supports joint protection during flares. Sources: WHO, ACR 2020, NHS, MedlinePlus, Arthritis Rheumatol 2024, Semantic Scholar searches.
        </div>
      </div>

    </div>
  );
}
