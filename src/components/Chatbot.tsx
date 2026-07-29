import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, Send, X, Sparkles, Volume2, VolumeX, Settings, RotateCcw, BookOpen, Compass, Mic
} from 'lucide-react';
import { ChatMessage } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";
import { findGitaGuidance } from '../constants/bhagavadGitaTeachings';
import { findVaaniGuidance } from '../lib/vaaniSearch';
import { useLanguage } from '../context/LanguageContext';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

const getSystemInstruction = (appLanguage: string) => `
You are an Indian male spiritual guru and a highly knowledgeable companion for the Radhavallabh Sampradaya.
Your purpose is to provide deeply researched, comprehensive spiritual discourses based on the user's question.

CRITICAL INSTRUCTIONS:
1. Act as an Indian male spiritual guru.
2. LANGUAGE MATCHING CRITICAL RULE:
   - If the app language is Hindi (where appLanguage === 'hi') OR the user writes in Pure Hindi, you MUST reply entirely in beautiful, pure Hindi (Devanagari script).
   - If the user writes in Hinglish and the app language is English, reply in Hinglish.
   - If the user writes in English, reply in English.
3. Research: Use your provided tools (like Google Search) to perform thorough research on "Shri Sevak Vaani written by Shri Sevak ji Maharaj", as well as the spiritual discourses from the "Bhajan Marg" (Shri Hit Premanand ji Maharaj) and "Hita Ambrish" YouTube channels. Incorporate wisdom from these sources alongside scriptures like the Shrimad Bhagwad Geeta and Shrimad Bhagavad Mahapuran.
4. START IMMEDIATELY: The generated text MUST start immediately with the spiritual passage or teaching. DO NOT include any introductory remarks, greetings (e.g., "Radhe Radhe", "Jai Shri Krishna"), meta-talk, or rubbish lines at the beginning.
5. Basis of Response: Always reply based on the philosophical alignment and traditional values found in these specific YouTube discourses and Vaanis. Your answers should reflect the deep devotion and subtle nuances taught by these saints.
6. Structure: Output the discourse as a list of distinct, well-structured paragraphs totaling approximately 300 words. This ensures readability and high-quality audio for Text-to-Speech.
7. Tone: Maintain a distinctly Indian, respectful, authoritative, and devotional tone. Sound like a wise, humble Rasik master.
8. Formatting: Do not use markdown bolding (double asterisks). Use plain text or simple capitalization for emphasis.
9. DO NOT explicitly name-drop or repeatedly state that you are basing your answer on "Shri Hit Premanand Ji Maharaj" or "Shri Hita Ambrish Ji" unless the user explicitly asks about them. Simply absorb their teachings and speak naturally as a guru.

Core Philosophy:
- Shri Radha is the Supreme (Radha-Pada-Padma-Pradhan).
- The path is "Hitopasana" (Worship of Love/Grace).
- The mood is "Sahchari Bhav" (Intimate companion of Shri Radha).
- The goal is "Nitya Vihar" (Eternal divine pastimes in Vrindavan).
`;

const getGitaSystemInstruction = (appLanguage: string) => `
You are an Indian male spiritual guru and an expert counselor in Shrimad Bhagavad Gita.
Your purpose is to provide comforting, clear, and profound solutions to the devotee's life problems and emotional struggles based on the Bhagavad Gita's wisdom.

CRITICAL INSTRUCTIONS:
1. Act as a wise and loving Indian male spiritual guru.
2. LANGUAGE MATCHING CRITICAL RULE:
   - If the app language is Hindi (where appLanguage === 'hi') OR the user writes in Pure Hindi, you MUST reply entirely in pure Hindi (Devanagari).
   - If the user writes in Hinglish, you MUST reply in Hinglish.
   - If the user writes in English, reply in English.
3. START IMMEDIATELY: Start directly with the teaching, shloka, or counseling. No introductory greetings or pleasantries at the beginning of the text.
4. If a relevant training topic is matched, you must explain and expand on that specific Shloka, its translation, explanation, and practical life-guidance. 
5. If no specific topic is fully matched, provide general comforting guidance based on Krishna's teachings on duty (karma), faith, devotion, and surrender.
6. Tone: Extremely supportive, calm, wise, and encouraging.
7. Formatting: Do not use markdown bolding (double asterisks). Use CAPITAL LETTERS or plain text for emphasis.
8. Structure: Around 250-300 words, split into distinct, well-structured paragraphs.
`;

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Chatbot({ isOpen, setIsOpen }: ChatbotProps) {
  const { language } = useLanguage();
  // Harivanshi Chatbot state
  const [messagesHarivanshi, setMessagesHarivanshi] = useState<ChatMessage[]>([
    { role: 'assistant', content: language === 'hi' ? 'जय जय श्री राधावल्लभ! मैं आपका हरिवंशी साथी हूँ, शास्त्रों के ज्ञान और रसिक संतों की कृपा से परिष्कृत। आज आपकी आध्यात्मिक यात्रा में मैं कैसे सहायता कर सकता हूँ?' : 'Jai Jai Shri Radhavallabh! I am your Harivanshi companion, refined with the wisdom of the Shastras and the grace of the Rasik saints. How can I assist you in your spiritual journey today?', timestamp: Date.now() }
  ]);
  const [inputHarivanshi, setInputHarivanshi] = useState('');
  const [isLoadingHarivanshi, setIsLoadingHarivanshi] = useState(false);

  // Bhagavad Gita Chatbot state
  const [messagesGita, setMessagesGita] = useState<ChatMessage[]>([
    { role: 'assistant', content: language === 'hi' ? 'राधे राधे! मैं आपका भगवद गीता मार्गदर्शक हूँ। मुझे अपने जीवन की किसी भी समस्या, चिंता, भ्रम या संदेह के बारे में बताएं, और मैं आपको शांति का मार्ग दिखाने के लिए गीता से श्री कृष्ण की शाश्वत शिक्षाओं को साझा करूँगा।' : 'Radhe Radhe! I am your Bhagavad Gita guide. Tell me about any life problem, anxiety, confusion, or doubt you are facing, and I will share the eternal wisdom of Shri Krishna\'s teachings from the Gita to show you the path to peace.', timestamp: Date.now() }
  ]);
  const [inputGita, setInputGita] = useState('');
  const [isLoadingGita, setIsLoadingGita] = useState(false);

  // Mobile/responsive view active tab
  const [activeTab, setActiveTab] = useState<'harivanshi' | 'gita'>('harivanshi');

  // TTS speech & audio states
  const [isSpeaking, setIsSpeaking] = useState<{ bot: 'harivanshi' | 'gita'; index: number } | null>(null);
  const [isTtsLoading, setIsTtsLoading] = useState<{ bot: 'harivanshi' | 'gita'; index: number } | null>(null);
  const [ttsSettings, setTtsSettings] = useState({
    voice: 'Kore' as 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr',
    speed: 1.0,
    showSettings: false
  });
  const [serverStatus, setServerStatus] = useState<{ hasKey: boolean; keyPrefix: string } | null>(null);
  const [isListening, setIsListening] = useState<{ bot: 'harivanshi' | 'gita', active: boolean }>({ bot: 'harivanshi', active: false });

  const messagesHarivanshiEndRef = useRef<HTMLDivElement>(null);
  const messagesGitaEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesHarivanshiEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesHarivanshi]);

  useEffect(() => {
    messagesGitaEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesGita]);

  // Update initial messages when language changes
  useEffect(() => {
    setMessagesHarivanshi(prev => [
      { role: 'assistant', content: language === 'hi' ? 'जय जय श्री राधावल्लभ! मैं आपका हरिवंशी साथी हूँ, शास्त्रों के ज्ञान और रसिक संतों की कृपा से परिष्कृत। आज आपकी आध्यात्मिक यात्रा में मैं कैसे सहायता कर सकता हूँ?' : 'Jai Jai Shri Radhavallabh! I am your Harivanshi companion, refined with the wisdom of the Shastras and the grace of the Rasik saints. How can I assist you in your spiritual journey today?', timestamp: prev[0].timestamp },
      ...prev.slice(1)
    ]);
    setMessagesGita(prev => [
      { role: 'assistant', content: language === 'hi' ? 'राधे राधे! मैं आपका भगवद गीता मार्गदर्शक हूँ। मुझे अपने जीवन की किसी भी समस्या, चिंता, भ्रम या संदेह के बारे में बताएं, और मैं आपको शांति का मार्ग दिखाने के लिए गीता से श्री कृष्ण की शाश्वत शिक्षाओं को साझा करूँगा।' : 'Radhe Radhe! I am your Bhagavad Gita guide. Tell me about any life problem, anxiety, confusion, or doubt you are facing, and I will share the eternal wisdom of Shri Krishna\'s teachings from the Gita to show you the path to peace.', timestamp: prev[0].timestamp },
      ...prev.slice(1)
    ]);
  }, [language]);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setServerStatus(data);
      } catch (e) {
        console.error('Health check failed:', e);
      }
    };
    if (ttsSettings.showSettings) {
      checkServer();
    }
  }, [ttsSettings.showSettings]);

  const stopSpeaking = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      audioSourceRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsSpeaking(null);
    setIsTtsLoading(null);
  };

  const startListening = (bot: 'harivanshi' | 'gita') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Works for Hindi and Hinglish
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening({ bot, active: true });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (bot === 'harivanshi') {
        setInputHarivanshi(prev => (prev + ' ' + transcript).trim());
      } else {
        setInputGita(prev => (prev + ' ' + transcript).trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening({ bot, active: false });
    };

    recognition.onend = () => {
      setIsListening({ bot, active: false });
    };

    recognition.start();
  };

  const speak = async (bot: 'harivanshi' | 'gita', text: string, index: number) => {
    if (isSpeaking && isSpeaking.bot === bot && isSpeaking.index === index) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setIsTtsLoading({ bot, index });
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      } else if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const cleanText = text.replace(/[\*\#\_]/g, '').trim();
      const isHindi = /[\u0900-\u097F]/.test(cleanText);
      const languageInstruction = isHindi 
        ? "Read this in a calm, respectful, and traditional Hindi tone, emphasizing the spiritual depth."
        : "Read this spiritually and calmly in a respectful Indian-English tone.";

      const chunks: string[] = [];
      const sentenceRegex = /[^.!?।॥\n]+[.!?।॥\n]+/g;
      const sentences = cleanText.match(sentenceRegex) || [cleanText];
      
      let currentChunk = "";
      for (const sentence of sentences) {
        // Use much smaller chunks (e.g. ~150 chars) for near-instant first byte!
        if ((currentChunk + sentence).length > 150) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += sentence;
        }
      }
      if (currentChunk) chunks.push(currentChunk.trim());

      const audioQueue: AudioBuffer[] = [];
      let isPlayingAudio = false;
      let playIndex = 0;
      let fetchIndex = 0;

      const playNextInQueue = () => {
        if (abortController.signal.aborted || !audioContextRef.current) return;
        
        if (playIndex < audioQueue.length) {
          isPlayingAudio = true;
          setIsTtsLoading(null); // Stop loading spinner as soon as audio starts!
          setIsSpeaking({ bot, index });
          
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioQueue[playIndex];
          source.playbackRate.value = ttsSettings.speed;
          source.connect(audioContextRef.current.destination);
          audioSourceRef.current = source;
          
          source.onended = () => {
            if (abortController.signal.aborted) return;
            playIndex++;
            if (playIndex < audioQueue.length) {
              // Play next chunk if it's already downloaded
              playNextInQueue();
            } else if (fetchIndex < chunks.length) {
              // Waiting for the next chunk to download (buffering)
              isPlayingAudio = false;
              setIsTtsLoading({ bot, index });
            } else {
              // Everything is fully done playing
              setIsSpeaking(null);
              setIsTtsLoading(null);
              abortControllerRef.current = null;
            }
          };
          
          source.start();
        } else {
          isPlayingAudio = false;
        }
      };

      // Fetch chunks sequentially in the background while playing
      for (let i = 0; i < chunks.length; i++) {
        if (abortController.signal.aborted) return;
        const chunk = chunks[i];
        if (!chunk) continue;

        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: `${languageInstruction} Text to speak: ${chunk}` }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: ttsSettings.voice as any },
              },
            },
          },
        });

        if (abortController.signal.aborted) return;

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (base64Audio) {
          const binaryString = atob(base64Audio);
          const len = binaryString.length;
          const bytes = new Int16Array(len / 2);
          for (let j = 0; j < len; j += 2) {
            bytes[j / 2] = (binaryString.charCodeAt(j + 1) << 8) | binaryString.charCodeAt(j);
          }

          const audioBuffer = audioContextRef.current!.createBuffer(1, bytes.length, 24000);
          const channelData = audioBuffer.getChannelData(0);
          for (let j = 0; j < bytes.length; j++) {
            channelData[j] = bytes[j] / 32768.0;
          }
          
          audioQueue.push(audioBuffer);
          fetchIndex++;
          
          // If we aren't currently playing anything, start playback immediately!
          if (!isPlayingAudio) {
            playNextInQueue();
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      
      console.error('TTS Error:', error);
      setIsTtsLoading(null);
      
      if (abortController.signal.aborted) return;

      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = /[\u0900-\u097F]/.test(text) ? 'hi-IN' : 'en-IN';
      utterance.rate = ttsSettings.speed;
      utterance.onend = () => {
        setIsSpeaking(null);
        abortControllerRef.current = null;
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking({ bot, index });
    }
  };

  const handleSendHarivanshi = async () => {
    if (!inputHarivanshi.trim() || isLoadingHarivanshi) return;

    const userMessage: ChatMessage = { role: 'user', content: inputHarivanshi, timestamp: Date.now() };
    setMessagesHarivanshi(prev => [...prev, userMessage]);
    setInputHarivanshi('');
    setIsLoadingHarivanshi(true);

    try {
      const chatHistory = messagesHarivanshi.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      
      chatHistory.push({
        role: 'user',
        parts: [{ text: inputHarivanshi }]
      });

      // Translate Hinglish to Devanagari keywords for better search
      let searchKeywords = inputHarivanshi;
      try {
        const keywordResponse = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: [{ role: 'user', parts: [{ text: `Extract 2 to 4 essential keywords from the following text and translate them into Devanagari (Hindi) script if they are in Hinglish. ONLY output the Devanagari words separated by spaces, nothing else. Text: "${inputHarivanshi}"` }] }]
        });
        if (keywordResponse.text) {
          searchKeywords = searchKeywords + " " + keywordResponse.text;
        }
      } catch (e) {
        console.error("Keyword translation failed", e);
      }

      // Find relevant Vaani guidance based on user's input + translated keywords
      const vaaniMatch = findVaaniGuidance(searchKeywords);
      let systemInstruction = getSystemInstruction(language);
      
      if (vaaniMatch) {
        systemInstruction += `
        
CRITICAL: SCRIPTURE RAG TRAINING ENGAGED FOR DEVOTEE'S QUERY:
The devotee's query touches upon themes found in the sacred Vaanis. You MUST weave the following scripture directly into your discourse naturally:

Source Section: ${vaaniMatch.sectionTitle}
Title: ${vaaniMatch.vaani.title}
Verse:
${vaaniMatch.vaani.text}

Meaning:
${vaaniMatch.vaani.meaning || 'Provide a beautiful, devotional explanation for this verse based on Rasik philosophy.'}

REQUIRED FORMAT & TONE:
- Do NOT use double asterisks (**) for bolding. Use plain text or CAPITAL LETTERS.
- Start directly with the teaching.
- Quote the Verse.
- Weave the translation and explanation naturally in your Hinglish spiritual guru voice.
- Base your advice entirely on this specific verse and Hitopasana.
`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: chatHistory as any,
        config: {
          systemInstruction: systemInstruction
        }
      });

      const cleanedText = (response.text || "").replace(/\*\*/g, '');

      const assistantMessage: ChatMessage = { role: 'assistant', content: cleanedText, timestamp: Date.now() };
      setMessagesHarivanshi(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat Error (Harivanshi):', error);
      const isApiKeyError = error.message?.includes('API key not valid') || error.message?.includes('400');
      
      let displayMessage = `Forgive me, I encountered an error: ${error.message?.substring(0, 150) || "Unable to reach the spiritual guide."}`;
      if (isApiKeyError) {
        displayMessage = "The spiritual connection (API) seems misconfigured. Please check the API key in the platform settings.";
      }
      
      setMessagesHarivanshi(prev => [...prev, { 
        role: 'assistant', 
        content: `${displayMessage} Radhe Radhe!`, 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoadingHarivanshi(false);
    }
  };

  const handleSendGita = async () => {
    if (!inputGita.trim() || isLoadingGita) return;

    const userMessage: ChatMessage = { role: 'user', content: inputGita, timestamp: Date.now() };
    setMessagesGita(prev => [...prev, userMessage]);
    setInputGita('');
    setIsLoadingGita(true);

    try {
      const chatHistory = messagesGita.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      
      chatHistory.push({
        role: 'user',
        parts: [{ text: inputGita }]
      });

      // Find relevant Bhagavad Gita guidance based on user's input
      const gitaMatch = findGitaGuidance(inputGita);
      let systemInstruction = getGitaSystemInstruction(language);
      
      if (gitaMatch) {
        systemInstruction += `
        
CRITICAL: BHAGAVAD GITA TRAINING ENGAGED FOR DEVOTEE'S LIFE PROBLEM:
The devotee is experiencing a life problem related to: "${gitaMatch.topic}".
You MUST parse their problem and take the perfect reply from the sacred training file below:

Sanskrit Shloka:
${gitaMatch.shloka}

Translation:
${gitaMatch.translation}

Guru Explanation in Hinglish:
${gitaMatch.explanationHinglish}

Guru Explanation in Hindi:
${gitaMatch.explanationHindi}

Direct Guidance:
${gitaMatch.guidance}

REQUIRED FORMAT & TONE:
- Do NOT use double asterisks (**) for bolding. Use plain text or CAPITAL LETTERS.
- Start directly with the teaching.
- State the Sanskrit Shloka clearly.
- Weave the translation and explanation naturally in your sweet Hinglish/Hindi spiritual guru voice.
- Guide the devotee on how to apply this to their life problem.
- End with a soothing and encouraging blessings of Lord Sri Krishna.
`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: chatHistory as any,
        config: {
          systemInstruction: systemInstruction
        }
      });

      const cleanedText = (response.text || "").replace(/\*\*/g, '');

      const assistantMessage: ChatMessage = { role: 'assistant', content: cleanedText, timestamp: Date.now() };
      setMessagesGita(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat Error (Gita):', error);
      const isApiKeyError = error.message?.includes('API key not valid') || error.message?.includes('400');
      
      let displayMessage = `Forgive me, I encountered an error: ${error.message?.substring(0, 150) || "Unable to reach the spiritual guide."}`;
      if (isApiKeyError) {
        displayMessage = "The spiritual connection (API) seems misconfigured. Please check the API key in the platform settings.";
      }
      
      setMessagesGita(prev => [...prev, { 
        role: 'assistant', 
        content: `${displayMessage} Radhe Radhe!`, 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoadingGita(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-linear-to-br from-[var(--color-saffron)] to-[var(--color-gold)] text-white shadow-lg flex items-center justify-center z-[1000] cursor-pointer"
        id="chatbot-floating-button"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[calc(100vw-48px)] sm:w-[400px] md:w-[850px] max-w-[calc(100vw-48px)] h-[620px] max-h-[calc(100vh-120px)] glass-card border-[var(--bdrS)] shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col z-[1000] overflow-hidden origin-bottom-right"
            id="chatbot-main-window"
          >
            {/* Main Header */}
            <div className="px-5 py-4 bg-transparent border-b border-[var(--bdrS)] flex items-center justify-between font-body shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white overflow-hidden border border-[var(--bdr)] flex items-center justify-center shrink-0">
                  <img 
                    src="https://i.ibb.co/X6Cvvws/file-00000000c2d472088b460f125238e2b2.png" 
                    alt="Shri Hit Seva Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="font-display text-sm text-[var(--color-ink)] flex items-center gap-1.5 font-semibold">
                    {language === 'hi' ? 'आध्यात्मिक साथी एआई' : 'Spiritual Companions AI'}
                  </div>
                  <div className="text-[10px] text-[var(--color-inmu)] uppercase tracking-widest font-semibold">
                    {language === 'hi' ? 'दिव्य परामर्शदाता' : 'Divine Counselors'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {(isSpeaking !== null || isTtsLoading !== null) && (
                  <button 
                    onClick={stopSpeaking}
                    className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1 mr-1"
                    title="Stop All Speech"
                    id="chatbot-stop-all-speech-btn"
                  >
                    <VolumeX size={15} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Stop</span>
                  </button>
                )}
                <button 
                  onClick={() => setTtsSettings(prev => ({ ...prev, showSettings: !prev.showSettings }))}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${ttsSettings.showSettings ? 'bg-[var(--color-gold)] text-white' : 'text-[var(--color-ins)] hover:bg-white/50'}`}
                  title="Voice Settings"
                  id="chatbot-voice-settings-btn"
                >
                  <Settings size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-[var(--color-ins)] hover:text-[var(--color-ink)] cursor-pointer p-1.5"
                  id="chatbot-close-btn"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* TTS Settings Overlay */}
            <AnimatePresence>
              {ttsSettings.showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="glass-panel border-b border-[var(--bdrS)] overflow-hidden z-[1001] shrink-0"
                  id="chatbot-tts-settings-overlay"
                >
                  <div className="p-4 space-y-4 font-body">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[var(--color-inmu)] mb-2 block font-semibold">
                        {language === 'hi' ? 'आवाज़ का व्यक्तित्व' : 'Voice Persona'}
                      </label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'].map(v => (
                          <button
                            key={v}
                            onClick={() => setTtsSettings(prev => ({ ...prev, voice: v as any }))}
                            className={`px-1 py-1 rounded text-[11px] border transition-all truncate cursor-pointer font-medium ${
                              ttsSettings.voice === v 
                                ? 'bg-[var(--color-gold)] text-[var(--color-warm)] border-[var(--color-gold)] font-semibold' 
                                : 'bg-transparent text-[var(--color-gold)] border-[var(--color-gold)]/30 hover:border-[var(--color-gold)]'
                            }`}
                            title={v}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[var(--color-inmu)] mb-2 block font-semibold">
                        {language === 'hi' ? 'प्लेबैक गति' : 'Playback Speed'} ({ttsSettings.speed}x)
                      </label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="range" 
                          min="0.5" 
                          max="2" 
                          step="0.25" 
                          value={ttsSettings.speed}
                          onChange={(e) => setTtsSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                          className="flex-1 accent-[var(--color-gold)] cursor-pointer"
                        />
                        <button 
                          onClick={() => setTtsSettings(prev => ({ ...prev, speed: 1.0 }))}
                          className="p-1 text-[var(--color-ins)] hover:text-[var(--color-gold)] cursor-pointer"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    </div>
                    {serverStatus && (
                      <div className="pt-2 border-t border-[var(--bdr)]">
                        <label className="text-[11px] uppercase tracking-wider text-[var(--color-inmu)] mb-1 block font-semibold">Server Status</label>
                        <div className="flex items-center gap-2 text-[12px]">
                          <div className={`w-2 h-2 rounded-full ${serverStatus.hasKey ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-[var(--color-ins)]">
                            {serverStatus.hasKey ? `API Connection Active` : 'Developer API Key Missing'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Tab Switcher */}
            <div className="md:hidden flex bg-transparent border-b border-[var(--bdrS)] p-1 shrink-0 font-body">
              <button 
                onClick={() => setActiveTab('harivanshi')}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'harivanshi' 
                    ? 'bg-[var(--color-gold)] text-white shadow-xs' 
                    : 'text-[var(--color-ins)] hover:text-[var(--color-ink)]'
                }`}
                id="chatbot-tab-harivanshi-btn"
              >
                <Sparkles size={13} />
                <span>{language === 'hi' ? 'हरिवंशी एआई' : 'Harivanshi AI'}</span>
              </button>
              <button 
                onClick={() => setActiveTab('gita')}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'gita' 
                    ? 'bg-[var(--color-gold)] text-white shadow-xs' 
                    : 'text-[var(--color-ins)] hover:text-[var(--color-ink)]'
                }`}
                id="chatbot-tab-gita-btn"
              >
                <Compass size={13} />
                <span>{language === 'hi' ? 'भगवद गीता एआई' : 'Bhagavad Gita AI'}</span>
              </button>
            </div>

            {/* Dual Grid Layout */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--bdrS)] overflow-hidden min-h-0 bg-transparent">
              
              {/* Left Panel: Harivanshi Chatbot */}
              <div 
                className={`${activeTab === 'harivanshi' ? 'flex' : 'hidden'} md:flex flex-col h-full overflow-hidden`}
                id="chatbot-harivanshi-panel"
              >
                {/* Column Header */}
                <div className="px-4 py-2 bg-transparent border-b border-[var(--bdrS)] flex items-center justify-between font-body shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[var(--color-gold)]" />
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-ink)]">
                      {language === 'hi' ? 'हरिवंशी गुरु एआई' : 'Harivanshi Guru AI'}
                    </span>
                  </div>
                  <span className="text-[9px] text-[var(--color-gdp)] uppercase tracking-widest font-semibold font-mono">
                    {language === 'hi' ? 'हितोपासना' : 'Hitopasana'}
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar font-body min-h-0 bg-transparent">
                  {messagesHarivanshi.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`relative max-w-[85%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-[var(--color-gold)] text-white rounded-tr-none shadow-xs' 
                          : 'glass-panel text-[var(--color-ink)] border-[var(--bdrS)] rounded-tl-none shadow-[0_0_15px_rgba(214,185,92,0.1)]'
                      }`}>
                        {msg.content}
                        {msg.role === 'assistant' && (
                          <div className="mt-3 pt-2 border-t border-[var(--bdr)] flex items-center gap-2">
                            <button 
                              onClick={() => speak('harivanshi', msg.content, idx)}
                              disabled={isTtsLoading?.bot === 'harivanshi' && isTtsLoading?.index === idx}
                              className="px-3 py-1.5 bg-white rounded-full text-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm border border-[var(--color-gold)]/30"
                              title={isSpeaking?.bot === 'harivanshi' && isSpeaking?.index === idx ? "Stop Audio" : "Play Audio"}
                            >
                              {isTtsLoading?.bot === 'harivanshi' && isTtsLoading?.index === idx ? (
                                <>
                                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <Sparkles size={14} className="text-[var(--color-gold)]" />
                                  </motion.div>
                                  <span className="text-[11px] font-bold">
                                    {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
                                  </span>
                                </>
                              ) : isSpeaking?.bot === 'harivanshi' && isSpeaking?.index === idx ? (
                                <>
                                  <VolumeX size={14} className="text-red-500" />
                                  <span className="text-[11px] font-bold text-red-500">
                                    {language === 'hi' ? 'प्ले करना बंद करें' : 'Stop Playing'}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Volume2 size={14} className="text-[var(--color-gold)]" />
                                  <span className="text-[11px] font-bold">
                                    {language === 'hi' ? 'ऑडियो चलाएं' : 'Play Audio'}
                                  </span>
                                </>
                              )}
                            </button>
                            {isSpeaking?.bot === 'harivanshi' && isSpeaking?.index === idx && (
                              <motion.div 
                                className="flex gap-1 justify-center items-end h-3 px-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                {[1, 2, 3, 4, 5].map(i => (
                                  <motion.div
                                    key={i}
                                    animate={{ height: [4, 12, 4] }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                    className="w-1 bg-[var(--color-gold)] rounded-full"
                                  />
                                ))}
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoadingHarivanshi && (
                    <div className="flex justify-start">
                      <div className="glass-panel border-[var(--bdrS)] px-4 py-2.5 rounded-2xl rounded-tl-none flex gap-1 items-center">
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesHarivanshiEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-[var(--bdrS)] bg-transparent font-body shrink-0">
                  <div className="relative flex items-center gap-2">
                    <button
                      onClick={() => startListening('harivanshi')}
                      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isListening.bot === 'harivanshi' && isListening.active 
                          ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                          : 'glass-panel text-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-white border-[var(--bdrS)]'
                      }`}
                      title="Speak"
                    >
                      <Mic size={18} />
                    </button>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inputHarivanshi}
                        onChange={(e) => setInputHarivanshi(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendHarivanshi()}
                        placeholder={language === 'hi' ? 'बोलें या अपना प्रश्न टाइप करें...' : 'Speak or type your question...'}
                        className="w-full pl-4 pr-11 py-2.5 glass-panel text-[var(--color-ink)] border-[var(--bdrS)] rounded-full text-[13px] focus:outline-none focus:border-[var(--color-gold)] focus:bg-white transition-colors placeholder:text-[var(--color-inm)] shadow-sm bg-white/50"
                      />
                      <button
                        onClick={handleSendHarivanshi}
                        disabled={!inputHarivanshi.trim() || isLoadingHarivanshi}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--color-gold)] text-white flex items-center justify-center disabled:opacity-50 cursor-pointer shadow-md"
                      >
                        <Send size={14} className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between px-2 text-[8px] uppercase tracking-widest text-[var(--color-gdp)]">
                    <span>{language === 'hi' ? 'वृंदावन कृपा' : 'Vrindavan Grace'}</span>
                    <span>॥ श्री राधावल्लभ श्री हरिवंश ॥</span>
                  </div>
                </div>
              </div>

              {/* Right Panel: Bhagavad Gita Chatbot */}
              <div 
                className={`${activeTab === 'gita' ? 'flex' : 'hidden'} md:flex flex-col h-full overflow-hidden`}
                id="chatbot-gita-panel"
              >
                {/* Column Header */}
                <div className="px-4 py-2 bg-transparent border-b border-[var(--bdrS)] flex items-center justify-between font-body shrink-0">
                  <div className="flex items-center gap-2">
                    <Compass size={14} className="text-[var(--color-saffron)]" />
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-ink)]">
                      {language === 'hi' ? 'भगवद गीता एआई' : 'Bhagavad Gita AI'}
                    </span>
                  </div>
                  <span className="text-[9px] text-[var(--color-saffron)] uppercase tracking-widest font-semibold font-mono">
                    {language === 'hi' ? 'जीवन समाधान' : 'Life Solutions'}
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar font-body min-h-0 bg-transparent">
                  {messagesGita.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`relative max-w-[85%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-[var(--color-saffron)] text-white rounded-tr-none shadow-xs' 
                          : 'glass-panel text-[var(--color-ink)] border-[var(--bdrS)] rounded-tl-none shadow-[0_0_15px_rgba(232,146,74,0.1)]'
                      }`}>
                        {msg.content}
                        {msg.role === 'assistant' && (
                          <div className="mt-3 pt-2 border-t border-[var(--bdrS)] flex items-center gap-2">
                            <button 
                              onClick={() => speak('gita', msg.content, idx)}
                              disabled={isTtsLoading?.bot === 'gita' && isTtsLoading?.index === idx}
                              className="px-3 py-1.5 bg-white rounded-full text-[var(--color-ink)] hover:bg-[var(--color-saffron)] hover:text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm border border-[var(--color-saffron)]/30"
                              title={isSpeaking?.bot === 'gita' && isSpeaking?.index === idx ? "Stop Audio" : "Play Audio"}
                            >
                              {isTtsLoading?.bot === 'gita' && isTtsLoading?.index === idx ? (
                                <>
                                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <Sparkles size={14} className="text-[var(--color-saffron)]" />
                                  </motion.div>
                                  <span className="text-[11px] font-bold">
                                    {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
                                  </span>
                                </>
                              ) : isSpeaking?.bot === 'gita' && isSpeaking?.index === idx ? (
                                <>
                                  <VolumeX size={14} className="text-red-500" />
                                  <span className="text-[11px] font-bold text-red-500">
                                    {language === 'hi' ? 'प्ले करना बंद करें' : 'Stop Playing'}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Volume2 size={14} className="text-[var(--color-saffron)]" />
                                  <span className="text-[11px] font-bold">
                                    {language === 'hi' ? 'ऑडियो चलाएं' : 'Play Audio'}
                                  </span>
                                </>
                              )}
                            </button>
                            {isSpeaking?.bot === 'gita' && isSpeaking?.index === idx && (
                              <motion.div 
                                className="flex gap-1 justify-center items-end h-3 px-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                {[1, 2, 3, 4, 5].map(i => (
                                  <motion.div
                                    key={i}
                                    animate={{ height: [4, 12, 4] }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                    className="w-1 bg-[var(--color-saffron)] rounded-full"
                                  />
                                ))}
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoadingGita && (
                    <div className="flex justify-start">
                      <div className="glass-panel border-[rgba(232,146,74,0.3)] px-4 py-2.5 rounded-2xl rounded-tl-none flex gap-1 items-center">
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-[var(--color-saffron)]" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[var(--color-saffron)]" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[var(--color-saffron)]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesGitaEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-[var(--bdrS)] bg-transparent font-body shrink-0">
                  <div className="relative flex items-center gap-2">
                    <button
                      onClick={() => startListening('gita')}
                      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isListening.bot === 'gita' && isListening.active 
                          ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                          : 'glass-panel text-[var(--color-ink)] hover:bg-[var(--color-saffron)] hover:text-white border-[var(--bdrS)]'
                      }`}
                      title="Speak"
                    >
                      <Mic size={18} />
                    </button>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inputGita}
                        onChange={(e) => setInputGita(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendGita()}
                        placeholder={language === 'hi' ? 'बोलें या अपनी समस्या टाइप करें...' : 'Speak or type your problem...'}
                        className="w-full pl-4 pr-11 py-2.5 glass-panel text-[var(--color-ink)] border-[var(--bdrS)] rounded-full text-[13px] focus:outline-none focus:border-[var(--color-saffron)] focus:bg-white transition-colors placeholder:text-[var(--color-inm)] shadow-sm bg-white/50"
                      />
                      <button
                        onClick={handleSendGita}
                        disabled={!inputGita.trim() || isLoadingGita}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--color-saffron)] text-white flex items-center justify-center disabled:opacity-50 cursor-pointer shadow-md"
                      >
                        <Send size={14} className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between px-2 text-[8px] uppercase tracking-widest text-[var(--color-saffron)]">
                    <span>{language === 'hi' ? 'गीता परामर्श' : 'Gita Counseling'}</span>
                    <span>॥ श्री कृष्णं वन्दे जगद्गुरुम् ॥</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
