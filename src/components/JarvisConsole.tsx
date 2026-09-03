import React, { useState, useEffect } from 'react';
import { HolomatMode, CommunicationMessage } from '../types';
import { soundFx } from '../utils/soundEffects';
import { speechManager } from '../utils/speechManager';
import { 
  Mic, 
  MicOff, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Layers, 
  Maximize, 
  Activity,
  Cpu
} from 'lucide-react';

interface JarvisConsoleProps {
  mode: HolomatMode;
  jarvisSpeech: string;
  isListening: boolean;
  isSpeaking: boolean;
  messages: CommunicationMessage[];
  peppersGhostMode: boolean;
  audioMuted: boolean;
  continuousVoice: boolean;
  hasApiKey: boolean;
  onSendCommand: (commandText: string) => void;
  onToggleListen: () => void;
  onToggleMute: () => void;
  onTogglePeppersGhost: () => void;
  onToggleContinuousVoice: () => void;
  onOpenApiKeyModal: () => void;
  onInspectCamera?: () => void;
}

export const JarvisConsole: React.FC<JarvisConsoleProps> = ({
  mode,
  jarvisSpeech,
  isListening,
  isSpeaking,
  messages,
  peppersGhostMode,
  audioMuted,
  continuousVoice,
  hasApiKey,
  onSendCommand,
  onToggleListen,
  onToggleMute,
  onTogglePeppersGhost,
  onToggleContinuousVoice,
  onOpenApiKeyModal,
  onInspectCamera,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'voice' | 'protocol'>('voice');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

  useEffect(() => {
    speechManager.onVoicesAvailable((avail) => {
      setVoices(avail);
      const current = speechManager.getCurrentVoice();
      if (current) setSelectedVoiceName(current.name);
    });
  }, []);

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vName = e.target.value;
    setSelectedVoiceName(vName);
    speechManager.setVoiceByName(vName);
    soundFx.playChirp();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    soundFx.playChirp();
    onSendCommand(inputText.trim());
    setInputText('');
  };

  const quickCommands = [
    "Run suit diagnostics",
    "Activate patrol mode",
    "Inspect the mask",
    "Design wrist controller",
    "Activate workshop mode",
    "Stealth weave active",
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex flex-col items-center pointer-events-none">
      
      {/* Drawer Toggle Handle (The exact down-arrow '↓' element from image.png) */}
      <button
        id="btn-toggle-jarvis-drawer"
        onClick={() => {
          soundFx.playHoloClick();
          setIsOpen(!isOpen);
        }}
        className="pointer-events-auto mb-1 px-4 py-1 bg-black/80 hover:bg-black border border-cyan-500/60 rounded-t-lg backdrop-blur-md text-cyan-300 hud-box-glow flex items-center gap-1.5 font-mono-tech text-xs cursor-pointer transition-all hover:text-white"
        title="Toggle JARVIS Command Terminal"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-orbitron font-semibold tracking-wider text-[11px]">J.A.R.V.I.S. INTELLIGENCE</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />}
      </button>

      {/* Expandable Terminal Console */}
      {isOpen && (
        <div className="pointer-events-auto w-full max-w-5xl bg-black/90 backdrop-blur-xl border-t border-cyan-500/50 hud-box-glow-strong px-3 sm:px-6 py-3 transition-all duration-300">
          
          {/* Top Control Bar: Status + Audio + Pepper's Ghost + Mode Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/30 pb-2 mb-2 font-mono-tech text-[10px]">
            
            {/* Left: Mode Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-cyan-400/80">HOLOMAT HUD:</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-200 font-bold uppercase tracking-wider">
                {mode}
              </span>
              {isListening && (
                <span className="text-red-400 font-bold animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  VOICE INPUT ACTIVE
                </span>
              )}
              {isSpeaking && (
                <span className="text-cyan-300 font-bold animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                  JARVIS VOCALIZING
                </span>
              )}
            </div>

            {/* Right: Tabs & Display Preferences */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* API Key Modal Trigger */}
              <button
                onClick={() => {
                  soundFx.playHoloClick();
                  onOpenApiKeyModal();
                }}
                className={`px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center gap-1 font-bold ${
                  hasApiKey 
                    ? 'bg-emerald-950/60 border-emerald-400/80 text-emerald-300 shadow-[0_0_8px_#10b981]' 
                    : 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 hover:border-cyan-300'
                }`}
                title="Configure Gemini API Key & View Connected Services"
              >
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>{hasApiKey ? 'NEURAL LINK: ON' : 'CONNECT API KEY'}</span>
              </button>

              {/* Continuous Hands-Free Talk Mode Toggle */}
              <button
                onClick={() => {
                  soundFx.playHoloClick();
                  onToggleContinuousVoice();
                }}
                className={`px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center gap-1 font-bold ${
                  continuousVoice
                    ? 'bg-cyan-400 text-black border-white shadow-[0_0_10px_#00f0ff]'
                    : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 hover:text-cyan-200'
                }`}
                title="Continuous conversation mode: JARVIS speaks and automatically listens for your reply"
              >
                <Activity className="w-3 h-3" />
                <span>{continuousVoice ? 'REAL-TIME CHAT: ON' : 'HANDS-FREE CHAT'}</span>
              </button>

              {/* Tab Selector */}
              <button
                onClick={() => setActiveTab('voice')}
                className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
                  activeTab === 'voice' 
                    ? 'bg-cyan-500/25 border-cyan-400 text-white font-bold' 
                    : 'border-cyan-900 text-cyan-500'
                }`}
              >
                VOICE TERMINAL
              </button>

              <button
                onClick={() => setActiveTab('protocol')}
                className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
                  activeTab === 'protocol' 
                    ? 'bg-cyan-500/25 border-cyan-400 text-white font-bold' 
                    : 'border-cyan-900 text-cyan-500'
                }`}
              >
                BUS ({messages.length})
              </button>

              {/* Sound FX Toggle */}
              <button
                onClick={() => {
                  soundFx.playHoloClick();
                  onToggleMute();
                }}
                className={`p-1 rounded border transition-all cursor-pointer ${
                  audioMuted 
                    ? 'bg-red-950/40 border-red-500/50 text-red-400' 
                    : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                }`}
                title={audioMuted ? 'Unmute Audio Feedback' : 'Mute Audio Feedback'}
              >
                {audioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              {/* Pepper's Ghost View Mode Toggle */}
              <button
                onClick={() => {
                  soundFx.playHoloClick();
                  onTogglePeppersGhost();
                }}
                className={`px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center gap-1 ${
                  peppersGhostMode 
                    ? 'bg-cyan-400 text-black font-extrabold border-white' 
                    : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                }`}
                title="Toggle Pepper's Ghost Pitch-Black Hologram Projection Mode"
              >
                <Layers className="w-3 h-3" />
                <span className="hidden sm:inline">{peppersGhostMode ? "PEPPER'S GHOST" : "LAB VIEW"}</span>
              </button>
            </div>

          </div>

          {/* Tab 1: Voice & Natural Language Terminal */}
          {activeTab === 'voice' && (
            <div className="space-y-2">
              
              {/* JARVIS Vocal Response Bubble with Animated Waveform */}
              <div className="flex items-start gap-3 p-2 rounded bg-cyan-950/40 border border-cyan-500/40">
                {/* Voice avatar / animated audio bars */}
                <div className="flex items-center gap-0.5 h-8 px-2 bg-black/70 rounded border border-cyan-500/30">
                  <div className={`w-1 bg-cyan-400 rounded-full transition-all ${isSpeaking || isListening ? 'h-6 animate-pulse' : 'h-2'}`} />
                  <div className={`w-1 bg-cyan-400 rounded-full transition-all ${isSpeaking || isListening ? 'h-4 animate-ping' : 'h-3'}`} />
                  <div className={`w-1 bg-cyan-400 rounded-full transition-all ${isSpeaking || isListening ? 'h-7 animate-pulse' : 'h-2'}`} />
                  <div className={`w-1 bg-cyan-400 rounded-full transition-all ${isSpeaking || isListening ? 'h-5 animate-ping' : 'h-4'}`} />
                  <div className={`w-1 bg-cyan-400 rounded-full transition-all ${isSpeaking || isListening ? 'h-3 animate-pulse' : 'h-2'}`} />
                </div>

                <div className="flex-1">
                  <div className="font-orbitron text-[10px] text-cyan-400 font-bold tracking-wider">
                    J.A.R.V.I.S.
                  </div>
                  <p className="font-rajdhani text-sm sm:text-base text-cyan-100 font-medium leading-tight">
                    {jarvisSpeech || "Awaiting your directive, sir. All suit systems and workshop platforms are standing by."}
                  </p>
                </div>
              </div>

              {/* Natural Language Input Field & Mic Trigger */}
              <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playChirp();
                    onToggleListen();
                  }}
                  className={`p-2 rounded border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-500 border-white text-white shadow-[0_0_12px_#ef4444] animate-pulse'
                      : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400 text-cyan-200'
                  }`}
                  title={isListening ? 'Stop Voice Listening' : 'Speak to JARVIS'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Speak or type command (e.g. 'JARVIS, inspect the mask' or 'Activate patrol mode')..."
                    className="w-full bg-black/80 border border-cyan-500/50 rounded px-3 py-1.5 text-xs sm:text-sm font-rajdhani text-cyan-100 placeholder-cyan-600 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-orbitron font-bold text-xs rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_#00f0ff]"
                >
                  <span>EXECUTE</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Quick Action Chips and Voice Selector */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono-tech text-[9px] text-cyan-500/80">QUICK TALK:</span>
                  
                  {onInspectCamera && (
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playDiagnosticSweep();
                        onInspectCamera();
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-rajdhani font-bold bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/50 text-emerald-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                      <span>"WHAT DO YOU SEE?" (CAMERA INSPECT)</span>
                    </button>
                  )}

                  {quickCommands.map((cmd, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        soundFx.playHoloClick();
                        onSendCommand(cmd);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-rajdhani font-semibold bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 hover:text-white transition-all cursor-pointer"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>

                {/* Natural Voice Selector */}
                {voices.length > 0 && (
                  <div className="flex items-center gap-1.5 font-mono-tech text-[9px] text-cyan-400/80">
                    <span>VOICE ENGINE:</span>
                    <select
                      value={selectedVoiceName}
                      onChange={handleVoiceChange}
                      className="bg-black/90 border border-cyan-500/40 rounded px-1.5 py-0.5 text-[9px] text-cyan-200 focus:outline-none focus:border-cyan-400 max-w-[160px] truncate"
                    >
                      {voices
                        .filter(v => v.lang.startsWith('en'))
                        .map((v, i) => (
                          <option key={i} value={v.name} className="bg-black text-cyan-300">
                            {v.name} ({v.lang})
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Tab 2: Protocol Packet Inspector (MQTT / WebSocket Stream) */}
          {activeTab === 'protocol' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-mono-tech text-cyan-400/80 border-b border-cyan-500/20 pb-0.5">
                <span>TELEMETRY PACKET STREAM (JARVIS ⇄ E.V. ⇄ HOLOMAT ⇄ HOME ASSISTANT)</span>
                <span>STATUS: 24.8 KB/S // LATENCY: 1.4ms</span>
              </div>

              <div className="max-h-36 overflow-y-auto font-mono-tech text-[10px] space-y-1 bg-black/80 p-2 rounded border border-cyan-500/30">
                {messages.length === 0 ? (
                  <div className="text-cyan-600 italic">No packet history recorded yet.</div>
                ) : (
                  messages.slice(-8).reverse().map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`p-1 rounded border text-[9px] leading-tight ${
                        msg.source === 'jarvis' 
                          ? 'bg-blue-950/30 border-blue-500/40 text-blue-200' 
                          : msg.source === 'ev'
                          ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                          : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>[{msg.timestamp.split('T')[1]?.slice(0, 8) || 'TIME'}] {msg.source.toUpperCase()} → {msg.target.toUpperCase()} ({msg.type})</span>
                        <span>REQ: {msg.requestId}</span>
                      </div>
                      <pre className="mt-0.5 text-[8px] text-cyan-300/90 whitespace-pre-wrap font-mono-tech overflow-x-auto">
                        {JSON.stringify(msg.data || { action: msg.action, command: msg.command }, null, 2)}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
