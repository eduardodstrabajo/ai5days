import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
  res.json({ status: "ok", aiEnabled: !!ai });
});

// Gout AI Coach Conversational & Function Execution Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your project Secrets.",
    });
  }

  const { message, history } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: "Missing message parameter" });
  }

  try {
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }],
    }));

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      history: formattedHistory,
      config: {
        systemInstruction: "You are Gemi Coach, an empathetic expert rheumatologist assistant and Gout Care Coach. Gout patients will chat with you about joint pain flareups, diet, sleep, and indicators. You support them with lifestyle advice (hydration, low-purine and moderate-purine intakes, sleeping guidelines, natural wellness superfoods) as detailed by publications (Mayo Clinic, PubMed, Healthline evidence reviews). Offer to log these parameters easily using the appropriate tools at your disposal whenever they describe making these actions (e.g., drinks 250ml water, records a uric acid of 5.8, starts or resolves a big toe flare, logs sleep hours, completes exercise, etc.). Always return supportive feedback alongside any tool execution.",
        tools: [{
          functionDeclarations: [
            logWaterDecl,
            addNaturalFoodDecl,
            logUaDecl,
            addFlareDecl,
            resolveFlareDecl,
            addExerciseDecl,
            addSleepDecl
          ]
        }]
      }
    });

    const response = await chat.sendMessage({ message });
    const botText = response.text || "";
    const toolCalls = response.functionCalls?.map((f: any) => ({
      name: f.name,
      args: f.args,
    })) || [];

    return res.json({
      text: botText,
      toolCalls: toolCalls
    });
  } catch (error: any) {
    console.error("Gemini Coach Chat error:", error);
    return res.status(500).json({
      error: "Failed to process coach chat. " + (error instanceof Error ? error.message : String(error)),
    });
  }
});

// Gout Food Purine Analysis Endpoint
app.post("/api/gemini/food-analysis", async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your project Secrets.",
    });
  }

  const { foodQuery } = req.body;
  if (!foodQuery || typeof foodQuery !== 'string' || foodQuery.trim().length === 0) {
    return res.status(400).json({ error: "Missing foodQuery parameter" });
  }

  try {
    const prompt = `Analyze the food or meal or ingredients given: "${foodQuery}". Rate its purine content, explain its uric acid impact on gout patients, supply safety tips and list safe low-purine alternatives.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert clinical dietician specializing in rheumatology and gout disease management. Provide accurate, evidence-based nutrition advice for gout prevention, identifying purine rich components and providing helpful guides. Strictly stick to natural remedies, supplements (like Tart Cherry, Celery extract, Bromelain), hydration, and lifestyle advice. Avoid recommending pharmaceutical medications like Allopurinol or Colchicine. Crucial yogurt rule: For any yogurt/probotic product, always check and analyze the probiotic strains. Plain traditional starters (Lactobacillus bulgaricus, Streptococcus thermophilus, Bifidobacterium lactis, and Lactobacillus acidophilus) are safe and help digest purines. Advise patients to strictly avoid strains like Lactobacillus casei or Lactobacillus paracasei because they can increase cumulative renal load.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["foodName", "purineRating", "ratingExplanation", "uricAcidImpact", "safetyTips", "lowPurineAlternatives"],
          properties: {
            foodName: {
              type: Type.STRING,
              description: "The name of the food or meal analyzed.",
            },
            purineRating: {
              type: Type.STRING,
              description: "Must be exactly one of: 'Safe' (low purine), 'Moderate' (medium purine), or 'High' (high purine, avoid).",
            },
            ratingExplanation: {
              type: Type.STRING,
              description: "Explain why this food got this status, noting specific high-purine ingredients or components like high fructose corn syrup, beer, seafood, yeast, or red meat.",
            },
            uricAcidImpact: {
              type: Type.STRING,
              description: "Describe the physiological outcome on uric acid levels (e.g. rapid conversion to uric acid, triggers local inflammation, slows down kidney excretion).",
            },
            safetyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Provide exactly three highly practical tips for gout sufferers eating or replacing this food.",
            },
            lowPurineAlternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Provide exactly three delicious, low-purine alternatives that can safely satisfy this craving or serve as healthy substitutes.",
            },
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Unable to extract response text from Gemini API.");
    }

    const analyzedData = JSON.parse(jsonText.trim());
    return res.json(analyzedData);
  } catch (error: any) {
    console.error("Gemini food analysis error:", error);
    return res.status(500).json({
      error: "Failed to analyze food. " + (error instanceof Error ? error.message : String(error)),
    });
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
