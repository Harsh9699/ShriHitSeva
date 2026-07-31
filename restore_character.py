import re

filepath = 'src/components/JapCounter.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_character = """                {/* Devotee Kneeling Silhouette */}
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

new_character = """                {/* Premium 2D Character Token */}
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
                </g>"""

content = content.replace(old_character, new_character)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
