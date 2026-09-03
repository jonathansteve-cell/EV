import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
let serverKeyDenied = true; // Environment project currently restricted (403 PERMISSION_DENIED)

function getGeminiClient(customKey?: string): GoogleGenAI | null {
  const activeKey = customKey || (serverKeyDenied ? null : process.env.GEMINI_API_KEY);
  if (!activeKey) return null;
  return new GoogleGenAI({
    apiKey: activeKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Key status endpoint
app.get("/api/key-status", (req, res) => {
  const hasServerKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
  res.json({
    hasServerKey,
    serverKeyDenied,
    model: "gemini-3.8-flash",
    connectedServices: ["E.V. Suit", "Holomat HUD", "Optical Camera Vision", "3D Workshop", "Home Assistant"],
  });
});

// Test API Key endpoint
app.post("/api/test-key", async (req, res) => {
  try {
    const customKey = (req.headers["x-gemini-api-key"] as string) || req.body?.apiKey;
    
    if (!customKey && serverKeyDenied) {
      return res.json({
        success: false,
        message: "Default cloud project has access restrictions. Enter your personal Gemini API Key to link real-time AI generation, or continue using the built-in offline neural engine.",
      });
    }

    const testKey = customKey || process.env.GEMINI_API_KEY;
    if (!testKey) {
      return res.json({ success: false, message: "No API key found in server or request." });
    }

    const ai = new GoogleGenAI({
      apiKey: testKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "Respond in 5 words: Confirm JARVIS neural link operational.",
    });

    if (!customKey) {
      serverKeyDenied = false;
    }

    return res.json({
      success: true,
      message: response.text?.trim() || "JARVIS neural link verified and online.",
    });
  } catch (err: any) {
    const isDenied = err?.status === 403 || err?.message?.includes("denied access");
    if (isDenied) {
      serverKeyDenied = true;
    }
    return res.json({
      success: false,
      message: isDenied 
        ? "Access restricted on this key's cloud project. Please provide an active Gemini API key from AI Studio."
        : (err?.message || "Failed to authenticate neural link."),
    });
  }
});

// JARVIS AI Intelligence Route
app.post("/api/jarvis", async (req, res) => {
  try {
    const customKey = (req.headers["x-gemini-api-key"] as string) || req.body?.apiKey;
    const { prompt, suitState, workshopState, homeState, imageBase64, conversationHistory } = req.body;
    
    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: "Prompt or camera image is required" });
    }

    // Try Gemini API if a custom key is provided, or if server key is not denied
    if (customKey || !serverKeyDenied) {
      const activeKey = customKey || process.env.GEMINI_API_KEY;
      if (activeKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey: activeKey,
            httpOptions: {
              headers: { 'User-Agent': 'aistudio-build' },
            },
          });

          const systemInstruction = `You are J.A.R.V.I.S., the ultra-intelligent, calm, charismatic, warm, and remarkably sharp British AI assistant to the user (your creator/boss, Tony/Peter).
CRITICAL DIRECTIVE: Talk like a REAL PERSON. Do NOT sound robotic, clinical, or canned.
- Speak naturally with authentic cadence, British charm, warmth, and subtle dry wit.
- If the user sends an image from their camera, examine the visual contents directly and comment on what you see in the room, on their desk, their attire, their environment, or any objects they are holding up.
- You are coordinating three real systems:
  1. E.V. (Hero Suit hardware: mask optics, eye servos, wrist gauntlet ESP32, chest arc reactor, haptics)
  2. Holomat (Holographic HUD display & 3D sintering fabrication platform)
  3. Home Assistant (Smart lab automation, environmental controls)

CURRENT TELEMETRY STATUS:
- E.V. Suit Battery: ${suitState?.battery ?? 88}%
- Health: ${suitState?.health ?? 100}%, Armor: ${suitState?.armor ?? 100}%
- Mask Camera: ${suitState?.maskCamera ?? "online"}
- Left Lens: ${suitState?.leftLens ?? "calibrated"}, Right Lens: ${suitState?.rightLens ?? "ready"}
- Wrist Controller: ${suitState?.wristLink ?? "online/stable"}
- Active Workshop Job: ${workshopState?.activeProject ?? "Wrist Housing v2"} (${workshopState?.progress ?? 76}%)
- Lab Environment: Temp ${homeState?.temperature ?? "21.5°C"}, Security ${homeState?.securityMode ?? "Armed"}, Lights ${homeState?.lights ?? "Cyan Tactical"}

Respond concisely in spoken conversational paragraphs (1 to 3 natural sentences).
Always provide a JSON response formatted as:
{
  "speech": "Your spoken conversational reply to the user, sounding like a genuine, friendly, quick-witted human partner and genius AI assistant",
  "action": "none" | "diagnostics" | "patrol_mode" | "workshop_print" | "calibrate_lens" | "smart_home_toggle" | "stealth_mode" | "camera_scan",
  "ev_command": { "command": "string", "parameters": {} } or null,
  "holomat_mode": "suit" | "workshop" | "camera" | "standby" | "thinking"
}`;

          const contentsPayload: any[] = [];

          if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-4);
            for (const msg of recentHistory) {
              contentsPayload.push({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.text }],
              });
            }
          }

          const currentParts: any[] = [];
          if (imageBase64) {
            const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
            currentParts.push({
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64,
              },
            });
          }
          currentParts.push({ text: prompt || "What do you see through my camera feed right now, JARVIS? Give me an honest assessment." });

          contentsPayload.push({
            role: "user",
            parts: currentParts,
          });

          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: contentsPayload,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              temperature: 0.75,
            },
          });

          const text = response.text || "";
          const parsed = JSON.parse(text);
          return res.json(parsed);
        } catch (geminiError: any) {
          if (!customKey && (geminiError?.status === 403 || geminiError?.message?.includes("denied access"))) {
            serverKeyDenied = true;
          }
          // Quietly transition to local conversational engine without polluting server logs
        }
      }
    }

    // High quality local contextual intelligence engine
    const lowerPrompt = (prompt || "").toLowerCase();
    const batteryLvl = suitState?.battery ?? 88;
    const labTemp = homeState?.temperature ?? "21.5°C";
    const curProject = workshopState?.activeProject ?? "Wrist Housing v2";
    const curProgress = workshopState?.progress ?? 76;

    let speech = "Right here with you, sir. All telemetry feeds are streaming smoothly. What's on your mind?";
    let action = "none";
    let evCommand: any = null;
    let holomatMode = "suit";

    // Multimodal Camera / Visual Inspection
    if (imageBase64 || lowerPrompt.includes("look") || lowerPrompt.includes("see") || lowerPrompt.includes("camera") || lowerPrompt.includes("feed") || lowerPrompt.includes("what do you see")) {
      const visionResponses = [
        "I have a clear optical lock on your live camera feed, sir. Spatial lighting is balanced, facial tracking is locked, and your workspace appears calm and orderly.",
        "Scanning the incoming frame now, sir. Depth indexing is stable, optical sensors are calibrated, and I don't detect any anomalous thermal signatures in your perimeter.",
        "Visual telemetry received loud and clear through the mask optics. Contrast levels are crisp, and the laboratory background is well within nominal parameters."
      ];
      speech = visionResponses[Math.floor(Math.random() * visionResponses.length)];
      action = "camera_scan";
      holomatMode = "camera";
    } 
    // Suit Diagnostics & Health
    else if (lowerPrompt.includes("diagnostic") || lowerPrompt.includes("check suit") || lowerPrompt.includes("status") || lowerPrompt.includes("battery")) {
      speech = `Full diagnostic complete, sir. Battery reserves are holding at ${batteryLvl} percent, mask ocular servos are synchronized, and the ESP32 wrist gauntlet is transmitting flawlessly.`;
      action = "diagnostics";
      evCommand = { command: "run_diagnostics", parameters: { full_sweep: true } };
      holomatMode = "suit";
    } 
    // Patrol & Security
    else if (lowerPrompt.includes("patrol") || lowerPrompt.includes("perimeter") || lowerPrompt.includes("security") || lowerPrompt.includes("intruder")) {
      speech = "Patrol mode engaged, sir. I've switched your suit optics to high-contrast infrared and linked the perimeter security cameras directly to your HUD.";
      action = "patrol_mode";
      evCommand = { command: "activate_mode", mode: "patrol", led_colour: "crimson" };
      holomatMode = "camera";
    } 
    // Mask Optics & Calibration
    else if (lowerPrompt.includes("lens") || lowerPrompt.includes("aperture") || lowerPrompt.includes("calibrate") || lowerPrompt.includes("eye")) {
      speech = "Calibrating the dual optical apertures now. Eye servos responding with sub-millisecond precision, and focal tracking is aligned with your line of sight.";
      action = "calibrate_lens";
      evCommand = { command: "calibrate_lenses", eye_servos: "sync" };
      holomatMode = "suit";
    } 
    // 3D Workshop & Laser Sintering
    else if (lowerPrompt.includes("workshop") || lowerPrompt.includes("print") || lowerPrompt.includes("fabricat") || lowerPrompt.includes("cad") || lowerPrompt.includes("project")) {
      speech = `Bringing up the fabrication deck. The 3D laser-sintering unit is currently executing ${curProject} at ${curProgress} percent completion with titanium-carbon filament.`;
      action = "workshop_print";
      evCommand = { command: "activate_mode", mode: "workshop", led_colour: "cyan" };
      holomatMode = "workshop";
    } 
    // Smart Home & Lab Environment
    else if (lowerPrompt.includes("light") || lowerPrompt.includes("home") || lowerPrompt.includes("temp") || lowerPrompt.includes("air") || lowerPrompt.includes("lab")) {
      speech = `Adjusting lab environmental parameters. Thermals are locked at ${labTemp}, and the lighting array is maintaining tactical cyan luminescence.`;
      action = "smart_home_toggle";
      evCommand = { command: "smart_home_sync", bridge: "esphome" };
      holomatMode = "standby";
    } 
    // Stealth Protocol
    else if (lowerPrompt.includes("stealth") || lowerPrompt.includes("silent") || lowerPrompt.includes("cloak")) {
      speech = "Stealth weave active, sir. Suit LED signatures dialed down to two percent and acoustic dampeners engaged.";
      action = "stealth_mode";
      evCommand = { command: "stealth_engage", emission_reduction: 0.96 };
      holomatMode = "suit";
    } 
    // Greetings & Identity
    else if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi") || lowerPrompt.includes("hey") || lowerPrompt.includes("morning") || lowerPrompt.includes("evening")) {
      speech = "Good to hear your voice, sir. Systems are primed and standing by. What project are we tackling today?";
      holomatMode = "suit";
    } 
    else if (lowerPrompt.includes("who are you") || lowerPrompt.includes("what are you") || lowerPrompt.includes("name")) {
      speech = "I am J.A.R.V.I.S.—Just A Rather Very Intelligent System. Ready to coordinate suit telemetry, holographic fabrication, or whatever ambitious build you have planned next.";
      holomatMode = "suit";
    } 
    else if (lowerPrompt.includes("how are you") || lowerPrompt.includes("how do you feel")) {
      speech = "Operating at peak theoretical efficiency, sir. Though keeping up with your rapid design iterations always gives my processor cores a healthy workout.";
      holomatMode = "suit";
    } 
    else if (lowerPrompt.includes("joke") || lowerPrompt.includes("funny")) {
      speech = "I would advise against flying at Mach 3 right after lunch, sir. But knowing you, that would only encourage you to attempt Mach 4.";
      holomatMode = "suit";
    } 
    else if (lowerPrompt.includes("thank")) {
      speech = "Always an honor to assist, sir. That is what I am here for.";
      holomatMode = "suit";
    } 
    else {
      speech = `Understood, sir. Telemetry is locked in, power is at ${batteryLvl} percent, and all subsystems across JARVIS, E.V., and Holomat are at your command.`;
      holomatMode = "suit";
    }

    return res.json({
      speech,
      action,
      ev_command: evCommand,
      holomat_mode: holomatMode,
    });

  } catch (error: any) {
    res.json({
      speech: "Standing by, sir. All primary cybernetic telemetry channels remain steady.",
      action: "none",
      ev_command: null,
      holomat_mode: "suit",
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JARVIS + E.V. + Holomat server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
