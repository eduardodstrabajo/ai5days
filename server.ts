import express from "express";
import path from "path";
import dotenv from "dotenv";
import { OpenRouter } from '@openrouter/agent';
import { Type, FunctionDeclaration } from "@google/genai"; // keep Type defs used earlier for schema shapes
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

app.use(express.json());

// Security headers and dev/proxy compatibility fixes.
// PROXY_HOST can be set via env when running behind a proxy (Kaggle, Codespaces, etc.)
const PROXY_HOST = process.env.ADK_PROXY_HOST || process.env.ADK_PROXY_HOSTNAME || 'https://kkb-production.jupyter-proxy.kaggle.net';
app.use((req, res, next) => {
  // Conservative CSP that allows the proxy host for images, scripts, and connections.
  const cspParts = [
    "default-src 'self'",
    `img-src 'self' data: ${PROXY_HOST}`,
    `connect-src 'self' ${PROXY_HOST} wss:`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${PROXY_HOST}`,
    `style-src 'self' 'unsafe-inline' ${PROXY_HOST}`,
  ];
  try { res.setHeader('Content-Security-Policy', cspParts.join('; ')); } catch (_) {}

  // Ensure Vite dev module routes are served with correct JS MIME type when proxied
  const p = (req.path || req.url || '').toString();
  if (p.startsWith('/@vite/') || p.startsWith('/@react-refresh') || p.endsWith('.js') || /\/src\/.*\.(js|ts|tsx)$/.test(p)) {
    try { res.setHeader('Content-Type', 'application/javascript; charset=utf-8'); } catch (_) {}
  }
  next();
});

// OpenRouter Agent SDK configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY || null;

// Helper: redact sensitive values when logging or returning errors
const redactSensitive = (v: any) => {
  if (typeof v !== 'string') return v;
  // redact OpenRouter-style keys (sk-... ) and long JWT-like tokens
  return v
    .replace(/Bearer\s+\S+/gi, 'Bearer <REDACTED>')
    .replace(/sk-[A-Za-z0-9._-]{8,}/g, '<REDACTED_KEY>')
    .replace(/[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, '<REDACTED_JWT>')
    .replace(/([A-Za-z0-9-_=]{30,})/g, '<REDACTED_TOKEN>');
};

const maskPathToken = (p: string) => {
  if (typeof p !== 'string') return p;
  // mask token segment in /k/{kernel}/{token}/...
  return p.replace(/(\/k\/[^/]+\/)[^/]+(\/|$)/, (m, g1, g2) => `${g1}<REDACTED_TOKEN>${g2}`);
};
// Default to the requested OSS GPT-120B model alias; can be overridden with OPENROUTER_MODEL
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-oss-120b:free';

let openrouterClient: any = null;
if (!OPENROUTER_API_KEY) {
  console.warn('OPENROUTER_API_KEY is not set. Agent endpoints will return an error until configured.');
} else {
// Initialize client with the key, then remove it from process.env to reduce accidental leakage.
console.log('OpenRouter API key detected. Using model:', OPENROUTER_MODEL);
openrouterClient = new OpenRouter({ apiKey: OPENROUTER_API_KEY });
try {
  // Remove sensitive env vars from process.env to avoid accidental exposure in child processes or templates
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.OPENROUTER_KEY;
} catch (_) {}
}

// AI Gout Care Coach Skill function declarations
const logWaterDecl: FunctionDeclaration = {
  name: 'log-water',
  description: 'Log the amount of water drunk in milliliters.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      amount: {
        type: Type.NUMBER,
        description: 'Water quantity in ml (e.g. 250, 350, 500).'
      }
    },
    required: ['amount']
  }
};

const addNaturalFoodDecl: FunctionDeclaration = {
  name: 'add-natural-food',
  description: 'Add an anti-inflammatory superfood to the natural foods watchlist.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: 'The name of the superfood (e.g. Tart Cherry, Celery Seed, Lemon Juice, Ginger Tea).'
      },
      servingSize: {
        type: Type.STRING,
        description: 'Example: "30-50ml (diluted)", "1 portion (approx 100g)".'
      },
      frequency: {
        type: Type.STRING,
        description: 'Frequency of intake. Example: "Daily", "Weekly", "Twice Daily".'
      },
      category: {
        type: Type.STRING,
        description: 'Select exactly one: "Fruit", "Vegetable", "Beverage", "Dairy", "Herbal/Seasoning", "Other".'
      },
      mechanism: {
        type: Type.STRING,
        description: 'Biomedical reason why it helps lower uric acid or relieve joint strain.'
      },
      notes: {
        type: Type.STRING,
        description: 'Any personal notes.'
      }
    },
    required: ['name', 'category']
  }
};

const logUaDecl: FunctionDeclaration = {
  name: 'log-ua',
  description: 'Log a uric acid blood test reading.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      value: {
        type: Type.NUMBER,
        description: 'The uric acid value in mg/dL (e.g., 5.8).'
      },
      date: {
        type: Type.STRING,
        description: 'Date in YYYY-MM-DD format. Default is today.'
      },
      notes: {
        type: Type.STRING,
        description: 'Notes on fasting, labs, etc.'
      }
    },
    required: ['value']
  }
};

const addFlareDecl: FunctionDeclaration = {
  name: 'add-flare',
  description: 'Log an active flare outbreak in a specific joint with pain intensity.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      joint: {
        type: Type.STRING,
        description: 'The affected body joint (e.g. Left Big Toe, Right Knee, Left Ankle).'
      },
      painLevel: {
        type: Type.NUMBER,
        description: 'Pain scale level from 1 (mild stiffness) to 10 (excruciating pain).'
      },
      startDate: {
        type: Type.STRING,
        description: 'Date in YYYY-MM-DD format.'
      },
      triggers: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Suspected nutrition/event triggers (e.g. seafood, beef, stress, dehydration).'
      },
      remediesTaken: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Remedies or supplements taken (e.g. cherry extract, cold compress, extra hydration).'
      },
      notes: {
        type: Type.STRING,
        description: 'Detailed symptom log.'
      }
    },
    required: ['joint', 'painLevel']
  }
};

const resolveFlareDecl: FunctionDeclaration = {
  name: 'resolve-flare',
  description: 'Mark the active joint flare as completely resolved/healed.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: {
        type: Type.STRING,
        description: 'Optional ID of the flare log to resolve. If omitted, resolves the current active flare.'
      }
    }
  }
};

const addExerciseDecl: FunctionDeclaration = {
  name: 'add-exercise',
  description: 'Record a low-impact or metabolic exercise session.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      activityType: {
        type: Type.STRING,
        description: 'Type of exercise (e.g., "Walking", "Cycling", "Swimming", "Stretching/Yoga", "Calisthenics").'
      },
      duration: {
        type: Type.NUMBER,
        description: 'Duration of exercise in minutes.'
      },
      jointStrain: {
        type: Type.NUMBER,
        description: 'Joint load level from 1 (zero strain) to 10 (heavy load).'
      },
      remissionPhase: {
        type: Type.BOOLEAN,
        description: 'Whether patient is in remission phase (true) or flare phase (false).'
      },
      date: {
        type: Type.STRING,
        description: 'Date in YYYY-MM-DD format.'
      },
      notes: {
        type: Type.STRING,
        description: 'Post-workout feedback or feeling.'
      }
    },
    required: ['activityType', 'duration']
  }
};

const addSleepDecl: FunctionDeclaration = {
  name: 'add-sleep',
  description: 'Log sleep duration and quality metrics.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      hours: {
        type: Type.NUMBER,
        description: 'Amount of sleep hours (e.g. 7.5)'
      },
      quality: {
        type: Type.STRING,
        description: 'Quality level like "Excellent", "Good", "Fair", "Poor".'
      },
      restlessJoints: {
        type: Type.BOOLEAN,
        description: 'Whether any joint pain interrupted or bothered sleep.'
      },
      meditationCompleted: {
        type: Type.BOOLEAN,
        description: 'Whether bedtime mindfulness/meditation was completed.'
      },
      date: {
        type: Type.STRING,
        description: 'Date in YYYY-MM-DD format.'
      }
    },
    required: ['hours']
  }
};

// Health Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiEnabled: !!OPENROUTER_API_KEY });
});

// Gout AI Coach Conversational Endpoint (now using OpenRouter Agent SDK)
app.post("/api/gemini/chat", async (req, res) => {
  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "OpenRouter API key is not configured. Please add OPENROUTER_API_KEY to your project Secrets." });
  }

  const { message, history } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: "Missing message parameter" });
  }

  try {
    // Build messages for the Agent SDK: include system instruction that requests JSON output
    const systemInstruction = `You are Gemi Coach, an empathetic expert rheumatologist assistant and Gout Care Coach. Provide evidence-backed guidance (PubMed, Mayo Clinic, Healthline). DO NOT perform any remote side-effects. If you want the app to perform an action, respond with a JSON object with two keys: \"text\" (string reply to user) and \"toolCalls\" (an array of objects {name:string,args:object}). If no tool calls are requested, toolCalls should be an empty array. Be concise.`;

    const messages = [
      { role: 'system', content: systemInstruction },
      // include last few turns from history to preserve context
      ...(Array.isArray(history) ? history.slice(-6).map((h: any) => ({ role: h.role === 'model' ? 'assistant' : 'user', content: h.text })) : []),
      { role: 'user', content: message },
    ];

    if (!openrouterClient) throw new Error('OpenRouter client not initialized');
    // Convert chat-style messages to OpenRouter input format
    const { fromChatMessages } = await import('@openrouter/agent');
    const input = fromChatMessages(messages as any);
    const result = await openrouterClient.callModel({
      model: OPENROUTER_MODEL,
      input,
    });

    // Prefer getText() if available, otherwise use direct text
    let botText = '';
    if (result && typeof (result as any).getText === 'function') {
      botText = await (result as any).getText();
    } else if (result && (result as any).text) {
      botText = (result as any).text;
    } else if (Array.isArray((result as any).output) && (result as any).output[0]) {
      botText = (result as any).output[0].content || '';
    }

    // Expect model to return JSON as instructed. Try parsing, with tolerant JSON extraction.
    const extractJSON = (s: string) => {
      if (!s || typeof s !== 'string') return null;
      // Try direct parse
      try { return JSON.parse(s); } catch (_) {}
      // Find first JSON object or array substring
      const objMatch = s.match(/\{[\s\S]*\}/);
      const arrMatch = s.match(/\[[\s\S]*\]/);
      try {
        if (objMatch) return JSON.parse(objMatch[0]);
        if (arrMatch) return JSON.parse(arrMatch[0]);
      } catch (_) {}
      return null;
    };

    let parsed: any = extractJSON(botText) || { text: botText, toolCalls: [] };

    return res.json({ text: parsed.text || '', toolCalls: parsed.toolCalls || [] });
  } catch (error: any) {
    console.error("Agent chat error:", error);
    // If OpenRouter returned structured validation info, include it for debugging
    let details = (error && (error.rawValue?.body$ || error.rawMessage || error.message)) || String(error);
    details = redactSensitive(details);
    console.error("Agent chat error:", redactSensitive(error));
    return res.status(500).json({ error: `Failed to process coach chat. ${details}` });
  }
});

// Gout Food Purine Analysis Endpoint (OpenRouter)
app.post("/api/gemini/food-analysis", async (req, res) => {
  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "OpenRouter API key is not configured. Please add OPENROUTER_API_KEY to your project Secrets." });
  }

  const { foodQuery } = req.body;
  if (!foodQuery || typeof foodQuery !== 'string' || foodQuery.trim().length === 0) {
    return res.status(400).json({ error: "Missing foodQuery parameter" });
  }

  try {
    const systemInstruction = `You are an expert clinical dietician specializing in rheumatology and gout disease management. Provide accurate, evidence-based nutrition advice. Output a single JSON object matching this shape: { foodName: string, purineRating: 'Safe'|'Moderate'|'High', ratingExplanation: string, uricAcidImpact: string, safetyTips: string[3], lowPurineAlternatives: string[3] }. Do not include any extraneous text.`;

    const messages = [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: `Analyze: "${foodQuery}"` },
    ];

    if (!openrouterClient) throw new Error('OpenRouter client not initialized');
    const { fromChatMessages } = await import('@openrouter/agent');
    const input = fromChatMessages(messages as any);
    const result = await openrouterClient.callModel({ model: OPENROUTER_MODEL, input });

    let jsonText = '';
    if (result && typeof (result as any).getText === 'function') {
      jsonText = await (result as any).getText();
    } else if (result && (result as any).text) {
      jsonText = (result as any).text;
    } else if (Array.isArray((result as any).output) && (result as any).output[0]) {
      jsonText = (result as any).output[0].content || '';
    }

    if (!jsonText) throw new Error('Empty response from model');

    // Tolerant JSON extraction for model output
    const extractJSON = (s: string) => {
      if (!s || typeof s !== 'string') return null;
      try { return JSON.parse(s); } catch (_) {}
      const objMatch = s.match(/\{[\s\S]*\}/);
      const arrMatch = s.match(/\[[\s\S]*\]/);
      try {
        if (objMatch) return JSON.parse(objMatch[0]);
        if (arrMatch) return JSON.parse(arrMatch[0]);
      } catch (_) {}
      return null;
    };

    const analyzedData = extractJSON(jsonText.trim());
    if (!analyzedData) throw new Error('Model returned non-JSON response');
    return res.json(analyzedData);
  } catch (error: any) {
    console.error("Food analysis error:", redactSensitive(error));
    let details = (error && (error.rawValue?.body$ || error.rawMessage || error.message)) || String(error);
    details = redactSensitive(details);
    return res.status(500).json({ error: `Failed to analyze food. ${details}` });
  }
});

async function startServer() {
  // Allow configuring a base path when the app is served behind a proxy (e.g. Kaggle proxy)
  // Example: DEV_BASE_PATH="/k/<kernel>/<token>/proxy/proxy/8000"
  const basePath = process.env.DEV_BASE_PATH || process.env.BASE_PATH || '/';

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      base: basePath,
    });

    // If serving under a non-root base path, ensure express mounts the vite middleware at that path
    if (basePath !== '/' && basePath.endsWith('/')) {
      // Strip trailing slash for mounting
      const mountPath = basePath.slice(0, -1);
      app.use(mountPath, (req, res, next) => vite.middlewares(req, res, next));
    } else if (basePath !== '/') {
      app.use(basePath, (req, res, next) => vite.middlewares(req, res, next));
    } else {
      app.use(vite.middlewares);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    if (basePath !== '/' && basePath.endsWith('/')) {
      const mountPath = basePath.slice(0, -1);
      app.use(mountPath, express.static(distPath));

      // Serve index.html for client-side routing under the base path
      app.get(`${mountPath}/*`, (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else if (basePath !== '/') {
      app.use(basePath, express.static(distPath));
      app.get(`${basePath}/*`, (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  // Mask basePath in logs to avoid leaking tokens if the basePath contains a kernel token
  const loggedBase = basePath && basePath.includes('/k/') ? maskPathToken(basePath) : basePath;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} (base: ${loggedBase})`);
  });
}

startServer();
