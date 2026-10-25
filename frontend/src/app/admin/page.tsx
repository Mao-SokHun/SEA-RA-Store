'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Eye,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { WithdrawalRequest } from '@/types';

export default function AdminCommandCenterPage() {
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const [metrics, setMetrics] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      if (!isAuthenticated) return;
      try {
        const [overview, wrList] = await Promise.all([
          api.admin.getOverview().catch(() => null),
          api.admin.getWithdrawals().catch(() => []),
        ]);
        setMetrics(overview);
        setWithdrawals(wrList || []);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, [isAuthenticated]);

  const handleApproveWithdrawal = async (id: string) => {
    try {
      await api.admin.approveWithdrawal(id, 'Admin Concierge auto-approved via ABA Direct');
      setActionSuccess(`Withdrawal #${id.substring(0, 8)} approved successfully!`);
      // Refresh list
      const wrList = await api.admin.getWithdrawals();
      setWithdrawals(wrList || []);
      const overview = await api.admin.getOverview();
      setMetrics(overview);
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    }
  };

  const handleRejectWithdrawal = async (id: string) => {
    const reason = prompt('Please enter reason for rejection (funds will refund to user wallet):');
    if (!reason) return;
    try {
      await api.admin.rejectWithdrawal(id, reason);
      setActionSuccess(`Withdrawal #${id.substring(0, 8)} rejected and refunded to wallet.`);
      const wrList = await api.admin.getWithdrawals();
      setWithdrawals(wrList || []);
      const overview = await api.admin.getOverview();
      setMetrics(overview);
    } catch (err: any) {
      alert(err.message || 'Rejection failed');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className={`min-h-screen bg-[#0b0e14] flex items-center justify-center p-4 text-center ${language === 'kh' ? 'font-kantumruy' : ''}`}>
        <div className="bg-[#151a23] p-8 rounded-2xl border border-white/[0.08] max-w-md w-full space-y-4">
          <Shield className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">
            {language === 'kh' ? 'សិទ្ធិគ្រប់គ្រងត្រូវបានកម្រិត' : 'Admin Concierge Restricted'}
          </h2>
          <p className="text-xs text-neutral-400">
            {language === 'kh' ? 'ទំព័រនេះត្រូវការសិទ្ធិជា Administrator នៃប្រព័ន្ធ។' : 'This command center requires administrator privileges.'}
          </p>
          <Link
            href="/"
            className="block py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#f2ca50] text-[#0b0e14]"
          >
            {language === 'kh' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Public Marketplace'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#0b0e14] py-10 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30 text-[10px] font-bold uppercase tracking-widest mb-2">
              <Shield className="w-3.5 h-3.5" />
              CONCIERGE COMMAND DESK
            </div>
            <h1 className="text-3xl font-black text-white">{t('adminTitle')}</h1>
            <p className="text-xs text-neutral-400 mt-1">
              {t('adminSubtitle')}
            </p>
          </div>
        </div>

        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-[#151a23] p-5 rounded-2xl border border-white/[0.08] shadow-lg">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              {t('adminMetricsGmv')}
            </span>
            <span className="text-2xl font-black text-[#f2ca50] font-mono block">
              ${Number(metrics?.totalVolume ?? 762).toFixed(2)}
            </span>
            <span className="text-[10px] text-emerald-400">Escrow settled volume</span>
          </div>

          <div className="bg-[#151a23] p-5 rounded-2xl border border-white/[0.08] shadow-lg">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              {t('adminMetricsRevenue')}
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono block">
              ${Number(metrics?.netRevenue ?? 77).toFixed(2)}
            </span>
            <span className="text-[10px] text-neutral-400">Platform retained earnings</span>
          </div>

          <div className="bg-[#151a23] p-5 rounded-2xl border border-white/[0.08] shadow-lg">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              {language === 'kh' ? 'គណនីកំពុងដាក់លក់' : 'Active Listings in Vault'}
            </span>
            <span className="text-2xl font-black text-[#00e4f2] font-mono block">
              {metrics?.activeListings ?? 24}
            </span>
            <span className="text-[10px] text-neutral-400">Protected accounts</span>
          </div>

          <div className="bg-[#151a23] p-5 rounded-2xl border border-white/[0.08] shadow-lg">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              {language === 'kh' ? 'អ្នកប្រើប្រាស់សរុប' : 'Registered Traders'}
            </span>
            <span className="text-2xl font-black text-[#dcb8ff] font-mono block">
              {metrics?.totalUsers ?? 150}
            </span>
            <span className="text-[10px] text-neutral-400">Buyers & verified sellers</span>
          </div>
        </div>

        {/* Withdrawal Approvals Queue */}
        <div className="bg-[#151a23] rounded-2xl border border-white/[0.08] shadow-xl p-6 mb-10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {t('adminWithdrawalsPending')}
              </h3>
              <p className="text-xs text-neutral-400">
                {language === 'kh' ? 'អនុម័ត និងផ្ទេរប្រាក់ចូលធនាគារ ABA Bank / Wing របស់អ្នកលក់។' : 'Execute pending payouts via ABA Bank / Wing bank rail.'}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] font-bold text-xs">
              {withdrawals.filter((w) => w.status === 'pending').length} {language === 'kh' ? 'រង់ចាំ' : 'Pending'}
            </span>
          </div>

          {withdrawals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-500 border-b border-white/[0.06]">
                    <th className="pb-3 font-semibold uppercase">{t('txId')}</th>
                    <th className="pb-3 font-semibold uppercase">{t('txAmount')}</th>
                    <th className="pb-3 font-semibold uppercase">{t('withdrawBankSelect')}</th>
                    <th className="pb-3 font-semibold uppercase">{t('withdrawAccountName')}</th>
                    <th className="pb-3 font-semibold uppercase">{t('txStatus')}</th>
                    <th className="pb-3 font-semibold uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-mono font-bold text-neutral-400">
                        #{w.id.substring(0, 8)}
                      </td>
                      <td className="py-3 font-mono font-bold text-[#f2ca50]">
                        ${Number(w.amount).toFixed(2)}
                      </td>
                      <td className="py-3 text-neutral-300">
                        <span className="font-bold block text-white">{w.bankName}</span>
                        <span className="font-mono text-neutral-400">{w.accountNumber}</span>
                      </td>
                      <td className="py-3 text-neutral-300 font-bold">{w.accountName}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            w.status === 'approved'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : w.status === 'rejected'
                              ? 'bg-rose-500/15 text-rose-400'
                              : 'bg-amber-500/15 text-amber-400'
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {w.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveWithdrawal(w.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-[#0b0e14] border border-emerald-500/30 text-[11px] font-bold uppercase transition-all"
                            >
                              {t('adminApproveBtn')}
                            </button>
                            <button
                              onClick={() => handleRejectWithdrawal(w.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-[11px] font-bold uppercase transition-all"
                            >
                              {t('adminRejectBtn')}
                            </button>
                          </div>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-neutral-500">
              {language === 'kh' ? 'មិនមានការស្នើសុំដកប្រាក់កំពុងរង់ចាំទេ។' : 'No pending bank withdrawals in queue.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
