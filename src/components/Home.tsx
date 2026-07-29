import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
interface HomeProps {
  onNavigate: (page: string) => void;
  onOpenChat: () => void;
}

export default function Home({ onNavigate, onOpenChat }: HomeProps) {
  const { t, language } = useLanguage();
  const [showPetals, setShowPetals] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [isIshtImgLoading, setIsIshtImgLoading] = useState(true);
  const [isGuruImgLoading, setIsGuruImgLoading] = useState(true);

  const handlePranam = () => {
    setShowPetals(true);
    setTimeout(() => setShowPetals(false), 3000);
  };

  const acharyaImage = 'https://i.postimg.cc/x82K8p3C/1000051571-removebg-preview.png';
  return (
    <div className="min-h-screen">
      <section className="relative min-h-[calc(100vh-66px)] flex flex-col items-center justify-center text-center px-8 py-20 overflow-hidden">
        {/* Soft, mystical Nikunj background glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(224,184,58,0.15)_0%,transparent_60%),radial-gradient(circle_at_20%_80%,rgba(255,182,193,0.1)_0%,transparent_50%)]" />
        
        {/* Subtle, elegant rotating rings with gold tint */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(75vw,700px)] aspect-square rounded-full border border-[var(--bdr)] pointer-events-none sspin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(55vw,500px)] aspect-square rounded-full border border-[var(--bdrS)] pointer-events-none sspin [animation-duration:90s] [animation-direction:reverse]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="font-body text-[12px] tracking-[0.25em] uppercase text-[var(--color-gdp)] mb-6 relative z-10 font-medium"
        >
          {language === 'hi' ? 'राधावल्लभ संप्रदाय · स्था. 1535 · वृन्दावन' : 'Radhavallabh Sampradaya · Est. 1535 · Vrindavan'}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9 }}
          className="font-devanagari text-[clamp(18px,3.5vw,24px)] font-normal text-[var(--color-inm)] opacity-90 mb-5 leading-relaxed relative z-10 drop-shadow-md"
        >
          श्री राधावल्लभ लाल की जय
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="font-display text-[clamp(36px,7vw,76px)] font-normal leading-[1.1] tracking-tight text-[var(--color-ink)] mb-6 relative z-10 max-w-[900px] drop-shadow-lg"
        >
          {language === 'hi' ? (
            <>जहाँ प्रेम ही<br /><em className="text-transparent bg-clip-text bg-linear-to-r from-[var(--color-honey)] to-[var(--color-gold)] not-italic pr-4 drop-shadow-sm">सर्वोच्च सत्य है</em></>
          ) : (
            <>Where Love is the<br /><em className="text-transparent bg-clip-text bg-linear-to-r from-[var(--color-honey)] to-[var(--color-gold)] not-italic italic pr-4 drop-shadow-sm">Highest Truth</em></>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1 }}
          className="font-body text-[clamp(17px,2.2vw,22px)] font-light leading-relaxed text-[var(--color-ins)] max-w-[540px] mb-12 relative z-10"
        >
          {language === 'hi' 
            ? 'सबसे मधुर और अंतरंग परंपरा — हितोपासना, सहचरी भाव, नित्य विहार। जहाँ श्री राधा सर्वोपरि हैं।'
            : 'The sweetest, most intimate tradition — Hitopasana, Sahchari Bhav, Nitya Vihar. Shri Radha reigns supreme.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="flex flex-col sm:flex-row items-center gap-5 justify-center relative z-10"
        >
          <button
            onClick={() => onNavigate('vaanis')}
            className="w-full sm:w-auto px-10 py-4 bg-linear-to-r from-[var(--color-honey)] to-[var(--color-saffron)] text-[var(--color-ink)] border-none rounded-full font-body text-[16px] tracking-widest uppercase cursor-pointer shadow-[0_4px_15px_rgba(214,185,92,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(214,185,92,0.4)] font-bold"
          >
            {t('home.explore')}
          </button>
          
          <button
            onClick={onOpenChat}
            className="glass-panel w-full sm:w-auto px-10 py-4 text-[var(--color-ink)] rounded-full font-body text-[16px] tracking-widest uppercase cursor-pointer transition-all duration-300 hover:bg-[rgba(255,255,255,0.8)] hover:border-[var(--color-honey)] hover:-translate-y-1 flex items-center justify-center gap-2 font-bold"
          >
            <span className="text-[18px]">✨</span> {t('home.ask')}
          </button>
        </motion.div>
      </section>

      <div className="overflow-hidden glass-panel border-x-0 py-3">
        <div className="flex gap-9 whitespace-nowrap rscroll">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-9">
              <span className="font-devanagari text-[13px] text-[var(--color-inm)] tracking-wider">राधावल्लभ <span className="text-[var(--color-gold)] mx-2">✿</span></span>
              <span className="font-devanagari text-[13px] text-[var(--color-inm)] tracking-wider">हित हरिवंश <span className="text-[var(--color-gold)] mx-2">✿</span></span>
              <span className="font-devanagari text-[13px] text-[var(--color-inm)] tracking-wider">हित चौरासी <span className="text-[var(--color-gold)] mx-2">✿</span></span>
              <span className="font-devanagari text-[13px] text-[var(--color-inm)] tracking-wider">युगल सरकार <span className="text-[var(--color-gold)] mx-2">✿</span></span>
              <span className="font-devanagari text-[13px] text-[var(--color-inm)] tracking-wider">माधुर्य भक्ति <span className="text-[var(--color-gold)] mx-2">✿</span></span>
              <span className="font-devanagari text-[13px] text-[var(--color-inm)] tracking-wider">सहचरी भाव <span className="text-[var(--color-gold)] mx-2">✿</span></span>
              <span className="font-devanagari text-[13px] text-[var(--color-inm)] tracking-wider">नित्य विहार <span className="text-[var(--color-gold)] mx-2">✿</span></span>
              <span className="font-devanagari text-[13px] text-[var(--color-inm)] tracking-wider">हितोपासना <span className="text-[var(--color-gold)] mx-2">✿</span></span>
            </div>
          ))}
        </div>
      </div>

      <section className="px-6 py-24 bg-transparent overflow-hidden">
        <div className="max-w-[800px] mx-auto flex flex-col items-center text-center relative z-10">
          {/* Isht Dev Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="font-body text-[11px] tracking-[0.22em] uppercase text-[var(--color-gold)] mb-4 flex items-center justify-center gap-3 drop-shadow-md">
              <span className="w-8 h-[1px] bg-[var(--color-gold)] opacity-50"></span>
              {language === 'hi' ? 'हमारे इष्ट देव' : 'Our Isht Dev'}
              <span className="w-8 h-[1px] bg-[var(--color-gold)] opacity-50"></span>
            </div>
            <h2 className="font-display text-[clamp(32px,5vw,56px)] text-[var(--color-ink)] leading-[1.1] drop-shadow-lg">
              {language === 'hi' ? (
                <>नव निभृत निकुंज विलासी <br /><em className="italic text-[var(--color-gold)]">श्री हित राधावल्लभ</em> लाल जू महाराज</>
              ) : (
                <>Nav Nibhrut Nikunj Vilasi <br /><em className="italic text-[var(--color-gold)]">Shri Hit Radhavallabh</em> Lal Ju Maharaj</>
              )}
            </h2>
          </motion.div>

          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="relative w-full max-w-[420px] aspect-[4/5] mb-8 group p-2 glass-card rounded-[40px]"
          >
            <div className="relative z-10 rounded-[32px] overflow-hidden bg-[var(--color-warm)] h-full">
              {isIshtImgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-warm)]">
                  <div className="w-10 h-10 border-2 border-[var(--color-saffron)] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isIshtImgLoading ? 0 : 1 }}
                  exit={{ opacity: 0 }}
                  src="https://i.postimg.cc/pVmNJGx9/IMG-20260412-WA0315.jpg" 
                  alt="Shri Hit Radhavallabh Lal Ju Maharaj"
                  onLoad={() => setIsIshtImgLoading(false)}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.parentElement?.querySelector('.img-placeholder');
                    if (placeholder) (placeholder as HTMLElement).style.display = 'flex';
                    setIsIshtImgLoading(false);
                  }}
                />
              </AnimatePresence>
              <div className="img-placeholder absolute inset-0 hidden flex-col items-center justify-center bg-[var(--color-honey)] p-8 text-center">
                <span className="text-4xl mb-4">🪷</span>
                <p className="font-devanagari text-[var(--color-gdp)] text-sm">जय श्री राधावल्लभ</p>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-[rgba(44,26,14,0.15)] to-transparent pointer-events-none" />
            </div>
            
            {/* Decorative Orbits */}
            <div className="absolute -inset-10 border border-[var(--bdrS)] rounded-full pointer-events-none sspin [animation-duration:40s]" />
            <div className="absolute -inset-16 border border-dashed border-[var(--bdr)] rounded-full pointer-events-none sspin [animation-duration:60s] [animation-direction:reverse]" />
          </motion.div>

          {/* Dandavat Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePranam}
            className="px-10 py-4 bg-linear-to-r from-[var(--color-honey)] to-[var(--color-gold)] text-[var(--color-ink)] font-bold rounded-full text-[15px] tracking-[0.15em] uppercase flex items-center gap-3 shadow-xl relative overflow-hidden group mb-14 cursor-pointer"
          >
            <span className="relative z-10">🙏 {language === 'hi' ? 'दण्डवत प्रणाम' : 'Dandavat Pranam'}</span>
            <div className="absolute inset-0 bg-linear-to-r from-[var(--color-gdp)] to-[var(--color-honey)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          {/* Mantra */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-10"
          >
            <div className="font-devanagari text-[clamp(24px,4vw,36px)] text-[var(--color-ink)] leading-relaxed font-bold">
              ॥ राधावल्लभ श्री हरिवंश ॥
            </div>
            <div className="w-16 h-[1px] bg-[var(--color-gold)] mx-auto mt-6 opacity-30" />
          </motion.div>

          {/* Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-[680px] mb-12"
          >
            <p className="text-[16px] font-light leading-relaxed text-[var(--color-ins)]">
              {language === 'hi'
                ? 'श्री राधावल्लभ लाल राधावल्लभ संप्रदाय के सर्वोच्च स्वयंभू इष्ट हैं, जिन्हें श्री हित हरिवंश महाप्रभु ने संसार के सामने प्रकट किया। वृन्दावन के \'नव निभृत निकुंज\' में विराजमान, वे श्री राधा और श्री कृष्ण के एकीकृत स्वरूप का प्रतिनिधित्व करते हैं—दो दिव्य रूपों में एक आत्मा। अन्य परंपराओं के विपरीत, यहाँ इष्ट की सेवा \'नित्य विहार\' के भाव में की जाती है, जो श्री राधा-कृष्ण की शाश्वत और निर्बाध प्रेम-लीला है और जो भौतिक तथा स्वर्गीय सीमाओं से परे है।'
                : 'Shri Radhavallabh Lal is the supreme self-manifested (Swayambhu) deity of the Radhavallabh Sampradaya, manifested to the world by Shri Hit Harivansh Mahaprabhu. Residing in the \'Nav Nibhrut Nikunj\' of Vrindavan, He represents the unified essence of Shri Radha and Shri Krishna—one soul in two divine forms. Unlike other traditions, here the deity is served in the mood of \'Nitya Vihar,\' the eternal and uninterrupted love-play that transcends even the boundaries of the material and celestial realms.'
              }
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="max-w-[100px] mx-auto h-[1px] bg-linear-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-20 my-12" />

        <div className="max-w-[800px] mx-auto flex flex-col items-center text-center">
          {/* 1. Heading */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="font-body text-[11px] tracking-[0.22em] uppercase text-[var(--color-gold)] mb-4 flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-[var(--color-gold)] opacity-30"></span>
              {language === 'hi' ? 'हमारे संस्थापक एवं आचार्य' : 'Our Founder & Acharya'}
              <span className="w-8 h-[1px] bg-[var(--color-gold)] opacity-30"></span>
            </div>
            <h2 className="font-display text-[clamp(32px,5vw,56px)] text-[var(--color-ink)] leading-[1.1]">
              {language === 'hi' ? (
                <>श्री हित <em className="italic text-[var(--color-gold)]">हरिवंश चंद्र</em> महाप्रभु</>
              ) : (
                <>Shri Hit <em className="italic text-[var(--color-gold)]">Harivansh Chandra</em> Mahaprabhu</>
              )}
            </h2>
          </motion.div>

          {/* 2. Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="relative w-full max-w-[420px] aspect-[4/5] mb-8 group p-2 glass-card rounded-[40px]"
          >
            <div className="relative z-10 rounded-[32px] overflow-hidden bg-[var(--color-warm)] h-full">
              {isImgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-warm)]">
                  <div className="w-10 h-10 border-2 border-[var(--color-saffron)] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isImgLoading ? 0 : 1 }}
                  exit={{ opacity: 0 }}
                  src={acharyaImage} 
                  alt="Shri Hit Harivansh Chandra Mahaprabhu"
                  onLoad={() => setIsImgLoading(false)}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.parentElement?.querySelector('.img-placeholder');
                    if (placeholder) (placeholder as HTMLElement).style.display = 'flex';
                    setIsImgLoading(false);
                  }}
                />
              </AnimatePresence>
              <div className="img-placeholder absolute inset-0 hidden flex-col items-center justify-center bg-[var(--color-honey)] p-8 text-center">
                <span className="text-4xl mb-4">🪷</span>
                <p className="font-devanagari text-[var(--color-gdp)] text-sm">जय श्री हरिवंश</p>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-[rgba(44,26,14,0.15)] to-transparent pointer-events-none" />
            </div>
            
            {/* Decorative Orbits */}
            <div className="absolute -inset-10 border border-[var(--bdrS)] rounded-full pointer-events-none sspin [animation-duration:40s]" />
            <div className="absolute -inset-16 border border-dashed border-[var(--bdr)] rounded-full pointer-events-none sspin [animation-duration:60s] [animation-direction:reverse]" />
            
            {/* Glows */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[var(--color-saffron)] opacity-10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-[var(--color-gold)] opacity-10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
          </motion.div>

          {/* 3. Dandavat Button (Moved here) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePranam}
            className="px-10 py-4 bg-linear-to-r from-[var(--color-honey)] to-[var(--color-gold)] text-[var(--color-ink)] font-bold rounded-full text-[15px] tracking-[0.15em] uppercase flex items-center gap-3 shadow-xl relative overflow-hidden group mb-14 cursor-pointer"
          >
            <span className="relative z-10">🙏 {language === 'hi' ? 'दण्डवत प्रणाम' : 'Dandavat Pranam'}</span>
            <div className="absolute inset-0 bg-linear-to-r from-[var(--color-gdp)] to-[var(--color-honey)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {showPetals && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[rgba(255,255,255,0.1)] pointer-events-none"
              />
            )}
          </motion.button>

          {/* 4. Mantra (User Provided) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-10"
          >
            <div className="font-devanagari text-[clamp(20px,3vw,28px)] text-[var(--color-ink)] leading-relaxed font-medium italic drop-shadow-sm">
              प्रेमानन्दोत्पुलकित गात्रौ विद्युद्धाराधर सम कान्ति: ।<br />
              राधा कृष्णौ मनसि दधानं वन्देहं श्रीहित हरिवंशम् ॥
            </div>
            <div className="w-16 h-[1px] bg-[var(--color-gold)] mx-auto mt-6 opacity-50" />
          </motion.div>

          {/* 5. Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-[680px] mb-12"
          >
            <p className="text-[16px] font-light leading-relaxed text-[var(--color-ins)]">
              {language === 'hi'
                ? 'श्री कृष्ण की वंशी के अवतार (मुरली अवतार), जिन्होंने 1535 में राधावल्लभ संप्रदाय की स्थापना की। उन्होंने "हित" (विशुद्ध प्रेम) और "नित्य विहार" का मार्ग सिखाया — श्री राधा और श्री कृष्ण की शाश्वत, निस्वार्थ प्रेम-लीला।'
                : 'The incarnation of Shri Krishna\'s flute (Murali Avtar), who established the Radhavallabh Sampradaya in 1535. He taught the path of "Hit" (Pure Love) and "Nitya Vihar" — the eternal, selfless love play of Shri Radha and Shri Krishna.'
              }
            </p>
          </motion.div>

          <AnimatePresence>
            {showPetals && (
              <div className="fixed inset-0 pointer-events-none z-[100]">
                {[...Array(25)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 0, 
                      y: -20, 
                      x: Math.random() * window.innerWidth,
                      rotate: 0 
                    }}
                    animate={{ 
                      opacity: [0, 1, 1, 0],
                      y: window.innerHeight + 20,
                      x: (Math.random() - 0.5) * 300 + (Math.random() * window.innerWidth),
                      rotate: 720
                    }}
                    transition={{ 
                      duration: 2.5 + Math.random() * 2,
                      ease: "linear"
                    }}
                    className="absolute text-3xl"
                  >
                    🌸
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="max-w-[100px] mx-auto h-[1px] bg-linear-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-20 my-12" />

        {/* Sadhguru Section */}
        <div className="max-w-[800px] mx-auto flex flex-col items-center text-center pb-12">
          {/* 1. Heading */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="font-body text-[11px] tracking-[0.22em] uppercase text-[var(--color-gold)] mb-4 flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-[var(--color-gold)] opacity-30"></span>
              {language === 'hi' ? 'हमारे श्री सद्गुरु देव भगवान' : 'Our Shri Sadhguru Dev Bhagwan'}
              <span className="w-8 h-[1px] bg-[var(--color-gold)] opacity-30"></span>
            </div>
            <h2 className="font-display text-[clamp(32px,5vw,56px)] text-[var(--color-ink)] leading-[1.1]">
              {language === 'hi' ? (
                <>श्री हित गोबिंद शरण <em className="italic text-[var(--color-gold)]">प्रेमानंद जी</em> महाराज</>
              ) : (
                <>Shri Hit Govind Sharan <em className="italic text-[var(--color-gold)]">Premanand ji</em> Maharaj</>
              )}
            </h2>
          </motion.div>

          {/* 2. Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="relative w-full max-w-[420px] aspect-[4/5] mb-8 group p-2 glass-card rounded-[40px]"
          >
            <div className="relative z-10 rounded-[32px] overflow-hidden bg-[var(--color-warm)] h-full">
              {isGuruImgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-warm)]">
                  <div className="w-10 h-10 border-2 border-[var(--color-saffron)] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isGuruImgLoading ? 0 : 1 }}
                  exit={{ opacity: 0 }}
                  src="https://i.postimg.cc/MKcWXZXY/IMG-20260412_195218.jpg" 
                  alt="Shri Hit Govind Sharan Premanand ji Maharaj"
                  onLoad={() => setIsGuruImgLoading(false)}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.parentElement?.querySelector('.img-placeholder');
                    if (placeholder) (placeholder as HTMLElement).style.display = 'flex';
                    setIsGuruImgLoading(false);
                  }}
                />
              </AnimatePresence>
              <div className="img-placeholder absolute inset-0 hidden flex-col items-center justify-center bg-[var(--color-honey)] p-8 text-center">
                <span className="text-4xl mb-4">🪷</span>
                <p className="font-devanagari text-[var(--color-gdp)] text-sm">जय श्री राधावल्लभ</p>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-[rgba(44,26,14,0.15)] to-transparent pointer-events-none" />
            </div>
            
            {/* Decorative Orbits */}
            <div className="absolute -inset-10 border border-[var(--bdrS)] rounded-full pointer-events-none sspin [animation-duration:40s]" />
            <div className="absolute -inset-16 border border-dashed border-[var(--bdr)] rounded-full pointer-events-none sspin [animation-duration:60s] [animation-direction:reverse]" />
          </motion.div>

          {/* 3. Dandavat Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePranam}
            className="px-10 py-4 bg-linear-to-r from-[var(--color-honey)] to-[var(--color-gold)] text-[var(--color-ink)] font-bold rounded-full text-[15px] tracking-[0.15em] uppercase flex items-center gap-3 shadow-xl relative overflow-hidden group mb-14 cursor-pointer"
          >
            <span className="relative z-10">🙏 {language === 'hi' ? 'दण्डवत प्रणाम' : 'Dandavat Pranam'}</span>
            <div className="absolute inset-0 bg-linear-to-r from-[var(--color-gdp)] to-[var(--color-honey)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          {/* 4. Mantra */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-10"
          >
            <div className="font-devanagari text-[clamp(18px,2.5vw,24px)] text-[var(--color-ink)] leading-relaxed font-medium italic">
              गुरु कृपाल हितरूप वपु, करिहैं सुमति-प्रकाश।<br />
              हैं समरथ मो सिर धनी, पुजवेंगे सब आस ॥<br />
              वरनौं मंगल नाम-गुन, अग्या इनकी पाइ।<br />
              लोचन-हीनैं देत ज्यौं, समरथ पन्थ बताइ ॥
            </div>
            <div className="w-16 h-[1px] bg-[var(--color-gold)] mx-auto mt-6 opacity-30" />
          </motion.div>

          {/* 5. Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-[720px]"
          >
            <div className="space-y-4 text-[16px] font-light leading-relaxed text-[var(--color-ins)]">
              {language === 'hi' ? (
                <>
                  <p>
                    वृन्दावन के श्रद्धेय रसिक संत, श्री हित प्रेमानंद गोविंद शरण जी महाराज "राधा वल्लभ" भक्ति के साक्षात् स्वरूप हैं। उनका जीवन "नाम जप" की शक्ति और श्रीजी की अद्भुत कृपा का गहन प्रमाण है।
                  </p>
                  <p>
                    15 वर्ष से अधिक समय पहले अपनी दोनों किडनियाँ खराब होने के बावजूद, महाराज जी अपनी गहन आध्यात्मिक दिनचर्या को जारी रखे हुए हैं—जिसमें आधी रात की परिक्रमा और दैनिक सत्संग शामिल हैं—जो पूरी तरह से उनकी भक्ति की शक्ति से संभव है। वे अक्सर कहते हैं, "यह शरीर श्री राधा की इच्छा से चल रहा है।"
                  </p>
                  <p>
                    अपने यूट्यूब चैनल <span className="text-[var(--color-saffron)] font-medium">"भजन मार्ग"</span> के माध्यम से, वे लाखों लोगों को निस्वार्थ प्रेम (निष्काम भक्ति) के मार्ग पर मार्गदर्शन करते हैं, चरित्र निर्माण और दिव्य युगल के शाश्वत "नित्य विहार" पर जोर देते हैं।
                  </p>
                </>
              ) : (
                <>
                  <p>
                    A revered Rasik Saint of Vrindavan, Shri Hit Premanand Govind Sharan ji Maharaj is a living embodiment of "Radha Vallabh" devotion. His life is a profound testament to the power of "Nam Jap" and the miraculous Grace of Shriji.
                  </p>
                  <p>
                    Despite both his kidneys having failed over 15 years ago, Maharaj ji continues his intense spiritual routine—including midnight parikramas and daily satsangs—solely by the strength of his devotion. He often says, "This body is sustained by the will of Shri Radha."
                  </p>
                  <p>
                    Through his YouTube channel <span className="text-[var(--color-saffron)] font-medium">"Bhajanmarg"</span>, he guides millions towards the path of selfless love (Nishkam Bhakti), emphasizing character building and the eternal "Nitya Vihar" of the Divine Couple.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="max-w-[100px] mx-auto h-[1px] bg-linear-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-20 my-12" />
      </section>

      <section className="px-11 py-18 bg-transparent">
        <div className="text-center mb-13 relative z-10">
          <div className="font-body text-[11px] tracking-[0.22em] uppercase text-[var(--color-gold)] flex items-center gap-2 justify-center mb-3">
            <span className="text-[8px]">✦</span> {language === 'hi' ? 'अंदर क्या है' : "What's Inside"}
          </div>
            <h2 className="font-display text-[clamp(24px,4vw,42px)] text-[var(--color-ink)] tracking-tight drop-shadow-sm">
            {language === 'hi' ? (
              <>एक पूर्ण <em className="italic text-[var(--color-gold)]">आध्यात्मिक आश्रय</em></>
            ) : (
              <>A Complete <em className="italic text-[var(--color-gold)]">Spiritual Sanctuary</em></>
            )}
          </h2>
        </div>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4.5 max-w-[1060px] mx-auto relative z-10">
          {language === 'hi' ? [
            { id: 'mangalacharan', icon: '🙏', title: 'मंगलाचरण', desc: '4 पवित्र स्तुति श्लोक — पूर्ण अर्थ सहित।', badge: '4 श्लोक ✓' },
            { id: 'yamunashtaka', icon: '🌊', title: 'श्री यमुनाष्टक', desc: 'श्री यमुना जी की महिमा के सभी 9 श्लोक — पूर्ण अर्थ सहित।', badge: '9 श्लोक ✓' },
            { id: 'yugaldhyan', icon: '🧘', title: 'युगल ध्यान', desc: 'युगल स्वरूप ध्यान के 20 सुंदर श्लोक — पूर्ण रूप से एकीकृत।', badge: '20 श्लोक ✓' },
            { id: 'bhaktnaamvali', icon: '📿', title: 'भक्त नामावली', desc: 'सभी परंपराओं के पवित्र भक्तों के नाम के 22 श्लोक।', badge: '22 श्लोक ✓' },
            { id: 'calendar', icon: '📅', title: 'दिव्य कैलेंडर', desc: 'वर्ष 2026 के लिए संपूर्ण वैष्णव उत्सव निर्णय पत्रिका।', badge: 'उत्सव ✓' }
          ].map((feat, idx) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onNavigate(feat.id === 'calendar' ? 'calendar' : 'vaanis')}
              className="glass-card rounded-[18px] p-7 transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_14px_44px_rgba(212,175,55,0.2)] group"
            >
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[var(--color-honey)] to-[var(--color-saffron)] flex items-center justify-center text-[22px] mb-3.5 transition-transform duration-300 group-hover:scale-110 shadow-lg">
                {feat.icon}
              </div>
              <div className="font-display text-[17px] text-[var(--color-ink)] mb-1.5">{feat.title}</div>
              <p className="text-[13.5px] font-light text-[var(--color-ins)] leading-relaxed mb-3">
                {feat.desc}
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] bg-[rgba(212,175,55,0.15)] text-[var(--color-gold)] border border-[rgba(212,175,55,0.3)]">
                {feat.badge}
              </span>
            </motion.div>
          )) : [
            { id: 'mangalacharan', icon: '🙏', title: 'Mangalacharan', desc: '4 sacred invocatory shlokas — fully extracted with meanings.', badge: '4 Shlokas ✓' },
            { id: 'yamunashtaka', icon: '🌊', title: 'Shri Yamunashtaka', desc: 'All 9 shlokas glorifying Shri Yamuna — with refrain & full meanings.', badge: '9 Shlokas ✓' },
            { id: 'yugaldhyan', icon: '🧘', title: 'Yugal Dhyan', desc: '20 beautiful verses of Yugal Swaroop meditation — fully integrated.', badge: '20 Verses ✓' },
            { id: 'bhaktnaamvali', icon: '📿', title: 'Bhakt Naamvali', desc: '22 verses naming sacred devotees across all traditions.', badge: '22 Verses ✓' },
            { id: 'calendar', icon: '📅', title: 'Divine Calendar', desc: 'Complete Vaishnav Utsav Nirnay Patrika for the year 2026.', badge: 'Utsavs ✓' }
          ].map((feat, idx) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onNavigate(feat.id === 'calendar' ? 'calendar' : 'vaanis')}
              className="glass-card rounded-[18px] p-7 transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_14px_44px_rgba(212,175,55,0.2)] group"
            >
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[var(--color-honey)] to-[var(--color-saffron)] flex items-center justify-center text-[22px] mb-3.5 transition-transform duration-300 group-hover:scale-110 shadow-lg">
                {feat.icon}
              </div>
              <div className="font-display text-[17px] text-[var(--color-ink)] mb-1.5">{feat.title}</div>
              <p className="text-[13.5px] font-light text-[var(--color-ins)] leading-relaxed mb-3">
                {feat.desc}
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] bg-[rgba(212,175,55,0.15)] text-[var(--color-gold)] border border-[rgba(212,175,55,0.3)]">
                {feat.badge}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
