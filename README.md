# Managing_gout_with_ai

Managing_gout_with_ai provides culinary best practices, dietary guidance, and tools to help chefs, dietitians, and patients adapt recipes and meal plans for managing hyperuricemia and gout. The repository contains chef-facing skills, educational modules, and a small development web app. Content is informational and not a substitute for professional medical advice.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and fill in secrets (do NOT commit `.env.local`):
   - GEMINI_API_KEY (required)
   - APP_API_KEY (required in production)
   - ALLOWED_ORIGIN (production CORS origin)
   - NODE_ENV (development or production)
   - PORT (optional)

   To set secrets for GitHub Actions / production, add them under the repository Settings -> Secrets.

3. Run the app locally:
   `npm run dev`
