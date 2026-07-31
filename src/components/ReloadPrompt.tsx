import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ReloadPrompt() {
  const { t } = useLanguage();
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
      <div className="bg-white dark:bg-[var(--color-ink)] border border-[var(--color-gold)]/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-4 flex flex-col gap-3">
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-display text-lg text-[var(--color-ink)] dark:text-white mb-1">
              {needRefresh ? "App Update Available" : "App Ready Offline"}
            </h3>
            <p className="font-body text-sm text-[var(--color-inm)]">
              {needRefresh 
                ? "A new version of Shri Hit Seva is available! Update now to access new features." 
                : "The app has been cached for offline use."}
            </p>
          </div>
          <button 
            onClick={close}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {needRefresh && (
          <button
            onClick={() => updateServiceWorker(true)}
            className="w-full py-2.5 px-4 bg-linear-to-r from-[var(--color-honey)] to-[var(--color-saffron)] text-[var(--color-ink)] font-bold rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            Update Now
          </button>
        )}
      </div>
    </div>
  );
}
