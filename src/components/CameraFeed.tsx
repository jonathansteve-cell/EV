import React, { useState, useEffect, useRef } from 'react';
import { CameraFeedState } from '../types';
import { soundFx } from '../utils/soundEffects';
import { Video, Crosshair, Eye, ShieldAlert, Radio, Maximize2, Camera, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface CameraFeedProps {
  camera: CameraFeedState;
  onSwitchFeed: (feed: 'webcam' | 'city_night' | 'mask_optical' | 'workshop_lab') => void;
  onToggleNightVision: () => void;
  onZoomChange: (delta: number) => void;
  onCaptureInspect?: (imageBase64: string, customPrompt?: string) => void;
  isInspecting?: boolean;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  camera,
  onSwitchFeed,
  onToggleNightVision,
  onZoomChange,
  onCaptureInspect,
  isInspecting = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);
  const [isConnectingCamera, setIsConnectingCamera] = useState<boolean>(false);
  const [cameraDeviceLabel, setCameraDeviceLabel] = useState<string>('Live Webcam');

  // Activate / deactivate real webcam stream based on activeFeed
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const startWebcam = async () => {
      if (camera.activeFeed !== 'webcam') {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        return;
      }

      setIsConnectingCamera(true);
      setCameraPermissionError(null);

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API is not supported on this device/browser.');
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: false,
        });

        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(e => console.warn("Video play notice:", e));
        }

        // Get track label
        const videoTrack = mediaStream.getVideoTracks()[0];
        if (videoTrack) {
          setCameraDeviceLabel(videoTrack.label || 'Webcam Optic');
        }

        soundFx.playConfirmationChime();
      } catch (err: any) {
        console.warn("Camera access failed:", err);
        setCameraPermissionError(err.message || 'Camera permission denied or device not found.');
      } finally {
        setIsConnectingCamera(false);
      }
    };

    startWebcam();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [camera.activeFeed]);

  // Make sure videoRef gets the stream if it mounts
  useEffect(() => {
    if (videoRef.current && stream && camera.activeFeed === 'webcam') {
      videoRef.current.srcObject = stream;
    }
  }, [stream, camera.activeFeed]);

  // Capture frame from current video or synthetic feed and trigger JARVIS multimodal inspection
  const captureAndInspect = () => {
    soundFx.playDiagnosticSweep();

    if (camera.activeFeed === 'webcam' && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        if (onCaptureInspect) {
          onCaptureInspect(dataUrl, "Inspect what you see in front of my camera right now. Tell me what you see, give your candid thoughts, and speak to me like a real person.");
        }
        return;
      }
    }

    // Fallback if not using real webcam: still analyze the tactical feed
    if (onCaptureInspect) {
      onCaptureInspect('', "Analyze the current tactical camera optical feed and provide your assessment.");
    }
  };

  return (
    <div 
      id="camera-feed-panel"
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
          <div className={`w-2 h-2 rounded-full ${camera.activeFeed === 'webcam' ? 'bg-emerald-400 animate-pulse' : 'bg-red-500 animate-ping'}`} />
          <h2 className="font-orbitron font-bold text-xs sm:text-sm tracking-wider text-cyan-100 hud-glow uppercase">
            {camera.activeFeed === 'webcam' ? 'OPTICAL CAMERA [LIVE]' : 'CAMERA FEED'}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 font-mono-tech text-[10px] text-cyan-400/90">
          <span className={camera.activeFeed === 'webcam' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
            {camera.activeFeed === 'webcam' ? 'LIVE' : 'REC'}
          </span>
          <span className="text-white">00:42:18</span>
        </div>
      </div>

      {/* Main Tactical Viewport & Grid Map */}
      <div className="relative w-full h-44 bg-black rounded border border-cyan-500/40 overflow-hidden group">
        
        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* 1. REAL LIVE WEBCAM FEED */}
        {camera.activeFeed === 'webcam' ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {isConnectingCamera && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 z-20 font-mono-tech text-xs text-cyan-300">
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                <span>CONNECTING HARDWARE CAMERA...</span>
              </div>
            )}

            {cameraPermissionError ? (
              <div className="absolute inset-0 p-3 flex flex-col items-center justify-center text-center gap-1.5 bg-red-950/70 z-20 text-red-200 font-mono-tech text-[10px]">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="font-bold">CAMERA PERMISSION REQUIRED</span>
                <p className="text-[9px] text-red-300/90">Allow camera permission in browser or test feed.</p>
                <button
                  onClick={() => onSwitchFeed('webcam')}
                  className="mt-1 px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded text-[9px] font-bold cursor-pointer"
                >
                  RETRY CONNECTION
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-all duration-300 ${
                  camera.nightVision ? 'brightness-125 contrast-150 hue-rotate-90 saturate-200' : 'brightness-100'
                }`}
              />
            )}
          </div>
        ) : (
          /* 2. SYNTHETIC VIDEO FEED BACKGROUND LAYER */
          <div 
            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
              camera.nightVision ? 'brightness-125 contrast-150 hue-rotate-90' : 'brightness-90'
            }`}
            style={{
              backgroundImage: camera.activeFeed === 'city_night'
                ? 'radial-gradient(circle at 50% 70%, rgba(0,240,255,0.15) 0%, rgba(0,0,0,0.85) 90%), url("https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80")'
                : camera.activeFeed === 'mask_optical'
                ? 'radial-gradient(circle at 50% 50%, rgba(0,240,255,0.2) 0%, rgba(0,10,20,0.9) 80%), url("https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80")'
                : 'radial-gradient(circle at 50% 50%, rgba(0,240,255,0.15) 0%, rgba(0,0,0,0.85) 90%), url("https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80")'
            }}
          />
        )}

        {/* Scanline CRT overlay */}
        <div className="absolute inset-0 scanlines-overlay pointer-events-none opacity-40" />

        {/* Tactical Crosshairs & Targeting box */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-16 h-16 border border-cyan-400/50 rounded-sm">
            <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-cyan-400/40" />
            <div className="absolute top-0 left-1/2 w-[0.5px] h-full bg-cyan-400/40" />
            <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-cyan-300" />
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t border-r border-cyan-300" />
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b border-l border-cyan-300" />
            <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-cyan-300" />
          </div>
        </div>

        {/* Top Right: "GRID MAP" tactical radar overlay widget */}
        <div className="absolute top-2 right-2 p-1 bg-black/80 border border-cyan-500/60 rounded backdrop-blur-xs">
          <div className="font-mono-tech text-[7px] text-cyan-300 text-center tracking-wider pb-0.5 border-b border-cyan-500/30">
            GRID MAP
          </div>
          <div className="relative w-10 h-10 overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 50 50" className="w-full h-full">
              <line x1="0" y1="25" x2="50" y2="25" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="1 2" opacity="0.6" />
              <line x1="25" y1="0" x2="25" y2="50" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="1 2" opacity="0.6" />
              <circle cx="25" cy="25" r="12" fill="none" stroke="#00f0ff" strokeWidth="0.5" opacity="0.5" />
              <circle cx="25" cy="25" r="22" fill="none" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />
              <circle cx="34" cy="18" r="1.5" fill="#ef4444" className="animate-ping" />
              <circle cx="34" cy="18" r="1.5" fill="#ef4444" />
            </svg>
          </div>
        </div>

        {/* Top Left: Live Status Tag */}
        <div className="absolute top-2 left-2 bg-black/80 border border-cyan-500/50 px-1.5 py-0.5 rounded font-mono-tech text-[8px] text-cyan-200">
          <div>FEED: {camera.activeFeed === 'webcam' ? 'MY DEVICE CAMERA' : camera.activeFeed.toUpperCase()}</div>
          <div className="text-[7px] text-cyan-400/80">
            {camera.activeFeed === 'webcam' ? (cameraDeviceLabel || 'Active Stream') : `RNG: ${camera.gridTarget.distance} // ${camera.gridTarget.sector}`}
          </div>
        </div>

        {/* Quick Trigger: "JARVIS INSPECT / SCAN" */}
        <button
          onClick={captureAndInspect}
          disabled={isInspecting}
          className="absolute bottom-6 right-2 px-2 py-1 bg-cyan-400 hover:bg-cyan-300 text-black font-orbitron font-bold text-[9px] rounded flex items-center gap-1 shadow-[0_0_10px_#00f0ff] cursor-pointer transition-all"
          title="Capture frame and have JARVIS analyze what he sees out loud"
        >
          {isInspecting ? (
            <>
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>ANALYZING...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-2.5 h-2.5" />
              <span>ASK JARVIS WHAT HE SEES</span>
            </>
          )}
        </button>

        {/* Bottom Bar: Telemetry metadata */}
        <div className="absolute bottom-1 inset-x-1 flex justify-between items-center px-1.5 py-0.5 bg-black/75 border border-cyan-500/30 rounded font-mono-tech text-[8px] text-cyan-300">
          <span>{camera.activeFeed === 'webcam' ? 'DEVICE CAM' : camera.activeFeed.toUpperCase()}</span>
          <span>ISO {camera.iso}</span>
          <span>{camera.fps} FPS</span>
          <span className="text-white font-bold">{camera.zoom.toFixed(1)}x ZOOM</span>
        </div>
      </div>

      {/* Camera Controls & Selector Chips */}
      <div className="mt-2.5 grid grid-cols-4 gap-1 pt-2 border-t border-cyan-500/30 font-mono-tech text-[8px]">
        {/* Real Live Webcam Button */}
        <button
          onClick={() => {
            soundFx.playChirp();
            onSwitchFeed('webcam');
          }}
          className={`px-1 py-1 border rounded text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            camera.activeFeed === 'webcam'
              ? 'bg-emerald-500/30 border-emerald-400 text-white font-bold shadow-[0_0_8px_#10b981]'
              : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40'
          }`}
        >
          <Camera className="w-2.5 h-2.5 mb-0.5 text-emerald-400" />
          <span>MY CAMERA</span>
        </button>

        <button
          onClick={() => {
            soundFx.playChirp();
            onSwitchFeed('city_night');
          }}
          className={`px-1 py-1 border rounded text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            camera.activeFeed === 'city_night'
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100 font-bold'
              : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400'
          }`}
        >
          <Video className="w-2.5 h-2.5 mb-0.5" />
          <span>PATROL</span>
        </button>

        <button
          onClick={() => {
            soundFx.playChirp();
            onSwitchFeed('mask_optical');
          }}
          className={`px-1 py-1 border rounded text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            camera.activeFeed === 'mask_optical'
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100 font-bold'
              : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400'
          }`}
        >
          <Crosshair className="w-2.5 h-2.5 mb-0.5" />
          <span>MASK OPTIC</span>
        </button>

        <button
          onClick={() => {
            soundFx.playHoloClick();
            onToggleNightVision();
          }}
          className={`px-1 py-1 border rounded text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            camera.nightVision
              ? 'bg-cyan-400 text-black font-extrabold border-white'
              : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400'
          }`}
        >
          <Eye className="w-2.5 h-2.5 mb-0.5" />
          <span>{camera.nightVision ? 'NV ON' : 'NIGHT VIS'}</span>
        </button>
      </div>

    </div>
  );
};
