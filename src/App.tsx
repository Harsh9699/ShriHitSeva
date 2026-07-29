/**
 * ॥ श्री राधावल्लभ श्री हरिवंश ॥
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import VaaniLibrary from './components/VaaniLibrary';
import JapCounter from './components/JapCounter';
import UtsavCalendar from './components/UtsavCalendar';
import Philosophy from './components/Philosophy';
import Community from './components/Community';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Mystical Fireflies (Divine Sparks) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-[var(--color-honey)] rounded-full firefly"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              boxShadow: '0 0 10px 2px var(--color-honey)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar activePage={activePage} onPageChange={setActivePage} />
        
        <main className="flex-1 pt-[66px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {activePage === 'home' && (
              <Home 
                onNavigate={setActivePage} 
                onOpenChat={() => setIsChatOpen(true)} 
              />
            )}
            {activePage === 'vaanis' && <VaaniLibrary />}
            {activePage === 'calendar' && <UtsavCalendar />}
            {activePage === 'jap' && <JapCounter />}
            {activePage === 'philosophy' && <Philosophy />}
            {activePage === 'community' && <Community />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={setActivePage} />
      <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      <AudioPlayer />
      </div>
    </div>
  );
}

