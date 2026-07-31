import re
import os

filepath = 'src/components/JapCounter.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Mic, MicOff to imports
content = content.replace(
    "import { RotateCcw, Award, Play, Pause, Flame, CheckCircle2, Circle, Plus, Minus, Save, Calendar, BarChart2, Settings, X, Trash2, Bell, Gift, Image as ImageIcon } from 'lucide-react';",
    "import { RotateCcw, Award, Play, Pause, Flame, CheckCircle2, Circle, Plus, Minus, Save, Calendar, BarChart2, Settings, X, Trash2, Bell, Gift, Image as ImageIcon, Mic, MicOff } from 'lucide-react';"
)

# 2. Add State
state_injection = """  const [targetMalas, setTargetMalas] = useState(1);
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
  
      recognition.onresult = (event: any) => {
        const current = event.results[event.results.length - 1];
        const transcript = current[0].transcript.toLowerCase();
        
        // When user chants continuously, interim results will stream.
        // We increment when we detect a fresh distinct chunk of speech.
        if (transcript !== lastTranscript && transcript.trim().length > 0) {
           lastTranscript = transcript;
           const incBtn = document.getElementById('hidden-increment-btn');
           if (incBtn) incBtn.click();
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
"""
content = content.replace("const MALA_SIZE = 108;", state_injection + "\n  const MALA_SIZE = 108;")


# 3. Update handleIncrement
old_handle_increment = """  const handleIncrement = () => {
    if (count + 1 === MALA_SIZE) {
      setCount(0);
      setTotalMalas(prev => prev + 1);
      setShowMalaComplete(true);
      // Increased time for the "Victory Celebration"
      setTimeout(() => setShowMalaComplete(false), 8000);
    } else {
      setCount(prev => prev + 1);
    }
    
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 100);
  };"""

new_handle_increment = """  const handleIncrement = () => {
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
  };"""
content = content.replace(old_handle_increment, new_handle_increment)

# Fix calculateProgress
content = content.replace(
    "return (count / MALA_SIZE) * 100;",
    "return (count / (MALA_SIZE * targetMalas)) * 100;"
)

# 4. Target selector UI
target_selector = """
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
"""
content = content.replace("</div>\n\n      {/* Stairs Animation Section */}", target_selector + "\n      {/* Stairs Animation Section */}")

# 5. Fix Stickman to Devotee
# Let's replace the whole stickman SVG
stickman_old = """            {/* Stickman Walker */}
            <motion.g
              animate={{ 
                x: 22 + (count / MALA_SIZE) * 350,
                y: 185 - (count / MALA_SIZE) * 155
              }}
              transition={{ type: 'spring', stiffness: 45, damping: 18 }}
            >
              {/* Walking Stickman */}
              <motion.g
                animate={{ 
                  rotate: isVibrating ? [-8, 12, 0] : [0, 2, 0],
                  y: isVibrating ? -4 : 0
                }}
                transition={{ duration: 0.12 }}
              >
                {/* Glow under feet on tap */}
                {isVibrating && (
                  <motion.circle 
                    r="8" fill="var(--color-gold)" 
                    initial={{ opacity: 0.8, scale: 0 }}
                    animate={{ opacity: 0, scale: 2 }}
                    className="pointer-events-none"
                  />
                )}

                {/* Body & Prayer Pose */}
                <path d="M -4 -12 L 4 -12 L 6 0 L -6 0 Z" fill="var(--color-saffron)" className="opacity-40" />
                <circle cx="0" cy="-28" r="4.5" fill="var(--color-ink)" />
                <line x1="0" y1="-24" x2="0" y2="-12" stroke="var(--color-ink)" strokeWidth="2.5" />
                
                {/* Joined Hands (Anjali) */}
                <path d="M 0 -18 L -5 -23 M 0 -18 L 5 -23" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="0" cy="-22" r="1.5" fill="var(--color-ink)" />

                {/* Animated Legs */}
                <motion.line 
                  x1="0" y1="-12" x2="-6" y2="0" 
                  stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round"
                  animate={{ x2: isVibrating ? -10 : -6 }}
                />
                <motion.line 
                  x1="0" y1="-12" x2="6" y2="0" 
                  stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round"
                  animate={{ x2: isVibrating ? 10 : 6 }}
                />
                
                {/* Rising Mantra Text */}
                <AnimatePresence>
                  {isVibrating && (
                    <motion.text
                      initial={{ opacity: 0, y: -35, scale: 0.5 }}
                      animate={{ opacity: 1, y: -65, scale: 1.2 }}
                      exit={{ opacity: 0 }}
                      textAnchor="middle"
                      className="font-devanagari text-[11px] fill-[var(--color-gold)] font-bold pointer-events-none"
                    >
                      {activeName.split(' ')[0]}
                    </motion.text>
                  )}
                </AnimatePresence>
              </motion.g>
            </motion.g>"""

devotee_new = """            {/* Devotee Walker */}
            <motion.g
              animate={{ 
                x: 22 + (count / (MALA_SIZE * targetMalas)) * 350,
                y: 185 - (count / (MALA_SIZE * targetMalas)) * 155
              }}
              transition={{ type: 'spring', stiffness: 45, damping: 18 }}
            >
              <motion.g
                animate={{ 
                  rotate: isVibrating ? [-5, 5, 0] : [0, 1, 0],
                  y: isVibrating ? -8 : 0
                }}
                transition={{ duration: 0.15 }}
              >
                {/* Glow under feet */}
                {isVibrating && (
                  <motion.circle 
                    r="10" fill="var(--color-gold)" 
                    initial={{ opacity: 0.8, scale: 0 }}
                    animate={{ opacity: 0, scale: 2.5 }}
                    className="pointer-events-none"
                  />
                )}

                {/* Devotee Silhouette (More elegant) */}
                <path d="M -8 -15 Q 0 -35 8 -15 L 12 0 L -12 0 Z" fill="var(--color-saffron)" />
                <circle cx="0" cy="-26" r="6" fill="var(--color-ink)" />
                {/* Folded Hands */}
                <path d="M -5 -16 L 0 -22 L 5 -16" stroke="var(--color-ink)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Rising Mantra Text */}
                <AnimatePresence>
                  {isVibrating && (
                    <motion.text
                      initial={{ opacity: 0, y: -35, scale: 0.5 }}
                      animate={{ opacity: 1, y: -65, scale: 1.2 }}
                      exit={{ opacity: 0 }}
                      textAnchor="middle"
                      className="font-devanagari text-[12px] fill-[var(--color-gold)] font-bold pointer-events-none drop-shadow-md"
                    >
                      {activeName.split(' ')[0]}
                    </motion.text>
                  )}
                </AnimatePresence>
              </motion.g>
            </motion.g>"""
content = content.replace(stickman_old, devotee_new)


# Update glowing step math
content = content.replace(
    "Math.abs(count - (i * 9)) < 10 &&",
    "Math.abs(count - (i * ((MALA_SIZE * targetMalas) / 11))) < ((MALA_SIZE * targetMalas) / 10) &&"
)

# Update gate animation target
content = content.replace(
    "scale: count > 100 ? [1, 1.2, 1] : 1,",
    "scale: count >= MALA_SIZE * targetMalas - 5 ? [1, 1.2, 1] : 1,"
)
content = content.replace(
    'filter: count > 100 ? ["drop-shadow(0 0 5px gold)", "drop-shadow(0 0 20px gold)"] : "none"',
    'filter: count >= MALA_SIZE * targetMalas - 5 ? ["drop-shadow(0 0 5px gold)", "drop-shadow(0 0 20px gold)"] : "none"'
)
content = content.replace(
    "count > 90 &&",
    "count >= MALA_SIZE * targetMalas - 10 &&"
)

# Update action button
content = content.replace(
    "/ {MALA_SIZE}",
    "/ {MALA_SIZE * targetMalas}"
)
content = content.replace(
    "rotate(${count * (360/MALA_SIZE)}deg)",
    "rotate(${count * (360/(MALA_SIZE * targetMalas))}deg)"
)

# Add Hidden Increment Button and Mic button to controls
# Find Reset button and append Mic button
reset_button_html = """        <button 
          onClick={handleReset}
          className="p-3 rounded-full glass-panel text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-warm)] transition-all shadow-sm active:scale-90"
          title="Reset Mala"
        >
          <RotateCcw className="w-5 h-5" />
        </button>"""

mic_and_hidden_button_html = reset_button_html + """
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
"""
content = content.replace(reset_button_html, mic_and_hidden_button_html)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
