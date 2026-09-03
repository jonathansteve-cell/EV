/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import workshopBg from './assets/images/workshop_background_1788432906398.jpg';
import { 
  HolomatMode, 
  HeroSuitState, 
  WristControllerState, 
  PowerMonitorState, 
  CameraFeedState, 
  WorkshopState, 
  WorkshopProject, 
  SmartHomeState, 
  CommunicationMessage 
} from './types';
import { EvCore } from './components/EvCore';
import { HeroSuitStatus } from './components/HeroSuitStatus';
import { WristController } from './components/WristController';
import { BatteryPowerMonitor } from './components/BatteryPowerMonitor';
import { CameraFeed } from './components/CameraFeed';
import { Workshop3D } from './components/Workshop3D';
import { SmartHomeControl } from './components/SmartHomeControl';
import { JarvisConsole } from './components/JarvisConsole';
import { ApiKeyModal } from './components/ApiKeyModal';
import { soundFx } from './utils/soundEffects';
import { speechManager } from './utils/speechManager';
import { Key, Video, Activity, Sparkles } from 'lucide-react';

export default function App() {
  // Master Holomat Mode: 'suit' | 'workshop' | 'camera' | 'listening' | 'thinking' | 'standby'
  const [mode, setMode] = useState<HolomatMode>('suit');
  const [peppersGhostMode, setPeppersGhostMode] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);

  // Neural API Key state
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('jarvis_gemini_api_key') || '';
  });
  const [hasServerKey, setHasServerKey] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // Hands-free continuous voice conversation mode
  const [continuousVoice, setContinuousVoice] = useState<boolean>(() => {
    return localStorage.getItem('jarvis_continuous_voice') === 'true';
  });
  const continuousVoiceRef = useRef<boolean>(continuousVoice);
  useEffect(() => {
    continuousVoiceRef.current = continuousVoice;
    localStorage.setItem('jarvis_continuous_voice', String(continuousVoice));
  }, [continuousVoice]);

  // Multimodal Camera state
  const [isInspectingCamera, setIsInspectingCamera] = useState<boolean>(false);

  // Conversational memory for real-person continuity
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: "Systems online and standing by, sir. Ready for your directive." }
  ]);

  // Check key status on mount
  useEffect(() => {
    fetch('/api/key-status')
      .then(res => res.json())
      .then(data => {
        if (data.hasServerKey) setHasServerKey(true);
      })
      .catch(err => console.warn("Key status check notice:", err));
  }, []);

  // Save API key handler
  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('jarvis_gemini_api_key', newKey);
  };

  // JARVIS Intelligence State
  const [jarvisSpeech, setJarvisSpeech] = useState<string>(
    "JARVIS online, sir. E.V. hardware link verified at 88% battery. Holomat HUD ready."
  );
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);

  // Message Protocol Bus (MQTT / WebSocket simulation)
  const [messages, setMessages] = useState<CommunicationMessage[]>([
    {
      id: 'init-001',
      source: 'jarvis',
      target: 'ev',
      type: 'command',
      action: 'handshake',
      requestId: 'hs_001',
      timestamp: new Date().toISOString(),
      data: { client: 'jarvis_core_v4', protocol: 'mqtt' }
    },
    {
      id: 'init-002',
      source: 'ev',
      target: 'jarvis',
      type: 'status_update',
      action: 'status_ack',
      requestId: 'hs_001',
      timestamp: new Date().toISOString(),
      data: { device: 'ev_suit', battery: 88, mask_camera: 'online', wrist_link: 'stable' }
    }
  ]);

  const addProtocolMessage = useCallback((msg: Omit<CommunicationMessage, 'id' | 'timestamp'>) => {
    const newMsg: CommunicationMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev.slice(-40), newMsg]);
  }, []);

  // 1. HERO SUIT STATUS (E.V. Suit electronics)
  const [suit, setSuit] = useState<HeroSuitState>({
    health: 100,
    armor: 100,
    power: 100,
    vitals: {
      heartRate: 72,
      oxygenLevel: 98,
      coreTemp: 37.0,
    },
    maskModule: {
      camera: 'online',
      leftLens: 'ready',
      rightLens: 'ready',
      microphone: 'active',
      statusLed: 'cyan',
    },
    chestModule: {
      reactorStatus: 'nominal',
      outputWatts: 450,
      sensorMatrix: 'active',
    },
    features: {
      stealthWeave: false,
      armorLock: false,
      opticalZoom: 1.0,
    },
  });

  // 2. WRIST CONTROLLER (ESP32 Gauntlet)
  const [wrist, setWrist] = useState<WristControllerState>({
    esp32Status: 'LINK STABLE',
    battery: 100,
    signalStrength: 85,
    syncRate: 72,
    ledColour: 'cyan',
    vibrationActive: false,
    displayMode: 'telemetry',
    button1State: false,
    button2State: false,
  });

  // 3. BATTERY / POWER MONITOR (Main power bus)
  const [power, setPower] = useState<PowerMonitorState>({
    batteryPercentage: 88,
    voltage: 14.8,
    currentDraw: 3.2,
    hoursRemaining: 8.4,
    consumptionHistory: [45, 52, 48, 60, 58, 65, 54, 70, 68, 62, 75, 64],
    buses: {
      maskOptics: true,
      wristController: true,
      chestSensors: true,
      holomatProjection: true,
    },
  });

  // 4. CAMERA FEED (Tactical Viewport & Grid Map)
  const [camera, setCamera] = useState<CameraFeedState>({
    activeFeed: 'city_night',
    nightVision: false,
    motionDetected: true,
    iso: 1600,
    fps: 60,
    zoom: 2.4,
    gridTarget: {
      id: 'tgt_09',
      label: 'PERIMETER ROOFTOP',
      distance: '42M',
      sector: 'WEST-04',
      threat: 'none',
    },
  });

  // 5. 3D-PRINTING WORKSHOP (Holomat Fabrication System)
  const availableProjects: WorkshopProject[] = [
    {
      id: 'proj_wrist',
      name: 'Wrist Housing v2',
      category: 'Gauntlet Shell',
      dimensions: '50mm x 70mm x 14mm',
      material: 'Titanium-Carbon Composite',
      description: 'Ergonomic wrist controller enclosure with dual push-button cutouts and OLED bezel.',
      initialProgress: 76,
    },
    {
      id: 'proj_lens',
      name: 'Eye Lens Servo Frame',
      category: 'Mask Optics',
      dimensions: '42mm x 28mm x 8mm',
      material: 'Kevlar Poly-Mesh',
      description: 'Micro-aperture shutter chassis with dual servo mounting brackets.',
      initialProgress: 42,
    },
    {
      id: 'proj_chest',
      name: 'Chest Sensor Enclosure',
      category: 'Power Housing',
      dimensions: '85mm x 85mm x 18mm',
      material: 'Titanium Weave',
      description: 'Reinforced arc-reactor harness with dampening heat sinks.',
      initialProgress: 18,
    },
    {
      id: 'proj_nozzle',
      name: 'Web-Shooter Nozzle Mk IV',
      category: 'Fluid Mechanics',
      dimensions: '22mm x 15mm x 12mm',
      material: 'Conductive Tungsten Alloy',
      description: 'High-pressure variable aperture dispersion nozzle.',
      initialProgress: 90,
    }
  ];

  const [workshop, setWorkshop] = useState<WorkshopState>({
    selectedProject: availableProjects[0],
    progress: 76,
    isPrinting: true,
    layerCount: { current: 380, total: 500 },
    materials: {
      titaniumWeave: 100,
      kevlarMesh: 75,
      carbonFiber: 92,
      conductiveFilament: 88,
    },
  });

  // 6. SMART HOME CONTROL (Home Assistant & ESPHome layer)
  const [home, setHome] = useState<SmartHomeState>({
    lights: 'tactical_cyan',
    temperature: 21.5,
    securityArmed: true,
    ventilation: true,
    esphomeBridge: 'connected',
    airQualityAqi: 12,
  });

  // Periodic simulated telemetry fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate subtle current draw variance
      setPower(prev => ({
        ...prev,
        currentDraw: Number((3.0 + Math.random() * 0.5).toFixed(1)),
        consumptionHistory: [...prev.consumptionHistory.slice(1), Math.floor(55 + Math.random() * 25)]
      }));

      // Simulate 3D printing advancement if printing
      setWorkshop(prev => {
        if (!prev.isPrinting || prev.progress >= 100) return prev;
        const nextProgress = Math.min(100, prev.progress + 1);
        return {
          ...prev,
          progress: nextProgress,
          layerCount: {
            ...prev.layerCount,
            current: Math.floor((nextProgress / 100) * prev.layerCount.total)
          }
        };
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Start listening helper for voice interactions
  const startListeningInternal = useCallback(() => {
    setIsListening(true);
    setMode('listening');
    soundFx.playChirp();
    speechManager.startListening(
      (transcript) => {
        setIsListening(false);
        handleExecuteCommand(transcript);
      },
      (status) => {
        setIsListening(status);
        if (!status) {
          setMode(prev => (prev === 'listening' ? 'suit' : prev));
        }
      }
    );
  }, []);

  // Dispatch verbal output through SpeechManager and sound effect
  const speakAsJarvis = useCallback((text: string) => {
    setJarvisSpeech(text);
    setIsSpeaking(true);
    speechManager.speak(
      text,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false);
        // If continuous hands-free chat is enabled, resume listening automatically
        if (continuousVoiceRef.current) {
          setTimeout(() => {
            if (continuousVoiceRef.current && !speechManager.isCurrentlySpeaking()) {
              startListeningInternal();
            }
          }, 450);
        }
      }
    );
  }, [startListeningInternal]);

  // Main Command Handler (coordinates JARVIS software intelligence with E.V. and Holomat)
  const handleExecuteCommand = async (commandText: string) => {
    setMode('thinking');
    soundFx.playChirp();

    // Log user speech / request to protocol bus
    addProtocolMessage({
      source: 'jarvis',
      target: 'jarvis',
      type: 'command',
      action: 'process_natural_language',
      requestId: `req_${Date.now().toString().slice(-4)}`,
      data: { query: commandText }
    });

    try {
      // Send to server-side Gemini API route
      const response = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey || '',
        },
        body: JSON.stringify({
          prompt: commandText,
          conversationHistory: conversationHistory.slice(-6),
          suitState: {
            battery: power.batteryPercentage,
            health: suit.health,
            armor: suit.armor,
            maskCamera: suit.maskModule.camera,
            leftLens: suit.maskModule.leftLens,
            rightLens: suit.maskModule.rightLens,
            wristLink: wrist.esp32Status,
          },
          workshopState: {
            activeProject: workshop.selectedProject.name,
            progress: workshop.progress,
          },
          homeState: {
            temperature: `${home.temperature}°C`,
            securityMode: home.securityArmed ? 'Armed' : 'Disarmed',
            lights: home.lights,
          },
        }),
      });

      const result = await response.json();
      
      // Update UI mode
      if (result.holomat_mode) {
        setMode(result.holomat_mode as HolomatMode);
      } else {
        setMode('suit');
      }

      // Record conversational turn
      setConversationHistory(prev => [
        ...prev.slice(-6),
        { role: 'user', text: commandText },
        { role: 'assistant', text: result.speech }
      ]);

      // If E.V. hardware command was issued, dispatch it
      if (result.ev_command) {
        addProtocolMessage({
          source: 'jarvis',
          target: 'ev',
          type: 'command',
          command: result.ev_command.command,
          requestId: `ev_${Date.now().toString().slice(-4)}`,
          data: result.ev_command,
        });

        // Simulate E.V. hardware confirmation packet
        setTimeout(() => {
          addProtocolMessage({
            source: 'ev',
            target: 'jarvis',
            type: 'result',
            action: 'command_complete',
            requestId: `ev_${Date.now().toString().slice(-4)}`,
            data: {
              event: "command_complete",
              command: result.ev_command.command,
              result: "success"
            }
          });
          soundFx.playConfirmationChime();
        }, 500);
      }

      // Execute specific action side-effects
      if (result.action === 'diagnostics') {
        runSuitDiagnostics();
      } else if (result.action === 'patrol_mode') {
        setCamera(prev => ({ ...prev, activeFeed: 'city_night', nightVision: true }));
        setHome(prev => ({ ...prev, securityArmed: true, lights: 'tactical_cyan' }));
        setWrist(prev => ({ ...prev, ledColour: 'crimson' }));
      } else if (result.action === 'calibrate_lens') {
        calibrateLenses();
      } else if (result.action === 'workshop_print') {
        setWorkshop(prev => ({ ...prev, isPrinting: true }));
      } else if (result.action === 'stealth_mode') {
        setSuit(prev => ({ ...prev, features: { ...prev.features, stealthWeave: true } }));
        setHome(prev => ({ ...prev, lights: 'night_dim' }));
      }

      // Vocalize response
      speakAsJarvis(result.speech);

    } catch (err) {
      console.warn("API request fallback:", err);
      // Local fallback
      speakAsJarvis("Diagnostics nominal, sir. All telemetry channels are streaming at peak stability.");
      setMode('suit');
    }
  };

  // Multimodal Camera Frame Inspection Handler
  const handleCaptureInspect = async (imageBase64: string, promptText?: string) => {
    setIsInspectingCamera(true);
    setMode('thinking');
    soundFx.playDiagnosticSweep();

    const prompt = promptText || "Analyze what you see through my camera feed right now. Describe what is visible and talk to me naturally like a real person.";

    addProtocolMessage({
      source: 'jarvis',
      target: 'jarvis',
      type: 'command',
      action: 'multimodal_camera_inspection',
      requestId: `vis_${Date.now().toString().slice(-4)}`,
      data: { hasImage: Boolean(imageBase64), prompt }
    });

    try {
      const response = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey || '',
        },
        body: JSON.stringify({
          prompt,
          imageBase64,
          conversationHistory: conversationHistory.slice(-6),
          suitState: {
            battery: power.batteryPercentage,
            health: suit.health,
            armor: suit.armor,
            maskCamera: suit.maskModule.camera,
            leftLens: suit.maskModule.leftLens,
            rightLens: suit.maskModule.rightLens,
            wristLink: wrist.esp32Status,
          },
          workshopState: {
            activeProject: workshop.selectedProject.name,
            progress: workshop.progress,
          },
          homeState: {
            temperature: `${home.temperature}°C`,
            securityMode: home.securityArmed ? 'Armed' : 'Disarmed',
            lights: home.lights,
          },
        }),
      });

      const result = await response.json();
      
      if (result.holomat_mode) {
        setMode(result.holomat_mode as HolomatMode);
      } else {
        setMode('camera');
      }

      setConversationHistory(prev => [
        ...prev.slice(-6),
        { role: 'user', text: prompt },
        { role: 'assistant', text: result.speech }
      ]);

      speakAsJarvis(result.speech);

    } catch (err) {
      console.warn("Camera inspection error:", err);
      speakAsJarvis("I have visual contact on your optical feed, sir. Telemetry is stable.");
      setMode('camera');
    } finally {
      setIsInspectingCamera(false);
    }
  };

  // Run full suit diagnostics flow as detailed in prompt section 4
  const runSuitDiagnostics = () => {
    setIsDiagnosing(true);
    setMode('thinking');
    soundFx.playDiagnosticSweep();

    // 1. JARVIS sends diagnostic command to E.V.
    addProtocolMessage({
      source: 'jarvis',
      target: 'ev',
      type: 'command',
      action: 'run_diagnostics',
      requestId: `diag_${Date.now().toString().slice(-4)}`,
      data: { check: ['battery', 'buttons', 'camera', 'leds', 'motors'] }
    });

    setTimeout(() => {
      // 2. E.V. sends sensor data back
      addProtocolMessage({
        source: 'ev',
        target: 'jarvis',
        type: 'result',
        action: 'diagnostics_result',
        requestId: `diag_${Date.now().toString().slice(-4)}`,
        data: {
          battery: power.batteryPercentage,
          mask_camera: 'online',
          left_lens: 'calibrated',
          right_lens: 'ready',
          haptics: 'operational',
          holomat_connection: 'stable'
        }
      });

      setSuit(prev => ({
        ...prev,
        health: 100,
        armor: 100,
        power: 100,
        maskModule: {
          ...prev.maskModule,
          leftLens: 'ready',
          rightLens: 'ready',
          camera: 'online'
        }
      }));

      setIsDiagnosing(false);
      setMode('suit');
      soundFx.playConfirmationChime();

      speakAsJarvis(
        `Diagnostic complete. Battery at ${power.batteryPercentage} percent. Mask camera online. Right lens ready. Left lens calibrated. Holomat connection stable.`
      );
    }, 1200);
  };

  // Calibrate Lenses action
  const calibrateLenses = () => {
    soundFx.playChirp();
    setSuit(prev => ({
      ...prev,
      maskModule: {
        ...prev.maskModule,
        leftLens: 'calibrating',
        rightLens: 'calibrating'
      }
    }));

    setTimeout(() => {
      setSuit(prev => ({
        ...prev,
        maskModule: {
          ...prev.maskModule,
          leftLens: 'ready',
          rightLens: 'ready'
        }
      }));
      soundFx.playConfirmationChime();
      speakAsJarvis("Optical lens aperture calibrated and synchronized to the Holomat HUD.");
    }, 1000);
  };

  // Toggle voice recognition
  const handleToggleListen = () => {
    if (isListening) {
      speechManager.stopListening();
      setIsListening(false);
      setMode('suit');
    } else {
      setIsListening(true);
      setMode('listening');
      soundFx.playChirp();
      speechManager.startListening(
        (transcript) => {
          setIsListening(false);
          handleExecuteCommand(transcript);
        },
        (status) => {
          setIsListening(status);
          if (!status && mode === 'listening') {
            setMode('suit');
          }
        }
      );
    }
  };

  return (
    <div 
      className={`relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden transition-colors duration-700 ${
        peppersGhostMode ? 'bg-black' : 'bg-black'
      }`}
    >
      {/* Background Laboratory Interior Image (matches image.png) */}
      {!peppersGhostMode && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-65 pointer-events-none transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 20, 30, 0.4) 0%, rgba(0, 0, 0, 0.85) 85%), url(${workshopBg})`
          }}
        />
      )}

      {/* Cybernetic Scanlines & Ambient Grid Overlay */}
      <div className="absolute inset-0 scanlines-overlay pointer-events-none z-0" />

      {/* Top HUD Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-2.5 border-b border-cyan-500/30 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-ping" />
          <h1 className="font-orbitron font-extrabold text-sm sm:text-base tracking-[0.25em] text-white hud-glow">
            JARVIS <span className="text-cyan-400 font-normal">//</span> E.V. <span className="text-cyan-400 font-normal">//</span> HOLOMAT
          </h1>
        </div>

        {/* Global Quick Telemetry & Neural Key Connection */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono-tech text-[10px] text-cyan-300">
          <button
            onClick={() => {
              soundFx.playHoloClick();
              setIsApiKeyModalOpen(true);
            }}
            className={`px-2.5 py-1 rounded border transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
              apiKey || hasServerKey
                ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                : 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 hover:border-cyan-300'
            }`}
            title="Configure Gemini API Key and Neural Subsystems"
          >
            <Key className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden xs:inline">{apiKey || hasServerKey ? 'NEURAL LINK: ACTIVE' : 'CONNECT API KEY'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1">
            <span className="text-cyan-500">SUIT LINK:</span>
            <span className="text-white font-bold">STABLE (99.4%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-cyan-500">BATTERY:</span>
            <span className="text-white font-bold">{power.batteryPercentage}%</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <span className="text-cyan-500">FABRICATION:</span>
            <span className="text-white font-bold">{workshop.progress}%</span>
          </div>
        </div>
      </header>

      {/* Main Holomat Interface Grid (Matching image.png layout) */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-2 sm:px-6 py-4 max-w-7xl mx-auto w-full">
        
        {/* Responsive Grid of HUD Modules around the Center E.V. Core */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">

          {/* LEFT COLUMN: HERO SUIT STATUS + WRIST CONTROLLER + BATTERY MONITOR */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end gap-4 w-full">
            
            {/* Top Left: HERO SUIT STATUS */}
            <HeroSuitStatus
              suit={suit}
              onRunDiagnostics={runSuitDiagnostics}
              onToggleStealth={() => {
                const nextStealth = !suit.features.stealthWeave;
                setSuit(prev => ({ ...prev, features: { ...prev.features, stealthWeave: nextStealth } }));
                speakAsJarvis(nextStealth ? "Stealth weave engaged." : "Stealth weave deactivated.");
              }}
              onCalibrateLenses={calibrateLenses}
              isDiagnosing={isDiagnosing}
            />

            {/* Left Middle: WRIST CONTROLLER */}
            <WristController
              wrist={wrist}
              onTriggerVibrate={() => {
                setWrist(prev => ({ ...prev, vibrationActive: true }));
                soundFx.playHapticPulse();
                setTimeout(() => setWrist(prev => ({ ...prev, vibrationActive: false })), 900);
              }}
              onCycleLedColor={() => {
                const colors: ('cyan' | 'crimson' | 'amber' | 'emerald')[] = ['cyan', 'crimson', 'amber', 'emerald'];
                const nextColor = colors[(colors.indexOf(wrist.ledColour) + 1) % colors.length];
                setWrist(prev => ({ ...prev, ledColour: nextColor }));
                addProtocolMessage({
                  source: 'jarvis',
                  target: 'ev',
                  type: 'command',
                  command: 'set_wrist_led',
                  requestId: `led_${Date.now().toString().slice(-4)}`,
                  data: { led_colour: nextColor }
                });
              }}
              onPressButton={(btn) => {
                if (btn === 1) {
                  setWrist(prev => ({ ...prev, button1State: !prev.button1State }));
                  runSuitDiagnostics();
                } else {
                  setWrist(prev => ({ ...prev, button2State: !prev.button2State }));
                }
              }}
            />

            {/* Bottom Left: BATTERY/POWER MONITOR */}
            <BatteryPowerMonitor
              power={power}
              onToggleBus={(busKey) => {
                setPower(prev => ({
                  ...prev,
                  buses: {
                    ...prev.buses,
                    [busKey]: !prev.buses[busKey]
                  }
                }));
              }}
            />

          </div>

          {/* CENTER COLUMN: E.V. CORE (The animated cybernetic centerpiece) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center my-4 lg:my-0">
            <EvCore 
              mode={mode} 
              onCoreClick={() => {
                soundFx.playHapticPulse();
                runSuitDiagnostics();
              }}
              audioActive={isSpeaking || isListening}
            />
          </div>

          {/* RIGHT COLUMN: CAMERA FEED + 3D-PRINTING WORKSHOP + SMART-HOME CONTROL */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start gap-4 w-full">
            
            {/* Top Right: CAMERA FEED */}
            <CameraFeed
              camera={camera}
              onSwitchFeed={(feed) => {
                setCamera(prev => ({ ...prev, activeFeed: feed }));
                soundFx.playChirp();
              }}
              onToggleNightVision={() => {
                setCamera(prev => ({ ...prev, nightVision: !prev.nightVision }));
              }}
              onZoomChange={(delta) => {
                setCamera(prev => ({
                  ...prev,
                  zoom: Math.max(1.0, Math.min(8.0, prev.zoom + delta))
                }));
              }}
              onCaptureInspect={handleCaptureInspect}
              isInspecting={isInspectingCamera}
            />

            {/* Right Middle: 3D-PRINTING WORKSHOP */}
            <Workshop3D
              workshop={workshop}
              onTogglePrint={() => {
                const nextState = !workshop.isPrinting;
                setWorkshop(prev => ({ ...prev, isPrinting: nextState }));
                speakAsJarvis(nextState ? "Fabrication resumed." : "Fabrication paused.");
              }}
              onSelectProject={(project) => {
                setWorkshop(prev => ({
                  ...prev,
                  selectedProject: project,
                  progress: project.initialProgress,
                }));
                soundFx.playHoloClick();
              }}
              onSpeedUpPrint={() => {
                setWorkshop(prev => ({
                  ...prev,
                  progress: Math.min(100, prev.progress + 5)
                }));
              }}
            />

            {/* Bottom Right: SMART-HOME CONTROL */}
            <SmartHomeControl
              home={home}
              onCycleLights={() => {
                const modes: ('tactical_cyan' | 'high_work' | 'night_dim')[] = ['tactical_cyan', 'high_work', 'night_dim'];
                const nextMode = modes[(modes.indexOf(home.lights as any) + 1) % modes.length];
                setHome(prev => ({ ...prev, lights: nextMode }));
              }}
              onAdjustTemp={(delta) => {
                setHome(prev => ({
                  ...prev,
                  temperature: Number((prev.temperature + delta).toFixed(1))
                }));
              }}
              onToggleSecurity={() => {
                const nextSec = !home.securityArmed;
                setHome(prev => ({ ...prev, securityArmed: nextSec }));
                speakAsJarvis(nextSec ? "Perimeter defense armed in patrol mode." : "Perimeter security disarmed.");
              }}
              onToggleVentilation={() => {
                setHome(prev => ({ ...prev, ventilation: !prev.ventilation }));
              }}
            />

          </div>

        </div>

        {/* Spacing padding at bottom for the expandable JARVIS Console */}
        <div className="h-28 w-full" />
      </main>

      {/* Bottom Floating J.A.R.V.I.S. Command & Voice Intelligence Terminal */}
      <JarvisConsole
        mode={mode}
        jarvisSpeech={jarvisSpeech}
        isListening={isListening}
        isSpeaking={isSpeaking}
        messages={messages}
        peppersGhostMode={peppersGhostMode}
        audioMuted={audioMuted}
        continuousVoice={continuousVoice}
        hasApiKey={Boolean(apiKey || hasServerKey)}
        onSendCommand={handleExecuteCommand}
        onToggleListen={handleToggleListen}
        onToggleMute={() => {
          const nextMute = !audioMuted;
          setAudioMuted(nextMute);
          soundFx.setMuted(nextMute);
        }}
        onTogglePeppersGhost={() => {
          setPeppersGhostMode(!peppersGhostMode);
        }}
        onToggleContinuousVoice={() => {
          setContinuousVoice(prev => !prev);
          soundFx.playHoloClick();
        }}
        onOpenApiKeyModal={() => {
          setIsApiKeyModalOpen(true);
        }}
        onInspectCamera={() => {
          handleCaptureInspect('', "Analyze what you see through my camera feed and talk to me naturally about it.");
        }}
      />

      {/* Neural Core API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        hasServerKey={hasServerKey}
      />

    </div>
  );
}
