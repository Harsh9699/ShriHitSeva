import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, Hash, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { VAANI_SECTIONS } from '../constants/vaanis';

export default function VaaniLibrary() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('mangalacharan');
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [fullscreenVaaniId, setFullscreenVaaniId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeSection = VAANI_SECTIONS.find(s => s.id === activeTab);

  // Reset sub-tab when main tab changes
  useMemo(() => {
    if (activeSection?.subSections) {
      setActiveSubTab(activeSection.subSections[0].id);
    } else {
      setActiveSubTab(null);
    }
  }, [activeTab, activeSection]);

  const filteredVaanis = useMemo(() => {
    if (!activeSection) return [];
    
    let baseVaanis = activeSection.vaanis;
    if (activeSection.subSections && activeSubTab) {
      const sub = activeSection.subSections.find(ss => ss.id === activeSubTab);
      baseVaanis = sub ? sub.vaanis : [];
    }

    if (!searchQuery.trim()) return baseVaanis;
    
    const query = searchQuery.toLowerCase();
    return baseVaanis.filter(v => 
      v.title.toLowerCase().includes(query) || 
      v.text.toLowerCase().includes(query) ||
      (v.meaning && v.meaning.toLowerCase().includes(query))
    );
  }, [activeSection, activeSubTab, searchQuery]);

  const totalVaanisCount = useMemo(() => {
    return VAANI_SECTIONS.map(s => ({
      id: s.id,
      count: s.subSections 
        ? s.subSections.reduce((acc, ss) => acc + ss.vaanis.length, 0)
        : s.vaanis.length
    }));
  }, []);

  const fullscreenVaani = useMemo(() => {
    if (!fullscreenVaaniId) return null;
    for (const section of VAANI_SECTIONS) {
      const vaani = section.vaanis.find(v => v.id === fullscreenVaaniId);
      if (vaani) return vaani;
      if (section.subSections) {
        for (const sub of section.subSections) {
          const subVaani = sub.vaanis.find(v => v.id === fullscreenVaaniId);
          if (subVaani) return subVaani;
        }
      }
    }
    return null;
  }, [fullscreenVaaniId]);

  // Prevent scroll when fullscreen is active
  useEffect(() => {
    if (fullscreenVaaniId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [fullscreenVaaniId]);

  const navigateFullscreen = (direction: 'next' | 'prev') => {
    if (!fullscreenVaaniId) return;
    
    const allVaanis = activeSection?.subSections && activeSubTab
      ? activeSection.subSections.find(ss => ss.id === activeSubTab)?.vaanis || []
      : activeSection?.vaanis || [];
      
    const currentIndex = allVaanis.findIndex(v => v.id === fullscreenVaaniId);
    if (currentIndex === -1) return;

    if (direction === 'next' && currentIndex < allVaanis.length - 1) {
      setFullscreenVaaniId(allVaanis[currentIndex + 1].id);
    } else if (direction === 'prev' && currentIndex > 0) {
      setFullscreenVaaniId(allVaanis[currentIndex - 1].id);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreenVaaniId) return;
      if (e.key === 'ArrowRight') navigateFullscreen('next');
      if (e.key === 'ArrowLeft') navigateFullscreen('prev');
      if (e.key === 'Escape') setFullscreenVaaniId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenVaaniId, activeSection, activeSubTab]);

  const scrollToPad = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 140; // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsSelectorOpen(false);
    }
  };

  const currentSubSection = activeSection?.subSections?.find(ss => ss.id === activeSubTab);
  const refrain = activeSection?.refrain || currentSubSection?.refrain;
  const phalashruti = activeSection?.phalashruti || currentSubSection?.phalashruti;

  return (
    <div className="min-h-screen">
      <section className="px-11 pt-17 pb-12 bg-transparent text-center relative overflow-hidden border-b border-[var(--bdrS)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-devanagari text-[clamp(80px,18vw,220px)] text-[rgba(255,255,255,0.03)] pointer-events-none select-none whitespace-nowrap">
          वाणी
        </div>
        <div className="font-body text-[11px] tracking-[0.22em] uppercase text-[var(--color-gold)] flex items-center gap-2 justify-center mb-3 relative z-10">
          {language === 'hi' ? 'हरिवंशी पवित्र ग्रंथ' : 'Harivanshi Sacred Texts'}
        </div>
        <h1 className="font-display text-[clamp(26px,5vw,48px)] text-[var(--color-ink)] tracking-tight relative z-10">
          {language === 'hi' ? (
            <>वाणी <em className="italic text-[var(--color-saffron)]">पुस्तकालय</em></>
          ) : (
            <>Vaani <em className="italic text-[var(--color-saffron)]">Library</em></>
          )}
        </h1>
        <p className="text-[16px] font-light text-[var(--color-ins)] leading-relaxed max-w-[480px] mx-auto mt-2 relative z-10">
          {language === 'hi'
            ? 'राधावल्लभ संप्रदाय के संपूर्ण पवित्र ग्रंथ — पूरी तरह से संकलित और एकीकृत'
            : 'Complete sacred texts of the Radhavallabh Sampradaya — fully extracted & integrated'}
        </p>
        
        <div className="flex justify-center gap-9 mt-7 relative z-10 flex-wrap">
          {VAANI_SECTIONS.map((s) => (
            <div key={s.id}>
              <div className="font-display text-[28px] bg-linear-to-br from-[var(--color-saffron)] to-[var(--color-gold)] bg-clip-text text-transparent leading-none">
                {totalVaanisCount.find(c => c.id === s.id)?.count || 0}
              </div>
              <div className="text-[12px] text-[var(--color-inmu)] mt-1 tracking-wide">{s.label.split(' — ')[0]}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky top-[66px] z-[800] glass-panel backdrop-blur-2xl border-b border-[var(--bdrS)] px-4 md:px-11 flex gap-1 overflow-x-auto no-scrollbar shadow-sm">
        {VAANI_SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`px-5 py-4 font-body text-[14px] cursor-pointer whitespace-nowrap relative transition-all duration-300 ${
              activeTab === s.id 
                ? 'text-[var(--color-ink)] font-bold' 
                : 'text-[var(--color-inm)] hover:text-[var(--color-ink)]'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {s.id === 'mangalacharan' && '🙏'}
              {s.id === 'yamunashtaka' && '🌊'}
              {s.id === 'naamavali' && '📿'}
              {s.id === 'mangalgann' && '✨'}
              {s.id === 'hitchaurasi' && '📜'}
              {s.label.split(' — ')[0]}
            </span>
            {activeTab === s.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-gold)] shadow-[0_-2px_10px_rgba(196,154,42,0.3)]"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.section
            key={activeSection.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="px-4 md:px-11 py-16"
          >
            <div className="max-w-[860px] mx-auto">
              <div className="text-center mb-12">
                <div className="font-body text-[11px] tracking-[0.22em] uppercase text-[var(--color-gold)] flex items-center gap-2 justify-center mb-3">
                  <span className="text-[8px]">✦</span> {language === 'hi' && activeSection.title ? activeSection.title : activeSection.label}
                </div>
                <h2 className="font-display font-bold text-[clamp(24px,4vw,42px)] text-[var(--color-ink)] tracking-tight mb-2">
                  {activeSection.title}
                </h2>
                <p className="text-[16px] font-light text-[var(--color-ins)] leading-relaxed max-w-[460px] mx-auto">
                  {activeSection.description}
                </p>
              </div>

              {activeSection.subSections && (
                <div className="flex flex-wrap justify-center gap-2.5 mb-10 px-2">
                  {activeSection.subSections.map((ss) => (
                    <button
                      key={ss.id}
                      onClick={() => setActiveSubTab(ss.id)}
                      className={`px-5 py-2 rounded-xl font-body text-[13px] font-medium transition-all duration-300 border shadow-sm active:scale-95 ${
                        activeSubTab === ss.id
                          ? 'bg-[var(--color-gold)] text-[var(--color-warm)] border-[var(--color-gold)] shadow-[0_4px_12px_rgba(196,154,42,0.25)]'
                          : 'glass-panel text-[var(--color-gold)] border-[var(--color-gold)]/30 hover:border-[var(--color-gold)] hover:text-white hover:shadow-md'
                      }`}
                    >
                      {ss.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Pad Selector & Search */}
              <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[120px] z-[700] py-4 glass-panel backdrop-blur-md rounded-2xl px-4 border border-[var(--bdrS)] shadow-sm">
                <div className="relative w-full md:w-auto flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-inmu)]" />
                  <input 
                    type="text"
                    placeholder={language === 'hi' ? `${activeSection.title} में खोजें...` : `Search in ${activeSection.title}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 glass-panel text-[var(--color-ink)] border border-[var(--color-gold)]/30 rounded-xl font-body text-[14px] focus:outline-none focus:border-[var(--color-gold)] transition-all placeholder:text-[var(--color-inm)]"
                  />
                </div>

                {(activeSection.id === 'hitchaurasi' || activeSection.id === 'mangalgann' || activeSection.id === 'more-vaanis') && (
                  <div className="relative w-full md:w-auto">
                    <button 
                      onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                      className="w-full md:w-auto flex items-center justify-between gap-3 px-5 py-2.5 bg-[var(--color-gold)] text-white rounded-xl font-body text-[13px] font-medium hover:bg-[var(--color-saffron)] transition-all shadow-md active:scale-95"
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        {language === 'hi' ? 'पद पर जाएँ' : 'Jump to Pad'}
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSelectorOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isSelectorOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-[280px] md:w-[320px] glass-card border border-[var(--bdrS)] rounded-2xl shadow-2xl p-4 z-[1000] max-h-[400px] overflow-y-auto custom-scrollbar"
                        >
                          <div className="grid grid-cols-5 gap-2">
                            {(activeSection.subSections && activeSubTab 
                              ? activeSection.subSections.find(ss => ss.id === activeSubTab)?.vaanis || []
                              : activeSection.vaanis
                            ).map((v, idx) => (
                              <button
                                key={v.id}
                                onClick={() => scrollToPad(v.id)}
                                className="aspect-square flex items-center justify-center rounded-lg glass-panel border border-[var(--color-gold)]/20 text-[var(--color-gold)] font-display text-[14px] hover:bg-[var(--color-gold)] hover:text-[var(--color-warm)] transition-all"
                              >
                                {idx + 1}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {refrain && (
                <div className="glass-panel border border-[var(--bdrS)] rounded-2xl p-5 md:p-7 mb-7 text-center">
                  <div className="font-body text-[11px] tracking-widest uppercase text-[var(--color-gold)] mb-2">
                    {refrain.label}
                  </div>
                  <div className="font-devanagari text-[clamp(14px,2vw,17px)] font-bold text-[var(--color-ink)] leading-relaxed">
                    {refrain.text}
                  </div>
                  <p className="font-body italic text-[13px] text-[var(--color-ins)] mt-2">
                    {refrain.meaning}
                  </p>
                </div>
              )}

              <div className={activeSection.isGrid ? "grid grid-cols-1 md:grid-cols-2 gap-4 mb-5" : "space-y-5 mb-5"}>
                {filteredVaanis.map((v) => (
                  <div 
                    key={v.id} 
                    id={v.id}
                    className={`glass-card border-[var(--bdrS)] rounded-xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(196,154,42,0.15)] hover:border-[var(--color-gold)] relative group overflow-hidden ${
                      activeSection.isGrid ? 'p-6 md:p-8' : 'p-10 md:p-14'
                    }`}
                  >
                    {/* Decorative Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--color-gold)] opacity-20 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--color-gold)] opacity-20 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--color-gold)] opacity-20 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--color-gold)] opacity-20 group-hover:opacity-60 transition-opacity" />

                    <button 
                      onClick={() => setFullscreenVaaniId(v.id)}
                      className="absolute top-6 right-6 p-2 rounded-full glass-panel text-[var(--color-gold)] opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--color-gold)] hover:text-white shadow-md z-10"
                      title={language === 'hi' ? 'पूर्ण स्क्रीन में पढ़ें' : 'Read in Fullscreen'}
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>

                    <div className="font-body text-[12px] font-bold tracking-[0.2em] uppercase text-[var(--color-gold)] mb-6 text-center">
                      — {v.title} —
                    </div>

                    <div className="font-devanagari text-[clamp(18px,2.8vw,23px)] font-bold text-[var(--color-ink)] leading-[1.8] text-center mb-8 whitespace-pre-line relative z-10">
                      {v.text}
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="h-[1px] flex-1 bg-linear-to-r from-transparent to-[var(--color-honey)]" />
                      <div className="w-2 h-2 rotate-45 border border-[var(--color-gold)] bg-[var(--color-gold)]/20" />
                      <div className="h-[1px] flex-1 bg-linear-to-r from-[var(--color-honey)] to-transparent" />
                    </div>

                    {v.meaning && (
                      <div className="font-body italic text-[clamp(15px,1.8vw,17px)] font-normal text-[var(--color-ins)] leading-relaxed text-center px-4 mb-4">
                        {v.meaning}
                      </div>
                    )}

                    {v.source && (
                      <div className="font-body text-[12px] font-medium tracking-[0.15em] uppercase text-[var(--color-gold)] text-center opacity-80 pt-2">
                        {v.source}
                      </div>
                    )}
                    {v.badge && (
                      <div className="text-center mt-3">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] bg-[rgba(196,154,42,0.1)] text-[var(--color-gdp)] border border-[rgba(196,154,42,0.18)]">
                          {v.badge}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {phalashruti && (
                <div className="glass-panel rounded-2xl p-8 md:p-9 text-center mt-2 border border-[var(--bdrS)]">
                  <div className="font-body text-[11px] tracking-widest uppercase text-[rgba(240,192,64,0.5)] mb-3.5">
                    {phalashruti.label}
                  </div>
                  <div className="font-devanagari text-[clamp(14px,2vw,17px)] text-[var(--color-ink)] font-medium leading-relaxed whitespace-pre-line">
                    {phalashruti.text}
                  </div>
                  <p className="font-body italic text-[13px] text-[var(--color-ins)] mt-3.5">
                    {phalashruti.meaning}
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Fullscreen Reading Mode */}
      <AnimatePresence>
        {fullscreenVaani && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-[rgba(10,20,10,0.9)] backdrop-blur-3xl overflow-y-auto custom-scrollbar"
            style={{ backgroundImage: 'var(--paper-pattern)' }}
          >
            <div className="absolute inset-0 bg-transparent pointer-events-none" />
            
            <button 
              onClick={() => setFullscreenVaaniId(null)}
              className="fixed top-6 right-6 p-3 rounded-full glass-panel border border-[var(--color-gold)]/30 text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-white transition-all shadow-xl z-[2100] active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            <div className="fixed inset-y-0 left-0 flex items-center px-4 pointer-events-none z-[2050]">
              <button 
                onClick={(e) => { e.stopPropagation(); navigateFullscreen('prev'); }}
                className={`p-3 rounded-full glass-panel border border-[var(--color-gold)]/30 text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-white transition-all shadow-lg pointer-events-auto active:scale-90 ${
                  (activeSection?.subSections && activeSubTab
                    ? activeSection.subSections.find(ss => ss.id === activeSubTab)?.vaanis || []
                    : activeSection?.vaanis || []
                  ).findIndex(v => v.id === fullscreenVaaniId) === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="fixed inset-y-0 right-0 flex items-center px-4 pointer-events-none z-[2050]">
              <button 
                onClick={(e) => { e.stopPropagation(); navigateFullscreen('next'); }}
                className={`p-3 rounded-full glass-panel border border-[var(--color-gold)]/30 text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-white transition-all shadow-lg pointer-events-auto active:scale-90 ${
                  (activeSection?.subSections && activeSubTab
                    ? activeSection.subSections.find(ss => ss.id === activeSubTab)?.vaanis || []
                    : activeSection?.vaanis || []
                  ).findIndex(v => v.id === fullscreenVaaniId) === (
                    activeSection?.subSections && activeSubTab
                      ? activeSection.subSections.find(ss => ss.id === activeSubTab)?.vaanis.length || 0
                      : activeSection?.vaanis.length || 0
                  ) - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="min-h-full flex flex-col items-center py-24 px-8 md:px-24 relative z-10">
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="max-w-[850px] w-full text-center glass-card p-12 md:p-20 rounded-3xl border border-[var(--color-gold)]/30 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
              >
                {/* Fullscreen Decorative Corner Accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[var(--color-gold)] opacity-10" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[var(--color-gold)] opacity-10" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[var(--color-gold)] opacity-10" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[var(--color-gold)] opacity-10" />

                <div className="font-body text-[13px] font-bold tracking-[0.4em] uppercase text-[var(--color-gold)] mb-12">
                  — {fullscreenVaani.title} —
                </div>
                
                <div className="font-devanagari text-[clamp(26px,5vw,46px)] font-bold text-[var(--color-ink)] leading-[1.8] mb-16 whitespace-pre-line">
                  {fullscreenVaani.text}
                </div>

                <div className="flex items-center justify-center gap-6 mb-12">
                  <div className="h-[1px] w-24 bg-linear-to-r from-transparent to-[var(--color-gold)]/40" />
                  <div className="w-3 h-3 rotate-45 border-2 border-[var(--color-gold)] bg-[var(--color-gold)]/10" />
                  <div className="h-[1px] w-24 bg-linear-to-r from-[var(--color-gold)]/40 to-transparent" />
                </div>

                {fullscreenVaani.meaning && (
                  <div className="font-body italic text-[clamp(18px,2.8vw,22px)] font-normal text-[var(--color-ins)] leading-relaxed mb-10 px-6">
                    {fullscreenVaani.meaning}
                  </div>
                )}

                {fullscreenVaani.source && (
                  <div className="font-body text-[14px] font-medium tracking-[0.2em] uppercase text-[var(--color-gold)] mt-4">
                    {fullscreenVaani.source}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
