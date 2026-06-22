import React from 'react';

export default function ModeratePurineDetails() {
  const guidance = [
    'Definition: Foods with moderate purine levels (≈50–150 mg/100g); risk depends on portion and preparation.',
    'Clinical role: Safe when portion‑controlled and paired with low‑purine sides and hydration.',
    'Examples: Salmon (small portions), chicken breast, legumes, mushrooms, oatmeal, and tofu.',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <h3 className="font-semibold text-lg mb-2">Moderate-Purine Foods — Use with Caution</h3>
      <p className="text-xs text-slate-500 mb-4">Moderate-purine items can be included in balanced diets but require attention to portion size, frequency, and cooking method to avoid serum uric acid spikes.</p>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Practical guidance</h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          {guidance.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Portion & frequency examples</h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          <li>Fatty fish (salmon, tuna): 1 small serving (75–100 g) once weekly; prefer grilling/steaming over frying.</li>
          <li>Chicken breast: 75–100 g portions; skinless breast has lower purine burden than dark cuts.</li>
          <li>Legumes & tofu: include regularly as plant protein — plant purines show limited association with flares.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Cooking & pairing tips</h4>
        <p className="text-[13px] text-slate-600">Avoid concentrated broths, long reductions, or gravies that concentrate purines. Add vitamin C–rich sides (lemon, bell peppers) and hydrate well when consuming moderate items.</p>
      </section>

      <section>
        <h4 className="font-semibold mb-2">Evidence & notes</h4>
        <p className="text-[13px] text-slate-600">Large epidemiological studies indicate that plant-based purines are less likely to increase gout risk than animal purines. Maintain moderation and consult a clinician if uncertain.</p>
      </section>

      <div className="mt-4 text-xs text-slate-500">Sources: PubMed systematic reviews, Healthline, Cleveland Clinic.</div>
    </div>
  );
}
