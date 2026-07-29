import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-[var(--color-warm)] border-t border-[var(--bdrS)] px-11 py-14 grid grid-cols-1 md:grid-cols-3 gap-11">
      <div>
        <div className="font-display text-[16px] text-[var(--color-ink)] mb-1.5 font-bold">Shri Hit Seva</div>
        <div className="font-devanagari text-[12px] text-[var(--color-gold)] mb-4.5">श्री हित सेवा 🪷</div>
        <div className="text-[13px] font-light text-[var(--color-inm)] leading-relaxed">
          {language === 'hi' 
            ? 'वृन्दावन में स्थित राधावल्लभ संप्रदाय का सम्पूर्ण पवित्र पुस्तकालय।'
            : 'The complete sacred library of the Radhavallabh Sampradaya — rooted in Vrindavan.'}
        </div>
      </div>
      
      <div>
        <div className="font-body text-[11px] tracking-widest uppercase text-[var(--color-gold)] font-bold mb-4">
          {language === 'hi' ? 'नेविगेट करें' : 'Navigate'}
        </div>
        <ul className="flex flex-col gap-2.5 list-none">
          <li><button onClick={() => onNavigate('home')} className="text-[13px] font-light text-[var(--color-inm)] hover:text-[var(--color-ink)] transition-colors cursor-pointer">{t('nav.home')}</button></li>
          <li><button onClick={() => onNavigate('vaanis')} className="text-[13px] font-light text-[var(--color-inm)] hover:text-[var(--color-ink)] transition-colors cursor-pointer">{t('nav.vaani')}</button></li>
          <li><button onClick={() => onNavigate('calendar')} className="text-[13px] font-light text-[var(--color-inm)] hover:text-[var(--color-ink)] transition-colors cursor-pointer">{t('nav.calendar')}</button></li>
          <li><button onClick={() => onNavigate('jap')} className="text-[13px] font-light text-[var(--color-inm)] hover:text-[var(--color-ink)] transition-colors cursor-pointer">{t('nav.naamJap')}</button></li>
          <li><button onClick={() => onNavigate('philosophy')} className="text-[13px] font-light text-[var(--color-inm)] hover:text-[var(--color-ink)] transition-colors cursor-pointer">{t('nav.philosophy')}</button></li>
          <li><button onClick={() => onNavigate('community')} className="text-[13px] font-light text-[var(--color-inm)] hover:text-[var(--color-ink)] transition-colors cursor-pointer">{t('nav.community')}</button></li>
        </ul>
      </div>

      <div>
        <div className="font-body text-[11px] tracking-widest uppercase text-[var(--color-gold)] font-bold mb-4">
          {language === 'hi' ? 'पवित्र ग्रंथ' : 'Sacred Texts'}
        </div>
        <ul className="flex flex-col gap-2.5 list-none">
          <li><button onClick={() => onNavigate('vaanis')} className="text-[13px] font-light text-[var(--color-inm)] hover:text-[var(--color-ink)] transition-colors cursor-pointer">{language === 'hi' ? 'मंगलाचरण' : 'Mangalacharan'}</button></li>
          <li><button onClick={() => onNavigate('vaanis')} className="text-[13px] font-light text-[var(--color-inm)] hover:text-[var(--color-ink)] transition-colors cursor-pointer">{language === 'hi' ? 'श्री यमुनाष्टक' : 'Yamunashtaka'}</button></li>
          <li><button onClick={() => onNavigate('vaanis')} className="text-[13px] font-light text-[var(--color-inm)] hover:text-[var(--color-ink)] transition-colors cursor-pointer">{language === 'hi' ? 'युगल ध्यान' : 'Yugal Dhyan'}</button></li>
          <li><button onClick={() => onNavigate('vaanis')} className="text-[13px] font-light text-[var(--color-inm)] hover:text-[var(--color-ink)] transition-colors cursor-pointer">{language === 'hi' ? 'भक्त नामावली' : 'Bhakt Naamvali'}</button></li>
        </ul>
      </div>

      <div className="col-span-full pt-5.5 border-t border-[var(--color-gold)]/20 flex flex-wrap justify-between items-center gap-2.5">
        <div className="text-[12px] font-light text-[var(--color-inmu)]">
          {language === 'hi' ? '© 2026 श्री हित सेवा · भक्ति के साथ निर्मित' : '© 2026 Shri Hit Seva · Built with devotion'}
        </div>
        <div className="font-devanagari text-[13px] text-[var(--color-gold)] font-bold">
          श्री राधावल्लभ लाल की जय 🪷
        </div>
      </div>
    </footer>
  );
}
