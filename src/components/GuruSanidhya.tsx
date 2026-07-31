import React, { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Camera, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function GuruSanidhya() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isDistracted, setIsDistracted] = useState(false);
  const [distractionReason, setDistractionReason] = useState<string>('');
  const [isTracking, setIsTracking] = useState(false);

  // Core tracking state refs
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const distractionStartRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const initializeTracker = async () => {
      try {
        // Load MediaPipe WASM files from CDN
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        // Initialize FaceLandmarker
        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "CPU"
          },
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });

        if (!active) return;
        faceLandmarkerRef.current = landmarker;

        // Request Camera Access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" },
          audio: false
        });
        
        if (!active) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", () => {
            if (active) {
              setIsTracking(true);
              setIsInitializing(false);
              detectFaces();
            }
          });
        }
      } catch (error) {
        console.error("Initialization Error:", error);
        if (active) {
          setHasCameraPermission(false);
          setIsInitializing(false);
        }
      }
    };

    initializeTracker();

    return () => {
      active = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
      }
    };
  }, []);

  const detectFaces = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = faceLandmarkerRef.current;

    if (!video || !landmarker || !isTracking) return;

    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      
      const startTimeMs = performance.now();
      const results = landmarker.detectForVideo(video, startTimeMs);

      // DISTRACTION LOGIC
      const now = Date.now();
      
      if (results.faceLandmarks.length === 0) {
        // No face detected
        handleDistraction(now, "Please sit in front of the camera.");
      } else if (results.facialTransformationMatrixes && results.facialTransformationMatrixes.length > 0) {
        // Face is present, check orientation
        const matrix = results.facialTransformationMatrixes[0].data;
        // In mediapipe, yaw roughly corresponds to matrix[8] (sin(yaw)).
        const yaw = Math.asin(Math.max(-1, Math.min(1, matrix[8]))) * (180 / Math.PI);
        const pitch = Math.asin(Math.max(-1, Math.min(1, -matrix[9]))) * (180 / Math.PI);
        
        // If head is turned more than 30 degrees left/right or up/down significantly
        if (Math.abs(yaw) > 30 || pitch > 30 || pitch < -25) {
          handleDistraction(now, "Your mind is wandering. Return your focus to the Divine Name.");
        } else {
          // User is focused
          clearDistraction();
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(detectFaces);
  };

  const handleDistraction = (now: number, reason: string) => {
    if (!distractionStartRef.current) {
      distractionStartRef.current = now;
    } else {
      // Alert after 3 seconds of continuous distraction
      if (now - distractionStartRef.current > 3000) {
        setIsDistracted(true);
        setDistractionReason(reason);
      }
    }
  };

  const clearDistraction = () => {
    distractionStartRef.current = null;
    if (isDistracted) {
      setIsDistracted(false);
      setDistractionReason('');
    }
  };

  return (
    <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h2 className="font-display text-[14px] uppercase tracking-[0.3em] text-[var(--color-gold)] mb-4">
          Divine Presence
        </h2>
        <h1 className="font-display text-[48px] md:text-[64px] text-[var(--color-ink)] leading-none mb-6">
          Guru Sanidhya
        </h1>
        <p className="font-body text-[16px] text-[var(--color-inm)] max-w-2xl mx-auto leading-relaxed">
          Meditate deeply under the watchful presence of the Guru. If your focus wanders, you will be gently guided back to the path.
        </p>
      </div>

      {isInitializing ? (
        <div className="w-full max-w-3xl mx-auto aspect-video rounded-3xl glass-card flex flex-col items-center justify-center p-12">
          <Loader2 className="w-12 h-12 text-[var(--color-gold)] animate-spin mb-4" />
          <h3 className="font-display text-2xl text-[var(--color-ink)] mb-2">Preparing the Sanctuary</h3>
          <p className="font-body text-[var(--color-inm)]">Loading AI vision models...</p>
        </div>
      ) : hasCameraPermission === false ? (
        <div className="w-full max-w-3xl mx-auto aspect-video rounded-3xl glass-card border-red-200/50 flex flex-col items-center justify-center p-12 text-center bg-red-50/50">
          <Camera className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="font-display text-2xl text-[var(--color-ink)] mb-2">Camera Access Required</h3>
          <p className="font-body text-[var(--color-inm)] max-w-md">
            To sit in the presence of the Guru, please allow camera access. Your video is processed entirely on your device and never sent to the internet.
          </p>
        </div>
      ) : (
        <div className="relative w-full max-w-4xl mx-auto">
          
          {/* Main Visual Environment */}
          <div className="w-full aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl relative border-4 border-white/50 bg-[var(--color-warm)]">
            <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/60 pointer-events-none z-10" />
            
            {/* Background Image (We reuse the Vrindavan BG) */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/vrindavan_bg.jpg)', filter: 'blur(4px) brightness(0.8)' }}
            />

            {/* Glowing Aura in the center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/20 rounded-full blur-[60px] z-10" />

            <div className="relative z-20 h-full flex flex-col items-center justify-center">
              {/* Animated Message / Avatar */}
              <AnimatePresence mode="wait">
                {isDistracted ? (
                  <motion.div
                    key="distracted"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center text-center px-8"
                  >
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse border-2 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                      <EyeOff className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="font-display text-4xl text-white mb-4 drop-shadow-lg">
                      {distractionReason}
                    </h2>
                    <p className="font-body text-[18px] text-red-200 uppercase tracking-widest drop-shadow-md">
                      Breathe. Refocus.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="focused"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-24 h-24 bg-[var(--color-gold)]/20 rounded-full flex items-center justify-center mb-6 border-2 border-[var(--color-gold)]/50 shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                      <Eye className="w-10 h-10 text-[var(--color-gold)]" />
                    </div>
                    <h2 className="font-display text-3xl text-white drop-shadow-lg opacity-90">
                      The Guru is watching over you.
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Picture-in-Picture Webcam */}
          <div className="absolute bottom-6 right-6 w-48 aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 z-30 transform transition-transform hover:scale-105">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover mirror"
              style={{ transform: 'scaleX(-1)' }}
            />
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ transform: 'scaleX(-1)' }}
            />
            
            {/* Status Indicator */}
            <div className={`absolute top-3 right-3 w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${isDistracted ? 'bg-red-500 animate-pulse' : 'bg-green-400'}`} />
          </div>
        </div>
      )}
    </div>
  );
}
