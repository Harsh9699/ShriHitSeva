import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Music, Volume2, VolumeX, Minimize2, Maximize2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AudioPlayer() {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Switched to a direct, bulletproof MP3 audio file. 
  // No YouTube blocking, no API restrictions.
  const KIRTAN_URL = '/kirtan.mp3';

  // Sync state with native audio element
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Audio play error:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  if (isHidden) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[900]">
      {/* Native HTML5 Audio Element - 100% reliable */}
      <audio
        ref={audioRef}
        src={KIRTAN_URL}
        loop
        preload="auto"
      />

      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer border border-[rgba(255,255,255,0.4)] backdrop-blur-md
              ${isPlaying 
                ? 'bg-linear-to-br from-[var(--color-honey)] to-[var(--color-gold)] text-white' 
                : 'bg-white/80 text-[var(--color-gold)] hover:bg-white'
              }`}
            title="Kirtan Lounge"
          >
            <div className="relative">
              <Music size={20} className={isPlaying && !isMuted ? 'animate-bounce' : ''} />
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ width: 48, opacity: 0, borderRadius: 24 }}
            animate={{ width: 'auto', opacity: 1, borderRadius: 32 }}
            exit={{ width: 48, opacity: 0, borderRadius: 24 }}
            className="bg-white/80 backdrop-blur-xl border border-[rgba(255,255,255,0.6)] shadow-[0_12px_36px_rgba(44,26,14,0.08)] overflow-hidden flex items-center h-16 pr-3 pl-1 gap-4"
          >
            {/* Play Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ml-0.5
                ${isPlaying 
                  ? 'bg-linear-to-br from-[var(--color-honey)] to-[var(--color-gold)] text-white' 
                  : 'bg-white text-[var(--color-gold)] hover:bg-[var(--color-cream)]'
                }`}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            
            {/* Track Info */}
            <div className="flex flex-col min-w-[140px]">
              <span className="font-display text-[14px] text-[var(--color-ink)] font-medium leading-tight">
                {isPlaying 
                  ? (language === 'hi' ? 'कीर्तन लाउंज' : 'Kirtan Lounge') 
                  : (language === 'hi' ? 'रोका गया' : 'Paused')}
              </span>
              <span className="font-body text-[11px] text-[var(--color-gdp)] uppercase tracking-widest mt-0.5">
                {language === 'hi' ? 'नित्य विहार' : 'Nitya Vihar'}
              </span>
            </div>

            {/* Visualizer (Only when playing) */}
            {isPlaying && !isMuted && (
              <div className="flex items-end justify-center gap-0.5 h-4 opacity-50 px-2">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[2px] bg-[var(--color-gold)] rounded-t-sm"
                    animate={{ height: [4, Math.random() * 12 + 4, 4] }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
                  />
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-1 border-l border-[rgba(196,154,42,0.1)] pl-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-[var(--color-ins)] hover:text-[var(--color-gold)] cursor-pointer rounded-full transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-2 text-[var(--color-ins)] hover:text-[var(--color-ink)] cursor-pointer rounded-full"
                title="Minimize"
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
