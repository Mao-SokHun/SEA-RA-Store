'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t, language } = useLanguage();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ emailOrUsername, password });
      router.push('/catalog');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
            {language === 'kh' ? 'ចូលប្រើប្រាស់ SEA RA' : 'Sign In to SEA RA'}
          </h1>
          <p className="text-xs text-neutral-400">
            {language === 'kh' ? 'ចូលទៅកាន់បន្ទប់លេខសម្ងាត់ និងការបញ្ជាទិញរបស់អ្នក។' : 'Access your secure gaming escrow vault and active orders.'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
              {language === 'kh' ? 'អ៊ីមែល ឬឈ្មោះអ្នកប្រើ' : 'Email or Username'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="seller_pro or user@seara.com"
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
                placeholder="••••••••••••"
                className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? (language === 'kh' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Authenticating...') : t('navSignIn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-white/[0.06] text-center text-xs text-neutral-400">
          <span>{language === 'kh' ? 'មិនទាន់មានគណនីមែនទេ?' : "Don't have an account?"}{' '}</span>
          <Link href="/auth/register" className="text-[#f2ca50] hover:underline font-bold">
            {t('navGetStarted')}
          </Link>
        </div>
      </div>
    </div>
  );
}
