import React from 'react';
import { HolomatMode } from '../types';

interface EvCoreProps {
  mode: HolomatMode;
  onCoreClick?: () => void;
  audioActive?: boolean;
}

export const EvCore: React.FC<EvCoreProps> = ({ mode, onCoreClick, audioActive = false }) => {
  return (
    <div 
      className="relative flex items-center justify-center cursor-pointer group select-none"
      onClick={onCoreClick}
      title="E.V. CORE - Click to pulse or test status"
    >
      {/* Surrounding HUD Tags exactly as in reference image */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <span className="font-mono-tech text-[10px] tracking-widest text-cyan-400/90 border border-cyan-500/40 bg-black/60 px-2 py-0.5 rounded-sm hud-glow">
          [SYSTEM ACTIVE]
        </span>
      </div>

      <div className="absolute top-1/4 -left-16 z-20 pointer-events-none hidden md:block">
        <span className="font-mono-tech text-[9px] tracking-wider text-cyan-400/80 border border-cyan-500/30 bg-black/50 px-1.5 py-0.5 rounded-sm">
          [SECTOR 4]
        </span>
      </div>

      <div className="absolute top-12 -right-16 z-20 pointer-events-none hidden md:block">
        <span className="font-mono-tech text-[9px] tracking-wider text-cyan-400/80 border border-cyan-500/30 bg-black/50 px-1.5 py-0.5 rounded-sm">
          [DATA STREAMING]
        </span>
      </div>

      <div className="absolute bottom-1/4 -right-20 z-20 pointer-events-none hidden md:block">
        <span className="font-mono-tech text-[9px] tracking-wider text-cyan-400/80 border border-cyan-500/30 bg-black/50 px-1.5 py-0.5 rounded-sm">
          [STATUS: OPTIMAL]
        </span>
      </div>

      {/* Radiant Hexagonal & Code telemetry blocks (ambient sci-fi overlays) */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <div className="font-mono-tech text-[8px] text-cyan-400/60 leading-tight tracking-tighter opacity-80 max-w-[200px] truncate">
          0x4E7A29 // BUS_READY // LATENCY: 1.2ms
        </div>
        <div className="flex justify-center gap-1 mt-0.5">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
          <div className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full" />
          <div className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full" />
        </div>
      </div>

      {/* Dynamic Energy Core Main Container */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 flex items-center justify-center">

        {/* Outer Hexagon & Node Web (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" viewBox="0 0 300 300">
          <polygon 
            points="150,15 265,80 265,220 150,285 35,220 35,80" 
            fill="none" 
            stroke="#00f0ff" 
            strokeWidth="0.75" 
            strokeDasharray="4 4"
            className="animate-spin-slow origin-center"
          />
          <circle cx="150" cy="15" r="2.5" fill="#00f0ff" />
          <circle cx="265" cy="80" r="2.5" fill="#00f0ff" />
          <circle cx="265" cy="220" r="2.5" fill="#00f0ff" />
          <circle cx="150" cy="285" r="2.5" fill="#00f0ff" />
          <circle cx="35" cy="220" r="2.5" fill="#00f0ff" />
          <circle cx="35" cy="80" r="2.5" fill="#00f0ff" />
        </svg>

        {/* Outer segmented tech ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed animate-spin-slow" />

        {/* Orbital Gyro Ellipse 1 (Tilted 3D Ring) */}
        <div 
          className="absolute w-full h-full rounded-full border-[1.5px] border-cyan-400/60 pointer-events-none shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          style={{
            transform: 'rotateX(65deg) rotateY(20deg)',
            animation: 'spin-slow 8s linear infinite',
          }}
        >
          {/* Orbital Satellite Node */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-300 rounded-full shadow-[0_0_10px_#00f0ff]" />
        </div>

        {/* Orbital Gyro Ellipse 2 (Cross-tilted Ring) */}
        <div 
          className="absolute w-full h-full rounded-full border-[1.5px] border-cyan-400/60 pointer-events-none shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          style={{
            transform: 'rotateX(65deg) rotateY(-35deg)',
            animation: 'spin-reverse 10s linear infinite',
          }}
        >
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-cyan-300 rounded-full shadow-[0_0_10px_#00f0ff]" />
        </div>

        {/* Orbital Gyro Ellipse 3 (Near Horizontal) */}
        <div 
          className="absolute w-[92%] h-[92%] rounded-full border border-cyan-300/40 pointer-events-none"
          style={{
            transform: 'rotateX(75deg)',
            animation: 'spin-slow 6s linear infinite',
          }}
        />

        {/* Intermediate segmented tick ring */}
        <div className="absolute w-[80%] h-[80%] rounded-full border-2 border-cyan-400/40 border-t-transparent border-b-transparent animate-spin-medium" />
        <div className="absolute w-[72%] h-[72%] rounded-full border border-cyan-300/60 border-l-transparent border-r-transparent animate-spin-reverse-slow" />

        {/* Glowing Plasma Atmosphere / Backlight */}
        <div 
          className={`absolute w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full bg-cyan-500/20 blur-xl transition-all duration-700 pointer-events-none ${
            mode === 'listening' 
              ? 'bg-cyan-400/40 scale-125' 
              : mode === 'thinking' 
              ? 'bg-blue-400/50 scale-110' 
              : 'bg-cyan-500/25 animate-core-pulse'
          }`}
        />

        {/* Glowing Electric Plasma Core Sphere */}
        <div 
          className={`relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center text-center transition-transform duration-300 shadow-[0_0_35px_rgba(0,240,255,0.7),inset_0_0_20px_rgba(0,240,255,0.8)] border border-cyan-200/90 bg-black/70 backdrop-blur-md group-hover:scale-105 ${
            mode === 'thinking' ? 'animate-spin-fast' : ''
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(0,240,255,0.35) 0%, rgba(0,40,60,0.85) 70%, rgba(0,10,20,0.95) 100%)',
          }}
        >
          {/* Internal Electric Filament Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full opacity-70 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#67e8f9" strokeWidth="0.5" />
            {mode === 'listening' && (
              <circle cx="50" cy="50" r="46" fill="none" stroke="#a5f3fc" strokeWidth="1.5" className="animate-ping" />
            )}
          </svg>

          {/* Core Central Title Badge */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl tracking-widest text-white hud-glow-strong m-0 leading-none">
              E.V.
            </h1>
            <span className="font-orbitron text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] text-cyan-300 mt-1 uppercase leading-none">
              CORE
            </span>

            {/* Mode-specific status text */}
            <div className="mt-1">
              <span className={`font-mono-tech text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded ${
                mode === 'listening'
                  ? 'text-cyan-200 bg-cyan-900/60 animate-pulse'
                  : mode === 'thinking'
                  ? 'text-amber-300 bg-amber-950/60'
                  : mode === 'camera'
                  ? 'text-red-300 bg-red-950/60'
                  : 'text-cyan-400/90'
              }`}>
                {mode === 'listening' ? '• LISTENING •' : mode === 'thinking' ? '• COMPUTING •' : 'SYSTEM LINK'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Cybernetic Radial Connectors linking to surrounding HUD widgets */}
      <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-visible opacity-40">
        <line x1="10%" y1="15%" x2="50%" y2="50%" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" />
        <line x1="90%" y1="15%" x2="50%" y2="50%" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" />
        <line x1="5%" y1="50%" x2="50%" y2="50%" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" />
        <line x1="95%" y1="50%" x2="50%" y2="50%" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" />
        <line x1="15%" y1="85%" x2="50%" y2="50%" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" />
        <line x1="85%" y1="85%" x2="50%" y2="50%" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" />
      </svg>
    </div>
  );
};
