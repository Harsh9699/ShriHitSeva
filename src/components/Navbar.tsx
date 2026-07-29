import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function Navbar({ activePage, onPageChange }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[900] px-4 md:px-11 h-[66px] flex items-center justify-between bg-[rgba(255,255,255,0.75)] backdrop-blur-xl border-b border-[var(--bdr)] transition-shadow duration-300 shadow-[0_4px_30px_rgba(74,59,44,0.05)]">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onPageChange('home')}>
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
      
      <ul className="hidden md:flex items-center gap-7 list-none">
        {['home', 'vaanis', 'calendar', 'philosophy', 'jap', 'community'].map((page) => {
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
          {/* Language Toggle */}
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
    </nav>
  );
}
