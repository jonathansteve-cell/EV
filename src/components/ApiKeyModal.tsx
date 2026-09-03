import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/soundEffects';
import { Key, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, X, Eye, EyeOff, Sparkles, Cpu, Radio, Video, Wrench } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  hasServerKey: boolean;
  serverKeyRestricted?: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  hasServerKey,
  serverKeyRestricted = false,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    soundFx.playConfirmationChime();
    onSaveApiKey(inputKey.trim());
    setTestResult({
      success: true,
      message: "API Key saved to secure local memory. Connected to all JARVIS subsystems.",
    });
  };

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult(null);
    soundFx.playDiagnosticSweep();

    const startTime = performance.now();
    try {
      const activeKey = inputKey.trim() || apiKey;
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': activeKey || '',
        },
        body: JSON.stringify({ apiKey: activeKey }),
      });
      const data = await res.json();
      const latency = Math.round(performance.now() - startTime);

      if (data.success) {
        setTestResult({
          success: true,
          message: data.message || "JARVIS Neural Link verified with Gemini 3.8 Flash.",
          latency,
        });
        soundFx.playConfirmationChime();
      } else {
        setTestResult({
          success: false,
          message: data.message || "Authentication error. Check API key validity.",
          latency,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || "Failed to reach neural endpoint.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        id="api-key-config-modal"
        className="relative w-full max-w-xl bg-black/95 border-2 border-cyan-500/70 rounded-xl p-5 sm:p-6 hud-box-glow-strong text-cyan-200"
      >
        {/* Sci-Fi Corner Accents */}
        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-cyan-300" />
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-cyan-300" />
        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-cyan-300" />
        <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-cyan-300" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/40 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cyan-950/80 border border-cyan-400 rounded">
              <Key className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-sm sm:text-base tracking-wider text-white hud-glow">
                NEURAL CORE CONFIGURATION
              </h2>
              <div className="font-mono-tech text-[10px] text-cyan-400">
                GEMINI 3.8 FLASH // JARVIS BRAIN INTEGRATION
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playHoloClick();
              onClose();
            }}
            className="p-1.5 rounded hover:bg-cyan-950/60 text-cyan-400 hover:text-white border border-transparent hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subsystems Connected Banner */}
        <div className="mb-4 p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg">
          <div className="font-orbitron text-[10px] font-bold text-cyan-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>LINKED SUBSYSTEMS POWERED BY THIS KEY:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono-tech text-[10px]">
            <div className="flex items-center gap-1.5 text-cyan-200">
              <Video className="w-3 h-3 text-emerald-400" />
              <span>Optical Camera Vision</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-200">
              <Radio className="w-3 h-3 text-cyan-400" />
              <span>Realistic Voice Dialogue</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-200">
              <Cpu className="w-3 h-3 text-amber-400" />
              <span>E.V. Hero Suit Telemetry</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-200">
              <Wrench className="w-3 h-3 text-blue-400" />
              <span>Holomat 3D Workshop</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-200 col-span-2 sm:col-span-1">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              <span>Smart Lab Automation</span>
            </div>
          </div>
        </div>

        {/* Server Status Indicator */}
        <div className="mb-4 flex items-center justify-between p-2.5 bg-black/60 border border-cyan-500/30 rounded font-mono-tech text-xs">
          <span className="text-cyan-400">ACTIVE NEURAL ENGINE:</span>
          {apiKey ? (
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              USER KEY ACTIVE (GEMINI 3.8)
            </span>
          ) : serverKeyRestricted ? (
            <span className="flex items-center gap-1 text-cyan-300 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              OFFLINE JARVIS NEURAL ENGINE ACTIVE
            </span>
          ) : hasServerKey ? (
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              SERVER KEY ATTACHED
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              CUSTOM KEY OPTIONAL / OFFLINE ENGINE
            </span>
          )}
        </div>

        {serverKeyRestricted && !apiKey && (
          <div className="mb-4 p-2.5 bg-cyan-950/40 border border-cyan-500/40 rounded text-[11px] font-mono-tech text-cyan-300">
            The JARVIS offline neural engine is actively processing speech, camera vision, and suit telemetry. To enable real-time Gemini generation, paste your personal Gemini API key below.
          </div>
        )}

        {/* API Key Input Field */}
        <div className="space-y-2 mb-4">
          <label className="block font-orbitron text-xs text-cyan-300 tracking-wide">
            ENTER GEMINI API KEY
          </label>
          <div className="relative flex items-center">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste your Gemini API Key (e.g. AIzaSy...)"
              className="w-full bg-black/90 border border-cyan-500/60 rounded px-3 py-2 pr-10 text-xs sm:text-sm font-mono-tech text-cyan-100 placeholder-cyan-700 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-400"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2.5 text-cyan-500 hover:text-cyan-200 cursor-pointer"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="font-mono-tech text-[10px] text-cyan-500/90">
            Keys are stored locally in your browser session and never sent anywhere except the server-side proxy.
          </p>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div 
            className={`p-2.5 rounded border mb-4 font-mono-tech text-xs flex items-start gap-2 ${
              testResult.success 
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
                : 'bg-red-950/40 border-red-500/50 text-red-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className="font-bold">{testResult.message}</div>
              {testResult.latency !== undefined && (
                <div className="text-[10px] opacity-80 mt-0.5">Roundtrip Latency: {testResult.latency}ms</div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-cyan-500/40">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={isTesting}
            className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 rounded font-orbitron text-xs text-cyan-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
          >
            {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isTesting ? 'VERIFYING...' : 'TEST NEURAL LINK'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playHoloClick();
                onClose();
              }}
              className="px-3 py-1.5 rounded font-orbitron text-xs text-cyan-500 hover:text-cyan-300 cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-orbitron font-bold text-xs rounded flex items-center gap-1.5 shadow-[0_0_12px_#00f0ff] cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SAVE & CONNECT</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
