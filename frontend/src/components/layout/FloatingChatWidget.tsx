'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, ExternalLink, Bot, CheckCheck, Clock, User, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
}

export default function FloatingChatWidget() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showPill, setShowPill] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'telegram'>('live');

  // Live Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'admin',
      text:
        language === 'kh'
          ? 'សួស្តីបាទ! ខ្ញុំជា Admin Support 24/7។ តើលោកអ្នកត្រូវការជំនួយទាក់ទងនឹងការ Top Up ហ្គេមអ្វីដែរ?'
          : 'Hello! I am Nexus Support 24/7. How can I assist you with your game top-up today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Auto-respond simulation for top-up support
    setTimeout(() => {
      const adminReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'admin',
        text:
          language === 'kh'
            ? 'សូមអរគុណ! Admin បានទទួលសាររបស់អ្នកហើយ។ បើលោកអ្នកមានបញ្ហាក្នុងការ Top Up ឬចង់តាមដាន Order សូមផ្ញើលេខ Order Number ឬទាក់ទងតាម Telegram Admin ដើម្បីទទួលបានការដោះស្រាយបន្ទាន់ក្នុង ១ នាទី។'
            : 'Thank you! We have received your message. If you have an order query, please share your Order Number or switch to Telegram for instant response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, adminReply]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* Chat Popover Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] bg-[#121620] border border-white/[0.12] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#171e2c] via-[#1a2334] to-[#171e2c] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00b2fe] to-[#0070f3] flex items-center justify-center text-white shadow-md">
                  <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#121620] rounded-full" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{language === 'kh' ? 'Admin ជំនួយ 24/7' : 'Nexus Admin Support'}</span>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                    ONLINE
                  </span>
                </h4>
                <p className="text-[11px] text-neutral-400">
                  {language === 'kh' ? 'ឆ្លើយតបរហ័សទាន់ចិត្តក្នុង ១ នាទី' : 'Replies in under 1 minute'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2 Options Switcher Tabs */}
          <div className="p-2 bg-[#0e121a] border-b border-white/[0.06] grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setActiveTab('live')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'live'
                  ? 'bg-[#1e2738] text-white border border-white/[0.1] shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'kh' ? '💬 ឆាតផ្ទាល់ Web' : '💬 Live Web Chat'}</span>
            </button>

            <button
              onClick={() => setActiveTab('telegram')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'telegram'
                  ? 'bg-[#0088cc]/20 text-[#00a8ff] border border-[#0088cc]/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-[#00a8ff]" />
              <span>{language === 'kh' ? '✈️ Telegram' : '✈️ Telegram'}</span>
            </button>
          </div>

          {/* Body Content */}
          {activeTab === 'live' ? (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#0c1017]">
              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-medium rounded-tr-sm shadow-md'
                          : 'bg-[#18202e] border border-white/[0.08] text-neutral-200 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Badges */}
              <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto bg-[#0f141d] border-t border-white/[0.04] text-[10px]">
                <button
                  onClick={() => setInputText(language === 'kh' ? 'តើការ Top Up ប្រើពេលប៉ុន្មាននាទី?' : 'How long does top-up take?')}
                  className="px-2 py-1 rounded-lg bg-[#18202e] text-neutral-300 hover:text-white whitespace-nowrap border border-white/[0.06]"
                >
                  ⚡ {language === 'kh' ? 'រយៈពេល Top Up' : 'Delivery Time'}
                </button>
                <button
                  onClick={() => setInputText(language === 'kh' ? 'ខ្ញុំបានបង់ប្រាក់តាម Bakong KHQR រួចហើយ' : 'I have already paid via KHQR')}
                  className="px-2 py-1 rounded-lg bg-[#18202e] text-neutral-300 hover:text-white whitespace-nowrap border border-white/[0.06]"
                >
                  💳 {language === 'kh' ? 'បញ្ជាក់ការបង់ប្រាក់' : 'Payment Status'}
                </button>
              </div>

              {/* Message Input Field */}
              <form onSubmit={handleSendMessage} className="p-3 bg-[#121620] border-t border-white/[0.08] flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={language === 'kh' ? 'សរសេរសារទៅកាន់ Admin...' : 'Type your message...'}
                  className="flex-1 bg-[#18202e] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] disabled:opacity-40 text-black flex items-center justify-center font-bold shadow-md hover:brightness-110 transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-[#0c1017] space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-[#0088cc]/20 border border-[#0088cc]/30 flex items-center justify-center text-[#00a8ff] shadow-xl">
                <Send className="w-8 h-8 -rotate-12 translate-x-0.5" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-black text-white">
                  {language === 'kh' ? 'ឆាតផ្ទាល់តាម Telegram' : 'Direct Telegram Support'}
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                  {language === 'kh'
                    ? 'សម្រាប់បញ្ហាបន្ទាន់ វិក្កយបត្រ ឬការសាកសួរព័ត៌មានបន្ថែម សូមឆាតទៅកាន់ Admin តាម Telegram ផ្ទាល់។'
                    : 'For instant support, screenshots, and urgent top-up assistance, chat directly with our Telegram support team.'}
                </p>
              </div>

              <div className="w-full bg-[#151a24] p-3 rounded-2xl border border-white/[0.06] text-xs font-mono text-cyan-400">
                @nexus_support_kh
              </div>

              <a
                href="https://t.me/nexus_support_kh"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0088cc] to-[#00a8ff] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,168,255,0.3)] flex items-center justify-center gap-2"
              >
                <span>{language === 'kh' ? 'បើក Telegram ឥឡូវនេះ' : 'Open Telegram Now'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Floating Trigger Button + Notification Pill */}
      <div className="flex items-center gap-3">
        {/* Pill Notification Bubble (exactly like user screenshot) */}
        {!isOpen && showPill && (
          <div className="flex items-center gap-2 bg-[#ffffff]/95 dark:bg-[#151a24]/95 text-neutral-900 dark:text-white px-3.5 py-2 rounded-full border border-neutral-200 dark:border-white/[0.12] shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-right-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-tight">
                {language === 'kh' ? 'ឆាតសួរ Admin 24/7' : 'Chat with Admin 24/7'}
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium leading-tight">
                {language === 'kh' ? 'ឆ្លើយតបរហ័សទាន់ចិត្ត' : 'Fast & instant response'}
              </span>
            </div>
            <button
              onClick={() => setShowPill(false)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white ml-1 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Circular Blue Floating Button with Plane Icon & Green Status Badge */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowPill(false);
          }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0088cc] via-[#00a8ff] to-[#38bdf8] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-[0_4px_25px_rgba(0,168,255,0.45)] border-2 border-white/20 transition-all cursor-pointer group"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
          ) : (
            <Send className="w-6 h-6 -rotate-12 translate-x-0.5 group-hover:scale-110 transition-transform" />
          )}

          {/* Green Status Badge Dot at Top Right */}
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#121620] rounded-full shadow-sm" />
        </button>
      </div>
    </div>
  );
}

