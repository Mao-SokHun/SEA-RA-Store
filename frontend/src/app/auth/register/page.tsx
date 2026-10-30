'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, Mail, Tag, ArrowRight, AlertTriangle, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t, language } = useLanguage();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await register({
        username,
        email,
        password,
        role,
        referralCode: referralCode || undefined,
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      router.push('/catalog');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0b0e14] flex items-center justify-center p-4 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="bg-[#151a23] border border-white/[0.08] rounded-2xl max-w-md w-full p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffe088] via-[#d4af37] to-[#8f6b10] p-[1.5px] mx-auto shadow-md">
            <div className="w-full h-full bg-[#0b0e14] rounded-[10px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#f2ca50]" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">
            {language === 'kh' ? 'បង្កើតគណនី NEXUS' : 'Create NEXUS Account'}
          </h1>
          <p className="text-xs text-neutral-400">
            {language === 'kh'
              ? 'បង្កើតកាបូបឌីជីថលស្វ័យប្រវត្តិ និងទទួលកូដណែនាំភ្លាមៗ។'
              : 'Auto-generate your zero-knowledge digital wallet and referral key.'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Role Selector */}
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
              {language === 'kh' ? 'តួនាទីគណនី' : 'Account Role'}
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#0b0e14] p-1 rounded-xl border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                  role === 'buyer'
                    ? 'bg-[#f2ca50] text-[#0b0e14] shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'kh' ? 'អ្នកទិញ (Buyer)' : 'Buyer'}
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                  role === 'seller'
                    ? 'bg-[#00e4f2] text-[#0b0e14] shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'kh' ? 'អ្នកលក់ (Seller Vault)' : 'Seller (Listing Vault)'}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
              {language === 'kh' ? 'ឈ្មោះអ្នកប្រើ' : 'Username'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="legend_player"
                className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
              {language === 'kh' ? 'អាសយដ្ឋានអ៊ីមែល' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@example.com"
                className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
              {language === 'kh' ? 'លេខសម្ងាត់' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
              {language === 'kh' ? 'កូដណែនាំ Referral (ស្រេចចិត្ត)' : 'Referral Code (Optional)'}
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-[#f2ca50] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="WELCOME10 or Referrer Key"
                className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-black text-black" />
            <span>{isLoading ? (language === 'kh' ? 'កំពុងបង្កើតគណនី...' : 'Creating Account & Wallet...') : t('navGetStarted')}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-white/[0.06] text-center text-xs text-neutral-400">
          {language === 'kh' ? 'មានគណនីរួចហើយមែនទេ?' : 'Already have an account?'}{' '}
          <Link href="/auth/login" className="text-[#f2ca50] font-bold hover:underline">
            {t('navSignIn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
