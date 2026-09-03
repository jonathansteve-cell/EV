import React from 'react';
import { WristControllerState } from '../types';
import { soundFx } from '../utils/soundEffects';
import { Radio, Wifi, Vibrate, Cpu, Check, Circle } from 'lucide-react';

interface WristControllerProps {
  wrist: WristControllerState;
  onTriggerVibrate: () => void;
  onCycleLedColor: () => void;
  onPressButton: (btnIndex: 1 | 2) => void;
}

export const WristController: React.FC<WristControllerProps> = ({
  wrist,
  onTriggerVibrate,
  onCycleLedColor,
  onPressButton,
}) => {
  const getLedColorClass = (color: string) => {
    switch (color) {
      case 'crimson': return 'bg-red-500 shadow-[0_0_10px_#ef4444] text-red-400';
      case 'amber': return 'bg-amber-400 shadow-[0_0_10px_#f59e0b] text-amber-300';
      case 'emerald': return 'bg-emerald-400 shadow-[0_0_10px_#10b981] text-emerald-300';
      default: return 'bg-cyan-400 shadow-[0_0_10px_#00f0ff] text-cyan-300';
    }
  };

  return (
    <div 
      id="wrist-controller-panel"
      className="relative p-3.5 sm:p-4 rounded-lg border border-cyan-500/50 bg-black/60 backdrop-blur-md hud-box-glow text-cyan-300 w-full max-w-sm transition-all duration-300 hover:border-cyan-400"
    >
      {/* Sci-Fi Corner Accents */}
      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-300" />
      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-300" />
      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-300" />
      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-300" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <h2 className="font-orbitron font-bold text-xs sm:text-sm tracking-wider text-cyan-100 hud-glow uppercase">
            WRIST CONTROLLER
          </h2>
        </div>
        <div className="flex items-center gap-1 font-mono-tech text-[10px] text-cyan-400/90">
          <Wifi className="w-3 h-3 text-cyan-400" />
          <span>ESP32 BT/WIFI</span>
        </div>
      </div>

      {/* Controller Blueprint & Link Status Grid */}
      <div className="grid grid-cols-12 gap-3 items-center">
        
        {/* Left: Futuristic Wrist Unit / Smartwatch Wireframe */}
        <div className="col-span-6 relative flex flex-col items-center justify-center p-2 border border-cyan-500/25 bg-cyan-950/20 rounded">
          
          {/* Side percentage gauges matching reference UI */}
          <div className="absolute left-1 top-2 font-mono-tech text-[8px] text-cyan-300/80">
            100%
          </div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 font-mono-tech text-[8px] text-cyan-300/80">
            35%
          </div>
          <div className="absolute left-1 bottom-2 font-mono-tech text-[8px] text-cyan-300/80">
            72%
          </div>

          {/* SVG Smartwatch / Gauntlet Device Blueprint */}
          <svg viewBox="0 0 100 130" className="w-24 h-32 overflow-visible">
            {/* Wrist Strap upper & lower */}
            <path d="M 35 5 L 65 5 L 63 30 L 37 30 Z" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 37 100 L 63 100 L 65 125 L 35 125 Z" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="2 2" />

            {/* Main Enclosure */}
            <rect x="25" y="30" width="50" height="70" rx="8" fill="#001420" stroke="#00f0ff" strokeWidth="1.5" />
            
            {/* Inner Bezel */}
            <rect x="29" y="34" width="42" height="62" rx="5" fill="#000810" stroke="#00d2ff" strokeWidth="0.8" />

            {/* Simulated OLED Circular Display */}
            <circle cx="50" cy="65" r="16" fill="#001018" stroke="#00f0ff" strokeWidth="1" />
            <circle cx="50" cy="65" r="12" fill="none" stroke="#67e8f9" strokeWidth="0.5" strokeDasharray="3 2" className="animate-spin-slow origin-center" />

            {/* Center Core node */}
            <circle cx="50" cy="65" r="4" fill="#00f0ff" className={wrist.vibrationActive ? 'animate-ping' : ''} />

            {/* RGB Status LED on Gauntlet */}
            <circle cx="68" cy="40" r="2.5" className={getLedColorClass(wrist.ledColour)} />

            {/* Hardware Buttons on side of enclosure */}
            <rect 
              x="75" y="44" width="4" height="12" rx="1" 
              fill={wrist.button1State ? '#ffffff' : '#00f0ff'} 
              stroke="#00f0ff" strokeWidth="0.5" 
            />
            <rect 
              x="75" y="68" width="4" height="12" rx="1" 
              fill={wrist.button2State ? '#ffffff' : '#00f0ff'} 
              stroke="#00f0ff" strokeWidth="0.5" 
            />
          </svg>

          {/* Haptic pulse active banner */}
          {wrist.vibrationActive && (
            <div className="absolute inset-0 bg-cyan-400/20 rounded flex items-center justify-center pointer-events-none backdrop-blur-xs">
              <span className="font-mono-tech text-[9px] font-bold text-white bg-black/80 px-2 py-0.5 rounded border border-cyan-300 animate-bounce">
                HAPTIC PULSE
              </span>
            </div>
          )}

          <div className="font-mono-tech text-[8px] text-cyan-300 mt-1">
            ESP32 S3 // GAUNTLET
          </div>
        </div>

        {/* Right: Stacked Link Status matching image.png */}
        <div className="col-span-6 space-y-1.5 font-mono-tech text-[10px]">
          <div className="text-[9px] tracking-wider text-cyan-400/70 border-b border-cyan-500/20 pb-0.5">
            LINK STATUS
          </div>
          
          <div className="flex items-center justify-between bg-cyan-950/40 px-2 py-1 rounded border border-cyan-500/30">
            <span className="text-white text-[9px] font-semibold">LINK ONLINE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff] animate-pulse" />
          </div>

          <div className="flex items-center justify-between bg-cyan-950/40 px-2 py-1 rounded border border-cyan-500/30">
            <span className="text-cyan-200 text-[9px]">LINK STABLE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
          </div>

          <div className="flex items-center justify-between bg-cyan-950/40 px-2 py-1 rounded border border-cyan-500/30">
            <span className="text-cyan-200 text-[9px]">LINK SECURE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
          </div>

          <div className="flex items-center justify-between bg-cyan-950/40 px-2 py-1 rounded border border-cyan-500/30">
            <span className="text-cyan-200 text-[9px]">LINK STABLE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
          </div>

          <div className="flex items-center justify-between bg-cyan-950/40 px-2 py-1 rounded border border-cyan-500/30">
            <span className="text-cyan-200 text-[9px]">LINK SECURE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
          </div>
        </div>

      </div>

      {/* Interactive Hardware Buttons */}
      <div className="mt-3 grid grid-cols-3 gap-1.5 pt-2 border-t border-cyan-500/30">
        <button
          id="btn-trigger-vibrate"
          onClick={() => {
            soundFx.playHapticPulse();
            onTriggerVibrate();
          }}
          className="px-1.5 py-1 text-[9px] font-rajdhani font-bold tracking-wider uppercase bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded text-cyan-200 transition-all hover:hud-glow flex items-center justify-center gap-1 cursor-pointer"
        >
          <Vibrate className="w-2.5 h-2.5 text-cyan-300" />
          TEST HAPTIC
        </button>

        <button
          id="btn-cycle-led"
          onClick={() => {
            soundFx.playHoloClick();
            onCycleLedColor();
          }}
          className="px-1.5 py-1 text-[9px] font-rajdhani font-bold tracking-wider uppercase bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded text-cyan-200 transition-all hover:hud-glow flex items-center justify-center gap-1 cursor-pointer"
        >
          <Circle className={`w-2.5 h-2.5 fill-current ${getLedColorClass(wrist.ledColour)}`} />
          LED: {wrist.ledColour}
        </button>

        <button
          id="btn-press-hw-btn"
          onClick={() => {
            soundFx.playChirp();
            onPressButton(1);
          }}
          className="px-1.5 py-1 text-[9px] font-rajdhani font-bold tracking-wider uppercase bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 rounded text-cyan-200 transition-all hover:hud-glow flex items-center justify-center gap-1 cursor-pointer"
        >
          <Radio className="w-2.5 h-2.5 text-cyan-300" />
          TRIG BTN 1
        </button>
      </div>

    </div>
  );
};
