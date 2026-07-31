import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Award, Play, Pause, Flame, CheckCircle2, Circle, Plus, Minus, Save, Calendar, BarChart2, Settings, X, Trash2, Bell, Gift, Image as ImageIcon, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const getLocalDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function JapCounter() {
  const { t, language } = useLanguage();
  const [count, setCount] = useState(0);
  const [totalMalas, setTotalMalas] = useState(0);
  const [isVibrating, setIsVibrating] = useState(false);
  const [showMalaComplete, setShowMalaComplete] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeName, setActiveName] = useState('Shri Radha');
  
  // Daily Sadhana State
  interface SadhanaRule {
    id: string;
    text: string;
    type: 'numeric' | 'boolean';
    target: number;
    current: number;
    unit: string;
    reminderTime?: string;
  }

  const DEFAULT_RULES: SadhanaRule[] = [
    { id: 'chaturasi', text: 'Shri Hit Chaturasi ji', type: 'numeric', target: 12, current: 0, unit: 'Pads' },
    { id: 'radha_sudha', text: 'Shri Radha Sudha Nidhi ji', type: 'numeric', target: 10, current: 0, unit: 'Shlokas' },
    { id: 'sevak_vaani', text: 'Shri Sevak Vaani', type: 'numeric', target: 5, current: 0, unit: 'Verses' },
    { id: 'ashtyam', text: 'Ashtyam Seva Paddhati', type: 'boolean', target: 1, current: 0, unit: '' },
    { id: 'rasopasana', text: 'Nitya Path Rasopasana', type: 'boolean', target: 1, current: 0, unit: '' },
    { id: 'shat_leela', text: 'Vrindavan Shat Leela', type: 'numeric', target: 10, current: 0, unit: 'Shlokas' },
    { id: 'jap', text: 'Mala Jap', type: 'numeric', target: 11, current: 0, unit: 'Malas' },
  ];
  const [sadhanaRules, setSadhanaRules] = useState<SadhanaRule[]>(DEFAULT_RULES);
  const [sadhanaHistory, setSadhanaHistory] = useState<Record<string, number>>({});
  const [isSavedAnimation, setIsSavedAnimation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingRules, setEditingRules] = useState<SadhanaRule[]>(DEFAULT_RULES);
  const [showToast, setShowToast] = useState<{message: string, show: boolean}>({message: '', show: false});
  const [earnedGifts, setEarnedGifts] = useState<string[]>([]);
  const [showGiftReveal, setShowGiftReveal] = useState<{show: boolean, image: string, isSlacking: boolean}>({show: false, image: '', isSlacking: false});
  const [showGallery, setShowGallery] = useState(false);

    const [targetMalas, setTargetMalas] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice chanting is not supported in this browser. Please try Chrome on desktop or Android.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Optimized for chanting
  
      let lastTranscript = "";
      let lastIncrementTime = 0;
  
      recognition.onresult = (event: any) => {
        const current = event.results[event.results.length - 1];
        const transcript = current[0].transcript.toLowerCase();
        const now = Date.now();
        
        // When user chants continuously, interim results stream rapidly.
        // Add a 1200ms debounce to ensure one chant = one increment, 
        // preventing rapid-fire increments from a single phrase.
        if (transcript !== lastTranscript && transcript.trim().length > 0) {
           lastTranscript = transcript;
           if (now - lastIncrementTime > 1200) {
             lastIncrementTime = now;
             const incBtn = document.getElementById('hidden-increment-btn');
             if (incBtn) incBtn.click();
           }
        }
      };
  
      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'not-allowed') {
          setIsListening(false);
        }
      };
  
      recognition.onend = () => {
        // Auto-restart if we are still supposed to be listening
        // Note: we can't easily check `isListening` state directly due to closure without a ref,
        // but checking the DOM for a specific class or data attribute works around React closures.
        const micBtn = document.getElementById('chant-mic-btn');
        if (micBtn && micBtn.getAttribute('data-listening') === 'true') {
          try { recognition.start(); } catch (e) {}
        }
      };
  
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (err) {
      console.error(err);
      alert("Microphone could not be started.");
    }
  };

  const MALA_SIZE = 108;

  const names = [
    'Shri Radha',
    'Shri Harivansh',
    'Radha Vallabh',
    'Shyama Shyam'
  ];

  const handleIncrement = () => {
    setCount(prev => {
      const target = MALA_SIZE * targetMalas;
      if (prev + 1 >= target) {
        setTotalMalas(t => t + targetMalas);
        setShowMalaComplete(true);
        setTimeout(() => setShowMalaComplete(false), 8000);
        return target; // Stay at target during animation
      }
      return prev + 1;
    });
    
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 100);
  };

  const blessings = [
    "Shriji is pleased with your constant remembrance.",
    "May your heart be filled with the Nectar of Vraj.",
    "The Divine Couple's Grace is raining upon you.",
    "Your devotion is a fragrant flower at Her Lotus Feet.",
    "Shri Harivansh Mahaprabhu's blessings are with you.",
    "May you forever reside in the shade of the Nikunj."
  ];

  const [currentBlessing, setCurrentBlessing] = useState(blessings[0]);

  useEffect(() => {
    if (showMalaComplete) {
      setCurrentBlessing(blessings[Math.floor(Math.random() * blessings.length)]);
    }
  }, [showMalaComplete]);

  // Load Sadhana History and Today's Rules from LocalStorage
  useEffect(() => {
    const history = localStorage.getItem('sadhana_history');
    if (history) {
      setSadhanaHistory(JSON.parse(history));
    }
    
    // Load user's customized rules (base configuration)
    const customRules = localStorage.getItem('sadhana_custom_rules');
    let baseRules = DEFAULT_RULES;
    if (customRules) {
      baseRules = JSON.parse(customRules);
      setEditingRules(baseRules);
    }
    
    const todayStr = getLocalDateString(new Date());
    const savedToday = localStorage.getItem(`sadhana_today_${todayStr}`);
    if (savedToday) {
      setSadhanaRules(JSON.parse(savedToday));
    } else {
      // Initialize today's rules with base rules, resetting current progress
      setSadhanaRules(baseRules.map(r => ({ ...r, current: 0 })));
    }
    const savedGifts = localStorage.getItem('earned_gifts');
    if (savedGifts) {
      setEarnedGifts(JSON.parse(savedGifts));
    }

    // Weekly Evaluation Engine
    if (history) {
      const histObj = JSON.parse(history);
      const past7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (i + 1)); // Look at yesterday backwards
        return getLocalDateString(d);
      });
      
      let allPerfect = true;
      let allZero = true;
      
      past7Days.forEach(dayStr => {
        const progress = histObj[dayStr] || 0;
        if (progress < 100) allPerfect = false;
        if (progress > 0) allZero = false;
      });

      const todayStr = getLocalDateString(new Date());
      const lastEvaluated = localStorage.getItem('weekly_evaluated_date');
      
      // Only evaluate once a week or if it hasn't been evaluated today
      if (lastEvaluated !== todayStr) {
        if (allPerfect) {
          const availableGifts = ['/gift_1.jpg', '/gift_2.jpg', '/gift_3.jpg'];
          const newGift = availableGifts[Math.floor(Math.random() * availableGifts.length)];
          setEarnedGifts(prev => {
            const newGifts = [...prev, newGift];
            localStorage.setItem('earned_gifts', JSON.stringify(newGifts));
            return newGifts;
          });
          setShowGiftReveal({ show: true, image: newGift, isSlacking: false });
          localStorage.setItem('weekly_evaluated_date', todayStr);
        } else if (allZero) {
          setShowGiftReveal({ show: true, image: '', isSlacking: true });
          localStorage.setItem('weekly_evaluated_date', todayStr);
        }
      }
    }
  }, []);

  // Request Notification Permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Notification Engine (Checks every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;

      sadhanaRules.forEach(rule => {
        if (rule.reminderTime === currentTimeStr && rule.current < rule.target) {
          const notifiedKey = `notified_${rule.id}_${getLocalDateString(now)}`;
          if (!localStorage.getItem(notifiedKey)) {
            // Trigger Notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Sadhana Reminder: ${rule.text}`, {
                body: `It's time for your daily ${rule.text}! Tap to begin.`,
              });
            } else {
              // Fallback to in-app toast
              setShowToast({ message: `Sadhana Reminder: It's time for ${rule.text}!`, show: true });
              setTimeout(() => setShowToast({ message: '', show: false }), 5000);
            }
            localStorage.setItem(notifiedKey, 'true');
          }
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [sadhanaRules]);

  const handleUpdateRule = (id: string, increment: number, type: string) => {
    setSadhanaRules(prev => prev.map(rule => {
      if (rule.id === id) {
        if (type === 'boolean') {
          return { ...rule, current: rule.current === 0 ? 1 : 0 };
        } else {
          const newCurrent = Math.max(0, Math.min(rule.target, rule.current + increment));
          return { ...rule, current: newCurrent };
        }
      }
      return rule;
    }));
  };

  const calculateDailyProgress = () => {
    let totalTarget = 0;
    let totalCurrent = 0;
    sadhanaRules.forEach(r => {
      totalTarget += r.target;
      totalCurrent += r.current;
    });
    return totalTarget === 0 ? 0 : Math.round((totalCurrent / totalTarget) * 100);
  };

  const handleSaveProgress = () => {
    const todayStr = getLocalDateString(new Date());
    const progress = calculateDailyProgress();
    
    setSadhanaHistory(prev => {
      const newHistory = { ...prev, [todayStr]: progress };
      localStorage.setItem('sadhana_history', JSON.stringify(newHistory));
      return newHistory;
    });
    localStorage.setItem(`sadhana_today_${todayStr}`, JSON.stringify(sadhanaRules));
    
    setIsSavedAnimation(true);
    setTimeout(() => setIsSavedAnimation(false), 2000);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('sadhana_custom_rules', JSON.stringify(editingRules));
    // Apply to today if today hasn't been saved yet, or just merge targets
    const todayStr = getLocalDateString(new Date());
    const mergedRules = editingRules.map(er => {
      const existing = sadhanaRules.find(sr => sr.id === er.id);
      return existing ? { ...existing, target: er.target, text: er.text, reminderTime: er.reminderTime } : { ...er, current: 0 };
    });
    setSadhanaRules(mergedRules);
    localStorage.setItem(`sadhana_today_${todayStr}`, JSON.stringify(mergedRules));
    setShowSettings(false);
  };

  const getHeatmapColor = (progress: number | undefined, isFuture: boolean) => {
    if (isFuture) return 'bg-black/5 border-black/5 opacity-30'; // Future days
    if (progress === undefined || progress === 0) return 'bg-black/5 border-black/10';
    if (progress <= 25) return 'bg-[rgba(196,154,42,0.2)] border-[rgba(196,154,42,0.3)]';
    if (progress <= 50) return 'bg-[rgba(196,154,42,0.5)] border-[rgba(196,154,42,0.6)]';
    if (progress <= 75) return 'bg-[rgba(212,175,55,0.7)] border-[rgba(212,175,55,0.8)]';
    return 'bg-[var(--color-gold)] border-[var(--color-gold)] shadow-[0_0_12px_rgba(212,175,55,0.5)]';
  };

  // Generate last 28 days array aligned to a Monday-Sunday grid
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time to midnight for accurate future comparisons
  const currentDayIndex = (today.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const daysUntilSunday = 6 - currentDayIndex;
  
  const upcomingSunday = new Date(today);
  upcomingSunday.setDate(today.getDate() + daysUntilSunday);
  
  const last28Days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(upcomingSunday);
    d.setDate(upcomingSunday.getDate() - (27 - i));
    return d;
  });

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setCount(0);
    setShowResetConfirm(false);
  };

  const calculateProgress = () => {
    return (count / (MALA_SIZE * targetMalas)) * 100;
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Background Zen Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-honey)]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-12 relative z-10">
        <div className="font-body text-[11px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3">
          {t('jap.subtitle')}
        </div>
        <h1 className="font-display text-[clamp(28px,6vw,42px)] text-[var(--color-ink)] mb-4 drop-shadow-sm">
          {t('jap.title')}
        </h1>
        <div className="flex gap-2 justify-center flex-wrap">
          {names.map(name => (
            <button
              key={name}
              onClick={() => setActiveName(name)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                activeName === name 
                  ? 'bg-linear-to-r from-[var(--color-honey)] to-[var(--color-saffron)] text-[var(--color-ink)] shadow-[0_4px_12px_rgba(214,185,92,0.3)]' 
                  : 'glass-panel text-[var(--color-inm)] border border-[var(--color-gold)]/30 hover:border-[var(--color-gold)]/60'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      
        <div className="flex gap-2 justify-center flex-wrap mt-4">
          {[1, 2, 3, 5, 11].map(num => (
            <button
              key={num}
              onClick={() => { setTargetMalas(num); setCount(0); }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer shadow-sm ${
                targetMalas === num 
                  ? 'bg-linear-to-r from-[var(--color-honey)] to-[var(--color-saffron)] text-white shadow-[0_2px_10px_rgba(214,185,92,0.4)]' 
                  : 'glass-panel text-[var(--color-inm)] border border-[var(--color-gold)]/20 hover:border-[var(--color-gold)]/60 hover:text-[var(--color-ink)]'
              }`}
            >
              {num} Mala{num > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Stairs Animation Section */}
      <div 
        className="w-full max-w-[700px] h-[360px] relative mx-auto mb-12 rounded-[40px] overflow-hidden group shadow-2xl border-4 border-white/40"
        style={{ backgroundImage: 'url(/vrindavan_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Magical overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 mix-blend-overlay bg-linear-to-tr from-[var(--color-gold)]/20 to-transparent pointer-events-none" />
        
        {/* Stairs Path Visualization */}
        <div className="absolute inset-0 flex items-end justify-start p-6 pb-12">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>
              <mask id="doorMask">
                <path d="M -30 30 L -30 -25 Q -30 -50 0 -50 Q 30 -50 30 -25 L 30 30 Z" fill="white" />
              </mask>
            </defs>

            {/* The Stairs Structure */}
            {[...Array(12)].map((_, i) => {
              const xStart = 10 + (i * (350 / 11));
              const yStart = 175 - (i * (155 / 11));
              return (
                <g key={i}>
                  <rect 
                    x={xStart} 
                    y={yStart} 
                    width={28} 
                    height={8} 
                    fill="url(#goldGradient)" 
                    rx="3"
                    className="drop-shadow-lg"
                  />
                  {/* Step Highlight */}
                  <rect x={xStart} y={yStart} width={28} height={2} fill="rgba(255,255,255,0.6)" rx="1" />
                  
                  {/* Glowing step if devotee is near */}
                  {Math.abs(count - (i * ((MALA_SIZE * targetMalas) / 11))) < ((MALA_SIZE * targetMalas) / 10) && (
                    <motion.rect 
                      x={xStart-2} y={yStart-2} width={32} height={12} fill="var(--color-gold)" rx="4"
                      animate={{ opacity: [0, 0.8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </g>
              );
            })}

            {/* Destination: The Radiant Nikunj Gate */}
            <g transform="translate(365, 20)">
            <motion.g 
              animate={{ 
                scale: count >= MALA_SIZE * targetMalas - 5 ? [1, 1.1, 1] : 1,
                filter: count >= MALA_SIZE * targetMalas - 5 ? ["drop-shadow(0 0 10px gold)", "drop-shadow(0 0 40px gold)"] : "drop-shadow(0 0 15px rgba(212,175,55,0.6))"
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {/* Backlight glow */}
              <circle cx="0" cy="-20" r="40" fill="var(--color-gold)" className="opacity-20 animate-pulse" />
              
              <image 
                href="/nikunj_door.jpg" 
                x="-30" y="-50" width="60" height="80" 
                preserveAspectRatio="xMidYMid slice"
                mask="url(#doorMask)"
              />
              <path d="M -30 30 L -30 -25 Q -30 -50 0 -50 Q 30 -50 30 -25 L 30 30 Z" fill="none" stroke="#fef08a" strokeWidth="2.5" />
              
              <motion.text 
                y="45" textAnchor="middle" 
                className="font-devanagari text-[14px] fill-white font-bold drop-shadow-md"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                श्री राधा
              </motion.text>
            </motion.g>
            </g>

            {/* Devotee Walker */}
            <motion.g
              animate={{ 
                x: 25 + (count / (MALA_SIZE * targetMalas)) * 350,
                y: 175 - (count / (MALA_SIZE * targetMalas)) * 155
              }}
              transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            >
              <motion.g
                animate={{ 
                  rotate: isVibrating ? [-10, 10, 0] : [0, 2, 0],
                  y: isVibrating ? -15 : 0
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Glow under feet */}
                <motion.circle 
                  r="15" fill="var(--color-gold)" 
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: isVibrating ? 0 : 0.5, scale: isVibrating ? 2.5 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="pointer-events-none mix-blend-screen"
                />

                {/* Premium 2D Character Token */}
                <g transform="translate(0, -5)">
                  <clipPath id="charClip">
                    <circle cx="0" cy="-20" r="18" />
                  </clipPath>
                  
                  {/* Golden Coin Border */}
                  <circle cx="0" cy="-20" r="19.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" className="drop-shadow-lg" />
                  
                  {/* 2D Sprite */}
                  <image 
                    href="/devotee_sprite.jpg" 
                    x="-20" y="-40" width="40" height="40" 
                    clipPath="url(#charClip)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>
                
                {/* Rising Mantra Text */}
                <AnimatePresence>
                  {isVibrating && (
                    <motion.text
                      initial={{ opacity: 0, y: -40, scale: 0.5 }}
                      animate={{ opacity: 1, y: -70, scale: 1.3 }}
                      exit={{ opacity: 0 }}
                      textAnchor="middle"
                      className="font-devanagari text-[16px] fill-[var(--color-gold)] font-bold pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    >
                      {activeName.split(' ')[0]}
                    </motion.text>
                  )}
                </AnimatePresence>
              </motion.g>
            </motion.g>
          </svg>
        </div>

        {/* Milestone Progress Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-1.5 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
          <motion.div 
            className="h-full bg-linear-to-r from-[var(--color-gold)] via-yellow-300 to-[var(--color-saffron)] shadow-[0_0_15px_rgba(253,224,71,0.8)]"
            animate={{ width: `${calculateProgress()}%` }}
          />
        </div>

        <div className="absolute top-6 left-1/2 -translate-x-1/2 font-body text-[11px] tracking-[0.4em] uppercase text-white drop-shadow-md flex items-center gap-3 whitespace-nowrap bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
          <span className="w-2 h-2 bg-[var(--color-gold)] rounded-full animate-ping" />
          The Path of Nitya Vihar
        </div>
      </div>

      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
        {/* Progress Ring Background */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            className="fill-none stroke-[rgba(196,154,42,0.1)] stroke-[12]"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            className="fill-none stroke-[var(--color-gold)] stroke-[12]"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 1000" }}
            animate={{ strokeDasharray: `${calculateProgress() * 10} 1000` }}
            transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          />
        </svg>

        {/* The Action Button */}
        <motion.button
          onClick={handleIncrement}
          whileTap={{ scale: 0.92 }}
          className={`relative z-20 w-56 h-56 rounded-full glass-card flex flex-col items-center justify-center group overflow-hidden ${
            isVibrating ? 'animate-shake' : ''
          }`}
        >
          {/* Inner Glow Pulse */}
          <div className="absolute inset-0 bg-linear-to-b from-[var(--color-honey)]/10 to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeName}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="font-devanagari text-[28px] text-[var(--color-saffron)] mb-1"
            >
              {activeName === 'Shri Radha' ? 'श्री राधा' : 
               activeName === 'Shri Harivansh' ? 'श्री हरिवंश' : 
               activeName === 'Radha Vallabh' ? 'राधा वल्लभ' : 'श्यामा श्याम'}
            </motion.div>
          </AnimatePresence>
          
          <div className="font-display text-[48px] text-[var(--color-ink)] leading-none mb-1 drop-shadow-sm">
            {count}
          </div>
          <div className="font-body text-[12px] tracking-widest uppercase text-[var(--color- gold)] opacity-60">
            / {MALA_SIZE * targetMalas}
          </div>

          <div className="absolute bottom-6 font-body text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)] opacity-0 group-hover:opacity-100 transition-opacity">
            {t('jap.tap')}
          </div>
        </motion.button>

        {/* Bead Indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-4 rounded-full bg-[var(--color-gold)] shadow-lg z-30"
            style={{ 
              transform: `translateX(-50%) translateY(-50%) rotate(${count * (360/(MALA_SIZE * targetMalas))}deg)`,
              transformOrigin: '50% 160px'
            }}
          />
        </div>
      </div>

      <div className="mt-12 flex items-center gap-8 relative z-10">
        <div className="text-center group">
          <div className="flex items-center justify-center gap-2 text-[var(--color-saffron)] mb-1">
            <Award className="w-5 h-5" />
            <span className="font-display text-[24px]">{totalMalas}</span>
          </div>
          <div className="font-body text-[11px] tracking-widest uppercase text-[var(--color-inmu)]">
            {t('jap.total')}
          </div>
        </div>

        <div className="h-10 w-[1px] bg-[rgba(196,154,42,0.2)]" />

        <button 
          onClick={handleReset}
          className="p-3 rounded-full glass-panel text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-warm)] transition-all shadow-sm active:scale-90"
          title="Reset Mala"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <div className="h-10 w-[1px] bg-[rgba(196,154,42,0.2)]" />

        <button 
          id="chant-mic-btn"
          data-listening={isListening}
          onClick={toggleListening}
          className={`p-3 rounded-full transition-all shadow-md active:scale-90 flex items-center justify-center cursor-pointer ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
              : 'glass-panel text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-white'
          }`}
          title="Voice Chanting"
        >
          {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        <button id="hidden-increment-btn" onClick={handleIncrement} className="hidden" aria-hidden="true" />

      </div>

      {/* Daily Sadhana Quantifiable Tracker & History */}
      <div className="w-full max-w-[620px] mt-16 relative z-10">
        <div className="text-center mb-8">
          <div className="font-body text-[11px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-2 flex items-center justify-center gap-2">
            <Calendar size={12} /> {t('jap.niyam')}
          </div>
          <div className="flex items-center justify-center gap-4">
            <h2 className="font-display text-[32px] text-[var(--color-ink)] drop-shadow-sm">
              {t('jap.daily')}
            </h2>
            <button 
              onClick={() => {
                setEditingRules(sadhanaRules.map(r => ({ ...r, current: 0 })));
                setShowSettings(true);
              }}
              className="p-2 rounded-full glass-panel border border-[var(--color-gold)]/30 text-[var(--color-ink)] hover:bg-[var(--color-honey)] hover:text-[var(--color-ink)] transition-colors cursor-pointer shadow-md"
              title="Customize Niyams"
            >
              <Settings size={18} />
            </button>
          </div>
          <p className="font-body text-[13px] text-[var(--color-inm)] mt-2">
            {t('jap.desc')}
          </p>
        </div>

        <div className="glass-card rounded-[32px] p-6 sm:p-8 mb-8">
          
          {/* Rules List */}
          <div className="space-y-3 mb-8">
            {sadhanaRules.map((rule) => {
              const isComplete = rule.current === rule.target;
              return (
                <div 
                  key={rule.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl transition-all border ${
                    isComplete 
                      ? 'glass-panel border-[var(--color-honey)] shadow-[0_0_15px_rgba(230,208,132,0.3)] bg-linear-to-r from-[rgba(230,208,132,0.1)] to-transparent' 
                      : 'glass-panel hover:border-[var(--color-gold)]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => handleUpdateRule(rule.id, 0, 'boolean')}
                      className={`cursor-pointer transition-colors ${
                        isComplete ? 'text-green-500' : 'text-gray-300 hover:text-[var(--color-gold)]'
                      }`}
                    >
                      {isComplete ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </div>
                    <div>
                      <div className={`font-body text-[15px] sm:text-[16px] transition-colors ${
                        isComplete ? 'text-[var(--color-ink)] font-bold' : 'text-[var(--color-ink)]'
                      }`}>
                        {rule.text}
                      </div>
                      <div className="text-[11px] text-[var(--color-inm)] uppercase tracking-wider mt-0.5 flex items-center gap-2">
                        <span>{t('jap.target')}: {rule.target} {rule.unit}</span>
                        {rule.reminderTime && (
                          <span className="flex items-center gap-1 text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-1.5 py-0.5 rounded">
                            <Bell size={10} />
                            {rule.reminderTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {rule.type === 'numeric' && (
                    <div className="flex items-center justify-between sm:justify-end gap-4 glass-panel p-1.5 rounded-xl border border-[var(--color-gold)]/10">
                      <button 
                        onClick={() => handleUpdateRule(rule.id, -1, 'numeric')}
                        disabled={rule.current === 0}
                        className="w-8 h-8 flex items-center justify-center rounded-lg glass-panel text-[var(--color-ins)] disabled:opacity-30 cursor-pointer hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      
                      <div className="font-display text-[18px] text-[var(--color-ink)] w-8 text-center tabular-nums">
                        {rule.current}
                      </div>

                      <button 
                        onClick={() => handleUpdateRule(rule.id, 1, 'numeric')}
                        disabled={rule.current === rule.target}
                        className="w-8 h-8 flex items-center justify-center rounded-lg glass-panel text-[var(--color-ins)] disabled:opacity-30 cursor-pointer hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress & Save Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-[var(--bdr)]">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-16 h-16 rounded-full border-[3px] border-[rgba(255,255,255,0.1)] flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-transparent stroke-[4]" />
                  <motion.circle 
                    cx="50%" cy="50%" r="45%" 
                    className="fill-none stroke-[var(--color-gold)] stroke-[4]" 
                    strokeLinecap="round"
                    strokeDasharray={`${calculateDailyProgress()} 100`}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <span className="font-display text-[16px] text-[var(--color-ink)]">
                  {calculateDailyProgress()}%
                </span>
              </div>
              <div>
                <div className="font-body text-[14px] font-semibold text-[var(--color-ink)]">{t('jap.today')}</div>
                <div className="font-body text-[11px] text-[var(--color-inm)]">Calculate and save to history</div>
              </div>
            </div>

            <button
              onClick={handleSaveProgress}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-body text-[14px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg font-bold
                ${isSavedAnimation 
                  ? 'bg-green-500 text-white shadow-green-500/30' 
                  : 'bg-linear-to-r from-[var(--color-honey)] to-[var(--color-saffron)] text-[var(--color-ink)] shadow-[0_4px_15px_rgba(214,185,92,0.3)] hover:-translate-y-1'
                }`}
            >
              {isSavedAnimation ? (
                <><CheckCircle2 size={18} /> {t('jap.saved')}</>
              ) : (
                <><Save size={18} /> {t('jap.save')}</>
              )}
            </button>
          </div>
        </div>

        {/* Analytics Section: GitHub-style Heatmap & Weekly Chart */}
        <div className="glass-card rounded-[32px] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 border-b border-[var(--bdr)] pb-4">
            <div className="flex items-center gap-2">
              <BarChart2 size={18} className="text-[var(--color-gold)]" />
              <h3 className="font-display text-[20px] text-[var(--color-ink)] drop-shadow-sm">{t('jap.analytics')}</h3>
            </div>
            {earnedGifts.length > 0 && (
              <button 
                onClick={() => setShowGallery(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-[var(--color-honey)] to-[var(--color-gold)] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm hover:scale-105 transition-transform"
              >
                <Gift size={12} />
                My Gifts ({earnedGifts.length})
              </button>
            )}
          </div>

          {/* GitHub-style Heatmap (28 Days / 4 Weeks) */}
          <div className="mb-10">
            <div className="font-body text-[11px] uppercase tracking-widest text-[var(--color-gold)] mb-3">Last 28 Days (Monthly Overview)</div>
            <div className="grid grid-cols-7 gap-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-center font-body text-[10px] text-[var(--color-inmu)]">{day}</div>
              ))}
              
              {last28Days.map((date, i) => {
                const dateStr = getLocalDateString(date);
                const progress = sadhanaHistory[dateStr];
                const isToday = dateStr === getLocalDateString(today);
                const isFuture = date.getTime() > today.getTime();
                
                return (
                  <div key={i} className="group relative flex items-center justify-center">
                    <div 
                      className={`w-full aspect-square rounded-md border transition-all flex items-center justify-center ${getHeatmapColor(progress, isFuture)} ${isToday ? 'ring-2 ring-[var(--color-gold)] ring-offset-1' : ''}`}
                    >
                      {isToday && <span className="text-[10px] sm:text-[12px] opacity-70 drop-shadow-sm font-bold">✓</span>}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                      {date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric', weekday: 'short' })}: {isFuture ? 'Future' : `${progress || 0}%`}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Heatmap Legend */}
            <div className="flex justify-end items-center gap-1.5 mt-3 font-body text-[10px] text-[var(--color-inm)]">
              <span>{t('jap.missed')}</span>
              <div className="w-3 h-3 rounded-[2px] bg-black/5 border border-black/10" />
              <div className="w-3 h-3 rounded-[2px] bg-[rgba(196,154,42,0.2)] border border-[rgba(196,154,42,0.3)]" />
              <div className="w-3 h-3 rounded-[2px] bg-[rgba(196,154,42,0.5)] border border-[rgba(196,154,42,0.6)]" />
              <div className="w-3 h-3 rounded-[2px] bg-[var(--color-gold)] border border-[var(--color-gold)]" />
              <span>{t('jap.perfect')}</span>
            </div>
          </div>

          {/* Weekly Bar Chart */}
          <div>
            <div className="font-body text-[11px] uppercase tracking-widest text-[var(--color-gold)] mb-5">Last 7 Days Progress</div>
            <div className="flex items-end gap-2 sm:gap-4 h-32 w-full justify-between px-2">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d;
              }).map((date, i) => {
                const dateStr = getLocalDateString(date);
                const progress = sadhanaHistory[dateStr] || 0;
                const isFuture = false; // Always past/present now
                const height = Math.max(5, progress);
                const dayName = date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' });

                return (
                  <div key={dateStr} className="flex flex-col items-center gap-2 flex-1 group h-full">
                    <div className="w-full relative flex items-end justify-center flex-1 bg-black/5 rounded-t-sm">
                      <motion.div 
                        initial={{ height: '0%' }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, type: "spring" }}
                        className={`w-full rounded-t-sm transition-all ${
                          isFuture ? 'bg-transparent' : 
                          progress >= 100 ? 'bg-[var(--color-gold)] shadow-[0_-5px_15px_rgba(212,175,55,0.4)]' : 
                          progress > 0 ? 'bg-[rgba(212,175,55,0.6)]' : 'bg-transparent'
                        }`}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-body text-[10px] text-white bg-black/80 px-2 py-1 rounded whitespace-nowrap z-20">
                        {progress}%
                      </div>
                    </div>
                    <span className="font-body text-[10px] text-[var(--color-inmu)] uppercase">{dayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card rounded-[32px] p-8 max-w-[340px] w-full text-center"
            >
              <div className="w-16 h-16 bg-[var(--color-honey)]/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                ⚠️
              </div>
              <h3 className="font-display text-[22px] text-[var(--color-ink)] mb-3">Reset Counting?</h3>
              <p className="font-body text-[14px] text-[var(--color-inm)] mb-8 leading-relaxed">
                Are you sure you want to reset your current Mala count to zero?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 px-6 rounded-full border border-[var(--color-gold)]/20 text-[var(--color-gold)] font-medium hover:bg-[var(--color-honey)]/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmReset}
                  className="flex-1 py-3 px-6 rounded-full bg-[var(--color-honey)] text-[var(--color-ink)] font-bold shadow-lg shadow-[var(--color-honey)]/20 hover:brightness-110 transition-all"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divine Reward / Mala Completion Celebration */}
      <AnimatePresence>
        {showMalaComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-linear-to-b from-[rgba(196,154,42,0.95)] via-[rgba(232,146,74,0.98)] to-[rgba(44,26,14,0.95)] backdrop-blur-md overflow-hidden"
          >
            {/* Massive Petal Rain */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: -100, 
                    x: Math.random() * 120 - 10,
                    rotate: 0,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: ['0vh', '110vh'],
                    x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
                    rotate: 720,
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "linear"
                  }}
                  className="absolute text-3xl"
                >
                  {['🌸', '🪷', '✨', '💐'][Math.floor(Math.random() * 4)]}
                </motion.div>
              ))}
            </div>

            {/* Glowing Aura Sunburst */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: 0.2 }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute w-[800px] h-[800px] bg-white rounded-full blur-[150px] pointer-events-none"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative z-10 max-w-[500px] w-full bg-[rgba(255,253,247,0.15)] backdrop-blur-xl border border-white/30 rounded-[60px] p-12 text-center shadow-[0_50px_100px_rgba(0,0,0,0.3)]"
            >
              {/* Victory Symbol */}
              <div className="relative mb-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center text-6xl shadow-[0_0_50px_rgba(255,255,255,0.5)] border-4 border-[var(--color-gold)]"
                >
                  📿
                </motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute inset-0 -m-4 border-2 border-dashed border-white/50 rounded-full"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="font-devanagari text-[32px] text-[var(--color-ink)] mb-2 leading-tight">
                  ॥ श्रीजी की बड़ी कृपा ॥
                </div>
                <h2 className="font-display text-[44px] text-[var(--color-ink)] leading-none mb-6">
                  Mala <em className="italic text-[var(--color-gold)]">Complete!</em>
                </h2>
                
                <div className="w-16 h-[2px] bg-[var(--color-gold)]/40 mx-auto mb-8" />

                <div className="font-body text-[14px] text-[var(--color-ink)] leading-relaxed max-w-[280px] mx-auto mb-10 italic">
                  "{currentBlessing}"
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="px-10 py-4 bg-white text-[var(--color-ink)] font-bold rounded-full font-body text-[14px] tracking-widest uppercase flex items-center gap-3 shadow-xl">
                    <Award className="w-5 h-5 text-[var(--color-gold)]" />
                    Total Malas: {totalMalas}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMalaComplete(false)}
                    className="text-[var(--color-inm)] text-[12px] uppercase tracking-[0.2em] mt-4 hover:text-[var(--color-ink)] transition-colors"
                  >
                    Tap to Continue Sadhana
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* Radiant Orbits */}
            <div className="absolute inset-0 sspin [animation-duration:120s] opacity-20">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] aspect-square border border-white/30 rounded-full" />
            </div>
            <div className="absolute inset-0 sspin [animation-duration:90s] [animation-direction:reverse] opacity-10">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] aspect-square border border-dashed border-white/30 rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customizable Niyams Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[4000] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-card rounded-[32px] w-full max-w-[500px] overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-[var(--bdr)] flex items-center justify-between bg-transparent">
                <div>
                  <h3 className="font-display text-[22px] text-[var(--color-ink)]">
                    {language === 'hi' ? 'नियम अनुकूलित करें' : 'Customize Niyams'}
                  </h3>
                  <p className="font-body text-[13px] text-[var(--color-inm)]">
                    {language === 'hi' ? 'अपने लक्ष्य निर्धारित करें या अवांछित नियमों को हटा दें।' : 'Set your targets or remove unwanted niyams.'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-full hover:bg-[var(--color-gold)]/10 text-[var(--color-inm)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                {editingRules.map((rule, idx) => (
                  <div key={rule.id} className="flex flex-col sm:flex-row gap-3 p-4 glass-panel rounded-2xl">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={rule.text}
                        onChange={(e) => {
                          const newRules = [...editingRules];
                          newRules[idx].text = e.target.value;
                          setEditingRules(newRules);
                        }}
                        className="w-full bg-transparent px-3 py-2 border-b border-[var(--color-gold)]/30 rounded-none text-sm font-medium text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-gold)] placeholder-[var(--color-inm)]"
                      />
                      <div className="text-[10px] uppercase tracking-wider text-[var(--color-inmu)] mt-2 pl-1 flex items-center justify-between">
                        <span>{rule.type === 'numeric' ? 'Numeric Target' : 'Completion Task'}</span>
                        <div className="flex items-center gap-1.5 bg-transparent border-b border-[var(--color-gold)]/30 px-1">
                          <Bell size={10} className="text-[var(--color-gold)]" />
                          <input 
                            type="time" 
                            value={rule.reminderTime || ''}
                            onChange={(e) => {
                              const newRules = [...editingRules];
                              newRules[idx].reminderTime = e.target.value;
                              setEditingRules(newRules);
                            }}
                            className="bg-transparent text-[var(--color-ink)] focus:outline-none text-[11px] font-medium"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {rule.type === 'numeric' && (
                        <div className="flex items-center glass-panel rounded-lg overflow-hidden">
                          <button 
                            onClick={() => {
                              const newRules = [...editingRules];
                              newRules[idx].target = Math.max(1, newRules[idx].target - 1);
                              setEditingRules(newRules);
                            }}
                            className="w-8 h-9 flex items-center justify-center hover:bg-[var(--color-gold)]/20 text-[var(--color-ins)] cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <input 
                            type="number"
                            value={rule.target}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val > 0) {
                                const newRules = [...editingRules];
                                newRules[idx].target = val;
                                setEditingRules(newRules);
                              }
                            }}
                            className="w-12 h-9 bg-transparent text-center text-[14px] font-bold text-[var(--color-ink)] focus:outline-none border-x border-[var(--color-gold)]/20"
                          />
                          <button 
                            onClick={() => {
                              const newRules = [...editingRules];
                              newRules[idx].target += 1;
                              setEditingRules(newRules);
                            }}
                            className="w-8 h-9 flex items-center justify-center hover:bg-[var(--color-gold)]/20 text-[var(--color-ins)] cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => {
                          setEditingRules(editingRules.filter(r => r.id !== rule.id));
                        }}
                        className="p-2.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-100"
                        title="Remove Niyam"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {editingRules.length === 0 && (
                  <div className="text-center py-8 text-[var(--color-inm)] font-body italic">
                    {language === 'hi' ? 'कोई नियम नहीं। अपने कस्टम नियम जोड़ने के लिए डिफ़ॉल्ट पर रीसेट करें।' : 'No Niyams left. Reset to default to add your custom rules.'}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-[var(--bdr)] bg-transparent flex gap-3">
                <button 
                  onClick={() => setEditingRules(DEFAULT_RULES)}
                  className="flex-1 py-3 px-4 rounded-xl glass-panel text-[var(--color-gold)] font-medium hover:bg-[var(--color-gold)] hover:text-white transition-colors cursor-pointer text-sm"
                >
                  {language === 'hi' ? 'रीसेट' : 'Reset to Default'}
                </button>
                <button 
                  onClick={handleSaveSettings}
                  className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-[var(--color-honey)] to-[var(--color-gold)] text-[var(--color-ink)] font-bold shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
                >
                  {language === 'hi' ? 'परिवर्तन सहेजें' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[5000] glass-card px-6 py-3 rounded-full border border-[var(--color-gold)]/50 shadow-xl flex items-center gap-3"
          >
            <Bell size={16} className="text-[var(--color-gold)] animate-bounce" />
            <span className="font-body text-[13px] font-semibold text-[var(--color-ink)]">
              {showToast.message}
            </span>
            <button onClick={() => setShowToast({ message: '', show: false })} className="ml-2 p-1 hover:bg-black/5 rounded-full">
              <X size={14} className="text-[var(--color-ins)]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift Reveal Modal (Weekly Reward/Reminder) */}
      <AnimatePresence>
        {showGiftReveal.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card rounded-[40px] max-w-[400px] w-full text-center overflow-hidden border-2 border-[var(--color-gold)]/30 relative"
            >
              {showGiftReveal.isSlacking ? (
                <div className="p-10 bg-linear-to-b from-transparent to-[var(--color-warm)]/50">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[var(--color-saffron)]/10 flex items-center justify-center text-4xl mb-6">
                    🙏
                  </div>
                  <h3 className="font-display text-[28px] text-[var(--color-ink)] mb-4">A Loving Reminder</h3>
                  <p className="font-body text-[14px] text-[var(--color-inm)] leading-relaxed mb-8">
                    We noticed you haven't completed any Sadhana this past week. The Divine awaits your devotion. Start small today!
                  </p>
                  <button 
                    onClick={() => setShowGiftReveal({ show: false, image: '', isSlacking: false })}
                    className="px-8 py-3 rounded-full bg-[var(--color-gold)] text-white font-bold text-sm tracking-wider uppercase shadow-lg"
                  >
                    I Will Try
                  </button>
                </div>
              ) : (
                <div className="relative">
                  {/* Confetti / Lights */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 mix-blend-overlay pointer-events-none" />
                  
                  <div className="p-8 pb-0">
                    <h3 className="font-display text-[26px] text-[var(--color-ink)] mb-2">Perfect Week!</h3>
                    <p className="font-body text-[12px] text-[var(--color-inmu)] uppercase tracking-widest mb-6">You earned a Divine Gift</p>
                  </div>
                  
                  <div className="px-6 pb-6">
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-2xl relative group">
                      <img src={showGiftReveal.image} alt="Divine Gift" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <a 
                          href={showGiftReveal.image} 
                          download="divine_gift.jpg"
                          target="_blank"
                          rel="noreferrer"
                          className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white rounded-full text-[12px] font-bold text-black flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"
                        >
                          <ImageIcon size={14} /> Download Wallpaper
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 pt-2">
                    <button 
                      onClick={() => setShowGiftReveal({ show: false, image: '', isSlacking: false })}
                      className="px-8 py-3 rounded-full bg-linear-to-r from-[var(--color-honey)] to-[var(--color-gold)] text-white font-bold text-[13px] tracking-wider uppercase shadow-lg shadow-[var(--color-gold)]/30 hover:scale-105 transition-transform"
                    >
                      Accept Gift
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rewards Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[4500] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-card rounded-[32px] w-full max-w-[800px] max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-[var(--bdr)] flex items-center justify-between bg-transparent">
                <div>
                  <h3 className="font-display text-[24px] text-[var(--color-ink)] flex items-center gap-2">
                    <Gift className="text-[var(--color-gold)]" /> Divine Rewards Gallery
                  </h3>
                  <p className="font-body text-[13px] text-[var(--color-inm)] mt-1">
                    Wallpapers you have earned from completing perfect weeks of Sadhana.
                  </p>
                </div>
                <button 
                  onClick={() => setShowGallery(false)}
                  className="p-2 rounded-full hover:bg-[var(--color-gold)]/10 text-[var(--color-inm)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[var(--color-warm)]/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {earnedGifts.map((img, i) => (
                    <div key={i} className="group relative rounded-2xl overflow-hidden border-2 border-white shadow-lg aspect-[4/5] bg-black/5">
                      <img src={img} alt={`Gift ${i+1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end pb-6">
                        <a 
                          href={img} 
                          download={`divine_gift_${i+1}.jpg`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[var(--color-gold)] rounded-full text-[11px] font-bold text-white flex items-center gap-2 shadow-xl hover:bg-white hover:text-black transition-colors"
                        >
                          <ImageIcon size={14} /> Download
                        </a>
                      </div>
                    </div>
                  ))}
                  {earnedGifts.length === 0 && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
                      <Gift size={48} className="text-[var(--color-gold)]/30 mb-4" />
                      <p className="font-body text-[16px] text-[var(--color-inm)]">No gifts earned yet.</p>
                      <p className="font-body text-[13px] text-[var(--color-inmu)] mt-2">Complete a perfect week of Sadhana to unlock your first reward!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(0.98) rotate(1deg); }
          75% { transform: scale(0.98) rotate(-1deg); }
        }
        .animate-shake {
          animation: shake 0.1s ease-in-out;
        }
      `}</style>
    </div>
  );
}
