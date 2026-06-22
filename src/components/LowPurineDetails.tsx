import React from 'react';

export default function LowPurineDetails() {
  const highlights = [
    'Definition: Foods with low purine content (typically <50 mg/100g) that rarely raise serum urate.',
    'Clinical role: Daily staples for maintenance and flare prevention when paired with hydration and vitamin C intake.',
    'Typical examples: cherries, cucumbers, skim milk, eggs, most fruits, brown rice, low‑fat dairy, and many nuts/seeds in small portions.',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <h3 className="font-semibold text-lg mb-2">Low-Purine Foods — Safe Daily Choices</h3>
      <p className="text-xs text-slate-500 mb-4">Low-purine foods are appropriate for everyday meals and maintenance phases. They support renal clearance and reduce risk of crystal formation when eaten consistently.</p>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Why these matter</h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Practical serving suggestions</h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          <li>Fresh tart cherries or berries — 1 cup daily; use frozen if fresh unavailable.</li>
          <li>Low‑fat yogurt / skim milk — 150–250 g per serving; choose unsweetened options.</li>
          <li>Eggs — 1 per day as a safe protein source (negligible purines).</li>
          <li>Whole grains (brown rice, quinoa) — 1 serving (30–50 g cooked carbs) as carbohydrate base.</li>
          <li>Nuts & seeds — 1–2 tbsp; keep portions small to avoid caloric excess.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Preparation & pairing tips</h4>
        <p className="text-[13px] text-slate-600">Pair low‑purine mains with vitamin C–rich sides (lemon, berries) to support uricosuria. Avoid adding sugar or high‑fructose syrups which can negate benefits. Prioritize water intake throughout the day.</p>
      </section>

      <section>
        <h4 className="font-semibold mb-2">Evidence & notes</h4>
        <p className="text-[13px] text-slate-600">These recommendations are supported by patient‑facing guidelines and primary studies (e.g., PubMed reviews and Mayo Clinic summaries). Use as maintenance‑phase staples; discuss personalized plans with a clinician.</p>
      </section>

      <div className="mt-4 text-xs text-slate-500">Sources: PubMed, Mayo Clinic, Healthline (medically reviewed).</div>
    </div>
  );
}
