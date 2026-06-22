import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '10kb' }));
app.use(helmet());

// Configure CORS: allow only configured origin in production
const allowedOrigin = process.env.ALLOWED_ORIGIN || (process.env.NODE_ENV !== 'production' ? '*' : undefined);
if (allowedOrigin) {
  app.use(cors({ origin: allowedOrigin }));
}

// Basic rate limiter for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: Number(process.env.AI_RATE_LIMIT || 60), // limit per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Initialize Gemini SDK with recommended user agent settings and process environment
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Enforce basic API key (optional but recommended). Set APP_API_KEY in env to enable enforcement.
const APP_API_KEY = process.env.APP_API_KEY;
if (!APP_API_KEY && process.env.NODE_ENV === 'production') {
  console.error('APP_API_KEY not set in production. Exiting to avoid exposing AI endpoint.');
  process.exit(1);
} else if (!APP_API_KEY) {
  console.warn('APP_API_KEY not set. Running without API key enforcement (development only).');
}

// Health Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiEnabled: !!ai });
});

// helper: simple validator for analyzer output
function validateAnalyzedData(obj: any) {
  if (!obj || typeof obj !== 'object') return false;
  const { foodName, purineRating, ratingExplanation, uricAcidImpact, safetyTips, lowPurineAlternatives } = obj;
  if (typeof foodName !== 'string') return false;
  if (typeof purineRating !== 'string' || !['Safe', 'Moderate', 'High'].includes(purineRating)) return false;
  if (typeof ratingExplanation !== 'string') return false;
  if (typeof uricAcidImpact !== 'string') return false;
  if (!Array.isArray(safetyTips) || safetyTips.length < 1) return false;
  if (!Array.isArray(lowPurineAlternatives) || lowPurineAlternatives.length < 1) return false;
  return true;
}

// Apply rate limiter and simple API-key auth only for /api/gemini routes
app.use('/api/gemini', aiLimiter, (req, res, next) => {
  if (APP_API_KEY) {
    const provided = String(req.headers['x-app-api-key'] || '');
    if (!provided || provided !== APP_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
  next();
});

// Gout Food Purine Analysis Endpoint
app.post("/api/gemini/food-analysis", async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "AI service not configured" });
  }

  const { foodQuery } = req.body;
  if (!foodQuery || typeof foodQuery !== 'string' || foodQuery.trim().length === 0) {
    return res.status(400).json({ error: "Missing or invalid foodQuery parameter" });
  }

  // sanitize and limit input size
  const cleaned = String(foodQuery).replace(/\s+/g, ' ').replace(/["`<>]/g, '').trim().slice(0, 500);

  try {
    const prompt = `Analyze the food or meal or ingredients given: "${cleaned}". Rate its purine content, explain its uric acid impact on gout patients, supply safety tips and list safe low-purine alternatives.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert clinical dietician specializing in rheumatology and gout disease management. Provide accurate, evidence-based nutrition advice for gout prevention, identifying purine rich components and providing helpful guides. Focus on lifestyle and nutritional advice and avoid recommending prescription medications.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["foodName", "purineRating", "ratingExplanation", "uricAcidImpact", "safetyTips", "lowPurineAlternatives"],
          properties: {
            foodName: { type: Type.STRING },
            purineRating: { type: Type.STRING },
            ratingExplanation: { type: Type.STRING },
            uricAcidImpact: { type: Type.STRING },
            safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            lowPurineAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      console.error('Empty response from AI provider');
      return res.status(502).json({ error: 'AI provider returned an empty response' });
    }

    let analyzedData: any;
    try {
      analyzedData = JSON.parse(jsonText.trim());
    } catch (parseErr) {
      console.error('Failed parsing AI response as JSON:', parseErr);
      return res.status(502).json({ error: 'Invalid response format from AI provider' });
    }

    if (!validateAnalyzedData(analyzedData)) {
      console.error('AI response failed validation:', analyzedData);
      return res.status(502).json({ error: 'AI response did not match expected schema' });
    }

    // Return only the validated shape
    return res.json({
      foodName: String(analyzedData.foodName),
      purineRating: String(analyzedData.purineRating),
      ratingExplanation: String(analyzedData.ratingExplanation),
      uricAcidImpact: String(analyzedData.uricAcidImpact),
      safetyTips: Array.isArray(analyzedData.safetyTips) ? analyzedData.safetyTips.map(String) : [],
      lowPurineAlternatives: Array.isArray(analyzedData.lowPurineAlternatives) ? analyzedData.lowPurineAlternatives.map(String) : [],
    });

  } catch (error: any) {
    // Log full error server-side but return a generic message to clients
    console.error("Gemini food analysis error:", error);
    return res.status(500).json({ error: "Failed to analyze food. Please try again later." });
  }
});

// Simple chat endpoint used by the frontend AI coach. Forwards a user message and optional history
// to the Gemini SDK and returns a plain text reply and optional toolCalls array for skill execution.
app.post('/api/gemini/chat', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'AI service not configured' });
  }

  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid message' });
  }

  // Limit and sanitize input
  const cleaned = String(message).replace(/\s+/g, ' ').replace(/["`<>]/g, '').trim().slice(0, 1000);

  try {
    const prompt = `User: ${cleaned}\n` + (Array.isArray(history) ? `History: ${JSON.stringify(history.slice(-6))}\n` : '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an empathetic clinical gout care assistant. Answer concisely and when appropriate emit toolCalls as an array of { name, args } JSON after the textual reply.",
        responseMimeType: 'text/plain',
      },
    });

    const text = response.text || '';
    if (!text) {
      console.error('Empty chat response from AI provider');
      return res.status(502).json({ error: 'AI provider returned an empty response' });
    }

    // Naive extraction of toolCalls if the model appended a JSON block. Try to parse trailing JSON.
    let toolCalls: any[] = [];
    try {
      const trimmed = text.trim();
      // Look for a trailing JSON object/array after a separator
      const jsonStart = Math.max(trimmed.lastIndexOf('\n{'), trimmed.lastIndexOf('\n['));
      if (jsonStart !== -1) {
        const possible = trimmed.slice(jsonStart).trim();
        const parsed = JSON.parse(possible);
        if (Array.isArray(parsed)) toolCalls = parsed;
        else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.toolCalls)) toolCalls = parsed.toolCalls;
      }
    } catch (e) {
      // ignore parse errors — toolCalls will remain empty
    }

    return res.json({ text, toolCalls });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    return res.status(500).json({ error: 'Failed to process chat message' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Express v4 asset fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
