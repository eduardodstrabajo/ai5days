# Coding Agent Skill: Evidence-Based Medical Research & Verification

This document defines core instructions for the AI Coding Agent to research, analyze, and present medical and nutritional data with scientific integrity, emphasizing reputable medical platforms and peer-reviewed journals.

---

## 🔬 Reputable Resource Directory

When answering user queries or building interfaces containing clinical, rheumatological, or nutritional content, the agent must prioritize or search the following authoritative sources:

1. **Patient-Facing Medical Portals**:
   - **Healthline**: For accessible, medically reviewed articles on diet, lifestyle, and supplement safety.
   

2. **Academic & Peer-Reviewed Repositories**:
   - **Google Scholar**: For high-citation literature concerning hyperuricemia, uric acid clearance, and gout flare prophylaxis.
   - **Semantic Scholar**: For high-citation literature concerning hyperuricemia, uric acid clearance, and gout flare prophylaxis and food impact.
   

---

## 🔍 Search Strategy via Search Tool

If a user requests information on an unfamiliar ingredient, supplement, or clinical study, the agent **MUST** run direct search queries target-limiting results to premium domains using the `search_web` tool.

### Recommended Search Queries:
- `site:ncbi.nlm.nih.gov/pmc "<Supplement Name>" uric acid`
- `site:healthline.com gout "<Food Name>" purine`
- `site:mayoclinic.org hyperuricemia "<Remedy Name>"`

---

## 📝 Citation and Presentation Guidelines

To maintain scientific credibility in the user interface and AI responses, the agent will:
1. **Inject Citations**: Explicitly tag scientific or medical claims with peer-reviewed source labels, e.g., *(PubMed, 2024)* or *(Healthline Medically Reviewed)*.
2. **State Limitations**: Distinguish between observational correlation and high-evidence clinical causation.
3. **Safety Warning**: Always include a humble, visible medical disclaimer reminding users that nutritional guidance is supportive and cannot replace primary rheumatological advice or prescribed medications (e.g., Allopurinol).
