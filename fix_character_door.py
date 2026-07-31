import re
import sys

filepath = 'src/components/JapCounter.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the Gate positioning (Wrap in <g transform="..."> to prevent Framer Motion from overwriting it)
old_gate = """            {/* Destination: The Radiant Nikunj Gate */}
            <motion.g 
              animate={{ 
                scale: count >= MALA_SIZE * targetMalas - 5 ? [1, 1.1, 1] : 1,
                filter: count >= MALA_SIZE * targetMalas - 5 ? ["drop-shadow(0 0 10px gold)", "drop-shadow(0 0 40px gold)"] : "drop-shadow(0 0 15px rgba(212,175,55,0.6))"
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              transform="translate(365, 20)"
            >"""

new_gate = """            {/* Destination: The Radiant Nikunj Gate */}
            <g transform="translate(365, 20)">
            <motion.g 
              animate={{ 
                scale: count >= MALA_SIZE * targetMalas - 5 ? [1, 1.1, 1] : 1,
                filter: count >= MALA_SIZE * targetMalas - 5 ? ["drop-shadow(0 0 10px gold)", "drop-shadow(0 0 40px gold)"] : "drop-shadow(0 0 15px rgba(212,175,55,0.6))"
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >"""
content = content.replace(old_gate, new_gate)

# Add closing </g> for the gate
old_gate_end = """              </motion.text>
            </motion.g>

            {/* Devotee Walker */}"""

new_gate_end = """              </motion.text>
            </motion.g>
            </g>

            {/* Devotee Walker */}"""
content = content.replace(old_gate_end, new_gate_end)


# 2. Fix the Devotee Character (Replace the image with the beautiful SVG)
old_devotee = """                {/* AI Devotee Sprite with Multiply Blend to remove white background */}
                <image 
                  href="/devotee_sprite.jpg" 
                  x="-20" y="-38" width="40" height="40" 
                  style={{ mixBlendMode: 'multiply' }}
                  className="opacity-95"
                />"""

new_devotee = """                {/* Devotee Kneeling Silhouette */}
                <g className="drop-shadow-md" transform="translate(0, -10)">
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

content = content.replace(old_devotee, new_devotee)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
