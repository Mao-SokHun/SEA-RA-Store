'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Search,
  Receipt,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function TrackOrderModal() {
  const { language, t, isTrackOpen, closeTrack, recentOrders, openTopUp } = useApp();
  const [query, setQuery] = useState('');

  if (!isTrackOpen) return null;

  const filteredOrders = query.trim()
    ? recentOrders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
          o.playerNickname.toLowerCase().includes(query.toLowerCase()) ||
          o.game.name.toLowerCase().includes(query.toLowerCase())
      )
    : recentOrders;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-[#0B101E] rounded-3xl border border-white/[0.12] w-full max-w-lg p-6 relative shadow-2xl overflow-hidden">
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E5B55E] to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeTrack}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-5 h-5 text-[#E5B55E]" />
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white">
              {t.trackOrder.modalTitle}
            </h3>
          </div>
          <p className="text-xs text-neutral-400">
            {t.trackOrder.subtitle}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.trackOrder.inputPlaceholder}
            className="w-full bg-[#121828] border border-white/[0.1] focus:border-[#E5B55E] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none transition-all"
          />
        </div>

        {/* Order Results List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            {t.trackOrder.recentOrders} ({filteredOrders.length})
          </span>

          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center bg-[#121828]/50 rounded-2xl border border-white/[0.04]">
              <p className="text-xs text-neutral-400">
                {t.trackOrder.noOrders}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isCompleted = order.status === 'completed';
              return (
                <div
                  key={order.orderNumber}
                  className="p-3.5 rounded-2xl bg-[#121828] border border-white/[0.06] hover:border-white/[0.15] transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-black text-white">
                        #{order.orderNumber}
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        {order.game.name} • {order.package.name}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                          isCompleted
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-spin" />}
                        <span>{order.status}</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-[#E5B55E] block mt-0.5">
                        ${order.totalUSD.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-neutral-400">
                    <span>
                      Player: <strong className="text-neutral-200">{order.playerNickname}</strong>
                    </span>
                    <span>
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {order.deliveryProof && (
                    <div className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 truncate">
                      Proof: {order.deliveryProof}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Support link */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
          <span className="text-neutral-400">Need order assistance?</span>
          <a
            href="https://t.me/sokhunmao"
            target="_blank"
            className="text-[#E5B55E] font-bold hover:underline flex items-center gap-1"
          >
            <span>Telegram Support</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
