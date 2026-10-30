'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Zap, CheckCircle2, ArrowLeft, QrCode } from 'lucide-react';

const gamesDatabase: Record<string, {
  name: string;
  genre: string;
  rating: number;
  banner: string;
  avatar: string;
  developer: string;
  requiresZoneId: boolean;
  zonePlaceholder: string;
  packages: Array<{
    id: string;
    diamonds: number;
    bonus?: number;
    price: number;
    badge?: string;
    badgeColor?: string;
  }>;
}> = {
  'mobile-legends': {
    name: 'Mobile Legends: Bang Bang',
    genre: 'MOBA Mobile',
    rating: 4.9,
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=85&fit=crop',
    avatar: '💎',
    developer: 'Moonton Official Partner',
    requiresZoneId: true,
    zonePlaceholder: 'Zone ID (4-5 ខ្ទង់)',
    packages: [
      { id: 'p1', diamonds: 86, bonus: 4, price: 1.25, badge: 'HOT DEAL', badgeColor: '#f97316' },
      { id: 'p2', diamonds: 172, bonus: 14, price: 2.45 },
      { id: 'p3', diamonds: 257, bonus: 25, price: 3.65, badge: 'POPULAR', badgeColor: '#00a8ff' },
      { id: 'p4', diamonds: 344, bonus: 35, price: 4.85 },
      { id: 'p5', diamonds: 706, bonus: 70, price: 9.80, badge: 'BEST VALUE', badgeColor: '#10b981' },
      { id: 'p6', diamonds: 2195, bonus: 220, price: 29.50 },
      { id: 'p7', diamonds: 3688, bonus: 370, price: 48.90 },
      { id: 'p8', diamonds: 5532, bonus: 550, price: 72.00, badge: 'VIP PACK', badgeColor: '#8b5cf6' },
    ],
  },
  'free-fire': {
    name: 'Free Fire & Free Fire Max',
    genre: 'Battle Royale',
    rating: 4.8,
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600&q=85&fit=crop',
    avatar: '🔥',
    developer: 'Garena Authorized',
    requiresZoneId: false,
    zonePlaceholder: '',
    packages: [
      { id: 'ff1', diamonds: 100, bonus: 10, price: 0.95 },
      { id: 'ff2', diamonds: 310, bonus: 31, price: 2.85, badge: 'HOT DEAL', badgeColor: '#f97316' },
      { id: 'ff3', diamonds: 520, bonus: 52, price: 4.75, badge: 'POPULAR', badgeColor: '#00a8ff' },
      { id: 'ff4', diamonds: 1060, bonus: 106, price: 9.50, badge: 'BEST VALUE', badgeColor: '#10b981' },
      { id: 'ff5', diamonds: 2180, bonus: 218, price: 18.90 },
      { id: 'ff6', diamonds: 5600, bonus: 560, price: 47.50 },
    ],
  },
  'pubg-mobile': {
    name: 'PUBG Mobile (UC)',
    genre: 'Battle Royale',
    rating: 4.9,
    banner: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1600&q=85&fit=crop',
    avatar: '🪙',
    developer: 'Tencent Authorized',
    requiresZoneId: false,
    zonePlaceholder: '',
    packages: [
      { id: 'pubg1', diamonds: 60, price: 0.99 },
      { id: 'pubg2', diamonds: 325, bonus: 25, price: 4.95, badge: 'POPULAR', badgeColor: '#00a8ff' },
      { id: 'pubg3', diamonds: 660, bonus: 60, price: 9.90, badge: 'HOT DEAL', badgeColor: '#f97316' },
      { id: 'pubg4', diamonds: 1800, bonus: 180, price: 24.50, badge: 'BEST VALUE', badgeColor: '#10b981' },
      { id: 'pubg5', diamonds: 3850, bonus: 385, price: 48.90 },
      { id: 'pubg6', diamonds: 8100, bonus: 810, price: 97.00 },
    ],
  },
  'genshin-impact': {
    name: 'Genshin Impact',
    genre: 'Open-World Action RPG',
    rating: 4.8,
    banner: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=1600&q=85&fit=crop',
    avatar: '✨',
    developer: 'HoYoverse Authorized',
    requiresZoneId: true,
    zonePlaceholder: 'Server (Asia, America, Europe...)',
    packages: [
      { id: 'gen1', diamonds: 60, price: 0.99 },
      { id: 'gen2', diamonds: 300, bonus: 30, price: 4.85 },
      { id: 'gen3', diamonds: 980, bonus: 110, price: 14.50, badge: 'POPULAR', badgeColor: '#00a8ff' },
      { id: 'gen4', diamonds: 1980, bonus: 260, price: 28.90, badge: 'BEST VALUE', badgeColor: '#10b981' },
      { id: 'gen5', diamonds: 3280, bonus: 600, price: 47.90 },
      { id: 'gen6', diamonds: 6480, bonus: 1600, price: 95.00, badge: 'WHALE PACK', badgeColor: '#8b5cf6' },
    ],
  },
  'roblox': {
    name: 'Roblox (Robux Direct)',
    genre: 'Sandbox / Metaverse',
    rating: 4.9,
    banner: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1600&q=85&fit=crop',
    avatar: '🧱',
    developer: 'Roblox Direct Transfer',
    requiresZoneId: false,
    zonePlaceholder: '',
    packages: [
      { id: 'rbx1', diamonds: 80, price: 0.99 },
      { id: 'rbx2', diamonds: 400, bonus: 40, price: 4.85, badge: 'POPULAR', badgeColor: '#00a8ff' },
      { id: 'rbx3', diamonds: 800, bonus: 80, price: 9.50, badge: 'HOT DEAL', badgeColor: '#f97316' },
      { id: 'rbx4', diamonds: 1700, bonus: 200, price: 19.00, badge: 'BEST VALUE', badgeColor: '#10b981' },
      { id: 'rbx5', diamonds: 4500, bonus: 500, price: 48.00 },
      { id: 'rbx6', diamonds: 10000, bonus: 1200, price: 95.00 },
    ],
  },
};

const paymentMethods = [
  { id: 'khqr', name: 'Bakong KHQR (0% ថ្លៃសេវា)', sub: 'ABA, Wing, ACLEDA, Canadia, TrueMoney', icon: '📱', popular: true },
  { id: 'aba', name: 'ABA PAY Instant', sub: 'ទូទាត់ភ្លាមៗជាមួយ ABA Mobile App', icon: '💳' },
  { id: 'wing', name: 'Wing Bank KHQR', sub: 'ទូទាត់រហ័សជាមួយ Wing Bank App', icon: '🦅' },
  { id: 'acleda', name: 'ACLEDA mobile', sub: 'ទូទាត់ជាមួយគណនី ACLEDA', icon: '🏦' },
];

export default function TopUpClient({ slug }: { slug: string }) {
  const game = gamesDatabase[slug] || gamesDatabase['mobile-legends'];

  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(game.packages[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);

  const handleVerify = () => {
    if (!userId) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedName('Slayer_Pro_KH (ID ត្រឹមត្រូវ ✓)');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#040b1a] text-white">
      <Navbar />

      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        
        {/* ── Breadcrumb / Back Link ── */}
        <div className="mb-6 flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#8b9ab4] hover:text-[#00a8ff] transition-colors font-km"
          >
            <ArrowLeft size={14} />
            <span>ត្រឡប់ទៅទំព័រដើម</span>
          </Link>
          <span className="text-[#5a6f90]">/</span>
          <span className="text-xs text-white font-km font-semibold">{game.name}</span>
        </div>

        {/* ── Hero Game Banner ── */}
        <div className="relative rounded-2xl overflow-hidden mb-8 border border-[#1a335a] bg-[#0a1428] shadow-2xl">
          <div className="relative h-48 sm:h-60 w-full overflow-hidden">
            <img
              src={game.banner}
              alt={game.name}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.55)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1428] via-[#0a1428]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#040b1a]/90 via-[#040b1a]/40 to-transparent" />

            {/* Game Info Overlay */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0a1428] border-2 border-[#00a8ff]/60 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(0,168,255,0.3)]">
                  {game.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-en bg-[#00a8ff]/20 border border-[#00a8ff]/40 text-[#00a8ff]">
                      OFFICIAL DIRECT API
                    </span>
                    <span className="text-xs text-[#facc15] font-bold">★ {game.rating}</span>
                  </div>
                  <h1 className="font-km font-black text-xl sm:text-3xl text-white">
                    {game.name}
                  </h1>
                  <p className="font-km text-xs text-[#8b9ab4] mt-0.5">
                    {game.developer} • ដឹកជញ្ជូនស្វ័យប្រវត្តិតាមរយៈ Direct API ត្រឹម 3 វិនាទី
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-[#040b1a]/80 border border-[#00a8ff]/25 backdrop-blur-md text-right">
                  <div className="flex items-center gap-1.5 text-xs text-[#10b981] font-bold font-km">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    <span>ប្រព័ន្ធដំណើរការធម្មតា (Online)</span>
                  </div>
                  <span className="text-[10px] text-[#5a6f90] font-km">Response Time: 0.8s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Top-Up Steps */}
          <div className="lg:col-span-2 space-y-6">

            {/* STEP 1: Account Information */}
            <div className="p-6 rounded-2xl bg-[#0a1428] border border-[#1a335a]">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#00a8ff] text-white font-black font-en text-sm flex items-center justify-center shadow-[0_0_12px_#00a8ff]">
                  1
                </span>
                <div>
                  <h3 className="font-km font-bold text-base text-white">
                    ជំហានទី ១: បញ្ចូលព័ត៌មានគណនីហ្គេម
                  </h3>
                  <p className="font-km text-xs text-[#8b9ab4]">
                    បញ្ចូល User ID របស់អ្នកឲ្យបានត្រឹមត្រូវដើម្បីពិនិត្យឈ្មោះក្នុងហ្គេម (IGN)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-km text-xs font-semibold text-[#8b9ab4] mb-1.5">
                    User ID *
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => {
                      setUserId(e.target.value);
                      setVerifiedName(null);
                    }}
                    placeholder="ឧទាហរណ៍: 12345678"
                    className="w-full bg-[#040b1a] border border-[#1a335a] focus:border-[#00a8ff] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#4a5a7a] outline-none font-en transition-all"
                  />
                  <span className="block text-[10px] text-[#5a6f90] mt-1 font-km">
                    មើលក្នុង Profile &gt; Basic Info ក្នុងហ្គេម
                  </span>
                </div>

                {game.requiresZoneId && (
                  <div>
                    <label className="block font-km text-xs font-semibold text-[#8b9ab4] mb-1.5">
                      Zone ID *
                    </label>
                    <input
                      type="text"
                      value={zoneId}
                      onChange={(e) => {
                        setZoneId(e.target.value);
                        setVerifiedName(null);
                      }}
                      placeholder="ឧទាហរណ៍: 2001"
                      className="w-full bg-[#040b1a] border border-[#1a335a] focus:border-[#00a8ff] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#4a5a7a] outline-none font-en transition-all"
                    />
                    <span className="block text-[10px] text-[#5a6f90] mt-1 font-km">
                      លេខក្នុងវង់ក្រចក ឧ. (2001)
                    </span>
                  </div>
                )}
              </div>

              {/* Verify Button & Status */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleVerify}
                  disabled={!userId || isVerifying}
                  className="px-4 py-2 rounded-xl bg-[#00a8ff]/20 hover:bg-[#00a8ff] border border-[#00a8ff]/40 text-[#00a8ff] hover:text-white font-km text-xs font-bold transition-all disabled:opacity-40"
                >
                  {isVerifying ? 'កំពុងផ្ទៀងផ្ទាត់...' : '🔍 ផ្ទៀងផ្ទាត់ ID ភ្លាមៗ'}
                </button>

                {verifiedName && (
                  <span className="font-km text-xs text-[#10b981] font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    {verifiedName}
                  </span>
                )}
              </div>
            </div>

            {/* STEP 2: Select Package */}
            <div className="p-6 rounded-2xl bg-[#0a1428] border border-[#1a335a]">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#00a8ff] text-white font-black font-en text-sm flex items-center justify-center shadow-[0_0_12px_#00a8ff]">
                  2
                </span>
                <div>
                  <h3 className="font-km font-bold text-base text-white">
                    ជំហានទី ២: ជ្រើសរើសកញ្ចប់ពេជ្រ/កាក់
                  </h3>
                  <p className="font-km text-xs text-[#8b9ab4]">
                    ជ្រើសរើសបរិមាណដែលអ្នកចង់បញ្ចូល (មាន Bonus បន្ថែមក្នុងកញ្ចប់នីមួយៗ)
                  </p>
                </div>
              </div>

              {/* Packages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {game.packages.map((pkg) => {
                  const isSelected = selectedPackage.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative p-3.5 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-[#00a8ff]/15 border-[#00a8ff] shadow-[0_0_20px_rgba(0,168,255,0.3)] -translate-y-1'
                          : 'bg-[#040b1a] border-[#1a335a] hover:border-[#00a8ff]/50'
                      }`}
                    >
                      {pkg.badge && (
                        <div
                          className="absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white shadow-md font-en"
                          style={{ background: pkg.badgeColor || '#f97316' }}
                        >
                          {pkg.badge}
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-base">{game.avatar}</span>
                        <span className="font-en font-black text-sm text-white">
                          {pkg.diamonds}
                        </span>
                      </div>

                      {pkg.bonus ? (
                        <span className="inline-block text-[10px] text-[#10b981] font-km font-semibold mb-2">
                          +{pkg.bonus} Bonus ឥតគិតថ្លៃ
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] text-[#5a6f90] font-km mb-2">
                          កញ្ចប់ស្តង់ដារ
                        </span>
                      )}

                      <div className="pt-2 border-t border-[#1a335a] flex items-center justify-between">
                        <span className="font-en font-black text-sm text-[#facc15]">
                          ${pkg.price.toFixed(2)}
                        </span>
                        {isSelected && (
                          <CheckCircle2 size={14} className="text-[#00a8ff]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Payment Method */}
            <div className="p-6 rounded-2xl bg-[#0a1428] border border-[#1a335a]">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#00a8ff] text-white font-black font-en text-sm flex items-center justify-center shadow-[0_0_12px_#00a8ff]">
                  3
                </span>
                <div>
                  <h3 className="font-km font-bold text-base text-white">
                    ជំហានទី ៣: ជ្រើសរើសវិធីទូទាត់ប្រាក់
                  </h3>
                  <p className="font-km text-xs text-[#8b9ab4]">
                    គាំទ្រគ្រប់ធនាគារក្នុងស្រុកតាមរយៈ Bakong KHQR ឥតគិតថ្លៃសេវា 0%
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {paymentMethods.map((pm) => {
                  const isSelected = selectedPayment === pm.id;
                  return (
                    <div
                      key={pm.id}
                      onClick={() => setSelectedPayment(pm.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#00a8ff]/15 border-[#00a8ff] shadow-[0_0_15px_rgba(0,168,255,0.25)]'
                          : 'bg-[#040b1a] border-[#1a335a] hover:border-[#00a8ff]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#0a1428] border border-[#1a335a] flex items-center justify-center text-lg">
                          {pm.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-km font-bold text-sm text-white">
                              {pm.name}
                            </span>
                            {pm.popular && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 font-km">
                                ពេញនិយមបំផុត
                              </span>
                            )}
                          </div>
                          <span className="font-km text-[11px] text-[#5a6f90]">
                            {pm.sub}
                          </span>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-[#00a8ff] bg-[#00a8ff]' : 'border-[#4a5a7a]'}`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Checkout Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-[#0a1428] border border-[#00a8ff]/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              
              <h3 className="font-km font-bold text-base text-white pb-3 border-b border-[#1a335a] flex items-center justify-between">
                <span>សង្ខេបការបញ្ជាទិញ</span>
                <span className="text-xs text-[#00a8ff] font-en font-bold">ORDER SUMMARY</span>
              </h3>

              <div className="py-4 space-y-3 font-km text-xs border-b border-[#1a335a]">
                <div className="flex justify-between text-[#8b9ab4]">
                  <span>ហ្គេម:</span>
                  <span className="text-white font-bold">{game.name}</span>
                </div>

                <div className="flex justify-between text-[#8b9ab4]">
                  <span>កញ្ចប់ពេជ្រ:</span>
                  <span className="text-white font-bold font-en">
                    {selectedPackage.diamonds} {selectedPackage.bonus ? `(+${selectedPackage.bonus})` : ''}
                  </span>
                </div>

                <div className="flex justify-between text-[#8b9ab4]">
                  <span>User ID:</span>
                  <span className="text-white font-bold font-en">
                    {userId || '(មិនទាន់បំពេញ)'}
                  </span>
                </div>

                {game.requiresZoneId && (
                  <div className="flex justify-between text-[#8b9ab4]">
                    <span>Zone ID:</span>
                    <span className="text-white font-bold font-en">
                      {zoneId || '(មិនទាន់បំពេញ)'}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[#8b9ab4]">
                  <span>វិធីទូទាត់:</span>
                  <span className="text-[#10b981] font-bold">Bakong KHQR (0% Fee)</span>
                </div>
              </div>

              {/* Total Price */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <span className="block font-km text-xs text-[#8b9ab4]">តម្លៃសរុបត្រូវបង់:</span>
                  <span className="font-km text-[10px] text-[#5a6f90]">≈ {(selectedPackage.price * 4100).toLocaleString()} ៛ (រៀល)</span>
                </div>
                <div className="text-right">
                  <span className="font-en font-black text-2xl text-[#facc15]">
                    ${selectedPackage.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Instant Pay Button */}
              <button
                disabled={!userId}
                className="w-full py-3.5 rounded-xl font-km font-bold text-sm text-white bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_25px_rgba(249,115,22,0.6)] flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <QrCode size={18} />
                <span>បង់ប្រាក់ឥឡូវនេះ (Scan KHQR) →</span>
              </button>

              {/* Trust Badges */}
              <div className="mt-4 pt-4 border-t border-[#1a335a] flex items-center justify-center gap-4 text-[#8b9ab4] text-[11px] font-km">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-[#10b981]" /> សុវត្ថិភាព 100%
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Zap size={13} className="text-[#00a8ff]" /> ចូលភ្លាមៗ 3 វិនាទី
                </span>
              </div>

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
