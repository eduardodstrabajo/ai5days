import React, { useState } from 'react';
import { SymptomLog } from '../types';

interface Props {
  symptoms: SymptomLog[];
  onAddSymptom: (log: Omit<SymptomLog, 'id'>) => void;
  onDeleteSymptom: (id: string) => void;
}

export default function Symptoms({ symptoms, onAddSymptom, onDeleteSymptom }: Props) {
  const [text, setText] = useState('');
  const [severity, setSeverity] = useState(3);
  const today = new Date().toISOString().split('T')[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddSymptom({ date: today, symptom: text.trim(), severity, notes: '' });
    setText('');
    setSeverity(3);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <h3 className="font-semibold text-lg mb-3">Symptoms Journal</h3>
      <div className="text-xs text-slate-500 mb-4 space-y-2">
        <div>
          Typical symptoms: sudden, intense joint pain (often the big toe), swelling, warmth, redness, and reduced range of motion. Attacks often peak quickly and may last 1–2 weeks if untreated.
        </div>
        <div>
          Common sites: big toe (podagra), ankles, knees, wrists, fingers; long-standing disease can form tophi (hard lumps).
        </div>
        <div>
          Red flags: high fever, worsening pain despite treatment, or systemic illness—seek urgent medical care (possible joint infection).
        </div>
        <div>
          What to record: onset/time, location, severity (1–10), duration, possible triggers (food, alcohol, dehydration, injury), medications taken and response, and photos if helpful.
        </div>
        <div className="text-[11px] text-slate-400">Sources: NHS, Healthline.</div>
      </div>

      <form onSubmit={submit} className="flex gap-2 items-center mb-4">
        <input
          className="flex-1 border rounded-xl px-3 py-2 text-sm"
          placeholder="Describe symptom (e.g., Left big toe throbbing)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select value={severity} onChange={(e) => setSeverity(Number(e.target.value))} className="border rounded-xl px-2 py-2 text-sm">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded-xl text-sm">Add</button>
      </form>

      <div className="space-y-3">
        {symptoms.length === 0 ? (
          <div className="text-xs text-slate-400">No symptoms recorded yet.</div>
        ) : (
          symptoms.map((s) => (
            <div key={s.id} className="flex items-start justify-between p-3 rounded-2xl border bg-slate-50">
              <div>
                <div className="text-sm font-semibold">{s.symptom}</div>
                <div className="text-[11px] text-slate-500">{s.date} • Severity {s.severity}/10</div>
                {s.notes && <div className="text-[11px] mt-1 text-slate-600">{s.notes}</div>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => onDeleteSymptom(s.id)} className="text-xs text-rose-600">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
