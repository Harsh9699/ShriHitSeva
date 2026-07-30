import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function Preloader() {
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 800 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-cream)] overflow-hidden"
    >
      {/* Decorative Rotating Mandala/Sunrays */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[150vw] h-[150vw] md:w-[120vw] md:h-[120vw] max-w-[1000px] max-h-[1000px] opacity-10 pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, var(--color-honey) 10deg, transparent 20deg, var(--color-honey) 30deg, transparent 40deg, var(--color-honey) 50deg, transparent 60deg, var(--color-honey) 70deg, transparent 80deg, var(--color-honey) 90deg, transparent 100deg, var(--color-honey) 110deg, transparent 120deg, var(--color-honey) 130deg, transparent 140deg, var(--color-honey) 150deg, transparent 160deg, var(--color-honey) 170deg, transparent 180deg, var(--color-honey) 190deg, transparent 200deg, var(--color-honey) 210deg, transparent 220deg, var(--color-honey) 230deg, transparent 240deg, var(--color-honey) 250deg, transparent 260deg, var(--color-honey) 270deg, transparent 280deg, var(--color-honey) 290deg, transparent 300deg, var(--color-honey) 310deg, transparent 320deg, var(--color-honey) 330deg, transparent 340deg, var(--color-honey) 350deg, transparent 360deg)',
          borderRadius: '50%'
        }}
      />

      {/* Main Spiritual Elements */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="mb-8 relative"
        >
          {/* Glowing Aura Behind Logo */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-[var(--color-saffron)] blur-[40px] opacity-20"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.img 
            src="/logo-512x512.png" 
            alt="Shri Hit Seva Logo"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full relative z-10 border-2 border-[var(--color-honey)] shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Text Animation */}
        <div className="text-center overflow-hidden">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
            className="text-3xl md:text-5xl font-bold font-sanskrit text-[var(--color-saffron)] tracking-wider mb-2"
            style={{ textShadow: '0 2px 15px rgba(220,107,31,0.3)' }}
          >
            ॥ श्री राधावल्लभ श्री हरिवंश ॥
          </motion.h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, delay: 1.2, ease: 'easeInOut' }}
            className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-honey)] to-transparent mx-auto mt-6"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="text-[var(--color-coffee)] mt-6 font-serif text-sm md:text-lg tracking-[0.25em] uppercase opacity-80"
          >
            Entering the Divine Realm
          </motion.p>
        </div>
      </div>
      
      {/* Mystical Fireflies in Preloader */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-[var(--color-honey)] rounded-full"
          initial={{ 
            x: Math.random() * windowSize.width, 
            y: Math.random() * windowSize.height,
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            y: [null, Math.random() * -150 - 50],
            opacity: [0, 0.9, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{ 
            duration: 2.5 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
          style={{ boxShadow: '0 0 12px 3px var(--color-honey)' }}
        />
      ))}
    </motion.div>
  );
}
