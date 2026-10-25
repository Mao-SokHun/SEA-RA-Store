'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Crown,
  Shield,
  Lock,
  Zap,
  ArrowRight,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  DollarSign,
  Gem,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';

export default function VipWhaleSanctuaryPage() {
  const { t, language } = useLanguage();

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [gameTitle, setGameTitle] = useState('Valorant');
  const [budget, setBudget] = useState('2500');
  const [specRequirements, setSpecRequirements] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const vipShowcaseAccounts = [
    {
      id: 'vip-01',
      title: 'Global #1 Radiant | Champions 2021-2024 Collection + Kuro Vandal',
      game: 'VALORANT',
      rank: 'RADIANT #14',
      price: '$3,800.00',
      bonds: '$10,000 Collateral',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'vip-02',
      title: 'All Collector MLBB (720 Skins) | Mythic Immortal 320★',
      game: 'MLBB',
      rank: 'IMMORTAL 320★',
      price: '$2,450.00',
      bonds: '$8,000 Collateral',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'vip-03',
      title: 'Max Level 7 Pharaoh + Blood Raven X-Suits | 18 Upgradable Weapons',
      game: 'PUBG MOBILE',
      rank: 'CONQUEROR S3-S19',
      price: '$4,200.00',
      bonds: '$12,000 Collateral',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'vip-04',
      title: 'AR 60 Complete C6 R5 Hoyoverse Whale Account (14 C6 Characters)',
      game: 'GENSHIN IMPACT',
      rank: 'AR 60 WHALE',
      price: '$5,900.00',
      bonds: '$15,000 Collateral',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setRequestModalOpen(false);
      setSubmitted(false);
      setSpecRequirements('');
    }, 2500);
  };

  return (
    <div className={`min-h-screen bg-[#0b0e14] py-10 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top VIP Black Card Strip */}
        <section className="relative w-full rounded-2xl bg-gradient-to-r from-[#151a23] via-[#1c2230] to-[#151a23] p-6 sm:p-8 border border-[#d4af37]/40 shadow-2xl overflow-hidden mb-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase">
                <span className="text-[#f2ca50] font-bold flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-[#f2ca50]" />
                  BLACK CARD PROTOCOL
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-[#00e4f2]">SOVEREIGN OTC BROKERAGE</span>
              </div>

              <h1 className="text-3xl font-black text-white tracking-tight">
                {t('vipHeroTitle')}
              </h1>
              <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">
                {t('vipHeroDesc')}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#f2ca50]" />
                  <span>
                    {language === 'kh' ? 'មូលនិធិ Escrow ឯកជន:' : 'Dedicated Escrow Vault:'}{' '}
                    <strong className="text-[#f2ca50]">$128,450.00 USD</strong>
                  </span>
                </div>
                <span className="text-neutral-600">•</span>
                <div className="flex items-center gap-1.5">
                  <Gem className="w-4 h-4 text-[#00e4f2]" />
                  <span>
                    {language === 'kh' ? 'បណ្តាញទំនាក់ទំនងសុវត្ថិភាព E2EE 4096-bit' : 'E2EE 4096-bit Concierge Broker Channel'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => setRequestModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] font-bold text-xs uppercase tracking-wider shadow-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                <span>{t('vipCustomSourcing')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* VIP Curated Inventory */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f2ca50]" />
                {language === 'kh' ? 'បញ្ជីគណនីកម្រ VIP Whale' : 'Vaulted Sovereign Whale Inventory'}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {language === 'kh'
                  ? 'គណនីនីមួយៗរួមបញ្ចូលការធានារ៉ាប់រងអចិន្ត្រៃយ៍មួយជីវិត និងអ្នកសម្របសម្រួលផ្ទេរផ្ទាល់។'
                  : 'Each listing includes lifetime platform anti-recall bond coverage & direct private broker handover.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vipShowcaseAccounts.map((item) => (
              <div
                key={item.id}
                className="bg-[#151a23] hover:bg-[#1a202c] rounded-2xl border border-[#d4af37]/30 hover:border-[#d4af37] p-5 shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative w-full h-56 rounded-xl overflow-hidden bg-[#0b0e14] mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151a23] via-transparent to-black/30" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#0b0e14]/90 text-[#f2ca50] border border-[#d4af37]/40 shadow-lg">
                      {item.game}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#00e4f2]/20 text-[#00e4f2] border border-[#00e4f2]/30 backdrop-blur-md">
                      {item.rank}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-neutral-200">
                    <span className="px-2.5 py-0.5 rounded bg-[#0b0e14]/80 border border-white/[0.08] text-emerald-400 font-semibold text-[11px]">
                      {item.bonds}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Tier-0 VIP Asset
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-base text-white group-hover:text-[#f2ca50] transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                        VIP OTC Price
                      </span>
                      <span className="text-2xl font-black text-[#f2ca50] font-mono">
                        {item.price}
                      </span>
                    </div>

                    <Link
                      href="/catalog"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-md hover:shadow-[0_0_15px_rgba(212,175,55,0.35)] transition-all flex items-center gap-1.5"
                    >
                      <span>{t('inspectButton')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Sourcing Modal */}
        {requestModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#151a23] border border-[#d4af37]/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 text-[#f2ca50]">
                  <Crown className="w-5 h-5" />
                  <h3 className="font-bold text-white text-base">
                    {language === 'kh' ? 'ស្នើសុំស្វែងរកគណនីពិសេស VIP' : 'VIP Concierge Sourcing Order'}
                  </h3>
                </div>
                <button
                  onClick={() => setRequestModalOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {submitted ? (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">
                    {language === 'kh' ? 'ការស្នើសុំត្រូវបានទទួល!' : 'Sourcing Order Opened!'}
                  </h4>
                  <p className="text-xs text-neutral-300">
                    {language === 'kh'
                      ? 'អ្នកសម្របសម្រួលឯកជននឹងទាក់ទងអ្នកតាមរយៈ Telegram / WhatsApp ក្នុងរយៈពេល ៣០ នាទី។'
                      : 'A dedicated private broker will contact you on Telegram / WhatsApp within 30 minutes.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {language === 'kh' ? 'ឈ្មោះហ្គេម' : 'Gaming Title'}
                    </label>
                    <select
                      value={gameTitle}
                      onChange={(e) => setGameTitle(e.target.value)}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      <option value="Valorant">Valorant (Radiant / Champions)</option>
                      <option value="MLBB">Mobile Legends (Collector / Mythic Immortal)</option>
                      <option value="PUBG Mobile">PUBG Mobile (Glacier Lv7 / X-Suits)</option>
                      <option value="Genshin Impact">Genshin Impact (C6 R5 Whale)</option>
                      <option value="CS2">CS2 (Howl / Karambit Blue Gem)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {language === 'kh' ? 'ថវិកាគ្រោង ($USD)' : 'Target Budget ($USD)'}
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-[#f2ca50] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="1000"
                        step="100"
                        required
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {language === 'kh' ? 'លក្ខខណ្ឌ Skins / Rank ជាក់លាក់' : 'Specific Weapon / Skin / Tier Requirements'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={language === 'kh' ? 'ឧ. ត្រូវមាន Kuronami Vandal, អ៊ីមែលដើម OGO ជាមួយបង្កាន់ដៃបង្កើតដំបូង...' : 'e.g. Must have Kuronami Vandal, Arcane Sheriff, clean first-mail OGO with creation receipt...'}
                      value={specRequirements}
                      onChange={(e) => setSpecRequirements(e.target.value)}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-md hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all"
                  >
                    {language === 'kh' ? 'បញ្ជូនទៅអ្នកសម្របសម្រួលផ្ទាល់' : 'Dispatch to Private Broker'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
