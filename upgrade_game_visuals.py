import re
import sys

filepath = 'src/components/JapCounter.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "      {/* Stairs Animation Section */}"
end_marker = '      <div className="relative w-72 h-72'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    sys.exit(1)

new_game_ui = """      {/* Stairs Animation Section */}
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
            <motion.g 
              animate={{ 
                scale: count >= MALA_SIZE * targetMalas - 5 ? [1, 1.1, 1] : 1,
                filter: count >= MALA_SIZE * targetMalas - 5 ? ["drop-shadow(0 0 10px gold)", "drop-shadow(0 0 40px gold)"] : "drop-shadow(0 0 15px rgba(212,175,55,0.6))"
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              transform="translate(365, 20)"
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

                {/* AI Devotee Sprite with Multiply Blend to remove white background */}
                <image 
                  href="/devotee_sprite.jpg" 
                  x="-20" y="-38" width="40" height="40" 
                  style={{ mixBlendMode: 'multiply' }}
                  className="opacity-95"
                />
                
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

"""

final_content = content[:start_idx] + new_game_ui + content[end_idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(final_content)
print("SUCCESS")
