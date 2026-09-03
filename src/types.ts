export type HolomatMode = 'standby' | 'listening' | 'thinking' | 'suit' | 'workshop' | 'camera' | 'diagnostics';

export interface HeroSuitState {
  health: number; // 0 - 100
  armor: number;  // 0 - 100
  power: number;  // 0 - 100
  vitals: {
    heartRate: number;
    oxygenLevel: number;
    coreTemp: number;
  };
  maskModule: {
    camera: 'online' | 'standby' | 'scanning';
    leftLens: 'ready' | 'calibrating' | 'locked';
    rightLens: 'ready' | 'calibrating' | 'locked';
    microphone: 'active' | 'muted';
    statusLed: 'cyan' | 'crimson' | 'off';
  };
  chestModule: {
    reactorStatus: 'nominal' | 'overcharge' | 'emergency';
    outputWatts: number;
    sensorMatrix: 'active' | 'calibrating';
  };
  features: {
    stealthWeave: boolean;
    armorLock: boolean;
    opticalZoom: number;
  };
}

export interface WristControllerState {
  esp32Status: 'ONLINE' | 'LINK STABLE' | 'LINK SECURE' | 'SYNCED';
  battery: number;
  signalStrength: number;
  syncRate: number;
  ledColour: 'cyan' | 'crimson' | 'amber' | 'emerald';
  vibrationActive: boolean;
  displayMode: 'telemetry' | 'biometrics' | 'hud_mirror' | 'weapons';
  button1State: boolean;
  button2State: boolean;
}

export interface PowerMonitorState {
  batteryPercentage: number;
  voltage: number;
  currentDraw: number;
  hoursRemaining: number;
  consumptionHistory: number[];
  buses: {
    maskOptics: boolean;
    wristController: boolean;
    chestSensors: boolean;
    holomatProjection: boolean;
  };
}

export interface CameraFeedState {
  activeFeed: 'webcam' | 'city_night' | 'mask_optical' | 'workshop_lab';
  nightVision: boolean;
  motionDetected: boolean;
  iso: number;
  fps: number;
  zoom: number;
  webcamActive?: boolean;
  webcamError?: string | null;
  gridTarget: {
    id: string;
    label: string;
    distance: string;
    sector: string;
    threat: 'none' | 'low' | 'elevated';
  };
}

export interface WorkshopProject {
  id: string;
  name: string;
  category: string;
  dimensions: string;
  material: string;
  description: string;
  initialProgress: number;
}

export interface WorkshopState {
  selectedProject: WorkshopProject;
  progress: number;
  isPrinting: boolean;
  layerCount: { current: number; total: number };
  materials: {
    titaniumWeave: number;
    kevlarMesh: number;
    carbonFiber: number;
    conductiveFilament: number;
  };
}

export interface SmartHomeState {
  lights: 'tactical_cyan' | 'high_work' | 'night_dim' | 'off';
  temperature: number; // in Celsius (e.g. 21.5)
  securityArmed: boolean;
  ventilation: boolean;
  esphomeBridge: 'connected' | 'reconnecting';
  airQualityAqi: number;
}

export interface CommunicationMessage {
  id: string;
  source: 'jarvis' | 'ev' | 'holomat' | 'home_assistant';
  target: 'jarvis' | 'ev' | 'holomat' | 'home_assistant';
  type: 'command' | 'result' | 'status_update' | 'event';
  action?: string;
  command?: string;
  requestId: string;
  timestamp: string;
  data?: any;
}
