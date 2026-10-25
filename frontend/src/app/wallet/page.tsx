'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Wallet as WalletType, WalletTransaction } from '@/types';

export default function WalletDashboardPage() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { t, language } = useLanguage();

  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Withdrawal Modal
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankName, setBankName] = useState('ABA Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    async function loadWalletData() {
      if (!isAuthenticated) return;
      try {
        const [walletData, txList] = await Promise.all([
          api.wallet.get().catch(() => null),
          api.wallet.getTransactions().catch(() => []),
        ]);
        setWallet(walletData);
        setTransactions(txList || []);
      } catch (err) {
        console.error('Error loading wallet:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadWalletData();
  }, [isAuthenticated]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (!amountNum || amountNum <= 0) return;

    setIsSubmittingWithdraw(true);
    setWithdrawError(null);

    try {
      await api.wallet.withdraw({
        amount: amountNum,
        bankName,
        accountNumber,
        accountName,
      });

      setWithdrawSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      // Reload wallet & user balance
      const updatedWallet = await api.wallet.get();
      const updatedTx = await api.wallet.getTransactions();
      setWallet(updatedWallet);
      setTransactions(updatedTx || []);
      refreshUser();

      setTimeout(() => {
        setIsWithdrawOpen(false);
        setWithdrawSuccess(false);
        setWithdrawAmount('');
      }, 2000);
    } catch (err: any) {
      setWithdrawError(err.message || 'Withdrawal failed');
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-[#0b0e14] flex items-center justify-center p-4 text-center ${language === 'kh' ? 'font-kantumruy' : ''}`}>
        <div className="bg-[#151a23] p-8 rounded-2xl border border-white/[0.08] max-w-md w-full space-y-4">
          <Wallet className="w-12 h-12 text-[#f2ca50] mx-auto" />
          <h2 className="text-xl font-bold text-white">
            {language === 'kh' ? 'សូមចូលប្រើប្រាស់ដើម្បីពិនិត្យកាបូប' : 'Sign In to Access Wallet'}
          </h2>
          <p className="text-xs text-neutral-400">
            {language === 'kh'
              ? 'មើលសមតុល្យលក់គណនីរបស់អ្នក ស្នើសុំដកប្រាក់ និងពិនិត្យប្រវត្តិប្រតិបត្តិការ។'
              : 'View your seller balance, request bank withdrawals, and inspect financial transactions.'}
          </p>
          <Link
            href="/auth/login"
            className="block py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#f2ca50] text-[#0b0e14]"
          >
            {t('navSignIn')}
          </Link>
        </div>
      </div>
    );
  }

  const currentBalance = Number(wallet?.balance ?? user?.wallet?.balance ?? 0);

  return (
    <div className={`min-h-screen bg-[#0b0e14] py-10 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">{t('walletTitle')}</h1>
            <p className="text-xs text-neutral-400 mt-1">
              {t('walletSubtitle')}
            </p>
          </div>

          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all flex items-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{t('withdrawButton')}</span>
          </button>
        </div>

        {/* Balance Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Available Balance */}
          <div className="bg-[#151a23] p-6 rounded-2xl border border-[#d4af37]/30 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {t('walletAvailable')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#f2ca50]/10 flex items-center justify-center text-[#f2ca50]">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#f2ca50] font-mono mb-1">
              ${currentBalance.toFixed(2)}
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              ✓ {language === 'kh' ? 'អាចដកចូលធនាគារក្នុងស្រុកបានភ្លាមៗ' : 'Ready for instant bank withdrawal'}
            </span>
          </div>

          {/* Card 2: Escrow Hold */}
          <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {t('walletEscrowLocked')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#00e4f2]/10 flex items-center justify-center text-[#00e4f2]">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono mb-1">
              ${Number(wallet?.pendingEscrowBalance ?? 0).toFixed(2)}
            </div>
            <span className="text-[11px] text-neutral-400">
              {language === 'kh' ? 'ដោះលែងនៅពេលអ្នកទិញបញ្ជាក់ការទទួលបាន' : 'Releases upon buyer handover confirmation'}
            </span>
          </div>

          {/* Card 3: Security Bond Coverage */}
          <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {t('slaBonds')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono mb-1">
              $2,000.00
            </div>
            <span className="text-[11px] text-emerald-300">
              Tier-1 Verified Sovereign Seller
            </span>
          </div>
        </div>

        {/* Ledger Transaction History Table */}
        <div className="bg-[#151a23] rounded-2xl border border-white/[0.08] shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('transactionsTitle')}
            </h3>
            <span className="text-xs text-neutral-400">
              {language === 'kh' ? `បង្ហាញប្រតិបត្តិការចុងក្រោយ ${transactions.length}` : `Showing last ${transactions.length} entries`}
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-mono">
              {language === 'kh' ? 'កំពុងទាញយកទិន្នន័យ...' : 'Loading ledger data...'}
            </div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-500 border-b border-white/[0.06]">
                    <th className="pb-3 font-semibold uppercase">{t('txType')}</th>
                    <th className="pb-3 font-semibold uppercase">{t('txAmount')}</th>
                    <th className="pb-3 font-semibold uppercase">{language === 'kh' ? 'សមតុល្យបន្ទាប់' : 'Balance After'}</th>
                    <th className="pb-3 font-semibold uppercase">{t('txDate')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {transactions.map((tx: any) => {
                    const isCredit =
                      tx.transaction_type === 'credit' ||
                      tx.transactionType === 'credit' ||
                      tx.transaction_type === 'escrow_release' ||
                      tx.transactionType === 'escrow_release';

                    return (
                      <tr key={tx.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-bold uppercase text-neutral-300">
                          {tx.transaction_type || tx.transactionType}
                        </td>
                        <td className={`py-3 font-mono font-bold ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isCredit ? `+$${Number(tx.amount).toFixed(2)}` : `-$${Number(tx.amount).toFixed(2)}`}
                        </td>
                        <td className="py-3 font-mono text-neutral-400">
                          ${Number(tx.balance_after || tx.balanceAfter || 0).toFixed(2)}
                        </td>
                        <td className="py-3 text-neutral-500">
                          {new Date(tx.created_at || tx.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-neutral-500">
              {language === 'kh' ? 'មិនទាន់មានប្រតិបត្តិការនៅឡើយទេ។ ដាក់លក់គណនីដើម្បីចាប់ផ្តើមរកចំណូល!' : 'No transactions recorded yet. List an account to start earning!'}
            </div>
          )}
        </div>

        {/* Withdrawal Modal */}
        {isWithdrawOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#151a23] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#f2ca50]" />
                  <h3 className="font-bold text-white text-base">
                    {t('withdrawModalTitle')}
                  </h3>
                </div>
                <button
                  onClick={() => setIsWithdrawOpen(false)}
                  className="text-neutral-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {withdrawSuccess ? (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">
                    {language === 'kh' ? 'ការស្នើសុំដកប្រាក់ត្រូវបានបញ្ជូន!' : 'Withdrawal Submitted!'}
                  </h4>
                  <p className="text-xs text-neutral-300">
                    {language === 'kh' ? 'សំណើរបស់អ្នកត្រូវបានបញ្ជូនទៅ Admin ដើម្បីផ្ទេរប្រាក់ជូនអ្នក។' : 'Your request has been queued for admin verification and transfer.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWithdraw} className="space-y-4">
                  {withdrawError && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      {withdrawError}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {t('withdrawBankSelect')}
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      <option value="ABA Bank">ABA Bank (Instant KHQR)</option>
                      <option value="Wing Bank">Wing Bank</option>
                      <option value="ACLEDA Bank">ACLEDA Bank</option>
                      <option value="Canadia Bank">Canadia Bank</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {t('withdrawAccountNumber')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 001 234 567"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {t('withdrawAccountName')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SOK HUN MAO"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {t('withdrawAmountLabel')}
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-[#f2ca50] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="5"
                        max={currentBalance}
                        step="0.01"
                        required
                        placeholder="Amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-1 block">
                      {language === 'kh' ? 'សមតុល្យដែលអាចដកបាន:' : 'Max available:'} ${currentBalance.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingWithdraw || currentBalance <= 0}
                    className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-md transition-all disabled:opacity-50"
                  >
                    {isSubmittingWithdraw ? (language === 'kh' ? 'កំពុងដំណើរការ...' : 'Processing Request...') : t('confirmWithdrawal')}
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
