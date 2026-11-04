'use client';

import React, { useState } from 'react';
import { X, MessageCircle, Send, HelpCircle, ShieldCheck, Zap, ExternalLink } from 'lucide-react';
import { useTopUp } from '@/context/TopUpContext';

export default function SupportDrawer() {
  const { isSupportOpen, setIsSupportOpen } = useTopUp();
  const [activeTab, setActiveTab] = useState<'chat' | 'faq'>('chat');

  if (!isSupportOpen) return null;

  const faqs = [
    {
      q: 'How fast is the top-up delivery?',
      a: 'Top-ups are delivered automatically within 3 to 10 seconds via direct publisher APIs (Moonton, Tencent, Garena).',
    },
    {
      q: 'Where do I find my User ID and Server ID?',
      a: 'Tap your game profile in the top-left corner of your game lobby. Your User ID and Zone/Server ID will be listed under Basic Info.',
    },
    {
      q: 'Is Bakong KHQR 0% processing fee?',
      a: 'Yes! Bakong KHQR payments are 100% free of processing fees across all participating banks in Cambodia.',
    },
    {
      q: 'What if my diamonds or credits did not arrive?',
      a: 'If items do not arrive within 60 seconds, message our 24/7 Telegram support team with your Order ID for instant manual delivery or refund.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm select-none animate-in fade-in">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={() => setIsSupportOpen(false)} />

      {/* Drawer Container */}
      <div className="w-full max-w-md bg-[#0A1026] border-l border-[#152248] h-full flex flex-col shadow-2xl overflow-hidden relative">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#152248] flex items-center justify-between bg-[#070D1F]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F2FE] to-[#3B82F6] flex items-center justify-center text-black font-bold shadow-md">
              <MessageCircle size={18} />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-white tracking-wider uppercase">
                24/7 GAMER SUPPORT
              </h3>
              <p className="text-[11px] text-[#7F92B0]">
                Instant Live Help &amp; FAQs
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSupportOpen(false)}
            aria-label="Close support"
            className="w-8 h-8 rounded-lg bg-[#0D142E] hover:bg-[#152248] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#152248] bg-[#0A1026]">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'text-[#00F2FE] border-b-2 border-[#00F2FE] bg-[#00F2FE]/5'
                : 'text-[#7F92B0] hover:text-white'
            }`}
          >
            Live Channels
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-3 text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'faq'
                ? 'text-[#00F2FE] border-b-2 border-[#00F2FE] bg-[#00F2FE]/5'
                : 'text-[#7F92B0] hover:text-white'
            }`}
          >
            Instant FAQs
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {activeTab === 'chat' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0D142E] border border-[#152248] space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-heading uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Support Team Online
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Our dedicated Cambodian gamer assistance desk is available 24 hours a day, 7 days a week.
                </p>
              </div>

              {/* Direct Telegram Channel */}
              <a
                href="https://t.me/seara_support_kh"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#0088cc]/20 to-[#00A3FF]/10 border border-[#0088cc]/40 hover:border-[#00F2FE] transition-all cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0088cc] flex items-center justify-center text-white shadow-md">
                    <Send size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-white group-hover:text-[#00F2FE] transition-colors">
                      Telegram 24/7 Live Desk
                    </h4>
                    <p className="text-[11px] text-[#7F92B0]">@seara_support_kh (Avg. reply: 1 min)</p>
                  </div>
                </div>
                <ExternalLink size={15} className="text-[#00F2FE]" />
              </a>

              {/* Discord Community */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-4 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 hover:border-[#5865F2] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow-md">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-white group-hover:text-[#5865F2] transition-colors">
                      GameVerse Discord Server
                    </h4>
                    <p className="text-[11px] text-[#7F92B0]">Join 18,500+ Cambodian gamers</p>
                  </div>
                </div>
                <ExternalLink size={15} className="text-[#5865F2]" />
              </a>

              {/* Platform Guarantees */}
              <div className="p-4 rounded-xl bg-[#070D1F] border border-[#152248] space-y-2 mt-4 text-xs text-[#7F92B0]">
                <div className="flex items-center gap-2 text-white font-heading font-bold uppercase text-[11px]">
                  <ShieldCheck size={14} className="text-[#00F2FE]" />
                  100% Buyer Protection
                </div>
                <p className="text-[11px] leading-relaxed">
                  All transactions are backed by official publisher integrations. Never share your password with anyone.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-[#0D142E] border border-[#152248] space-y-1.5"
                >
                  <h4 className="font-heading font-bold text-xs text-white flex items-start gap-2">
                    <HelpCircle size={14} className="text-[#00F2FE] shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-[11px] text-[#7F92B0] pl-5 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#152248] bg-[#070D1F] text-center">
          <p className="text-[10px] text-[#5A6E8D] font-mono">
            GAMEVERSE • SEA #1 TOP-UP PLATFORM
          </p>
        </div>
      </div>
    </div>
  );
}
