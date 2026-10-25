'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Send,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Paperclip,
  Check,
  ChevronLeft,
} from 'lucide-react';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Order, ChatMessage } from '@/types';

export default function EscrowRoomPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Load initial Order & Chat History
  useEffect(() => {
    async function initRoom() {
      if (!orderNumber) return;
      try {
        const [orderData, history] = await Promise.all([
          api.orders.getByNumber(orderNumber).catch(() => null),
          api.chat.getHistory(orderNumber).catch(() => []),
        ]);
        setOrder(orderData);
        setMessages(history || []);
      } catch (err) {
        console.error('Error initializing escrow room:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initRoom();
  }, [orderNumber]);

  // 2. Setup Socket.io Listeners
  useEffect(() => {
    if (!orderNumber) return;

    const socket = getSocket();

    // Join room
    socket.emit('order:join', { orderNumber });

    // Incoming messages
    socket.on('chat:message', (newMsg: ChatMessage) => {
      setMessages((prev) => [...prev, newMsg]);
      scrollToBottom();
    });

    // Typing indicators
    socket.on('chat:typing', (data: { username: string; isTyping: boolean }) => {
      if (data.username !== user?.username) {
        setIsTyping(data.isTyping ? data.username : null);
      }
    });

    return () => {
      socket.emit('order:leave', { orderNumber });
      socket.off('chat:message');
      socket.off('chat:typing');
    };
  }, [orderNumber, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !orderNumber) return;

    const socket = getSocket();
    socket.emit('chat:send', {
      orderNumber,
      content: inputText.trim(),
    });

    // Local optimistic append
    const localMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      orderNumber,
      senderId: user?.id || 'me',
      senderUsername: user?.username || 'You',
      senderRole: user?.role || 'buyer',
      content: inputText.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, localMsg]);
    setInputText('');

    // Clear typing
    socket.emit('chat:typing', { orderNumber, isTyping: false });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    const socket = getSocket();
    socket.emit('chat:typing', { orderNumber, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('chat:typing', { orderNumber, isTyping: false });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center gap-3 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
        <div className="w-8 h-8 border-2 border-[#f2ca50] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-400 font-mono">
          {language === 'kh' ? `កំពុងភ្ជាប់ទៅកាន់បន្ទប់ជជែក #${orderNumber}...` : `Connecting to Escrow WebSocket Room #${orderNumber}...`}
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#0b0e14] py-8 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/orders/${orderNumber}`}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === 'kh' ? 'ត្រឡប់ទៅបន្ទប់លេខសម្ងាត់' : 'Back to Decryption Vault'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">
              {t('escrowChatTitle')}
            </span>
          </div>
        </div>

        {/* Order Escrow Tracker Banner */}
        <div className="bg-[#151a23] p-5 rounded-2xl border border-white/[0.08] mb-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                {language === 'kh' ? 'បន្ទប់ ESCROW #' : 'ESCROW ROOM #'}{orderNumber}
              </span>
              <h2 className="text-lg font-bold text-white">
                {order?.listingSnapshot?.title || (language === 'kh' ? 'ផ្ទាំងផ្ទេរគណនីសុវត្ថិភាព' : 'Account Handover Desk')}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {language === 'kh' ? 'ទឹកប្រាក់ក្នុង Escrow:' : 'Funds in Escrow:'} <strong className="text-[#f2ca50]">${order?.totalAmount}</strong> • {language === 'kh' ? 'ស្ថានភាព:' : 'Status:'}{' '}
                <strong className="text-[#00e4f2]">{order?.status.toUpperCase()}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/orders/${orderNumber}`}
                className="px-4 py-2 rounded-xl bg-[#0b0e14] hover:bg-[#10131a] border border-white/[0.08] text-xs font-bold uppercase tracking-wider text-neutral-200"
              >
                {t('revealPasswords')}
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MESSAGING VIEWPORT
        ========================================================================== */}
        <div className="bg-[#151a23] rounded-2xl border border-white/[0.08] shadow-2xl flex flex-col h-[600px] overflow-hidden">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* System initial message */}
            <div className="text-center my-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0b0e14] border border-white/[0.06] text-[11px] text-neutral-400">
                <Shield className="w-3.5 h-3.5 text-[#00e4f2]" />
                <span>
                  {language === 'kh'
                    ? 'រាល់សារជជែកត្រូវបានកត់ត្រាក្នុង Audit Ledger នៃប្រព័ន្ធដើម្បីការពារសុវត្ថិភាពទាំងសងខាង។'
                    : 'All messages are cryptographically recorded in the platform audit ledger.'}
                </span>
              </div>
            </div>

            {messages.map((msg) => {
              const isMe = msg.senderId === user?.id || msg.senderUsername === user?.username;
              const isSystem = msg.senderRole === 'system';
              const isAdmin = msg.senderRole === 'admin';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-3">
                    <span className="inline-block px-3 py-1 rounded-lg bg-[#00e4f2]/10 border border-[#00e4f2]/20 text-[11px] text-[#00e4f2] font-mono">
                      [ESCROW BOT]: {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%] ${
                    isMe ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-neutral-400">
                    <span className="font-bold text-white">{msg.senderUsername}</span>
                    <span
                      className={`uppercase text-[9px] px-1 py-0.2 rounded font-bold ${
                        isAdmin
                          ? 'bg-[#f2ca50] text-[#0b0e14]'
                          : msg.senderRole === 'seller'
                          ? 'bg-[#00e4f2]/20 text-[#00e4f2]'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {msg.senderRole}
                    </span>
                    <span>• {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] font-medium rounded-tr-none shadow-md'
                        : isAdmin
                        ? 'bg-[#f2ca50]/15 border border-[#f2ca50]/40 text-neutral-100 rounded-tl-none'
                        : 'bg-[#0b0e14] border border-white/[0.08] text-neutral-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="text-[11px] text-neutral-400 italic flex items-center gap-1.5 animate-pulse">
                <span>{isTyping} {language === 'kh' ? 'កំពុងវាយអក្សរ...' : 'is typing...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-[#0b0e14] border-t border-white/[0.08] flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={t('escrowTypePlaceholder')}
              className="flex-1 bg-[#151a23] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] font-bold shadow-md hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
