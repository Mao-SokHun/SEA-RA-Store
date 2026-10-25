'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, ShoppingBag, ArrowRight, Clock, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Order } from '@/types';

export default function MyOrdersPage() {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!isAuthenticated) return;
      try {
        const data = await api.orders.getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-[#0b0e14] flex items-center justify-center p-4 text-center ${language === 'kh' ? 'font-kantumruy' : ''}`}>
        <div className="bg-[#151a23] p-8 rounded-2xl border border-white/[0.08] max-w-md w-full space-y-4">
          <Shield className="w-12 h-12 text-[#f2ca50] mx-auto" />
          <h2 className="text-xl font-bold text-white">
            {language === 'kh' ? 'សូមចូលប្រើប្រាស់ដើម្បីមើលការបញ្ជាទិញ' : 'Sign In to View Orders'}
          </h2>
          <p className="text-xs text-neutral-400">
            {language === 'kh'
              ? 'ចូលទៅកាន់គណនីរបស់អ្នកដើម្បីពិនិត្យមើលពាក្យសម្ងាត់ និងការបញ្ជាទិញ។'
              : 'Access your purchased gaming assets and active credential vaults.'}
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

  return (
    <div className={`min-h-screen bg-[#0b0e14] py-10 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">
              {language === 'kh' ? 'ការបញ្ជាទិញ & បន្ទប់លេខសម្ងាត់' : 'My Orders & Credential Vaults'}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              {language === 'kh'
                ? 'មើលគណនីដែលកំពុងស្ថិតក្នុង Escrow ដោះសោលេខសម្ងាត់ និងទាញយកប្រវត្តិផ្ទេរ។'
                : 'View your active escrow holdings, inspect decrypted credentials, and download handover logs.'}
            </p>
          </div>
          <Link
            href="/catalog"
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151a23] hover:bg-[#1d2026] text-[#f2ca50] border border-[#d4af37]/30"
          >
            {t('navCatalog')}
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#f2ca50] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-neutral-400 font-mono">
              {language === 'kh' ? 'កំពុងទាញយកទិន្នន័យ...' : 'Syncing order ledgers...'}
            </p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const isCompleted = order.status === 'completed';
              const isInEscrow = order.status === 'in_escrow' || order.status === 'inspection';
              const isInDispute = order.status === 'in_dispute';

              return (
                <div
                  key={order.id}
                  className="bg-[#151a23] hover:bg-[#1a202c] p-5 rounded-2xl border border-white/[0.08] hover:border-[#d4af37]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0b0e14] border border-white/[0.08] flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-6 h-6 text-[#f2ca50]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-neutral-400 font-bold">
                          #{order.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
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
                      <h3 className="font-bold text-sm text-white group-hover:text-[#f2ca50] transition-colors">
                        {order.listingSnapshot?.title || 'Game Account'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {order.listingSnapshot?.gameTitle} • {order.listingSnapshot?.tierRank} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-xs text-neutral-500 uppercase tracking-wider block">
                        {t('priceTag')}
                      </span>
                      <span className="text-base font-black text-[#f2ca50] font-mono">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>

                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-md flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{language === 'kh' ? 'បើក Vault' : 'Open Vault'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#151a23]/60 rounded-2xl border border-white/[0.08] p-8">
            <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-200">
              {t('ordersEmpty')}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              {language === 'kh'
                ? 'រុករកកាតាឡុកទីផ្សារ និងទិញគណនីដែលបានផ្ទៀងផ្ទាត់ដោយគ្មានហានិភ័យ។'
                : 'Explore the marketplace catalog and purchase verified accounts with zero fraud risk.'}
            </p>
            <Link
              href="/catalog"
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#f2ca50] text-[#0b0e14]"
            >
              {t('ctaExplore')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
