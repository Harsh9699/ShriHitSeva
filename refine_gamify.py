import re

filepath = 'src/components/JapCounter.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the Speech Recognition to include a 1200ms debounce
old_speech_logic = """      let lastTranscript = "";
  
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
      };"""

new_speech_logic = """      let lastTranscript = "";
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
      };"""

content = content.replace(old_speech_logic, new_speech_logic)


# 2. Upgrade the Nikunj Gate SVG
old_gate_svg = """              {/* Gate Structure */}
              <path d="M -25 20 L -25 -10 Q 0 -40 25 -10 L 25 20" fill="white" stroke="var(--color-gold)" strokeWidth="2" className="opacity-90" />
              <motion.text 
                y="-12" textAnchor="middle" 
                className="font-devanagari text-[12px] fill-[var(--color-saffron)] font-bold"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                श्री राधा
              </motion.text>
              <text y="5" textAnchor="middle" className="text-[20px]">🪷</text>"""

new_gate_svg = """              {/* Ornate Nikunj Temple Gate */}
              <path d="M -35 20 L -35 -15 Q -35 -45 -15 -55 Q 0 -62 15 -55 Q 35 -45 35 -15 L 35 20" fill="rgba(255,255,255,0.95)" stroke="var(--color-gold)" strokeWidth="3" />
              <path d="M -25 20 L -25 -12 Q -25 -35 -10 -42 Q 0 -48 10 -42 Q 25 -35 25 -12 L 25 20" fill="var(--color-cream)" stroke="var(--color-saffron)" strokeWidth="1.5" />
              
              {/* Divine Sun/Chakra behind text */}
              <circle cx="0" cy="-35" r="9" fill="var(--color-gold)" className="opacity-40 animate-pulse" />
              <path d="M 0 -48 L 0 -22 M -13 -35 L 13 -35 M -9 -44 L 9 -26 M -9 -26 L 9 -44" stroke="var(--color-gold)" strokeWidth="1" className="opacity-30" />
              
              <motion.text 
                y="-15" textAnchor="middle" 
                className="font-devanagari text-[13px] fill-[var(--color-saffron)] font-bold drop-shadow-sm"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                श्री राधा
              </motion.text>
              
              <text y="7" textAnchor="middle" className="text-[22px] drop-shadow-md">🪷</text>
              
              {/* Nikunj Creepers / Vines */}
              <path d="M -35 -5 Q -40 5 -35 15 Q -30 22 -35 30" stroke="#4ade80" strokeWidth="2.5" fill="none" strokeLinecap="round" className="opacity-80" />
              <path d="M 35 -20 Q 40 -10 35 0 Q 30 10 35 20" stroke="#4ade80" strokeWidth="2.5" fill="none" strokeLinecap="round" className="opacity-80" />
              <path d="M -35 -20 Q -30 -25 -25 -20" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 35 5 Q 30 0 25 5" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" />"""

content = content.replace(old_gate_svg, new_gate_svg)


# 3. Upgrade Devotee Silhouette SVG
old_devotee_svg = """                {/* Devotee Silhouette (More elegant) */}
                <path d="M -8 -15 Q 0 -35 8 -15 L 12 0 L -12 0 Z" fill="var(--color-saffron)" />
                <circle cx="0" cy="-26" r="6" fill="var(--color-ink)" />
                {/* Folded Hands */}
                <path d="M -5 -16 L 0 -22 L 5 -16" stroke="var(--color-ink)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />"""

new_devotee_svg = """                {/* Devotee Kneeling Silhouette */}
                <g className="drop-shadow-sm">
                  {/* Kneeling Body wrapped in shawl */}
                  <path d="M -4 0 C -14 0 -16 -12 -12 -20 C -7 -28 3 -25 8 -20 C 14 -12 12 0 4 0 Z" fill="var(--color-saffron)" stroke="var(--color-saffron)" strokeWidth="1.5" strokeLinejoin="round" />
                  
                  {/* Head/Face slightly bowed */}
                  <circle cx="4" cy="-27" r="5" fill="var(--color-ink)" />
                  <path d="M 7 -29 Q 10 -27 7 -25" stroke="var(--color-saffron)" strokeWidth="1" fill="none" strokeLinecap="round" />
                  <path d="M -1 -25 Q -4 -25 -4 -22" stroke="white" strokeWidth="1" fill="none" className="opacity-40" />
                  
                  {/* Folded Hands (Anjali Mudra) pointing towards the gate */}
                  <path d="M 6 -16 L 14 -19 L 14 -17 Z" fill="#fbcfe8" />
                  <path d="M 3 -13 L 13 -18 L 6 -20" stroke="var(--color-ink)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Dhoti / lower garment detail */}
                  <path d="M -2 -5 L -2 0" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                </g>"""

content = content.replace(old_devotee_svg, new_devotee_svg)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
