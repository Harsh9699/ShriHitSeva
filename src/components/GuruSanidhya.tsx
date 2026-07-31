import React, { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Camera, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function GuruSanidhya() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isDistracted, setIsDistracted] = useState(false);
  const isDistractedRef = useRef(false);
  const [distractionReason, setDistractionReason] = useState<string>('');
  const [isTracking, setIsTracking] = useState(false);
  const isTrackingRef = useRef(false);

  // Core tracking state refs
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const distractionStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sessionStarted) return;
    let active = true;

    const initializeTracker = async () => {
      try {
        const timeout = (ms: number, promise: Promise<any>, name: string) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error(name + " timed out after " + ms + "ms")), ms))
          ]);
        };

        // Load MediaPipe WASM files from CDN
        const vision = await timeout(10000, FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm"
        ), "FilesetResolver");

        // Initialize FaceLandmarker
        const landmarker = await timeout(15000, FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "CPU"
          },
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
          runningMode: "VIDEO",
          numFaces: 1
        }), "FaceLandmarker");

        if (!active) return;
        faceLandmarkerRef.current = landmarker;

        // Request Camera Access
        const stream = await timeout(15000, navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" },
          audio: false
        }), "Camera Access (Did you click allow?)");
        
        if (!active) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video to actually start playing
          await new Promise((resolve) => {
             if (videoRef.current) {
               videoRef.current.onloadeddata = resolve;
             }
          });
          
          if (active) {
            isTrackingRef.current = true;
            setIsTracking(true);
            setIsInitializing(false);
            detectFaces();
          }
        }
      } catch (error: any) {
        console.error("Initialization Error:", error);
        if (active) {
          setErrorMsg(error?.message || String(error));
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
  }, [sessionStarted]);

  const detectFaces = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = faceLandmarkerRef.current;

    if (!video || !landmarker || !isTrackingRef.current) return;

    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      
      const startTimeMs = performance.now();
      const results = landmarker.detectForVideo(video, startTimeMs);

      // DISTRACTION LOGIC
      const now = Date.now();
      
      if (results.faceLandmarks.length === 0) {
        // No face detected
        handleDistraction(now, "Please sit in front of the camera.");
      } else {
        let isStrictlyDistracted = false;
        let reason = "";

        // 1. Strict Head Pose (Looking around or down at a phone)
        if (results.facialTransformationMatrixes && results.facialTransformationMatrixes.length > 0) {
          const matrix = results.facialTransformationMatrixes[0].data;
          const yaw = Math.asin(Math.max(-1, Math.min(1, matrix[8]))) * (180 / Math.PI);
          const pitch = Math.asin(Math.max(-1, Math.min(1, -matrix[9]))) * (180 / Math.PI);
          
          // Tightened from 30 degrees to 15 degrees!
          if (Math.abs(yaw) > 15 || pitch > 15 || pitch < -15) {
            isStrictlyDistracted = true;
            reason = "Your focus is wandering. Keep your head straight and focus on Naam Jap.";
          }
        }

        // 2. Strict Mischief/Laughing Detection (using AI Blendshapes)
        if (!isStrictlyDistracted && results.faceBlendshapes && results.faceBlendshapes.length > 0) {
          const blendshapes = results.faceBlendshapes[0].categories;
          const getScore = (name: string) => blendshapes.find(b => b.categoryName === name)?.score || 0;
          
          const smileL = getScore('mouthSmileLeft');
          const smileR = getScore('mouthSmileRight');
          
          if (smileL > 0.35 || smileR > 0.35) {
            isStrictlyDistracted = true;
            reason = "Are you laughing or distracted? Maintain the absolute sanctity of your Sadhana.";
          }
        }

        if (isStrictlyDistracted) {
          handleDistraction(now, reason);
        } else {
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
      // Alert after 1.5 seconds of continuous distraction (STRICT MODE)
      if (now - distractionStartRef.current > 1500) {
        if (!isDistractedRef.current) {
          isDistractedRef.current = true;
          setIsDistracted(true);
          setDistractionReason(reason);
          // Play the Sadhguru scolding audio
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
          }
        }
      }
    }
  };

  const clearDistraction = () => {
    distractionStartRef.current = null;
    if (isDistractedRef.current) {
      isDistractedRef.current = false;
      setIsDistracted(false);
      setDistractionReason('');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
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

      {!sessionStarted && (
        <div className="w-full max-w-3xl mx-auto aspect-video rounded-3xl glass-card flex flex-col items-center justify-center p-12 text-center">
          <Eye className="w-16 h-16 text-[var(--color-gold)] mb-6 opacity-80" />
          <h3 className="font-display text-3xl text-[var(--color-ink)] mb-4">Begin Your Sadhana</h3>
          <p className="font-body text-[var(--color-inm)] max-w-md mx-auto mb-8">
            The Guru Sanidhya environment requires your camera to monitor your focus. Your video is processed completely securely on your device and never sent to the internet.
          </p>
          <button
            onClick={() => {
              setIsInitializing(true);
              setHasCameraPermission(null);
              setErrorMsg('');
              setIsDistracted(false);
              isDistractedRef.current = false;
              setIsTracking(false);
              isTrackingRef.current = false;
              setSessionStarted(true);
            }}
            className="px-8 py-4 bg-linear-to-r from-[var(--color-honey)] to-[var(--color-saffron)] text-[var(--color-ink)] rounded-full font-bold tracking-widest uppercase hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            Enter Sanctuary
          </button>
        </div>
      )}

      {sessionStarted && isInitializing && (
        <div className="w-full max-w-3xl mx-auto aspect-video rounded-3xl glass-card flex flex-col items-center justify-center p-12">
          <Loader2 className="w-12 h-12 text-[var(--color-gold)] animate-spin mb-4" />
          <h3 className="font-display text-2xl text-[var(--color-ink)] mb-2">Preparing the Sanctuary</h3>
          <p className="font-body text-[var(--color-inm)]">Loading AI vision models...</p>
        </div>
      )}
      
      {sessionStarted && !isInitializing && hasCameraPermission === false && (
        <div className="w-full max-w-3xl mx-auto aspect-video rounded-3xl glass-card border-red-200/50 flex flex-col items-center justify-center p-12 text-center bg-red-50/50">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="font-display text-2xl text-[var(--color-ink)] mb-2">Initialization Failed</h3>
          <p className="font-body text-[var(--color-inm)] max-w-md mb-4">
            Could not start the tracking environment. Please ensure you have allowed camera access and try refreshing the page.
          </p>
          <div className="bg-red-100 text-red-800 p-4 rounded-xl font-mono text-sm max-w-lg overflow-auto">
            Error: {errorMsg}
          </div>
        </div>
      )}
      
      {/* ALWAYS render the video so videoRef is never null, just hide it visually until initialized */}
      <div className={`relative w-full max-w-4xl mx-auto ${!sessionStarted || isInitializing || hasCameraPermission === false ? 'hidden' : 'block'}`}>
          <button
            onClick={() => setSessionStarted(false)}
            className="absolute -top-12 right-0 px-4 py-2 bg-red-500/10 text-red-500 rounded-full font-bold text-sm hover:bg-red-500/20 transition-colors z-40"
          >
            End Session
          </button>
          
          {/* Main Visual Environment */}
          <div className="w-full aspect-[4/5] md:aspect-[21/9] min-h-[500px] md:min-h-[auto] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl relative border-4 border-white/50 bg-[var(--color-warm)]">
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
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-6 border-4 border-red-500/80 shadow-[0_0_50px_rgba(239,68,68,0.6)] animate-pulse">
                      <img src="/saint2.jpg" alt="Saint Scolding" className="w-full h-full object-cover filter brightness-75 sepia-[0.3]" />
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl text-white mb-4 drop-shadow-lg">
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
                    <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden mb-6 border-4 border-[var(--color-gold)] shadow-[0_0_50px_rgba(212,175,55,0.5)]">
                      <img src="/saint.jpg" alt="Saint" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl text-white drop-shadow-lg opacity-90">
                      The Guru is watching over you.
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sadhguru Scolding Audio Trigger */}
      <audio ref={audioRef} src="/scold.mp3" preload="auto" loop />

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
    </div>
  );
}
