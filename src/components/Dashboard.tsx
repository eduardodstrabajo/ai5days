import { Droplet, Leaf, Activity, Flame, ShieldAlert, CheckCircle2, ChevronRight, Plus } from 'lucide-react';
import { FlareLog, HydrationLog, UricAcidLog, NaturalFood } from '../types';

interface DashboardProps {
  userEmail: string;
  flareLogs: FlareLog[];
  hydration: HydrationLog;
  uricAcidLogs: UricAcidLog[];
  naturalFoods: NaturalFood[];
  onAddWater: (amount: number) => void;
  onToggleFood: (id: string, date: string) => void;
  onSetTab: (tab: string) => void;
}

export default function Dashboard({
  userEmail,
  flareLogs,
  hydration,
  uricAcidLogs,
  naturalFoods,
  onAddWater,
  onToggleFood,
  onSetTab,
}: DashboardProps) {
  const activeFlare = flareLogs.find((f) => f.status === 'active');
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculations
  const waterPercent = Math.min(100, Math.floor((hydration.amount / hydration.target) * 100));
  
  const latestUA = uricAcidLogs.length > 0 
    ? [...uricAcidLogs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] 
    : null;

  const totalFlaresLogged = Array.isArray(flareLogs) ? flareLogs.length : 0;

  return (
    <div className="space-y-6" id="dashboard_root">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-radial-gradient from-blue-50/20 via-transparent to-transparent p-4 rounded-2xl border border-slate-100/50">
        <div>
          <h1 className="text-xl font-bold text-slate-800 font-sans tracking-tight">Gout Care Companion</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered Patient: <span className="font-semibold text-slate-700">{userEmail || 'Guest Profile'}</span>
          </p>
        </div>
        <div className="text-[10px] font-bold font-mono text-slate-400 bg-slate-100/50 border border-slate-200/40 px-2.5 py-1 rounded-lg mt-2 md:mt-0">
          🕒 Local Time: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Dynamic Health State Banner */}
      {activeFlare ? (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex flex-col md:flex-row gap-5 items-start justify-between animate-pulse-slow">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-200">
              <Flame size={24} className="animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] bg-rose-600 text-white font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                Active Flare Outbreak
              </span>
              <h3 className="text-base font-bold text-rose-900 mt-2">
                Painful inflammation registered in {activeFlare.joint} (Pain: {activeFlare.painLevel}/10)
              </h3>
              <p className="text-xs text-rose-700 mt-1.5 leading-relaxed max-w-2xl">
                Avoid raw high-purine foods immediately, drink massive quantities of water to clear crystal blockages, and consult our acute relief metronome.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSetTab('rest')}
            className="self-start md:self-center bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-5 py-3 rounded-xl transition cursor-pointer shadow-md shadow-rose-900/10 flex items-center gap-1 shrink-0"
            id="link_emergency_relief"
          >
            Emergency Relief Toolkit
            <ChevronRight size={14} />
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 bg-opacity-70 border border-emerald-100 rounded-3xl p-6 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <span className="text-[10px] bg-emerald-600 text-white font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full font-semibold">
                Stable Remission Phase
              </span>
              <h3 className="text-base font-bold text-emerald-950 mt-2">
                Your joint metabolic indices are currently stable
              </h3>
              <p className="text-xs text-emerald-800 mt-1">
                Excellent! Keep taking daily preventive natural remedies and maintain 2.5L+ hydration levels to wash crystals out.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSetTab('rest')}
            className="self-start md:self-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1"
          >
            Log Flare Info
          </button>
        </div>
      )}

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Bento Card 1: Hydration tracker widget */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between min-h-[190px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Droplet size={18} className="fill-blue-600/10" />
            </div>
            <button
              onClick={() => onAddWater(250)}
              className="text-[10px] font-bold text-blue-700 hover:text-white bg-blue-50 border border-blue-200 hover:bg-blue-600 py-1 px-2.5 rounded-lg transition cursor-pointer flex items-center gap-0.5"
            >
              <Plus size={10} /> 250ml
            </button>
          </div>
          
          <div className="my-4">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Logged Hydration</span>
            <span className="text-xl font-bold font-mono tracking-tight text-slate-800">{hydration.amount} <span className="text-xs text-slate-400">/ {hydration.target} ml</span></span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${waterPercent}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
              <span>{waterPercent}% of target</span>
              <button onClick={() => onSetTab('hydration')} className="text-blue-600 hover:underline">Customize</button>
            </div>
          </div>
        </div>

        {/* Bento Card 2: Uric Acid levels */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between min-h-[190px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
              <Activity size={18} />
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              latestUA && latestUA.value < 6.0 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' 
                : latestUA 
                  ? 'bg-rose-50 text-rose-700 border border-rose-100/50'
                  : 'bg-slate-100 text-slate-500'
            }`}>
              {latestUA && latestUA.value < 6.0 ? 'Therapeutic target met' : 'Target Target: <6.0'}
            </span>
          </div>

          <div className="my-4">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Uric Acid Baseline</span>
            <span className="text-xl font-bold font-mono tracking-tight text-slate-800">
              {latestUA ? `${latestUA.value} mg/dL` : 'No reading'}
            </span>
          </div>

          <div className="text-[10px] font-semibold text-slate-500 flex justify-between items-center">
            <span>{latestUA ? `Last test: ${latestUA.date}` : 'Awaiting clinical entry'}</span>
            <button onClick={() => onSetTab('uric-acid')} className="text-violet-600 hover:underline">Log lab</button>
          </div>
        </div>

        {/* Bento Card 3: Year Flares tally */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between min-h-[190px]">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Flame size={18} />
          </div>

          <div className="my-4">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Life Attacks Audited</span>
            <span className="text-xl font-bold font-mono tracking-tight text-slate-800">
              {totalFlaresLogged} <span className="text-xs text-slate-400">Total</span>
            </span>
          </div>

          <span className="text-[10px] text-slate-400 font-semibold block">
            {totalFlaresLogged > 0 
              ? `Keep logs up-to-date to identify triggers` 
              : '0 attacks audited — Clean slate.'}
          </span>
        </div>

        {/* Bento Card 4: Quick Food Check banner */}
        <div className="bg-slate-950 text-white rounded-3xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between min-h-[190px]">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 shadow-inner">
            <Activity size={18} className="animate-spin-slow" />
          </div>

          <div className="my-3">
            <h4 className="text-xs font-bold text-slate-200">AI Dietician Consultant</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Unsure if a restaurant recipe or drink is safe? Let our server-side Gemini scanner analyze it.
            </p>
          </div>

          <button
            onClick={() => onSetTab('scanner')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] py-2 rounded-xl text-center cursor-pointer transition uppercase tracking-wider"
          >
            Ask Food Scan
          </button>
        </div>

      </div>

      {/* Bottom rows: Active superfoods checklist */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <h3 className="font-sans font-semibold text-sm text-slate-800 flex items-center gap-1.5 mb-4">
          <Leaf className="text-emerald-500" size={16} />
          Daily Superfoods Intake Checklist
        </h3>

        {naturalFoods.length === 0 ? (
          <div className="py-6 text-center border border-dashed border-slate-100 rounded-2xl">
            <p className="text-xs text-slate-400">No active natural foods registered in your watchlist. Configure some inside the Natural Lowering Foods panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {naturalFoods.map((food) => {
              const isTakenToday = food.takenDates.includes(todayStr);
              return (
                <div
                  key={food.id}
                  onClick={() => onToggleFood(food.id, todayStr)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition ${
                    isTakenToday 
                      ? 'bg-emerald-50/20 border-emerald-100 text-emerald-800 hover:bg-emerald-100/30' 
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-200 hover:bg-slate-100/35'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{food.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">{food.servingSize} • {food.frequency}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition border ${
                    isTakenToday 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'bg-white border-slate-200 text-slate-200'
                  }`}>
                    {isTakenToday && <CheckCircle2 size={14} className="stroke-[3px]" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-3xl flex items-start gap-3 mt-6">
        <ShieldAlert className="text-slate-400 shrink-0 mt-0.5" size={18} />
        <div className="text-xs text-slate-500 leading-normal">
          <strong className="text-slate-700 font-bold block mb-1">⚖️ Clinical Supportive Care Disclaimer</strong>
          This application provides supportive care guidelines, water targets, and evidence-based nutritional logs *(Mayo Clinic, Healthline Medically Reviewed)*. This guidance is supportive and cannot replace primary medical treatment, clinical rheumatological examinations, or prescribed medications (such as Allopurinol or Colchicine). Always seek the advice of a qualified healthcare provider regarding any rheumatological condition or pharmacological plan.
        </div>
      </div>

    </div>
  );
}
