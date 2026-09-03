import React from 'react';
import { HeroSuitState } from '../types';
import { soundFx } from '../utils/soundEffects';
import { Activity, Shield, Zap, Eye, Sliders, CheckCircle2 } from 'lucide-react';

interface HeroSuitStatusProps {
  suit: HeroSuitState;
  onRunDiagnostics: () => void;
  onToggleStealth: () => void;
  onCalibrateLenses: () => void;
  isDiagnosing?: boolean;
}

export const HeroSuitStatus: React.FC<HeroSuitStatusProps> = ({
  suit,
  onRunDiagnostics,
  onToggleStealth,
  onCalibrateLenses,
  isDiagnosing = false,
}) => {
  return (
    <div 
      id="hero-suit-status-panel"
      className="relative p-3.5 sm:p-4 rounded-lg border border-cyan-500/50 bg-black/60 backdrop-blur-md hud-box-glow text-cyan-300 w-full max-w-sm transition-all duration-300 hover:border-cyan-400"
    >
      {/* Sci-Fi Corner Accents */}
      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-300" />
      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-300" />
      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-300" />
      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-300" />

      {/* Header matching image.png */}
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <h2 className="font-orbitron font-bold text-xs sm:text-sm tracking-wider text-cyan-100 hud-glow uppercase">
            HERO SUIT STATUS
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-cyan-400/80 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded">
          {suit.features.stealthWeave ? 'STEALTH ACTIVE' : 'NOMINAL HUD'}
        </span>
      </div>

      {/* Main Body: Silhouette + Gauges Grid */}
      <div className="grid grid-cols-12 gap-3 items-center">
        
        {/* Holographic Wireframe Hero Suit Silhouette */}
        <div className="col-span-5 relative flex items-center justify-center p-1 border border-cyan-500/20 bg-cyan-950/20 rounded">
          <svg 
            viewBox="0 0 120 200" 
            className="w-full h-36 max-h-40 overflow-visible text-cyan-400"
          >
            <defs>
              <radialGradient id="chestGlow" cx="50%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Suit Blueprint Lines */}
            <g stroke="#00f0ff" strokeWidth="1.2" fill="none" opacity="0.85">
              {/* Head / Mask */}
              <ellipse cx="60" cy="22" rx="14" ry="17" strokeWidth="1.4" />
              {/* Eyes / Lens frames */}
              <polygon points="52,20 57,22 55,25 49,23" fill="#00f0ff" opacity="0.9" />
              <polygon points="68,20 63,22 65,25 71,23" fill="#00f0ff" opacity="0.9" />

              {/* Neck & Shoulders */}
              <path d="M 54 36 L 40 45 L 24 55 L 20 85 L 18 115" />
              <path d="M 66 36 L 80 45 L 96 55 L 100 85 L 102 115" />

              {/* Torso */}
              <path d="M 40 45 L 43 90 L 48 115 L 60 122 L 72 115 L 77 90 L 80 45" />

              {/* Spider / Cyber Chest Emblem */}
              <circle cx="60" cy="62" r="7" fill="url(#chestGlow)" stroke="#ffffff" strokeWidth="1" />
              <line x1="60" y1="55" x2="60" y2="46" stroke="#00f0ff" strokeWidth="1" />
              <line x1="60" y1="69" x2="60" y2="82" stroke="#00f0ff" strokeWidth="1" />
              <line x1="53" y1="60" x2="42" y2="54" stroke="#00f0ff" strokeWidth="0.9" />
              <line x1="67" y1="60" x2="78" y2="54" stroke="#00f0ff" strokeWidth="0.9" />
              <line x1="54" y1="65" x2="44" y2="74" stroke="#00f0ff" strokeWidth="0.9" />
              <line x1="66" y1="65" x2="76" y2="74" stroke="#00f0ff" strokeWidth="0.9" />

              {/* Legs */}
              <path d="M 48 115 L 42 155 L 40 190" />
              <path d="M 72 115 L 78 155 L 80 190" />
              <path d="M 60 122 L 56 155 L 54 188" />
              <path d="M 60 122 L 64 155 L 66 188" />

              {/* Wrist module nodes */}
              <circle cx="19" cy="100" r="2.5" fill="#00f0ff" className="animate-ping" />
              <circle cx="101" cy="100" r="2.5" fill="#00f0ff" />
            </g>

            {/* Scanning Laser Line when diagnosing */}
            {isDiagnosing && (
              <line 
                x1="10" y1="20" x2="110" y2="20" 
                stroke="#ffffff" 
                strokeWidth="2"
                className="animate-bounce"
              />
            )}
          </svg>

          {/* Vitals badge over silhouette */}
          <div className="absolute bottom-1 right-1 font-mono-tech text-[8px] text-cyan-300/80 bg-black/70 px-1 rounded">
            98.6°F // O2: {suit.vitals.oxygenLevel}%
          </div>
        </div>

        {/* Status Gauges & Metrics matching reference image */}
        <div className="col-span-7 space-y-2">
          
          {/* Top Horizontal Bars */}
          <div className="space-y-1 text-[11px] font-rajdhani font-semibold">
            <div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-cyan-200">HEALTH</span>
                <span className="font-mono-tech text-white font-bold">{suit.health}%</span>
              </div>
              <div className="h-1.5 w-full bg-cyan-950 border border-cyan-500/40 rounded-sm overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] transition-all duration-500" 
                  style={{ width: `${suit.health}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-cyan-200">ARMOR</span>
                <span className="font-mono-tech text-white font-bold">{suit.armor}%</span>
              </div>
              <div className="h-1.5 w-full bg-cyan-950 border border-cyan-500/40 rounded-sm overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] transition-all duration-500" 
                  style={{ width: `${suit.armor}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-cyan-200">POWER</span>
                <span className="font-mono-tech text-white font-bold">{suit.power}%</span>
              </div>
              <div className="h-1.5 w-full bg-cyan-950 border border-cyan-500/40 rounded-sm overflow-hidden">
                <div 
                  className="h-full bg-cyan-300 shadow-[0_0_8px_#00f0ff] transition-all duration-500" 
                  style={{ width: `${suit.power}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3 Circular Status Badges matching lower row in image */}
          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-cyan-500/20 text-center">
            <div className="p-1 bg-cyan-950/40 border border-cyan-500/30 rounded flex flex-col items-center">
              <span className="font-mono-tech text-[8px] text-cyan-400/80">HEALTH</span>
              <span className="font-mono-tech font-bold text-[10px] text-white">90%</span>
            </div>
            <div className="p-1 bg-cyan-950/40 border border-cyan-500/30 rounded flex flex-col items-center">
              <span className="font-mono-tech text-[8px] text-cyan-400/80">ARMOR</span>
              <span className="font-mono-tech font-bold text-[10px] text-white">94%</span>
            </div>
            <div className="p-1 bg-cyan-950/40 border border-cyan-500/30 rounded flex flex-col items-center">
              <span className="font-mono-tech text-[8px] text-cyan-400/80">POWER</span>
              <span className="font-mono-tech font-bold text-[10px] text-white">81%</span>
            </div>
          </div>

          {/* Mask & Lens Sub-readout */}
          <div className="flex justify-between items-center text-[9px] font-mono-tech text-cyan-300/80 px-1 py-0.5 bg-black/40 rounded border border-cyan-500/20">
            <span>LENS: {suit.maskModule.leftLens.toUpperCase()}</span>
            <span>CAM: {suit.maskModule.camera.toUpperCase()}</span>
          </div>

        </div>

      </div>

      {/* Interactive Command Triggers */}
      <div className="mt-3 grid grid-cols-3 gap-1.5 pt-2 border-t border-cyan-500/30">
        <button
          id="btn-run-diagnostics"
          onClick={() => {
            soundFx.playDiagnosticSweep();
            onRunDiagnostics();
          }}
          disabled={isDiagnosing}
          className="px-1.5 py-1 text-[9px] font-rajdhani font-bold tracking-wider uppercase bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 rounded text-cyan-200 transition-all hover:hud-glow flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <Activity className="w-2.5 h-2.5" />
          {isDiagnosing ? 'DIAGNOSING...' : 'DIAGNOSTIC'}
        </button>

        <button
          id="btn-calibrate-lenses"
          onClick={() => {
            soundFx.playChirp();
            onCalibrateLenses();
          }}
          className="px-1.5 py-1 text-[9px] font-rajdhani font-bold tracking-wider uppercase bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/40 rounded text-cyan-300 transition-all hover:hud-glow flex items-center justify-center gap-1 cursor-pointer"
        >
          <Eye className="w-2.5 h-2.5" />
          CALIBRATE
        </button>

        <button
          id="btn-toggle-stealth"
          onClick={() => {
            soundFx.playHoloClick();
            onToggleStealth();
          }}
          className={`px-1.5 py-1 text-[9px] font-rajdhani font-bold tracking-wider uppercase border rounded transition-all flex items-center justify-center gap-1 cursor-pointer ${
            suit.features.stealthWeave
              ? 'bg-cyan-400 text-black font-extrabold border-white'
              : 'bg-cyan-950/50 hover:bg-cyan-900/50 border-cyan-500/40 text-cyan-300'
          }`}
        >
          <Shield className="w-2.5 h-2.5" />
          {suit.features.stealthWeave ? 'STEALTH ON' : 'STEALTH'}
        </button>
      </div>

    </div>
  );
};
