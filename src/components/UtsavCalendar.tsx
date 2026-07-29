import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, MapPin, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface UtsavEvent {
  date: string;
  tithi: string;
  day: string;
  title: string;
  description: string;
  month: string; // This will now store Gregorian month name
  paksh: 'Shukla' | 'Krishna' | 'Adhik';
}

const UTSAV_DATA: UtsavEvent[] = [
  { date: '18 March 2026', tithi: 'एकादशी (11)', day: 'गुरूवार', title: 'रंगीली होली', description: 'होली की सवारी श्री जी के मंदिर से निकलेगी। रात्रि को होली का खेल प्रारंभ।', month: 'March', paksh: 'Shukla' },
  { date: '19 March 2026', tithi: 'प्रतिपदा (30/1)', day: 'गुरूवार', title: 'संवत्सराारंभ २०८३', description: 'लाल पोषाक धारण। परम पूज्य श्रीहित प्रेमानन्द गोविंद शरण जी महाराज का जन्मोत्सव।', month: 'March', paksh: 'Shukla' },
  { date: '22 March 2026', tithi: 'पूर्णिमा (15)', day: 'सोमवार', title: 'धुलैड़ी / डोलोत्सव', description: 'पूर्णिमा, धुलैड़ी, डोलोत्सव।', month: 'March', paksh: 'Shukla' },
  { date: '24 March 2026', tithi: 'षष्ठी', day: 'मंगलवार', title: 'यमुना महोत्सव', description: 'श्री यमुना जी का प्राकट्य दिवस।', month: 'March', paksh: 'Shukla' },
  { date: '27 March 2026', tithi: 'नवमी', day: 'शुक्रवार', title: 'रामनवमी', description: 'भगवान श्री राम का प्राकट्य उत्सव।', month: 'March', paksh: 'Shukla' },
  { date: '29 March 2026', tithi: 'एकादशी', day: 'रविवार', title: 'कामदा एकादशी', description: 'मुकुट धारण, गुलाब डोल (वैष्णवाना)।', month: 'March', paksh: 'Shukla' },
  
  { date: '02 April 2026', tithi: 'पूर्णिमा', day: 'गुरूवार', title: 'श्री हितोत्सव', description: 'श्री हितोत्सव कौ मंगल पाठ, श्रीरास मण्डल पर हितोत्सव की बधाई समाज प्रारम्भ।', month: 'April', paksh: 'Shukla' },
  { date: '13 April 2026', tithi: 'एकादशी (11)', day: 'सोमवार', title: 'बरूथिनी एकादशी', description: 'मुकुट धारण।', month: 'April', paksh: 'Krishna' },
  { date: '17 April 2026', tithi: 'अमावस्या (30)', day: 'शुक्रवार', title: 'अमावस्या', description: 'काली पोषाक व ताज धारण।', month: 'April', paksh: 'Krishna' },
  { date: '20 April 2026', tithi: 'तृतीया (3)', day: 'सोमवार', title: 'अक्षय तृतीया', description: 'चन्दनोत्सव, समाज में चन्दन के पद, श्रीचरण चन्दन श्रृंगार, चंदनी पोषाक।', month: 'April', paksh: 'Shukla' },
  { date: '27 April 2026', tithi: 'एकादशी (11)', day: 'सोमवार', title: 'श्री हित हरिवंश महाप्रभु जन्मोत्सव', description: 'अरुणोदय में जन्म, श्रीजी के बड़े मन्दिर में मंगला से पूर्व बधाई प्रारंभ, हिताब्द ५५३ प्रारम्भ (पीली पोषाक धारण)।', month: 'April', paksh: 'Shukla' },
  
  { date: '02 May 2026', tithi: 'प्रतिपदा (1)', day: 'शनिवार', title: 'छठी उत्सव', description: 'श्रीहित महाप्रभु जी का बधाईगान।', month: 'May', paksh: 'Krishna' },
  { date: '03 May 2026', tithi: 'द्वितीया (2)', day: 'रविवार', title: 'वनविहार', description: 'वनविहार रात्रि में, समाज के साथ श्रीवृन्दावनधाम परिक्रमा।', month: 'May', paksh: 'Krishna' },
  { date: '25 June 2026', tithi: 'एकादशी (11)', day: 'गुरूवार', title: 'निर्जला एकादशी', description: 'जल विहार उत्सव, श्रीजी पुष्प नौका में विराजते हैं।', month: 'June', paksh: 'Shukla' },
  
  { date: '16 July 2026', tithi: 'द्वितीया (2)', day: 'गुरूवार', title: 'रथयात्रा', description: 'लाल बागौ धारण, वर्ष ऋतु के पद।', month: 'July', paksh: 'Shukla' },
  { date: '29 July 2026', tithi: 'पूर्णिमा (15)', day: 'बुधवार', title: 'गुरु पूर्णिमा', description: 'मुकुट धारण। श्रीजी के मंदिर में सेवक-चरित्र पाठ प्रारम्भ।', month: 'July', paksh: 'Shukla' },

  { date: '04 September 2026', tithi: 'अष्टमी (8)', day: 'शुक्रवार', title: 'श्रीकृष्ण जन्माष्टमी', description: 'वैष्णवाना, श्रीलालजी का बधाई-गान समाज में (पीली पोषाक धारण)।', month: 'September', paksh: 'Krishna' },
  { date: '19 September 2026', tithi: 'अष्टमी (8)', day: 'शनिवार', title: 'श्रीराधाष्टमी', description: 'श्रीराधिका जन्मोत्सव अरुणोदय के पूर्व मंगला आरती पर बधाई गान।', month: 'September', paksh: 'Shukla' },

  { date: '26 October 2026', tithi: 'पूर्णिमा (15)', day: 'सोमवार', title: 'शरद पूर्णिमा', description: 'मुकुट धारण, शरद के पद।', month: 'October', paksh: 'Shukla' },
  { date: '09 November 2026', tithi: 'अमावस्या (30)', day: 'सोमवार', title: 'दीप दान / गोवर्धन पूजा', description: 'दिपावली, श्रीजी चौपड़ खेलेंगे, व्याहुला।', month: 'November', paksh: 'Krishna' },
  { date: '22 November 2026', tithi: 'त्रयोदशी (13)', day: 'रविवार', title: 'श्रीराधावल्लभजी का पाटोत्सव', description: 'श्रीवृन्दावन प्राकट्योत्सव, अभिषेक, पीली पोषाक, छप्पनभोग दर्शन।', month: 'November', paksh: 'Shukla' },
];

const GREGORIAN_MONTHS = [
  'All', 'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const GREGORIAN_MONTHS_HI: Record<string, string> = {
  'All': 'सभी', 'January': 'जनवरी', 'February': 'फरवरी', 'March': 'मार्च', 'April': 'अप्रैल', 'May': 'मई', 'June': 'जून', 
  'July': 'जुलाई', 'August': 'अगस्त', 'September': 'सितंबर', 'October': 'अक्टूबर', 'November': 'नवंबर', 'December': 'दिसंबर'
};

export default function UtsavCalendar() {
  const { language } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState('All');

  const filteredEvents = selectedMonth === 'All' 
    ? UTSAV_DATA 
    : UTSAV_DATA.filter(event => event.month === selectedMonth);

  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Header Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/vrindavan_temple/1920/1080?blur=5" 
            alt="Vrindavan" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#0a140a]" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-[var(--color-gold)]/30 text-[var(--color-gold)] text-[12px] font-medium tracking-widest uppercase mb-6"
          >
            <CalendarIcon className="w-4 h-4" />
            {language === 'hi' ? 'उत्सव निर्णय पत्रिका' : 'Utsav Nirnay Patrika'}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-[42px] md:text-[64px] text-[var(--color-ink)] leading-[1.1] mb-4 drop-shadow-sm"
          >
            {language === 'hi' ? 'दिव्य पंचांग' : 'Divine Calendar'} <span className="text-[var(--color-gold)]">२०८३</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-devanagari text-[20px] md:text-[24px] text-[var(--color-gold)]"
          >
            उत्सव निर्णय पत्रिका (सन् २०२६)
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 -mt-16 relative z-20">
        {/* Month Selector */}
        <div className="glass-panel rounded-[32px] p-4 shadow-md border border-[var(--bdrS)] mb-12 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {GREGORIAN_MONTHS.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-6 py-3 rounded-2xl font-body text-[14px] transition-all cursor-pointer ${
                  selectedMonth === month 
                    ? 'bg-linear-to-r from-[var(--color-honey)] to-[var(--color-saffron)] text-[var(--color-ink)] shadow-[0_4px_12px_rgba(214,185,92,0.3)] font-bold' 
                    : 'text-[var(--color-inm)] hover:bg-[rgba(214,185,92,0.1)] hover:text-[var(--color-ink)]'
                }`}
              >
                {language === 'hi' ? GREGORIAN_MONTHS_HI[month] : month}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <motion.div
                  key={event.date + event.title}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group glass-card rounded-[40px] p-8 border border-[var(--bdrS)] hover:border-[var(--color-gold)]/50 transition-all duration-500 shadow-sm hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-left font-display">
                      <div className="text-[32px] text-[var(--color-gold)] leading-none mb-1">{event.date.split(' ')[0]}</div>
                      <div className="text-[12px] uppercase tracking-widest text-[var(--color-gold)]/60 font-body opacity-80">
                        {event.date.split(' ').slice(1).join(' ')}
                      </div>
                    </div>
                    <div className="px-3 py-1 transparent-gold rounded-full text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-tighter">
                      {event.paksh}
                    </div>
                  </div>

                  <h3 className="font-display text-[22px] text-[var(--color-ink)] mb-3 leading-snug group-hover:text-[var(--color-gold)] transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="font-devanagari text-[16px] text-[var(--color-ins)] mb-6 leading-relaxed">
                    {event.description}
                  </div>

                  <div className="mt-auto pt-6 border-t border-[var(--bdrS)] flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 text-[var(--color-gold)]/80 text-[12px]">
                      <Sparkles className="w-4 h-4 text-[var(--color-saffron)]" />
                      <span>{event.tithi}</span>
                    </div>
                    <div className="text-[var(--color-gold)]/80 text-[12px] italic">
                      {event.day}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-24 text-center"
              >
                <div className="w-20 h-20 glass-panel rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-gold)]/30">
                  <CalendarIcon className="w-10 h-10 text-[var(--color-gold)]" />
                </div>
                <h3 className="font-display text-[24px] text-[var(--color-ink)] mb-2">
                  {language === 'hi' ? 'कोई प्रमुख उत्सव नहीं मिला' : 'No Major Utsavs found'}
                </h3>
                <p className="font-body text-[15px] text-[var(--color-inm)]">
                  {language === 'hi' 
                    ? `${GREGORIAN_MONTHS_HI[selectedMonth]} के लिए और अधिक कार्यक्रम जल्द ही अपडेट किए जाएंगे।`
                    : `More events for ${selectedMonth} will be updated soon.`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 glass-panel rounded-[48px] p-12 relative overflow-hidden text-center border border-[var(--bdrS)]"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-gold)] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <MapPin className="w-12 h-12 text-[var(--color-saffron)] mx-auto mb-8" />
          <h2 className="font-display text-[32px] md:text-[42px] text-[var(--color-ink)] mb-6">
            {language === 'hi' ? 'दिव्य आनंद का अनुभव करें' : 'Experience the Divine Bliss'}
          </h2>
          <p className="max-w-[700px] mx-auto font-body text-[16px] text-[var(--color-ins)] leading-relaxed mb-10">
            {language === 'hi'
              ? 'वृंदावन में हर त्योहार भक्ति की एक अनूठी अभिव्यक्ति है। राधाष्टमी की पुष्प वर्षा से लेकर हरियाली तीज के दिव्य झूलों तक, श्री श्यामा-श्याम की शाश्वत लीलाओं का जश्न मनाने में हमारे साथ जुड़ें।'
              : 'Every festival in Vrindavan is a unique expression of devotion. From the petal rains of Radhashtami to the divine swings of Hariyali Teej, join us in celebrating the eternal pastimes of Shri Shyama-Shyam.'}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="text-center">
              <div className="font-display text-[24px] text-[var(--color-ink)]">
                {language === 'hi' ? 'वृंदावन' : 'Vrindavan'}
              </div>
              <div className="text-[11px] text-[var(--color-gold)] opacity-70 uppercase tracking-widest mt-1">
                {language === 'hi' ? 'स्थान' : 'Location'}
              </div>
            </div>
            <div className="w-[1px] h-8 bg-[var(--color-gold)]/30" />
            <div className="text-center">
              <div className="font-display text-[24px] text-[var(--color-ink)]">
                {language === 'hi' ? 'राधावल्लभ' : 'Radhavallabh'}
              </div>
              <div className="text-[11px] text-[var(--color-gold)] opacity-70 uppercase tracking-widest mt-1">
                {language === 'hi' ? 'संप्रदाय' : 'Sampradaya'}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
