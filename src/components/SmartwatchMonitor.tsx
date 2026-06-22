import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Activity, Watch, RefreshCw, Zap, Bluetooth, ShieldAlert, Heart, Thermometer, Battery, Bell, Play, Plus, Clock, HelpCircle } from 'lucide-react';
import { UricAcidLog } from '../types';

interface SmartwatchMonitorProps {
  logs: UricAcidLog[];
  onAddLog: (log: Omit<UricAcidLog, 'id'>) => void;
}

export default function SmartwatchMonitor({ logs, onAddLog }: SmartwatchMonitorProps) {
  const [deviceConnected, setDeviceConnected] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [liveUricValue, setLiveUricValue] = useState(5.8);
  const [pulseRate, setPulseRate] = useState(72);
  const [skinTemp, setSkinTemp] = useState(36.6); // Normal joint skin temp
  const [batteryLevel, setBatteryLevel] = useState(89);
  const [selectedJoint, setSelectedJoint] = useState('Left Big Toe (Sensor #2)');
  
  // Simulation panel states
  const [simValue, setSimValue] = useState('6.2');
  const [simNotes, setSimNotes] = useState('');
  const [showSimModal, setShowSimModal] = useState(false);
  
  // Wearable alerts/notifications
  const [alerts, setAlerts] = useState([
    {
      id: 'alert-1',
      time: '08:45 AM',
      type: 'Normal',
      text: 'Wake-up sweat bio-scan complete. Transdermal uric-acid stable at 5.7 mg/dL.',
    },
    {
      id: 'alert-2',
      time: 'Yesterday',
      type: 'Warning',
      text: 'Left Big Toe joint temperature localized spike (+0.8°C). Ensure high water intake to flush potential crystallization.',
    },
  ]);

  // Live heart rate flutters
  useEffect(() => {
    const interval = setInterval(() => {
      if (deviceConnected) {
        setPulseRate((prev) => {
          const delta = Math.floor(Math.random() * 5) - 2;
          const newVal = prev + delta;
          return newVal > 85 ? 85 : newVal < 65 ? 65 : newVal;
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [deviceConnected]);

  // Live bio-sensor mini sweat oscillations (simulate skin humidity micro-reading)
  useEffect(() => {
    const interval = setInterval(() => {
      if (deviceConnected) {
        setLiveUricValue((prev) => {
          const delta = parseFloat((Math.random() * 0.1 - 0.05).toFixed(2));
          const newVal = parseFloat((prev + delta).toFixed(2));
          return newVal > 9.5 ? 9.5 : newVal < 4.0 ? 4.0 : newVal;
        });
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [deviceConnected]);

  const triggerLiveSync = () => {
    setSyncing(true);
    // Simulate smart watch high-throughput bluetooth fetching of the transdermal sweat biosensor
    setTimeout(() => {
      setSyncing(false);
      // Log current reading as a valid laboratory metric update
      const curDateStr = new Date().toISOString().split('T')[0];
      onAddLog({
        date: curDateStr,
        value: liveUricValue,
        notes: `Simulated Wearable Bio-Scanner Sync (${selectedJoint})`,
      });
      
      // Post alert
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newAlert = {
        id: 'alert-' + Date.now(),
        time: nowTime,
        type: liveUricValue > 6.0 ? 'Critical' : 'Normal',
        text: `Wearable Sync: Sweat biosensors compiled a joint value of ${liveUricValue} mg/dL. ${
          liveUricValue > 6.0 
            ? 'Localized hyperuricemia risk detected. Tap Diet panel immediately.' 
            : 'Therapeutic target maintained!'
        }`,
      };
      setAlerts([newAlert, ...alerts]);
      setBatteryLevel((prev) => Math.max(prev - 2, 5));
    }, 1800);
  };

  const handleSimulatedCalibration = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(simValue);
    if (!isNaN(val) && val > 0) {
      onAddLog({
        date: new Date().toISOString().split('T')[0],
        value: val,
        notes: simNotes ? `Smartwatch manual calibration: ${simNotes}` : `Smartwatch biosensor calibration`,
      });
      setLiveUricValue(val);
      setShowSimModal(false);
      
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newAlert = {
        id: 'alert-' + Date.now(),
        time: nowTime,
        type: val > 6.0 ? 'Warning' : 'Normal',
        text: `Sensor Calibrated: Reset transdermal target factor to ${val} mg/dL. Skin temperature baseline synchronized.`,
      };
      setAlerts([newAlert, ...alerts]);
    }
  };

  // Prepare chart data chronologically
  const chartData = [...logs]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((log) => ({
      ...log,
      formattedDate: new Date(log.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }));

  const latestLog = logs.length > 0 ? [...logs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;

  return (
    <div className="space-y-6" id="smartwatch_monitor_root">
      
      {/* Top Banner introducing emerging biosensor wearable monitor */}
      <div className="bg-gradient-to-r from-violet-600/10 to-indigo-600/5 rounded-3xl p-6 border border-violet-500/10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="space-y-2">
          <span className="bg-violet-100 text-violet-800 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit">
            Next-Gen Wearable Tech
          </span>
          <h1 className="font-sans font-bold text-2xl text-slate-800 flex items-center gap-2">
            <Watch className="text-violet-500 animate-bounce" size={24} />
            Smartwatch Real-Time Uric Acid Sync
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Continuously monitor localized joint statistics, skin temperature spikes, and transdermal sweat biosensor metrics to map metabolic crystal conditions in real-time.
          </p>
        </div>

        <button
          onClick={() => setShowSimModal(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs px-5 py-3 rounded-xl transition shadow-md shadow-violet-900/10 flex items-center justify-center gap-1.5 self-start cursor-pointer transition-all hover:scale-105"
          id="btn_calibrate_sensor"
        >
          <RefreshCw size={14} />
          Calibrate/Simulate Node
        </button>
      </div>

      {showSimModal && (
        <form
          onSubmit={handleSimulatedCalibration}
          className="bg-white p-6 border border-slate-100 shadow-xs rounded-3xl animate-in fade-in slide-in-from-top-3 duration-200"
          id="calibrate_sensor_form"
        >
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-50">
            <Zap className="text-violet-500" size={18} />
            <h3 className="font-sans font-bold text-sm text-slate-700">Calibrate Local Joint Biosensor</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Enter Laboratory Reference / Blood Test Value (mg/dL) *</label>
              <input
                type="number"
                step="0.1"
                min="2.0"
                max="18.0"
                required
                value={simValue}
                onChange={(e) => setSimValue(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-100 focus:bg-white focus:border-violet-500 transition font-mono font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">Calibrates the smartwatch transdermal coefficient utilizing an accurate dry blood sample baseline.</p>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Calibration Notes</label>
              <input
                type="text"
                placeholder="e.g. Sychronized with lab test baseline"
                value={simNotes}
                onChange={(e) => setSimNotes(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-100 focus:bg-white focus:border-violet-500 transition"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowSimModal(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-xl font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs rounded-xl font-semibold transition flex items-center gap-1"
            >
              Confirm Calibration
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Wearable Device Display, Charts, Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Smartwatch Device Interactive Mockup (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-6 w-full max-w-[340px] shadow-2xl relative flex flex-col items-center">
            
            {/* Watch strap elements for realism */}
            <div className="absolute top-[-35px] w-32 h-9 bg-slate-800 rounded-t-xl z-[-1] border-t border-slate-700 shadow-inner" />
            <div className="absolute bottom-[-35px] w-32 h-9 bg-slate-800 rounded-b-xl z-[-1] border-b border-slate-700 shadow-inner" />
            
            {/* Watch crown/button controls */}
            <div className="absolute right-[-6px] top-28 w-2 h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-r-md border-r border-slate-500" />
            <div className="absolute right-[-4px] top-16 w-1 h-6 bg-slate-800 rounded-r-sm" />

            <div className="w-full bg-black rounded-[36px] p-4 text-white relative overflow-hidden flex flex-col items-center border border-slate-800 h-[430px]">
              {/* Inner ambient flare lighting */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/15 rounded-full blur-2xl pointer-events-none animate-pulse" />
              
              {/* Watch Outer Rim Indicators */}
              <div className="w-full flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-3">
                <div className="flex items-center gap-1">
                  <Bluetooth className={`text-blue-400 ${deviceConnected ? 'animate-pulse' : ''}`} size={12} />
                  <span>{deviceConnected ? 'paired' : 'disconnected'}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-slate-300">
                  <Battery size={12} className="text-emerald-400" />
                  <span>{batteryLevel}%</span>
                </div>
              </div>

              {/* Heart Beat & Local Sweat Sensor Section */}
              <div className="w-full text-center space-y-1.5 mt-2">
                <span className="text-[10px] text-violet-400 font-extrabold uppercase tracking-widest block">Sweat Biosensor v4</span>
                <h3 className="text-3xl font-extrabold text-white font-mono tracking-tighter relative inline-block">
                  {syncing ? (
                    <span className="text-violet-400 flex items-center justify-center gap-1">
                      <RefreshCw size={24} className="animate-spin" />
                      ...
                    </span>
                  ) : (
                    <>
                      {liveUricValue}
                      <span className="text-xs font-semibold text-slate-400 ml-1">mg/dL</span>
                    </>
                  )}
                </h3>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full block mx-auto w-fit ${
                  liveUricValue < 6.0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {liveUricValue < 6.0 ? 'Therapeutic target ok' : 'Warning: localized high concentration'}
                </span>
              </div>

              {/* Central Glowing Wearable Indicator Circle */}
              <div className="my-5 relative flex items-center justify-center w-36 h-36 border border-slate-800 rounded-full bg-slate-950">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Gauge Arc */}
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#1e293b"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke={liveUricValue < 6.0 ? '#10b981' : '#f43f5e'}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * Math.min(liveUricValue, 12)) / 12}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Local Stats Inner Circle */}
                <div className="absolute flex flex-col items-center">
                  <Heart className="text-rose-500 fill-rose-500/20 animate-pulse mb-1" size={18} />
                  <span className="text-xl font-bold font-mono text-white leading-none">{pulseRate}</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">BPM Pulse</span>
                </div>
              </div>

              {/* Real-time Subvitals */}
              <div className="w-full grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-slate-900 text-center">
                <div className="space-y-0.5 border-r border-slate-900">
                  <span className="text-[9px] text-slate-400 font-semibold block uppercase">Skin Temperature</span>
                  <span className="text-xs font-bold font-mono text-slate-200 flex items-center justify-center gap-0.5">
                    <Thermometer size={10} className="text-orange-400" />
                    {skinTemp}°C
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-semibold block uppercase">Sensor Anchor</span>
                  <span className="text-[10px] font-bold text-violet-300 truncate block px-1">
                    Big Toe node
                  </span>
                </div>
              </div>

              {/* Synchronize Button on Watch display */}
              <button
                onClick={triggerLiveSync}
                disabled={syncing}
                className="w-full mt-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-[10px] font-extrabold uppercase py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 tracking-wider"
              >
                <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />
                {syncing ? 'Connecting...' : 'Request Live Sync'}
              </button>

            </div>
          </div>
          
          <div className="mt-4 text-center max-w-xs space-y-1">
            <p className="text-[11px] text-slate-500 font-medium">
              Connected wearable: <strong className="text-slate-700">Apple Watch v8 Biosensor</strong>
            </p>
            <p className="text-[10px] text-slate-400 leading-normal">
              Uses high-efficiency transdermal micro-fluidic sweat sensors to monitor localized pH and uric metrics. No painful fingertip sticks required!
            </p>
          </div>
        </div>

        {/* Right Column: Analytics, Real-time trends & notifications (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Section 1: Chart Trend Visualization */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs relative">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
              <div>
                <h2 className="font-sans font-bold text-base text-slate-800 flex items-center gap-1.5">
                  <Activity className="text-violet-500" size={17} />
                  Transdermal Uric Acid Chronicles
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">Goal is keeping serum levels strictly &lt; 6.0 mg/dL for absolute joint comfort</p>
              </div>

              {latestLog && (
                <div className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                  latestLog.value < 6.0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  {latestLog.value < 6.0 ? '✓ Target Met' : '⚠ Elevated'}
                </div>
              )}
            </div>

            {chartData.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                <Clock className="text-slate-300 mx-auto mb-2 animate-pulse" size={32} />
                <h4 className="text-xs font-bold text-slate-600">No biosensor data loaded</h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Execute the "Request Live Sync" button on your paired virtual smartwatch to log your current transdermal readings!
                </p>
              </div>
            ) : (
              <div className="h-60 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 12, right: 10, left: -22, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis 
                      dataKey="formattedDate" 
                      stroke="#cbd5e1" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#cbd5e1" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderRadius: '16px', 
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.05)'
                      }}
                      labelStyle={{ fontWeight: 'bold', fontSize: '11px', color: '#1e293b' }}
                      itemStyle={{ fontSize: '11px', color: '#7c3aed', padding: 0 }}
                    />
                    <ReferenceLine 
                      y={6.0} 
                      stroke="#f43f5e" 
                      strokeDasharray="4 4" 
                      label={{ 
                        value: 'Crystalline Limit (6.0)', 
                        position: 'top', 
                        fill: '#ef4444', 
                        fontSize: 9,
                        fontWeight: 'semibold'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      strokeWidth={3} 
                      activeDot={{ r: 6 }} 
                      dot={{ r: 4, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Section 2: Wearable Smartwatch Health Notifications (Alerts panel) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h3 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <Bell size={13} className="text-violet-500" />
              Biosensor Intelligence Notifications & Alerts
            </h3>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-2xl border flex items-start gap-3 text-xs leading-normal ${
                    alert.type === 'Critical' ? 'bg-rose-50/50 border-rose-100 text-rose-800' :
                    alert.type === 'Warning' ? 'bg-amber-50/50 border-amber-100 text-amber-800' :
                    'bg-slate-50/50 border-slate-100 text-slate-700'
                  }`}
                >
                  <ShieldAlert
                    className={`shrink-0 mt-0.5 ${
                      alert.type === 'Critical' ? 'text-rose-600' :
                      alert.type === 'Warning' ? 'text-amber-600' : 'text-slate-400'
                    }`}
                    size={15}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800">{alert.text}</p>
                    <span className="text-[9px] uppercase font-bold text-slate-400 mt-1 block">
                      Logged • {alert.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
