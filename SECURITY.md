Security and Deployment Notes

This file documents required environment variables, recommended production hardening steps, and how to run dependency audits locally and in CI.

Required environment variables
- GEMINI_API_KEY: (required) API key for the Gemini/GenAI provider. Keep in secret manager; do NOT commit to repo.
- APP_API_KEY: (recommended, required in production) A server-side API key used to authenticate requests to sensitive endpoints. Set as an env var and provide to clients via secure channels.
- ALLOWED_ORIGIN: Allowed CORS origin for production (e.g., https://app.example.com). If unset in development, CORS allows all origins.

Server hardening (already applied)
- Helmet for secure HTTP headers
- express-rate-limit applied to /api/gemini routes
- CORS restricted via ALLOWED_ORIGIN
- Input sanitization and length limits for user-provided queries
- JSON response validation for AI provider responses
- Generic error messages returned to clients; full errors logged server-side

Local audit (developer)
1. Install dependencies (prefer CI or isolated environment):
   npm ci

2. Run npm audit and review results:
   npm audit --json > audit.json
   cat audit.json | jq '.'

3. If vulnerabilities are found, run:
   npm audit fix
   Re-run `npm audit` and evaluate remaining advisories.

CI / GitHub
- A GitHub Actions workflow (.github/workflows/security-audit.yml) runs `npm ci` and `npm audit --audit-level=high` on push and weekly. The job fails on findings with severity >= high.
- Dependabot is enabled (.github/dependabot.yml) to open weekly PRs for dependency updates.

Production checklist
- Ensure APP_API_KEY, GEMINI_API_KEY, and ALLOWED_ORIGIN are set in the environment or secrets manager.
- Configure monitoring/alerts for error rates and unusual AI endpoint activity.
- Rotate GEMINI_API_KEY regularly and restrict its permissions where possible.
- Use a secrets manager (e.g., AWS Secrets Manager, GitHub Secrets) and do not store secrets in repository.

If you want, I can:
- Run a local `npm audit` here (may be resource-heavy) and report results.
- Add a GitHub Action that files an issue or Slack notification when new high/critical advisories are found.
- Implement logging redaction and structured logging. 
