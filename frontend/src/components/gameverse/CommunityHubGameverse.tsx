'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ChevronRight as ArrowRightIcon,
  Eye,
} from 'lucide-react';

export default function CommunityHubGameverse() {
  return (
    <section id="community-hub" className="mb-14 scroll-mt-24 select-none">
      {/* Section Header (Sample 2 Template: COMMUNITY HUB on Left, < > on Right) */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
          COMMUNITY HUB
        </h2>

        {/* Carousel controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous community widget"
            className="w-7 h-7 rounded-lg bg-[#0c121e] hover:bg-[#151f33] border border-white/[0.08] text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Next community widget"
            className="w-7 h-7 rounded-lg bg-[#0c121e] hover:bg-[#151f33] border border-white/[0.08] text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Widgets Grid (Sample 2 Template: Recent Forum Posts, Live Stream, Top Players) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* =================================================================== */}
        {/* WIDGET 1 (LEFT): RECENT FORUM POSTS                                 */}
        {/* =================================================================== */}
        <div className="bg-[#0b101c] rounded-2xl border border-white/[0.07] p-5 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-300 pb-3 border-b border-white/[0.06] mb-3">
              RECENT FORUM POSTS
            </h3>

            <div className="space-y-3">
              {[
                {
                  title: 'Shadowfall Guild Recruitment',
                  author: 'Shadowfall Guild • 1 katin post',
                  timeAgo: '1 hours ago',
                },
                {
                  title: 'Patch 1.2 Discussion',
                  author: 'Shadowfall Guild • 1 urun post',
                  timeAgo: '1 day ago',
                },
                {
                  title: 'SEA RA Top-Up Security Guide',
                  author: 'Security Admin • 2 reloads post',
                  timeAgo: '1 day ago',
                },
              ].map((post, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-neutral-400 group-hover:text-[#00e5ff] shrink-0 mt-0.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#00e5ff] transition-colors line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400">
                        {post.author}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 shrink-0">
                    {post.timeAgo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* WIDGET 2 (CENTER): LIVE STREAM (2 Streamer Video Cards with Red LIVE)*/}
        {/* =================================================================== */}
        <div className="bg-[#0b101c] rounded-2xl border border-white/[0.07] p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-300">
                LIVE STREAM
              </h3>
              <ArrowRightIcon className="w-4 h-4 text-neutral-400" />
            </div>

            <div className="space-y-3">
              {/* Stream 1 */}
              <div className="relative rounded-xl overflow-hidden bg-black/50 border border-white/[0.06] group cursor-pointer">
                <div className="relative h-20 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80"
                    alt="Shroud stream"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-75"
                  />
                  {/* Top Red LIVE Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-600 text-white">
                      ● LIVE
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-600/80 text-white">
                      LIVE
                    </span>
                  </div>

                  {/* Streamer Avatar and Title Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60"
                        alt="Shroud"
                        className="w-5 h-5 rounded-full border border-white/50 object-cover"
                      />
                      <span className="text-[11px] font-black text-white truncate max-w-[150px]">
                        Shroud - Valorant Ranked
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-neutral-300 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      <Eye className="w-2.5 h-2.5" />
                      <span>2.2K</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Stream 2 */}
              <div className="relative rounded-xl overflow-hidden bg-black/50 border border-white/[0.06] group cursor-pointer">
                <div className="relative h-20 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80"
                    alt="Ninja stream"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-75"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-600 text-white">
                      ● LIVE
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-600/80 text-white">
                      LIVE
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60"
                        alt="Ninja"
                        className="w-5 h-5 rounded-full border border-white/50 object-cover"
                      />
                      <span className="text-[11px] font-black text-white truncate max-w-[150px]">
                        Ninja - Fortnite
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-neutral-300 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      <Eye className="w-2.5 h-2.5" />
                      <span>1.2K</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* WIDGET 3 (RIGHT): TOP PLAYERS (Ranked 1 to 5 with Score Badges)    */}
        {/* =================================================================== */}
        <div className="bg-[#0b101c] rounded-2xl border border-white/[0.07] p-5 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-300 pb-3 border-b border-white/[0.06] mb-3">
              TOP PLAYERS
            </h3>

            <div className="space-y-2">
              {[
                {
                  rank: 1,
                  name: 'Blazeflluoner',
                  sub: '15 Players',
                  score: '126K',
                  avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=60',
                },
                {
                  rank: 2,
                  name: 'Bessonics',
                  sub: '2 Players',
                  score: '650',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60',
                },
                {
                  rank: 3,
                  name: 'Ninja',
                  sub: '3 Players',
                  score: '260',
                  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60',
                },
                {
                  rank: 4,
                  name: 'Geontick',
                  sub: '2 Players',
                  score: '205',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60',
                },
                {
                  rank: 5,
                  name: 'Gema',
                  sub: '3 Players',
                  score: '190',
                  avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=60',
                },
              ].map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between p-1.5 rounded-xl hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 text-xs font-bold text-neutral-400">
                      {player.rank}
                    </span>
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">
                        {player.name}
                      </p>
                      <p className="text-[9px] text-neutral-400">
                        {player.sub}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white">
                    {player.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
