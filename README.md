<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6f7f7274-9175-4329-873d-002c730aa9ee

## Run Locally

**Prerequisites:** Node.js (v18+ recommended) and npm

1. Install dependencies:
   `npm install`

2. Configure secrets (do NOT commit):
   - Create `.env.local` at the project root and add:
     ```bash
     OPENROUTER_API_KEY="sk-or-..."
     # optional: OPENROUTER_MODEL="gpt-4o-mini"
     ```
   - Alternatively, provide the key temporarily when starting the server (safer for quick tests):
     ```bash
     OPENROUTER_API_KEY="sk-or-..." npm run dev
     ```

3. Run the dev server:
   - Normal: `npm run dev`
   - With temporary key: `OPENROUTER_API_KEY="sk-or-..." npm run dev`

4. Restarting / stopping the dev server:
   - Find PID using the port: `lsof -ti tcp:3000`
   - Stop it: `kill <PID>`
   - Restart with the commands above.

5. Production build and start:
   ```bash
   npm run build
   npm run start
   ```

6. Health check and smoke tests:
   - Health: `curl -sS http://localhost:3000/api/health`
   - Chat endpoint (quick test):
     ```bash
     curl -sS -X POST http://localhost:3000/api/gemini/chat -H 'Content-Type: application/json' -d '{"message":"Hello","history":[]}'
     ```

7. Troubleshooting tips:
   - If `aiEnabled` is false in /api/health, ensure `OPENROUTER_API_KEY` is set.
   - If port 3000 is in use, kill the process shown by `lsof -ti tcp:3000`.
   - For model response/parsing issues, check `OPENROUTER_MODEL` and review server logs.

Security note: Never commit API keys or secrets to the repository. Use environment variables or your deployment provider's secret store.


