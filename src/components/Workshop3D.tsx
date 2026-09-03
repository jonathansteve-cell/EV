import React from 'react';
import { WorkshopState, WorkshopProject } from '../types';
import { soundFx } from '../utils/soundEffects';
import { Printer, Box, Play, Pause, RefreshCw, Cpu, Layers } from 'lucide-react';

interface Workshop3DProps {
  workshop: WorkshopState;
  onTogglePrint: () => void;
  onSelectProject: (project: WorkshopProject) => void;
  onSpeedUpPrint: () => void;
}

export const Workshop3D: React.FC<Workshop3DProps> = ({
  workshop,
  onTogglePrint,
  onSelectProject,
  onSpeedUpPrint,
}) => {
  return (
    <div 
      id="workshop-3d-panel"
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
            3D-PRINTING WORKSHOP
          </h2>
        </div>
        <span className="font-mono-tech text-[9px] text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 px-1.5 py-0.5 rounded">
          {workshop.isPrinting ? 'FABRICATING' : 'PAUSED'}
        </span>
      </div>

      {/* Fabrication Area: Robotic Arm Graphic + Progress Ring */}
      <div className="grid grid-cols-12 gap-3 items-center">
        
        {/* Left: Holographic Robotic Arm & 3D Printed Isometric Cube matching reference */}
        <div className="col-span-7 relative flex flex-col items-center justify-center p-2 border border-cyan-500/25 bg-cyan-950/20 rounded h-36 overflow-hidden">
          
          {/* SVG Robotic 3D Sintering Arm & Isometric Part */}
          <svg viewBox="0 0 160 120" className="w-full h-full overflow-visible">
            {/* Robotic Arm Base & Joint */}
            <rect x="15" y="90" width="30" height="12" rx="2" fill="#001824" stroke="#00f0ff" strokeWidth="1.2" />
            <circle cx="30" cy="90" r="7" fill="#002b40" stroke="#00f0ff" strokeWidth="1" />

            {/* Arm Segment 1 */}
            <line x1="30" y1="90" x2="55" y2="45" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" />
            <circle cx="55" cy="45" r="5" fill="#003550" stroke="#00d2ff" strokeWidth="1" />

            {/* Arm Segment 2 (Upper Forearm) */}
            <line x1="55" y1="45" x2="100" y2="35" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="100" cy="35" r="4" fill="#003550" stroke="#00d2ff" strokeWidth="1" />

            {/* Extruder Head / Laser Nozzle */}
            <path d="M 100 35 L 105 55 L 95 55 Z" fill="#002b40" stroke="#00f0ff" strokeWidth="1" />

            {/* Laser Printing Sintering Beam when printing */}
            {workshop.isPrinting && (
              <g>
                <line x1="100" y1="55" x2="115" y2="78" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />
                <circle cx="115" cy="78" r="3" fill="#00f0ff" className="animate-ping origin-center" />
              </g>
            )}

            {/* Holographic Isometric 3D Cube / Part being printed */}
            <g transform="translate(100, 68)" stroke="#00f0ff" strokeWidth="1.2" fill="none">
              {/* Isometric Top Face */}
              <polygon points="15,0 30,8 15,16 0,8" fill="rgba(0, 240, 255, 0.2)" />
              {/* Isometric Left Face */}
              <polygon points="0,8 15,16 15,32 0,24" fill="rgba(0, 240, 255, 0.1)" />
              {/* Isometric Right Face */}
              <polygon points="15,16 30,8 30,24 15,32" fill="rgba(0, 240, 255, 0.3)" />

              {/* Wireframe Internal Geometry */}
              <line x1="15" y1="16" x2="15" y2="24" stroke="#a5f3fc" strokeWidth="0.8" strokeDasharray="2 1" />
            </g>

            {/* Base platform grid */}
            <line x1="10" y1="105" x2="150" y2="105" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
          </svg>

          {/* Active Project Title Badge */}
          <div className="absolute bottom-1 left-2 font-mono-tech text-[8px] text-cyan-300 truncate max-w-[120px]">
            {workshop.selectedProject.name}
          </div>
        </div>

        {/* Right: Circular Progress Gauge (76%) matching image.png */}
        <div className="col-span-5 flex flex-col items-center justify-center">
          
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* SVG Circular Progress Meter */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#002b40"
                strokeWidth="7"
              />
              {/* Progress Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="7"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - workshop.progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500 shadow-[0_0_10px_#00f0ff]"
              />
            </svg>

            {/* Center Percentage Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-orbitron font-extrabold text-base sm:text-lg text-white hud-glow-strong">
                {workshop.progress}%
              </span>
              <span className="font-mono-tech text-[7px] text-cyan-300 uppercase tracking-tighter">
                COMPLETE
              </span>
            </div>
          </div>

          <div className="font-mono-tech text-[8px] text-cyan-400/80 mt-1 text-center">
            LAYERS: {workshop.layerCount.current}/{workshop.layerCount.total}
          </div>

        </div>

      </div>

      {/* Material Schematic Bars matching image.png */}
      <div className="mt-2.5 pt-2 border-t border-cyan-500/25 space-y-1">
        <div className="flex justify-between items-center text-[9px] font-mono-tech text-cyan-400/80">
          <span className="tracking-wider">MATERIAL SCHEMATIC</span>
          <span className="text-cyan-200">EXTRUDER: 245°C</span>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] font-mono-tech">
          <div>
            <div className="flex justify-between text-[8px] text-cyan-300">
              <span>TITANIUM WEAVE</span>
              <span>{workshop.materials.titaniumWeave}%</span>
            </div>
            <div className="h-1 w-full bg-cyan-950 rounded overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${workshop.materials.titaniumWeave}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[8px] text-cyan-300">
              <span>KEVLAR MESH</span>
              <span>{workshop.materials.kevlarMesh}%</span>
            </div>
            <div className="h-1 w-full bg-cyan-950 rounded overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${workshop.materials.kevlarMesh}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[8px] text-cyan-300">
              <span>CARBON FIBER</span>
              <span>{workshop.materials.carbonFiber}%</span>
            </div>
            <div className="h-1 w-full bg-cyan-950 rounded overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${workshop.materials.carbonFiber}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[8px] text-cyan-300">
              <span>CONDUCTIVE FILAMENT</span>
              <span>{workshop.materials.conductiveFilament}%</span>
            </div>
            <div className="h-1 w-full bg-cyan-950 rounded overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${workshop.materials.conductiveFilament}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="mt-3 grid grid-cols-2 gap-1.5 pt-2 border-t border-cyan-500/30 font-mono-tech text-[9px]">
        <button
          id="btn-toggle-print"
          onClick={() => {
            soundFx.playHoloClick();
            onTogglePrint();
          }}
          className={`px-1.5 py-1 border rounded text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            workshop.isPrinting
              ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
              : 'bg-cyan-500/20 border-cyan-400 text-cyan-100 font-bold'
          }`}
        >
          {workshop.isPrinting ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {workshop.isPrinting ? 'PAUSE PRINT' : 'RESUME PRINT'}
        </button>

        <button
          id="btn-speed-up-print"
          onClick={() => {
            soundFx.playChirp();
            onSpeedUpPrint();
          }}
          className="px-1.5 py-1 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/40 rounded text-cyan-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Layers className="w-3 h-3 text-cyan-400" />
          ADVANCE +5%
        </button>
      </div>

    </div>
  );
};
