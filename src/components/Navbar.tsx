import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Download } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function Navbar({ activePage, onPageChange }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const navLinks = ['home', 'vaanis', 'calendar', 'philosophy', 'jap', 'community'];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[900] px-4 md:px-11 h-[66px] flex items-center justify-between bg-[rgba(255,255,255,0.75)] backdrop-blur-xl border-b border-[var(--bdr)] transition-shadow duration-300 shadow-[0_4px_30px_rgba(74,59,44,0.05)]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { onPageChange('home'); setIsMobileMenuOpen(false); }}>
          <div className="w-[42px] h-[42px] rounded-full overflow-hidden border-[1.5px] border-[var(--color-gold)] flex items-center justify-center bg-white breathe shadow-[0_0_15px_rgba(214,185,92,0.3)]">
            <img 
              src="https://i.ibb.co/X6Cvvws/file-00000000c2d472088b460f125238e2b2.png" 
              alt="Shri Hit Seva Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="font-display text-[15px] font-bold text-[var(--color-ink)] tracking-wider">Shri Hit Seva</div>
            <div className="font-devanagari text-[11px] text-[var(--color-inm)] mt-0.5">श्री हित सेवा</div>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-7 list-none">
          {navLinks.map((page) => {
            let labelKey = `nav.${page === 'jap' ? 'naamJap' : page}`;
            return (
              <li key={page}>
                <button
                  onClick={() => onPageChange(page)}
                  className={`font-body text-[14.5px] tracking-wide relative pb-0.5 cursor-pointer transition-colors duration-300 ${
                    activePage === page ? 'text-[var(--color-ink)] font-semibold' : 'text-[var(--color-inm)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {t(labelKey)}
                  {activePage === page && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[var(--color-gold)] shadow-[0_0_8px_rgba(214,185,92,0.4)]"
                    />
                  )}
                </button>
              </li>
            );
          })}
          <li className="flex items-center gap-3 border-l border-[var(--bdr)] pl-4 ml-2">
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-ink)] hover:bg-[var(--color-gold)]/20 transition-colors text-[12px] font-semibold cursor-pointer"
                title="Install App"
              >
                <Download size={14} /> Install App
              </button>
            )}

            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-[12px] font-bold text-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors cursor-pointer px-2 py-1 rounded-md border border-[var(--color-gold)]/40 hover:border-[var(--color-gold)] hover:bg-[var(--color-honey)]/20"
              title="Switch Language"
            >
              {language === 'en' ? 'A / अ' : 'अ / A'}
            </button>
            
            <button
              onClick={() => onPageChange('vaanis')}
              className="px-6 py-2 bg-linear-to-r from-[var(--color-honey)] to-[var(--color-saffron)] text-[var(--color-ink)] rounded-full text-[13px] tracking-widest uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(214,185,92,0.4)] pointer-events-auto cursor-pointer font-bold"
            >
              {t('nav.explore')}
            </button>
          </li>
        </ul>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-3">
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="p-1.5 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-ink)]"
            >
              <Download size={18} />
            </button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[var(--color-ink)] hover:bg-black/5 rounded-full cursor-pointer transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[800] pt-[66px] bg-[var(--color-cream)]/95 backdrop-blur-3xl md:hidden"
          >
            <div className="flex flex-col p-6 gap-6 h-full overflow-y-auto">
              <ul className="flex flex-col gap-4 list-none">
                {navLinks.map((page) => {
                  let labelKey = `nav.${page === 'jap' ? 'naamJap' : page}`;
                  return (
                    <li key={page}>
                      <button
                        onClick={() => { onPageChange(page); setIsMobileMenuOpen(false); }}
                        className={`font-display text-[24px] w-full text-left pb-2 border-b border-[var(--bdr)] transition-colors cursor-pointer ${
                          activePage === page ? 'text-[var(--color-gold)] font-bold' : 'text-[var(--color-ink)]'
                        }`}
                      >
                        {t(labelKey)}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-col gap-4 mt-4">
                <button
                  onClick={() => { setLanguage(language === 'en' ? 'hi' : 'en'); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[var(--color-gold)]/20 shadow-sm cursor-pointer"
                >
                  <span className="font-body text-[16px] text-[var(--color-ink)] font-semibold">Language</span>
                  <span className="text-[14px] font-bold text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-3 py-1 rounded-full">
                    {language === 'en' ? 'English -> हिन्दी' : 'हिन्दी -> English'}
                  </span>
                </button>

                {deferredPrompt && (
                  <button
                    onClick={() => { handleInstallClick(); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[var(--color-ink)] text-white shadow-xl cursor-pointer"
                  >
                    <Download size={20} />
                    <span className="font-body text-[16px] font-bold">Install App to Home Screen</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
