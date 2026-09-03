import React from 'react';
import { SmartHomeState } from '../types';
import { soundFx } from '../utils/soundEffects';
import { Home, Lightbulb, Thermometer, ShieldCheck, Fan, Radio } from 'lucide-react';

interface SmartHomeControlProps {
  home: SmartHomeState;
  onCycleLights: () => void;
  onAdjustTemp: (delta: number) => void;
  onToggleSecurity: () => void;
  onToggleVentilation: () => void;
}

export const SmartHomeControl: React.FC<SmartHomeControlProps> = ({
  home,
  onCycleLights,
  onAdjustTemp,
  onToggleSecurity,
  onToggleVentilation,
}) => {
  const getLightsLabel = (mode: string) => {
    switch (mode) {
      case 'tactical_cyan': return 'TACTICAL CYAN';
      case 'high_work': return 'WORK BENCH (100%)';
      case 'night_dim': return 'STEALTH / DIM';
      default: return 'STANDBY';
    }
  };

  return (
    <div 
      id="smart-home-control-panel"
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
            SMART-HOME CONTROL
          </h2>
        </div>
        <div className="flex items-center gap-1 font-mono-tech text-[10px] text-cyan-400/90">
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>HA // ESPHOME</span>
        </div>
      </div>

      {/* Main Grid: Left Holographic House Icon + Right Status Controls matching image.png */}
      <div className="grid grid-cols-12 gap-3 items-center">
        
        {/* Left: Holographic House Graphic from reference image */}
        <div className="col-span-5 flex flex-col items-center justify-center p-2 border border-cyan-500/25 bg-cyan-950/20 rounded h-32">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Ambient circular radar ring behind house */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed animate-spin-slow" />
            
            {/* SVG Sci-Fi Smart Home Outline */}
            <svg viewBox="0 0 100 100" className="w-16 h-16 text-cyan-300">
              {/* Roof */}
              <polygon points="50,15 88,48 80,52 50,26 20,52 12,48" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinejoin="round" />
              {/* House walls */}
              <path d="M 24 50 L 24 85 L 76 85 L 76 50" fill="none" stroke="#00f0ff" strokeWidth="2" />
              {/* Chimney / Antenna */}
              <line x1="72" y1="20" x2="72" y2="35" stroke="#00f0ff" strokeWidth="1.5" />
              <circle cx="72" cy="18" r="2" fill="#00f0ff" className="animate-ping origin-center" />
              {/* Smart Door & Keyhole */}
              <rect x="42" y="58" width="16" height="27" fill="#002233" stroke="#00f0ff" strokeWidth="1.2" />
              <circle cx="50" cy="70" r="2" fill="#00f0ff" />
            </svg>
          </div>

          <span className="font-mono-tech text-[8px] text-cyan-400/80 mt-1">
            LAB PERIMETER
          </span>
        </div>

        {/* Right: Stacked Controls matching image.png */}
        <div className="col-span-7 space-y-2 font-mono-tech text-[10px]">
          
          {/* Lights toggle row */}
          <button
            onClick={() => {
              soundFx.playHoloClick();
              onCycleLights();
            }}
            className="w-full flex items-center justify-between p-1.5 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 rounded transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-1.5 text-cyan-200">
              <Lightbulb className="w-3 h-3 text-cyan-300" />
              <span>LIGHTS</span>
            </div>
            <span className="text-[9px] text-white font-semibold">
              {getLightsLabel(home.lights)}
            </span>
          </button>

          {/* Temperature adjustment row */}
          <div className="flex items-center justify-between p-1.5 bg-cyan-950/40 border border-cyan-500/30 rounded">
            <div className="flex items-center gap-1.5 text-cyan-200">
              <Thermometer className="w-3 h-3 text-cyan-300" />
              <span>TEMPERATURE</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundFx.playHoloClick();
                  onAdjustTemp(-0.5);
                }}
                className="w-4 h-4 rounded bg-cyan-900/80 hover:bg-cyan-800 text-white font-bold flex items-center justify-center text-[10px] cursor-pointer"
              >
                -
              </button>
              <span className="text-[10px] text-white font-bold font-mono-tech px-1">
                {home.temperature.toFixed(1)}°C
              </span>
              <button
                onClick={() => {
                  soundFx.playHoloClick();
                  onAdjustTemp(0.5);
                }}
                className="w-4 h-4 rounded bg-cyan-900/80 hover:bg-cyan-800 text-white font-bold flex items-center justify-center text-[10px] cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Security Mode toggle row */}
          <button
            onClick={() => {
              soundFx.playChirp();
              onToggleSecurity();
            }}
            className={`w-full flex items-center justify-between p-1.5 rounded border transition-all cursor-pointer text-left ${
              home.securityArmed 
                ? 'bg-red-950/40 border-red-500/50 text-red-300' 
                : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-current" />
              <span>SECURITY</span>
            </div>
            <span className="text-[9px] font-bold text-white">
              {home.securityArmed ? 'ARMED // PATROL' : 'DISARMED'}
            </span>
          </button>

        </div>

      </div>

      {/* Bottom Sub-row: Ventilation & Air Quality */}
      <div className="mt-3 grid grid-cols-2 gap-1.5 pt-2 border-t border-cyan-500/30 font-mono-tech text-[8px]">
        <button
          onClick={() => {
            soundFx.playHoloClick();
            onToggleVentilation();
          }}
          className={`p-1 border rounded text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
            home.ventilation 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100' 
              : 'bg-black/40 border-cyan-900 text-cyan-600'
          }`}
        >
          <Fan className={`w-2.5 h-2.5 ${home.ventilation ? 'animate-spin' : ''}`} />
          VENTILATION: {home.ventilation ? 'ACTIVE' : 'OFF'}
        </button>

        <div className="p-1 bg-cyan-950/30 border border-cyan-500/30 rounded text-center text-cyan-300 flex items-center justify-center gap-1">
          <span>AQI: {home.airQualityAqi} (CLEAN)</span>
        </div>
      </div>

    </div>
  );
};
