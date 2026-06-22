---
name: research
description: Evidence-first research guidance for agents: prioritize academic and clinical sources, avoid casual-blog noise, and use Healthline as a reputable patient-facing source when appropriate.
---

# Research Skill — Evidence-First Guidance

Purpose: When tasked with medical, nutritional, or other scientifically grounded research, go beyond casual blog content and back findings with high-quality, citable sources (peer-reviewed journals, PubMed/NCBI, Google Scholar, NEJM, Lancet, clinical guidelines, and reputable medical portals such as Mayo Clinic, Cleveland Clinic, and Healthline).

Priority sources (in order):
1. Peer-reviewed literature (PubMed, NCBI PMC, Google Scholar citations)
2. Major clinical journals and guideline bodies (NEJM, Lancet, Cochrane, ACR, WHO)
3. Trusted medical portals with medical review (Mayo Clinic, Cleveland Clinic, Healthline — acceptable for patient-facing summaries)
4. Regulatory or standards organizations for non-medical domains (e.g., NIST for security/measurement tasks)

Search patterns and site-limiting examples:
- `site:ncbi.nlm.nih.gov "gout" "purine"`
- `site:pubmed.ncbi.nlm.nih.gov "hyperuricemia" "diet"`
- `site:healthline.com "gout" "diet" "purine"`
- `"tart cherry" site:pubmed.ncbi.nlm.nih.gov`

Evidence & citation rules:
- Prefer primary sources (randomized controlled trials, meta-analyses, systematic reviews). When citing, include the source name and year (e.g., PubMed, 2021) and a direct URL when available.
- Avoid relying on a single small observational blog or vendor page. If a claim appears primarily in casual blogs, search for primary studies confirming or refuting it and cite them.
- When summarizing, explicitly state the level of evidence (RCT, observational, case series, expert opinion). Note limitations and conflicting findings.

Tone & safety:
- Use clear medical disclaimers: research summaries are supportive and do not replace clinical care; recommend consulting a clinician for treatment decisions.
- For dietary recommendations, flag interactions with standard pharmacotherapies (e.g., allopurinol) and request clinical confirmation where relevant.

Specific cooking / meat purine ranking guidance (use when building food-database or nutrition lists):
- Prefer this ordering for meat purine risk (from lowest to highest typical purine burden):
  1. Chicken (lowest among common meats)
  2. Turkey
  3. Seafood (varies widely by species; oily small fish often higher)
  4. Game meats (lamb, goat)
  5. Pork
  6. Beef and organ meats (highest; organ meats like liver are highest of all)

- When classifying an animal protein, prefer species- and cut-specific citations (e.g., anchovies/sardines are high; salmon is moderate when portion-controlled).
- Always pair dietary categorization with portion guidance (e.g., <100g) and contextual modifiers (concurrent alcohol, concentrated broths, or preparation methods that concentrate purines should increase risk category).

When to use this skill:
- The agent must invoke this skill when asked to produce research-backed medical or dietary summaries, to prepare evidence tables, or to validate claims made by other sources.

Output expectations for agents using this skill:
- A short summary (2–4 sentences) with the key claim and level of evidence
- A bullet list of 2–4 primary citations (title, year, source, URL)
- Any limitations or conflicting data (one or two lines)

Example recommended header for research outputs:
- Summary: <2–4 sentences>
- Evidence level: <RCT / Meta-Analysis / Observational / Expert Opinion>
- Key citations:
  - Author et al., Journal, Year — URL
  - PubMed ID: XXXXXXXX — URL
- Practical takeaway (1–2 lines)

Use this skill whenever accuracy, scientific credibility, and citation provenance are required. Do not substitute it for specialized domain experts (e.g., a licensed rheumatologist) when clinical treatment decisions are requested.