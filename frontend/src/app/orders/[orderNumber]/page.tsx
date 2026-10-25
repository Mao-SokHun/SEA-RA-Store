'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Unlock,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { Order, DecryptedCredentials } from '@/types';

export default function OrderVaultPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [credentials, setCredentials] = useState<DecryptedCredentials | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  useEffect(() => {
    async function loadOrder() {
      if (!orderNumber) return;
      try {
        const data = await api.orders.getByNumber(orderNumber);
        setOrder(data);

        // Auto-decrypt if already in escrow or completed
        if (data.status === 'in_escrow' || data.status === 'completed' || data.status === 'inspection') {
          handleDecrypt();
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load order');
      }
    }
    loadOrder();
  }, [orderNumber]);

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    try {
      const creds = await api.orders.getCredentials(orderNumber);
      setCredentials(creds);
    } catch (err: any) {
      console.warn('Decryption pending or unauthorized:', err.message);
    } finally {
      setIsDecrypting(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmReceived = async () => {
    if (!order) return;
    setIsConfirming(true);
    try {
      const updated = await api.orders.confirmReceived(order.orderNumber);
      setOrder(updated);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to confirm receipt');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRaiseDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;
    try {
      await api.disputes.raise({
        orderNumber,
        reason: disputeReason,
      });
      setIsDisputeOpen(false);
      // Reload order
      const data = await api.orders.getByNumber(orderNumber);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Failed to raise dispute');
    }
  };

  if (!order) {
    return (
      <div className={`min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center gap-3 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
        <div className="w-8 h-8 border-2 border-[#f2ca50] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-400 font-mono">
          {language === 'kh' ? `កំពុងបើកបន្ទប់សុវត្ថិភាពសម្រាប់ការបញ្ជាទិញ #${orderNumber}...` : `Unlocking vault for order #${orderNumber}...`}
        </p>
      </div>
    );
  }

  const isCompleted = order.status === 'completed';
  const isInEscrow = order.status === 'in_escrow' || order.status === 'inspection';
  const isInDispute = order.status === 'in_dispute';

  return (
    <div className={`min-h-screen bg-[#0b0e14] py-10 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Header Card */}
        <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-neutral-400">
                {t('orderNumber')}{order.orderNumber}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isCompleted
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : isInDispute
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : 'bg-[#00e4f2]/15 text-[#00e4f2] border border-[#00e4f2]/30'
                }`}
              >
                {order.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">
              {order.listingSnapshot?.title || 'Vaulted Gaming Account'}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              {order.listingSnapshot?.gameTitle} • {order.listingSnapshot?.tierRank} • ${order.totalAmount}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/escrow/${order.orderNumber}`}
              className="px-4 py-2.5 rounded-xl bg-[#0b0e14] hover:bg-[#10131a] border border-[#00e4f2]/40 text-[#00e4f2] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('escrowRoomBtn')}</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-6">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* =========================================================================
            VAULT CREDENTIALS CONTAINER
        ========================================================================== */}
        <div className="bg-[#151a23] rounded-2xl border border-[#d4af37]/30 shadow-2xl p-6 sm:p-8 space-y-6 mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center text-[#f2ca50]">
                {credentials ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{t('vaultDecryptedTitle')}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    AES-256-GCM
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  {t('vaultDecryptedSubtitle')}
                </p>
              </div>
            </div>

            {!credentials && (
              <button
                onClick={handleDecrypt}
                disabled={isDecrypting}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#f2ca50] text-[#0b0e14] shadow-md flex items-center gap-2"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{isDecrypting ? (language === 'kh' ? 'កំពុងដោះសោ...' : 'Decrypting...') : t('revealPasswords')}</span>
              </button>
            )}
          </div>

          {credentials ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Login Identifier */}
              <div className="p-4 rounded-xl bg-[#0b0e14] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
                    {t('loginIdentifier')}
                  </span>
                  <span className="text-sm font-mono text-white select-all">
                    {credentials.loginIdentifier}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials.loginIdentifier, 'login')}
                  className="p-2 rounded-lg bg-[#151a23] hover:bg-[#1d2026] text-neutral-300 hover:text-white transition-colors"
                  title="Copy Login"
                >
                  {copiedField === 'login' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Password */}
              <div className="p-4 rounded-xl bg-[#0b0e14] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
                    {t('loginPassword')}
                  </span>
                  <span className="text-sm font-mono text-[#f2ca50] select-all">
                    {showPassword ? credentials.password : '••••••••••••••••'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 rounded-lg bg-[#151a23] hover:bg-[#1d2026] text-neutral-300 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(credentials.password, 'password')}
                    className="p-2 rounded-lg bg-[#151a23] hover:bg-[#1d2026] text-neutral-300 hover:text-white transition-colors"
                  >
                    {copiedField === 'password' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2FA / Recovery Email if present */}
              {credentials.recoveryEmail && (
                <div className="p-4 rounded-xl bg-[#0b0e14] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
                      {t('emailPassword')}
                    </span>
                    <span className="text-xs font-mono text-neutral-300">
                      Email: {credentials.recoveryEmail} | Pass: {credentials.recoveryEmailPassword || 'Same as account'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(credentials.recoveryEmail || '', 'email')}
                    className="p-2 rounded-lg bg-[#151a23] hover:bg-[#1d2026] text-neutral-300 hover:text-white"
                  >
                    {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Additional Handover Notes */}
              {credentials.additionalNotes && (
                <div className="p-4 rounded-xl bg-[#0b0e14] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
                    {language === 'kh' ? 'កំណត់ចំណាំពីអ្នកលក់' : 'Seller Handover Instructions'}
                  </span>
                  <p className="text-xs text-neutral-300 whitespace-pre-line font-mono">
                    {credentials.additionalNotes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#0b0e14] rounded-xl border border-white/[0.04]">
              <Lock className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs text-neutral-400">
                {language === 'kh'
                  ? 'ចុច "បង្ហាញលេខសម្ងាត់" ខាងលើដើម្បីដោះសោព័ត៌មានគណនីរបស់អ្នក។'
                  : 'Click "Reveal Passwords" above to decrypt this account\'s credentials.'}
              </p>
            </div>
          )}
        </div>

        {/* Handover & Dispute Actions */}
        <div className="bg-[#151a23] p-6 rounded-2xl border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">
              {language === 'kh' ? 'បានពិនិត្យ និងសាកល្បងចូលគណនីរួចរាល់ហើយឬនៅ?' : 'Inspected your new account?'}
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              {language === 'kh'
                ? 'នៅពេលអ្នកបញ្ជាក់ថាព័ត៌មានត្រឹមត្រូវ ប្រព័ន្ធ Escrow នឹងបញ្ចេញប្រាក់ជូនអ្នកលក់។'
                : 'Once you confirm everything matches, escrow releases payment to the seller.'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isCompleted && (
              <>
                <button
                  onClick={() => setIsDisputeOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#0b0e14] hover:bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  {t('raiseDispute')}
                </button>
                <button
                  onClick={handleConfirmReceived}
                  disabled={isConfirming}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-[#0b0e14] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isConfirming ? (language === 'kh' ? 'កំពុងដោះលែង Escrow...' : 'Releasing Escrow...') : t('confirmReceived')}</span>
                </button>
              </>
            )}

            {isCompleted && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {language === 'kh' ? 'ប្រតិបត្តិការត្រូវបានបញ្ចប់ដោយជោគជ័យ' : 'Transaction Completed Successfully'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dispute Modal */}
        {isDisputeOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#151a23] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base text-white">{t('raiseDispute')}</h3>
              </div>
              <p className="text-xs text-neutral-300">
                {language === 'kh'
                  ? 'ការដាក់ពាក្យបណ្តឹងនឹងបង្កកប្រាក់ Escrow ភ្លាមៗ។ Admin នឹងចូលរួមក្នុងបន្ទប់ជជែក Escrow ដើម្បីត្រួតពិនិត្យភស្តុតាង។'
                  : 'Raising a dispute immediately freezes platform escrow funds. A concierge mediator will join your escrow room to review evidence.'}
              </p>
              <form onSubmit={handleRaiseDispute} className="space-y-4">
                <textarea
                  rows={4}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder={language === 'kh' ? 'រៀបរាប់ពីបញ្ហា (ឧ. លេខសម្ងាត់ខុស, ជាប់ 2FA, ព័ត៌មានមិនដូចការពិពណ៌នា)...' : 'Describe the issue (e.g. wrong password, unlisted bind, 2FA prompt)...'}
                  className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-400"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDisputeOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase bg-[#0b0e14] text-neutral-400 hover:text-white"
                  >
                    {t('cancelBtn')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold uppercase bg-rose-500 hover:bg-rose-600 text-white font-bold"
                  >
                    {language === 'kh' ? 'ដាក់ពាក្យបណ្តឹង' : 'Submit Dispute'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
