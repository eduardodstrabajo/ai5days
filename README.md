<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6f7f7274-9175-4329-873d-002c730aa9ee

## Run Locally

Prerequisites
- Node.js v18+ and npm installed
- (Optional) curl and jq for testing

1) Install dependencies
- npm install

2) Configure secrets (do NOT commit)
- Create a local .env at the project root (this repo's .gitignore excludes .env):

  ```bash
  # .env (local only, do not commit)
  OPENROUTER_API_KEY=sk-your-real-key
  # Optional: override model
  # OPENROUTER_MODEL=openai/gpt-oss-120b:free
  # Optional: change server port
  # PORT=8000
  ```

- Instead of editing files, export the key for a single run (safer):
  ```bash
  export OPENROUTER_API_KEY="sk-your-real-key"
  npm run dev
  ```

3) Start the dev server
- Default: npm run dev
- With temporary env (single command): OPENROUTER_API_KEY="sk-..." npm run dev
- The server listens on PORT (env) or 8000 by default.

4) Terminating the app (full steps)

- If running in foreground (attached):
  - Stop with Ctrl+C in the terminal where `npm run dev` is running.

- Graceful shutdown by PID (recommended):
  ```bash
  # find the PID(s) for the dev server
  ps aux | grep "tsx server.ts" | grep -v grep
  # or by node/tsx processes
  ps aux | grep node | grep -v grep

  # send TERM to allow cleanup
  kill <PID>
  ```

- Find and stop by port (useful if you don't know the PID):
  ```bash
  # requires lsof (or use ss/netstat)
  lsof -iTCP:8000 -sTCP:LISTEN -Pn -t   # prints PID(s)
  kill <PID>

  # alternative: using ss
  ss -ltnp | grep ":8000"
  ```

- If the process does not exit after TERM, force kill:
  ```bash
  kill -9 <PID>
  ```
  (Only use SIGKILL when necessary.)

- WebSocket or auxiliary ports (example 24678):
  ```bash
  lsof -iTCP:24678 -sTCP:LISTEN -Pn -t || ss -ltnp | grep ":24678"
  ```

- Verify the server is stopped:
  ```bash
  # should fail / return no listener
  lsof -iTCP:8000 -sTCP:LISTEN -Pn || ss -ltnp | grep ":8000" || true
  # and HTTP should not respond
  curl -sS http://localhost:8000/api/health || echo "server not responding"
  ```

- Notes & tips
  - Prefer `kill <PID>` (SIGTERM) to allow graceful cleanup. Use `kill -9` only when necessary.
  - If you started the server via a process manager (systemd, pm2, Docker), stop it with the manager (e.g., `systemctl stop <service>`, `pm2 stop <name>`, `docker stop <container>`).
  - Remove temporary logs if desired: `rm -f /tmp/dev_server_run.log`.
  - If running inside a Codespace or remote container, ensure you have permission to kill the process (the user shown by `ps aux` will own the PID).

- Restarting after stop:
  ```bash
  npm run dev
  ```

5) Health check and quick API tests
- Health: curl -sS http://localhost:8000/api/health | jq
  Expect: {"status":"ok","aiEnabled":true} when OPENROUTER_API_KEY is set.

- Simple chat test (server-side proxy):
  ```bash
  curl -sS -X POST http://localhost:8000/api/gemini/chat \
   -H 'Content-Type: application/json' \
   -d '{"message":"Hello","history":[]}'
  ```

- Stream directly with OpenRouter (curl example):
  ```bash
  curl -N https://openrouter.ai/api/v1/chat/completions \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $OPENROUTER_API_KEY" \
   -d '{\n      "model": "openai/gpt-oss-120b:free",\n      "stream": true,\n      "messages": [{"role":"user","content":"Hello"}]\n    }'
  ```

6) Removing keys / safety
- To remove a local key, delete or sanitize .env (`rm .env` or replace value with placeholder). .env is ignored by git by default.
- Verify .env is not tracked: git ls-files --error-unmatch .env || echo ".env not tracked"
- If a secret is accidentally committed, rotate the key immediately and remove it from git history (contact the maintainer for help).

7) Production build
- npm run build
- npm run start

Troubleshooting
- "Missing Authentication header" -> OPENROUTER_API_KEY missing or malformed; ensure no surrounding quotes in some shells and restart server after changes.
- If aiEnabled remains false, confirm the running process can read the env var (restart after editing .env).
- Check server logs for detailed errors: look for "Agent chat error" or stack traces in the logs.

Security reminder: Never store real API keys in the repository. Use deployment secret stores (GitHub Actions secrets, cloud secret manager) for production deployments.


