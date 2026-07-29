/**
 * ॥ श्री राधावल्लभ श्री हरिवंश ॥
 * Community and Discussion Board for Harivanshis
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, User, Send, Users, Sparkles, Smile, Volume2, Globe, Heart, Shield, Hash, Info, RefreshCw, PenTool, Check, Trash2, ExternalLink, X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  doc, 
  updateDoc, 
  getDocs,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Define the Rooms
interface DiscussionRoom {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  icon: string;
  welcomeVerse: string;
}

const ROOMS: DiscussionRoom[] = [
  {
    id: 'general',
    name: 'Rasik Sabha',
    hindiName: 'रसिक सभा',
    description: 'General community conversations, spiritual quotes, and mutual sharing of divine association (Satsang).',
    icon: '🪷',
    welcomeVerse: 'वंदन कीजै कोटि शत, रसिक अनन्य सिरमौर। जाकी पद रज परस ते, मिटत जगत की झौर॥'
  },
  {
    id: 'naam-jap',
    name: 'Naam Jap Companion',
    hindiName: 'नाम जप प्रेरणा',
    description: 'Share your daily Jap counts, milestones, and seek encouragement from fellow devotees in reciting the Holy Name.',
    icon: '🦚',
    welcomeVerse: 'राधा नाम सर्वोपरि, कोटि कल्प दुख मेट। रटत-रटत यह नाम ही, श्याम मिलै सुख भेंट॥'
  },
  {
    id: 'vaanis',
    name: 'Vaani Gyaan',
    hindiName: 'वाणी जी ज्ञान',
    description: 'Deep discussions, interpretations, and questions regarding Shri Chaurasi Vaani & Shri Sevak Vaani verses.',
    icon: '📚',
    welcomeVerse: 'हित हरिवंश मुख कहत ही, सब सुख उपजत आनि। राधा नाम की महिमा, जानत केवल रसिक सुजान॥'
  },
  {
    id: 'questions',
    name: 'Bhajan Marg Margdarshan',
    hindiName: 'भजन मार्ग मार्गदर्शन',
    description: 'Inquire and discuss rules of devotion, everyday spiritual hurdles, and practices inspired by Saint discourses.',
    icon: '🙏',
    welcomeVerse: 'जो जन शरणागत भयो, ताको राखत प्रान। हिया सो लगाय राखत है, श्री हरिवंश सुजान॥'
  },
  {
    id: 'vrindavan',
    name: 'Vrindavan Raj',
    hindiName: 'श्री वृंदावन रज',
    description: 'Discuss Vrindavan Dham travel guidance, Parikrama updates, temple timings, and share the nectar of staying in Dham.',
    icon: '🌸',
    welcomeVerse: 'वृंदावन के वृक्ष को, मरम न जाने कोए। डार डार पात पात पै, राधे राधे होए॥'
  }
];

interface ChatMessage {
  id: string;
  content: string;
  senderName: string;
  senderAvatar: string;
  senderId: string;
  createdAt: any;
  reactions?: { [emoji: string]: string[] }; // emoji -> array of senderIds
}

const AVATARS = [
  { char: '🪷', label: 'Kamal (Lotus)', color: 'bg-pink-50 text-pink-500 border-pink-200' },
  { char: '🦚', label: 'Mayur (Peacock)', color: 'bg-teal-50 text-teal-600 border-teal-200' },
  { char: '🎼', label: 'Bansuri (Flute)', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { char: '🌿', label: 'Tulsi (Basil)', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { char: '🔔', label: 'Ghanti (Bell)', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { char: '🐚', label: 'Shankh (Conch)', color: 'bg-blue-50 text-blue-500 border-blue-200' },
  { char: '🎨', label: 'Tilak (Chandan)', color: 'bg-orange-50 text-orange-600 border-orange-200' }
];

export default function Community() {
  const { language } = useLanguage();
  const [activeRoom, setActiveRoom] = useState<DiscussionRoom>(ROOMS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // User profile state
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🪷');
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [editMode, setEditMode] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize/retrieve user identity
  useEffect(() => {
    let savedUid = localStorage.getItem('harivanshi_uid');
    if (!savedUid) {
      savedUid = 'devotee_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('harivanshi_uid', savedUid);
    }
    setUserId(savedUid);

    const savedName = localStorage.getItem('harivanshi_nickname');
    const savedAvatar = localStorage.getItem('harivanshi_avatar');

    if (savedName) {
      setNickname(savedName);
    } else {
      // Suggest a random lovely spiritual moniker initially
      const spiritualMonikers = ['Hit Sevak', 'Radha Daas', 'Vrindavan Sahchari', 'Hari Charananuragi', 'Grace Seeker', 'Prem Margi'];
      const randomMoniker = spiritualMonikers[Math.floor(Math.random() * spiritualMonikers.length)] + '_' + Math.floor(100 + Math.random() * 900);
      setNickname(randomMoniker);
      setShowSetupModal(true);
    }

    if (savedAvatar) {
      setSelectedAvatar(savedAvatar);
    }
  }, []);

  // Listen to Firestore messages in active room
  useEffect(() => {
    setLoading(true);
    const msgsCollectionRef = collection(db, 'community_rooms', activeRoom.id, 'messages');
    const q = query(msgsCollectionRef, orderBy('createdAt', 'asc'), limit(80));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMsgs: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedMsgs.push({
          id: docSnap.id,
          content: data.content,
          senderName: data.senderName || 'Anonymous Devotee',
          senderAvatar: data.senderAvatar || '🪷',
          senderId: data.senderId || 'unknown',
          createdAt: data.createdAt,
          reactions: data.reactions || {}
        });
      });
      setMessages(fetchedMsgs);
      setLoading(false);
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, (error) => {
      console.error("Firestore listening error: ", error);
      setLoading(false);
      handleFirestoreError(error, OperationType.LIST, `community_rooms/${activeRoom.id}/messages`);
    });

    return () => unsubscribe();
  }, [activeRoom]);

  const handleSaveProfile = () => {
    const finalNickname = nickname.trim() || 'Devotee';
    localStorage.setItem('harivanshi_nickname', finalNickname);
    localStorage.setItem('harivanshi_avatar', selectedAvatar);
    setNickname(finalNickname);
    setShowSetupModal(false);
    setEditMode(false);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageText = inputMessage.trim();
    setInputMessage('');

    try {
      const msgsCollectionRef = collection(db, 'community_rooms', activeRoom.id, 'messages');
      await addDoc(msgsCollectionRef, {
        content: messageText,
        senderName: nickname || 'Anonymous Devotee',
        senderAvatar: selectedAvatar,
        senderId: userId,
        createdAt: serverTimestamp(),
        reactions: {}
      });
    } catch (err) {
      console.error("Error sending message to Firestore: ", err);
      handleFirestoreError(err, OperationType.CREATE, `community_rooms/${activeRoom.id}/messages`);
    }
  };

  const handleReact = async (msgId: string, emoji: string) => {
    try {
      const msgDocRef = doc(db, 'community_rooms', activeRoom.id, 'messages', msgId);
      const targetMsg = messages.find(m => m.id === msgId);
      if (!targetMsg) return;

      const currentReactions = { ...(targetMsg.reactions || {}) };
      const usersReacted = currentReactions[emoji] ? [...currentReactions[emoji]] : [];

      if (usersReacted.includes(userId)) {
        // Toggle off (remove user)
        const updatedUsers = usersReacted.filter(id => id !== userId);
        if (updatedUsers.length === 0) {
          delete currentReactions[emoji];
        } else {
          currentReactions[emoji] = updatedUsers;
        }
      } else {
        // Toggle on (add user)
        usersReacted.push(userId);
        currentReactions[emoji] = usersReacted;
      }

      await updateDoc(msgDocRef, { reactions: currentReactions });
    } catch (err) {
      console.error("Error updating reaction: ", err);
      handleFirestoreError(err, OperationType.UPDATE, `community_rooms/${activeRoom.id}/messages/${msgId}`);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!window.confirm("Do you want to withdraw/delete this message?")) return;
    try {
      const msgDocRef = doc(db, 'community_rooms', activeRoom.id, 'messages', msgId);
      await deleteDoc(msgDocRef);
    } catch (err) {
      console.error("Error deleting message: ", err);
      handleFirestoreError(err, OperationType.DELETE, `community_rooms/${activeRoom.id}/messages/${msgId}`);
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8 md:py-12 bg-transparent">
      
      {/* Intro Header */}
      <div className="text-center mb-10 max-w-2xl mx-auto space-y-3.5">
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-gold)] font-bold glass-panel px-3 py-1 rounded-full border border-[var(--color-gold)]/30">
          ॥ श्री राधावल्लभ श्री हरिवंश ॥
        </span>
        <h1 className="font-display text-2xl md:text-3.5xl font-bold text-[var(--color-ink)] leading-snug">
          {language === 'hi' ? 'हरिवंशी सत्संग मंडली' : 'Harivanshi Satsang Mandali'}
        </h1>
        <p className="text-[13px] md:text-[14px] text-[var(--color-ins)] leading-relaxed">
          {language === 'hi'
            ? 'राधा-वल्लभ समुदाय के साझा भक्ति बोर्ड में आपका स्वागत है! विशिष्ट चर्चा विषयों में शामिल हों, वैश्विक हरिवंशियों से जुड़ें, पवित्र वाणियों पर चर्चा करें और एक-दूसरे को दैनिक नाम जप के लिए प्रेरित करें।'
            : 'Welcome to the shared devotional board of the Radha-Vallabh community! Join specific discussion topics, connect with global Harivanshis, discuss sacred Vaanis, and inspire each other’s daily Naam Jap.'}
        </p>
      </div>

      {/* Profile Bar / Quick Setup */}
      <div className="mb-8 p-4 glass-card border-[var(--bdrS)] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full glass-panel border border-[var(--color-gold)]/30 flex items-center justify-center text-xl shadow-xs">
            {selectedAvatar}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--color-gold)]/80 font-bold">
              {language === 'hi' ? 'आपकी आध्यात्मिक पहचान' : 'Your Spiritual Identity'}
            </div>
            <div className="text-[14.5px] font-bold text-[var(--color-ink)] flex items-center gap-2">
              <span>{nickname || (language === 'hi' ? 'अनाम भक्त' : 'Anonymous Devotee')}</span>
              <span className="text-[10px] text-[var(--color-inmu)] font-mono">({userId.substring(8, 13)})</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            setEditMode(true);
            setShowSetupModal(true);
          }}
          className="px-4 py-2 glass-panel border border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)] text-[var(--color-ink)] hover:text-white rounded-xl text-xs font-semibold hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <PenTool size={13} />
          {language === 'hi' ? 'उपनाम और प्रतीक संपादित करें' : 'Edit Moniker & Symbol'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ROOMS NAVIGATION - Left Sidebar (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold uppercase text-[var(--color-gold)]/80 tracking-widest pl-1">
            {language === 'hi' ? 'भक्तिमय चैट रूम' : 'Devotional Chatrooms'}
          </h3>
          <div className="glass-panel border-[var(--bdrS)] rounded-2xl p-2.5 space-y-1 shadow-sm">
            {ROOMS.map((room) => {
              const isActive = activeRoom.id === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                    isActive 
                      ? 'glass-panel border-[var(--color-gold)]/40 text-[var(--color-ink)] shadow-[0_0_15px_rgba(214,185,92,0.3)] bg-linear-to-r from-[rgba(214,185,92,0.1)] to-transparent' 
                      : 'hover:bg-[rgba(214,185,92,0.05)] text-[var(--color-inm)] hover:text-[var(--color-ink)] border border-transparent'
                  }`}
                >
                  <span className="text-2xl mt-0.5 shrink-0 select-none">{room.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[13.5px] font-bold truncate">{room.name}</span>
                      <span className="text-[10.5px] font-devanagari text-[var(--color-gold)] glass-panel px-1.5 py-0.5 rounded-md border-[var(--color-gold)]/30 font-semibold shrink-0">
                        {room.hindiName}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[var(--color-inm)] mt-1 leading-relaxed line-clamp-2">
                      {room.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick instructions / guidelines card */}
          <div className="glass-card border-[var(--bdrS)] rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center gap-2 text-[var(--color-gold)]">
              <Shield size={16} />
              <h4 className="text-[12.5px] font-bold uppercase tracking-wider text-[var(--color-ink)]">
                {language === 'hi' ? 'सभा मर्यादा (आचरण)' : 'Sabha Maryada (Conduct)'}
              </h4>
            </div>
            <ul className="text-[11.5px] text-[var(--color-ins)] space-y-2.5 leading-relaxed pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-[var(--color-gold)] mt-0.5">🌸</span>
                <span>{language === 'hi' ? 'भक्तिमय सम्मान बनाए रखें। वाद-विवाद या राजनीतिक बहस से बचें।' : 'Maintain pure devotional respect. Avoid arguments or political debates.'}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[var(--color-gold)] mt-0.5">🌸</span>
                <span>{language === 'hi' ? 'केवल श्री राधा-वल्लभ हितोपासना से संबंधित विषयों पर चर्चा करें।' : 'Discuss only matters aligned with Sri Radha-Vallabh Hitopasana.'}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[var(--color-gold)] mt-0.5">🌸</span>
                <span>{language === 'hi' ? 'व्यक्तिगत संपर्क नंबर या वित्तीय जानकारी साझा करने से बचें।' : 'Avoid exchanging personal contact numbers or financial details.'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ACTIVE CONVERSATION BOARD - Right Panel (8 columns) */}
        <div className="lg:col-span-8 flex flex-col glass-card border border-[var(--bdrS)] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] h-[600px] overflow-hidden">
          
          {/* Board Header */}
          <div className="px-5 py-4 glass-panel border-b border-[var(--bdrS)] backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none">{activeRoom.icon}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-display text-[15px] font-bold text-[var(--color-ink)]">{activeRoom.name}</h2>
                  <span className="text-[11px] font-devanagari text-[var(--color-gold)] font-bold">({activeRoom.hindiName})</span>
                </div>
                <p className="text-[11px] text-[var(--color-inm)] truncate max-w-[320px] md:max-w-[480px]">
                  {activeRoom.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 glass-panel text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span>{language === 'hi' ? 'सत्संग बोर्ड लाइव' : 'Satsang Board Live'}</span>
            </div>
          </div>

          {/* Welcome/Inspirational Quote Banner */}
          <div className="px-5 py-3.5 glass-panel border-b border-[var(--color-gold)]/20 text-center select-none shrink-0 italic text-[11.5px] text-[var(--color-gold)] font-medium flex items-center justify-center gap-2 font-devanagari">
            <span>✨</span>
            <span className="leading-relaxed">{activeRoom.welcomeVerse}</span>
            <span>✨</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-transparent scrollbar-thin scrollbar-thumb-[rgba(214,185,92,0.2)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <RefreshCw size={24} className="text-[var(--color-gold)] animate-spin" />
                <span className="text-xs text-[var(--color-inm)]">{language === 'hi' ? 'पवित्र प्रवचन लोड हो रहे हैं...' : 'Loading sacred discourses...'}</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3.5 px-4">
                <div className="w-14 h-14 glass-panel rounded-full flex items-center justify-center text-3xl select-none border border-[var(--color-gold)]/30">
                  🍃
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-[var(--color-ink)]">
                    {language === 'hi' ? 'बातचीत शुरू करने वाले पहले व्यक्ति बनें!' : 'Be the First to Converse!'}
                  </h4>
                  <p className="text-[11.5px] text-[var(--color-inm)] max-w-sm mt-1 leading-relaxed">
                    {language === 'hi'
                      ? '"राधे राधे" कहें या इस शुभ सभा को शुरू करने के लिए एक सुंदर संत वाणी साझा करें।'
                      : 'Say "Radhe Radhe" or share a beautiful saintly Vaani to commence this auspicious gathering.'}
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isOwnMessage = msg.senderId === userId;
                return (
                  <div key={msg.id || index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-2.5 max-w-[85%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      
                      {/* Avatar */}
                      <span className="w-8 h-8 rounded-full border border-[var(--bdrS)] flex items-center justify-center glass-panel shadow-xs text-md select-none shrink-0 mt-0.5">
                        {msg.senderAvatar}
                      </span>

                      {/* Content Box */}
                      <div className="space-y-1">
                        
                        {/* Meta information: Nickname & Time */}
                        <div className={`flex items-center gap-2 text-[10.5px] ${isOwnMessage ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                          <span className="font-bold text-[var(--color-ink)]">{msg.senderName}</span>
                          <span className="text-[9px] text-[var(--color-inm)]">
                            {msg.createdAt?.seconds 
                              ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'just now'}
                          </span>
                          {isOwnMessage && (
                            <button 
                              onClick={() => handleDeleteMessage(msg.id)} 
                              className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete message"
                            >
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>

                        {/* Text bubble */}
                        <div className={`px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed border ${
                          isOwnMessage 
                            ? 'glass-panel bg-linear-to-r from-[rgba(214,185,92,0.15)] to-[rgba(214,185,92,0.05)] text-[var(--color-ink)] border-[var(--color-gold)]/30 shadow-[0_4px_12px_rgba(214,185,92,0.15)] rounded-tr-none' 
                            : 'glass-panel text-[var(--color-ink)] border-[var(--bdrS)] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-tl-none'
                        }`}>
                          <p className="break-words whitespace-pre-wrap">{msg.content}</p>

                          {/* Render Reactions */}
                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2 -mb-0.5">
                              {Object.entries(msg.reactions).map(([emoji, uidsVal]) => {
                                const uids = uidsVal as string[];
                                const hasReacted = uids.includes(userId);
                                return (
                                  <button
                                    key={emoji}
                                    onClick={() => handleReact(msg.id, emoji)}
                                    className={`px-1.5 py-0.5 rounded-md text-[10.5px] flex items-center gap-1 border transition-all cursor-pointer ${
                                      hasReacted 
                                        ? 'glass-panel border-[var(--color-gold)]/50 text-[var(--color-ink)] font-bold shadow-[0_0_10px_rgba(214,185,92,0.2)] bg-[rgba(214,185,92,0.1)]' 
                                        : 'glass-panel border-[var(--bdrS)] text-[var(--color-inm)] hover:border-[var(--color-gold)]/30 hover:text-[var(--color-ink)]'
                                    }`}
                                  >
                                    <span>{emoji}</span>
                                    <span>{uids.length}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Quick reaction popover on hover/focus */}
                        <div className={`opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-1.5 py-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          {['🙏', '❤️', '🪷', '✨'].map(emoji => {
                            const uids = msg.reactions?.[emoji] || [];
                            const hasReacted = uids.includes(userId);
                            return (
                              <button
                                key={emoji}
                                onClick={() => handleReact(msg.id, emoji)}
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] transition-all cursor-pointer hover:scale-120 ${
                                  hasReacted ? 'glass-panel border border-[var(--color-gold)]/50 shadow-[0_0_10px_rgba(214,185,92,0.2)] bg-[rgba(214,185,92,0.1)]' : 'glass-panel border border-transparent hover:border-[var(--color-gold)]/30'
                                }`}
                              >
                                {emoji}
                              </button>
                            );
                          })}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input form */}
          <div className="p-4 border-t border-[var(--bdrS)] glass-panel shrink-0">
            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={language === 'hi' ? `${activeRoom.name} में सार्वजनिक संदेश भेजें...` : `Send a public message in ${activeRoom.name}...`}
                className="w-full pl-5 pr-12 py-3 glass-panel border border-[var(--bdrS)] rounded-2xl text-[14px] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all shadow-md placeholder:text-[var(--color-inm)] bg-white"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-[var(--color-gold)] text-[var(--color-warm)] hover:bg-[var(--color-saffron)] flex items-center justify-center disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.4)] active:scale-95"
              >
                <Send size={15} />
              </button>
            </form>
            <div className="mt-2.5 flex items-center justify-between px-2 text-[9px] uppercase tracking-widest text-[var(--color-gold)] font-semibold select-none">
              <div className="flex items-center gap-1">
                <Users size={11} />
                <span>{language === 'hi' ? 'हरिवंशी सभा' : 'Harivanshi Gathering'}</span>
              </div>
              <span>॥ श्री हित हरिवंश विजयतेतराम् ॥</span>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL - Setup Devotee Profile */}
      <AnimatePresence>
        {showSetupModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1050] p-4 font-body">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card border border-[var(--bdrS)] rounded-3xl max-w-md w-full p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative space-y-6"
            >
              {editMode && (
                <button 
                  onClick={() => setShowSetupModal(false)}
                  className="absolute right-4 top-4 p-1.5 text-[var(--color-inm)] hover:text-[var(--color-ink)] rounded-full hover:bg-[var(--color-gold)]/10 cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}

              <div className="text-center space-y-1.5">
                <span className="text-3xl select-none">🦚</span>
                <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">
                  {editMode 
                    ? (language === 'hi' ? 'अपना उपनाम संपादित करें' : 'Edit Your Moniker') 
                    : (language === 'hi' ? 'अपना आध्यात्मिक उपनाम चुनें' : 'Choose Your Spiritual Nickname')}
                </h3>
                <p className="text-[12.5px] text-[var(--color-ins)] leading-relaxed">
                  {language === 'hi'
                    ? 'एक अनाम भक्तिमय स्क्रीन-नाम और प्रतीक स्थापित करें ताकि अन्य हरिवंशी आपके संदेशों को पहचान सकें। नाम शुद्ध और मधुर रखें।'
                    : 'Establish an anonymous devotional screen-name and symbol so other Harivanshis can recognize your messages. Keep names pure and sweet.'}
                </p>
              </div>

              <div className="space-y-4">
                {/* Nickname Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-gold)] block">
                    {language === 'hi' ? 'आध्यात्मिक उपनाम' : 'Spiritual Moniker'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-inm)]" size={16} />
                    <input
                      type="text"
                      maxLength={24}
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder={language === 'hi' ? 'उदा., हरिवंशदास, राधासुधा' : 'e.g., HarivanshDaas, RadhaSudha'}
                      className="w-full pl-10 pr-4 py-2.5 text-sm glass-panel text-[var(--color-ink)] border-[var(--bdrS)] rounded-xl focus:bg-white focus:outline-none focus:border-[var(--color-gold)] transition-all placeholder:text-[var(--color-inm)]"
                    />
                  </div>
                </div>

                {/* Avatar Grid Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-gold)] block">
                    {language === 'hi' ? 'पवित्र प्रतीक अवतार' : 'Sacred Symbol Avatar'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {AVATARS.map((av) => (
                      <button
                        key={av.char}
                        onClick={() => setSelectedAvatar(av.char)}
                        className={`py-2.5 rounded-xl border-2 text-xl transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          selectedAvatar === av.char
                            ? 'border-[var(--color-gold)] glass-panel bg-[rgba(214,185,92,0.1)] scale-105 shadow-[0_0_15px_rgba(214,185,92,0.2)]'
                            : 'border-transparent glass-panel hover:bg-[rgba(214,185,92,0.05)]'
                        }`}
                      >
                        <span className="select-none">{av.char}</span>
                        <span className="text-[8px] text-[var(--color-inm)] font-medium tracking-wide truncate max-w-full px-1">{av.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full py-3 bg-[var(--color-gold)] hover:bg-[var(--color-saffron)] text-[var(--color-warm)] font-semibold rounded-xl text-sm shadow-[0_4px_12px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_15px_rgba(212,175,55,0.5)] transition-all transform active:scale-98 cursor-pointer flex justify-center items-center gap-1.5"
              >
                <Check size={16} />
                {language === 'hi' ? 'आध्यात्मिक उपनाम की पुष्टि करें' : 'Confirm Spiritual Moniker'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
