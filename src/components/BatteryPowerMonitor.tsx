import React, { useState, useEffect } from 'react';
import { PowerMonitorState } from '../types';
import { soundFx } from '../utils/soundEffects';
import { BatteryCharging, Zap, Gauge, Flame, Check } from 'lucide-react';

interface BatteryPowerMonitorProps {
  power: PowerMonitorState;
  onToggleBus: (bus: 'maskOptics' | 'wristController' | 'chestSensors' | 'holomatProjection') => void;
}

export const BatteryPowerMonitor: React.FC<BatteryPowerMonitorProps> = ({
  power,
  onToggleBus,
}) => {
  // Live fluctuating consumption wave for realism
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset((prev) => (prev + 1) % 60);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Generate SVG path points based on power consumption history
  const points = power.consumptionHistory;
  const maxVal = 100;
  const svgWidth = 180;
  const svgHeight = 42;

  const pathData = points.reduce((acc, val, index) => {
    const x = (index / (points.length - 1)) * svgWidth;
    const y = svgHeight - (val / maxVal) * (svgHeight - 6);
    return index === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
  }, '');

  const areaData = `${pathData} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

  return (
    <div 
      id="battery-power-monitor-panel"
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
            BATTERY/POWER MONITOR
          </h2>
        </div>
        <div className="flex items-center gap-1 font-mono-tech text-[10px] text-cyan-400/90">
          <Zap className="w-3 h-3 text-cyan-300 fill-cyan-400/20" />
          <span>{power.voltage}V Li-Po</span>
        </div>
      </div>

      {/* Main Grid: Left Battery Cell + Right Waveform Chart */}
      <div className="grid grid-cols-12 gap-3 items-center">
        
        {/* Left: Holographic Battery Cell */}
        <div className="col-span-4 flex flex-col items-center justify-center p-2 border border-cyan-500/25 bg-cyan-950/20 rounded">
          
          {/* Battery Top Terminal */}
          <div className="w-4 h-1.5 bg-cyan-400 rounded-t-sm mb-0.5 border border-cyan-300" />

          {/* Battery Body Frame */}
          <div className="relative w-12 h-20 border-2 border-cyan-400/80 rounded-sm p-0.5 bg-black/60 flex flex-col justify-end overflow-hidden">
            
            {/* Battery Fill Level with neon cyan glow */}
            <div 
              className="w-full bg-cyan-400 rounded-xs shadow-[0_0_12px_#00f0ff] transition-all duration-700 flex items-center justify-center relative overflow-hidden"
              style={{ height: `${power.batteryPercentage}%` }}
            >
              {/* Subtle internal charging scanline */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent animate-pulse" />
            </div>

            {/* Subtle cell divider lines */}
            <div className="absolute inset-x-0 top-1/4 h-[1px] bg-cyan-500/30" />
            <div className="absolute inset-x-0 top-2/4 h-[1px] bg-cyan-500/30" />
            <div className="absolute inset-x-0 top-3/4 h-[1px] bg-cyan-500/30" />
          </div>

          {/* Percentage readout below */}
          <div className="mt-1.5 font-orbitron font-extrabold text-sm text-white hud-glow-strong">
            {power.batteryPercentage}%
          </div>
          <span className="font-mono-tech text-[8px] text-cyan-400/70">
            {power.hoursRemaining}h REMAIN
          </span>
        </div>

        {/* Right: Consumption Readout + Area Waveform Graph */}
        <div className="col-span-8 space-y-2">
          
          {/* Power Level Readouts */}
          <div className="flex justify-between items-center text-[10px] font-rajdhani font-semibold border-b border-cyan-500/20 pb-1">
            <span className="text-cyan-300/80">POWER LEVEL</span>
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-white font-bold text-[11px] bg-cyan-950/80 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                {power.batteryPercentage}%
              </span>
            </div>
          </div>

          {/* Dual Consumption bars */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-mono-tech text-cyan-300/80">
              <span>CONSUMPTION</span>
              <span className="text-cyan-100">{power.currentDraw} A // 48W</span>
            </div>
            <div className="h-1.5 w-full bg-cyan-950 border border-cyan-500/40 rounded-sm overflow-hidden">
              <div 
                className="h-full bg-cyan-300 shadow-[0_0_8px_#00f0ff]" 
                style={{ width: `${Math.min(100, power.currentDraw * 25)}%` }}
              />
            </div>
          </div>

          {/* Real-time Waveform Area Chart matching reference */}
          <div className="relative pt-1">
            <div className="flex justify-between text-[8px] font-mono-tech text-cyan-400/60 pb-0.5">
              <span>10h</span>
              <span>8h</span>
              <span>6h</span>
              <span>4h</span>
              <span>2h</span>
              <span>NOW</span>
            </div>

            {/* SVG Waveform Line & Filled Gradient Area */}
            <div className="border border-cyan-500/30 bg-cyan-950/30 rounded p-1">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-10 overflow-visible">
                <defs>
                  <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="14" x2={svgWidth} y2="14" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
                <line x1="0" y1="28" x2={svgWidth} y2="28" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />

                {/* Area under curve */}
                <path d={areaData} fill="url(#powerGradient)" />
                {/* Curve line */}
                <path d={pathData} fill="none" stroke="#00f0ff" strokeWidth="1.5" />

                {/* Current live point pulsing node */}
                <circle 
                  cx={svgWidth} 
                  cy={svgHeight - (points[points.length - 1] / maxVal) * (svgHeight - 6)} 
                  r="2.5" 
                  fill="#ffffff" 
                  className="animate-ping origin-center" 
                />
              </svg>
            </div>
          </div>

        </div>

      </div>

      {/* Subsystem Bus Routing Toggles */}
      <div className="mt-3 grid grid-cols-4 gap-1 pt-2 border-t border-cyan-500/30 font-mono-tech text-[8px]">
        <button
          onClick={() => {
            soundFx.playHoloClick();
            onToggleBus('maskOptics');
          }}
          className={`p-1 border rounded text-center transition-all cursor-pointer ${
            power.buses.maskOptics 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' 
              : 'bg-black/40 border-cyan-900 text-cyan-700'
          }`}
          title="Toggle Mask Optics Bus"
        >
          MASK: {power.buses.maskOptics ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={() => {
            soundFx.playHoloClick();
            onToggleBus('wristController');
          }}
          className={`p-1 border rounded text-center transition-all cursor-pointer ${
            power.buses.wristController 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' 
              : 'bg-black/40 border-cyan-900 text-cyan-700'
          }`}
          title="Toggle Wrist Controller Bus"
        >
          WRIST: {power.buses.wristController ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={() => {
            soundFx.playHoloClick();
            onToggleBus('chestSensors');
          }}
          className={`p-1 border rounded text-center transition-all cursor-pointer ${
            power.buses.chestSensors 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' 
              : 'bg-black/40 border-cyan-900 text-cyan-700'
          }`}
          title="Toggle Chest Sensors Bus"
        >
          CHEST: {power.buses.chestSensors ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={() => {
            soundFx.playHoloClick();
            onToggleBus('holomatProjection');
          }}
          className={`p-1 border rounded text-center transition-all cursor-pointer ${
            power.buses.holomatProjection 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' 
              : 'bg-black/40 border-cyan-900 text-cyan-700'
          }`}
          title="Toggle Holomat HUD Bus"
        >
          HUD: {power.buses.holomatProjection ? 'ON' : 'OFF'}
        </button>
      </div>

    </div>
  );
};
