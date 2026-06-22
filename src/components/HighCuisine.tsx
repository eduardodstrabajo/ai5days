import React from 'react';

export default function HighCuisine() {
  const cookingBestPractices = [
    'Separate stocks for animal proteins and high-purine plant ingredients; do not share concentrated liquids.',
    'Use short-cook methods for proteins and finish with diluted vegetable broth rather than reduced glazes.',
    'Avoid prolonged reductions; dilute or discard concentrated stocks.',
    'Minimize acidic ingredients during cooking; add acids at plating when needed.',
    'Strain and discard poaching liquids if purine concentration is suspected.',
    'Trim skins, bones, and shells before cooking.',
    'Serve modest portions and pair with vitamin C–rich sides.',
  ];

  const spicePhGuidance = [
    'Ingredient pH: Citrus, vinegars, tomatoes, tamarind, and fermented condiments are acidic and lower dish pH.',
    'When avoiding acidity: favor fresh herbs (parsley, cilantro, basil) and warm aromatics (ginger, turmeric, cumin) over acidifying spice blends.',
    'Avoid combining multiple acidifiers in one reduction (e.g., sumac + vinegar + tamarind) — this amplifies acidity and can overly concentrate flavors; add acids at plating when possible.',
  ];

  const quickChecklist = [
    'Check and limit acidifying ingredients; prefer zest to juice.',
    'Keep separate stocks and discard concentrated reductions.',
    'Short-cook proteins; finish with fresh diluted broths.',
    'Use mild umami sources (roasted veg, diluted purées) instead of yeast extracts.',
    'Portion control and pair with vitamin C sides.',
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <h3 className="font-semibold text-lg mb-2">Cooking Best Practices (High Cuisine)</h3>
      <p className="text-xs text-slate-500 mb-4">Focused chef guidance to reduce purine concentration and unwanted acidity when preparing elevated cuisine for patients managing hyperuricemia or gout.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <section>
          <h4 className="font-semibold mb-2">Core Cooking Rules</h4>
          <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
            {cookingBestPractices.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="font-semibold mb-2">Spices & pH Guidance</h4>
          <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2">
            {spicePhGuidance.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="md:col-span-2">
          <h4 className="font-semibold mb-2">pH Measurement & Thresholds</h4>
          <p className="text-[13px] text-slate-600 mb-2">Use simple pH checks on cooking liquids to inform dilution/discard decisions. Recommended kitchen workflow and thresholds:</p>
          <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-2 mb-4">
            <li><strong>Tools:</strong> inexpensive pH test strips for quick checks or a calibrated handheld pH meter for repeated use.</li>
            <li><strong>When to measure:</strong> measure stocks after simmering and again after any reduction step (before finishing the sauce).</li>
            <li><strong>Threshold guidance:</strong> aim for finishing cooking liquids with pH &gt;= 6.0 when minimizing acidity is desired. If a stock or reduction reads &lt;= 5.5, dilute with fresh vegetable broth or discard the concentrated fraction and remake with a lighter stock.</li>
            <li><strong>Calibration & care:</strong> if using a digital meter, calibrate daily with standard buffers and rinse probes between samples to avoid cross-contamination.</li>
            <li><strong>Caveat:</strong> pH thresholds are operational kitchen guidance based on food chemistry principles — not a clinical prescription. Consult a dietitian for patient-specific clinical advice.</li>
          </ul>

          <h4 className="font-semibold mb-2">Chef Quick Checklist</h4>
          <ol className="list-decimal pl-5 text-[13px] text-slate-600 space-y-2">
            {quickChecklist.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-4 text-xs text-slate-500">Skill file: .agents/skills/high-cuisine-cooking-best-practices/SKILL.md — use for SOP copy-paste. These are culinary strategies, not medical advice.</div>
    </div>
  );
}
