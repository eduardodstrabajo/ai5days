import React from 'react';

export default function HighPurineDetails() {
  const cautions = [
    'Definition: High-purine foods (>150 mg/100g) or foods that metabolically raise uric acid (e.g., high-fructose beverages).',
    'Clinical role: Typically avoid during active flares and limit during maintenance phases; these items most commonly trigger acute attacks.',
    'Common high-risk categories include organ meats, small oily fish, certain shellfish, beer, and concentrated yeast extracts.',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <h3 className="font-semibold text-lg mb-2">High-Purine Foods — Avoid or Minimize</h3>
      <p className="text-xs text-slate-500 mb-4">High-purine foods and metabolically active items are the likeliest dietary triggers for acute gout flares or rising serum urate. Limit these strictly, especially while uric acid remains above goal.</p>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Why to avoid</h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          {cautions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Common high-purine examples</h4>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
          <li>Organ meats (liver, kidneys, sweetbreads), anchovies, sardines, herring, mackerel, mussels, and scallops.</li>
          <li>Beer and alcoholic beverages — impair renal uric excretion and can rapidly elevate serum urate.</li>
          <li>High-fructose drinks and processed syrups — trigger hepatic purine synthesis from ATP breakdown.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold mb-2">Cooking & substitution strategies</h4>
        <p className="text-[13px] text-slate-600">When preparing meals, discard concentrated poaching liquids and avoid long reductions that concentrate purines. Substitute with eggs, tofu, low‑fat dairy, or plant proteins. If craving seafood, pick lower‑purine white fish and limit portion to &lt;75 g and avoid oily small fish.</p>
      </section>

      <section>
        <h4 className="font-semibold mb-2">Evidence & clinical note</h4>
        <p className="text-[13px] text-slate-600">Recommendations are based on clinical nutrition reviews and consensus guidance. High‑purine items are strongly associated with gout flares in multiple observational and clinical studies — consult your clinician for individualized advice.</p>
      </section>

      <div className="mt-4 text-xs text-slate-500">Sources: PubMed, Mayo Clinic, Cleveland Clinic. Discuss clinical treatment with a rheumatologist.</div>
    </div>
  );
}
