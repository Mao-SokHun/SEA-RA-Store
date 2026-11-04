'use client';

import React from 'react';
import { MessageSquare, ChevronLeft, ChevronRight, ChevronRight as ArrowLink, Eye } from 'lucide-react';

const forumPosts = [
  {
    id: 1,
    title: 'Shadowfall Guild Recruitment',
    guild: 'Shadowfall Guild',
    posts: '1 new post',
    time: '1 hours ago',
  },
  {
    id: 2,
    title: 'Patch 1.2 Discussion',
    guild: 'Shadowfall Guild',
    posts: '1 new post',
    time: '1 day ago',
  },
  {
    id: 3,
    title: 'Shadowfall Build Recruitment',
    guild: 'Shadowfall Guild',
    posts: '1 new post',
    time: '1 day ago',
  },
];

const liveStreams = [
  {
    id: 1,
    title: 'Shroud - Valorant Ranked',
    game: 'Shroud • Valorant',
    viewers: '3.2K',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=160&h=100&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Ninja - Fortnite',
    game: 'Ninja • Fortnite',
    viewers: '1.2K',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=100&fit=crop&q=80',
  },
];

const topPlayers = [
  { rank: 1, name: 'BlazeRunner', sub: '5 Players', score: '135K', badge: 'bg-[#FFB800] text-black font-black' },
  { rank: 2, name: 'Descanics', sub: '2 Players', score: '550', badge: 'bg-[#94A3B8] text-black font-black' },
  { rank: 3, name: 'Ninja', sub: '3 Players', score: '250', badge: 'bg-[#CD7F32] text-white font-black' },
  { rank: 4, name: 'GeonStick', sub: '3 Players', score: '205', badge: 'bg-[#152248] text-[#7F92B0]' },
  { rank: 5, name: 'Game', sub: '3 Players', score: '190', badge: 'bg-[#152248] text-[#7F92B0]' },
];

export default function CommunityHub() {
  return (
    <section id="community" className="py-6 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 select-none">
      
      {/* ── Section Header (COMMUNITY HUB in Mockup) ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-wider uppercase">
          COMMUNITY HUB
        </h2>

        {/* Header Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Previous community item"
            className="w-7 h-7 rounded-md bg-[#0A1026] border border-[#16244C] hover:border-[#00A3FF] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            aria-label="Next community item"
            className="w-7 h-7 rounded-md bg-[#0A1026] border border-[#16244C] hover:border-[#00A3FF] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 3 Column Panels Matching Mockup 100% ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* ── Box 1: RECENT FORUM POSTS ── */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0A1026] border border-[#152248] flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-black text-xs sm:text-[13px] text-white tracking-wider uppercase mb-4">
              RECENT FORUM POSTS
            </h3>

            <div className="space-y-4">
              {forumPosts.map((post) => (
                <div
                  key={post.id}
                  className="group cursor-pointer flex items-start gap-3 hover:opacity-90 transition-opacity"
                >
                  {/* Circular chat bubble icon */}
                  <div className="w-8 h-8 rounded-full bg-[#081026] border border-[#1A2A54] flex items-center justify-center text-[#7F92B0] shrink-0 group-hover:border-[#00A3FF] group-hover:text-[#00A3FF] transition-all">
                    <MessageSquare size={13} />
                  </div>

                  {/* Post details */}
                  <div className="leading-tight overflow-hidden">
                    <h4 className="font-heading font-bold text-xs text-white group-hover:text-[#00A3FF] transition-colors truncate">
                      {post.title}
                    </h4>
                    <p className="text-[10px] text-[#5A6E8D] mt-1 truncate">
                      <span>{post.guild}</span>
                      <span className="mx-1">•</span>
                      <span>{post.posts}</span>
                      <span className="mx-1">•</span>
                      <span>{post.time}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Box 2: LIVE STREAM ── */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0A1026] border border-[#152248] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-black text-xs sm:text-[13px] text-white tracking-wider uppercase">
                LIVE STREAM
              </h3>
              <ArrowLink size={14} className="text-[#00A3FF] cursor-pointer hover:translate-x-0.5 transition-transform" />
            </div>

            <div className="space-y-3.5">
              {liveStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="group cursor-pointer flex items-center gap-3 p-2 rounded-lg hover:bg-[#070D1F] border border-transparent hover:border-[#152248] transition-all"
                >
                  {/* Streamer Avatar with Live Glow */}
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-[#1A2A54] shrink-0 group-hover:border-[#00A3FF] transition-colors shadow-md">
                    <img
                      src={stream.avatar}
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-red-600 text-[8px] font-heading font-black text-white uppercase leading-none">
                      LIVE
                    </div>
                  </div>

                  {/* Stream Details */}
                  <div className="flex-1 overflow-hidden leading-tight">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-xs text-white group-hover:text-[#00A3FF] transition-colors truncate">
                        {stream.title}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-heading font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 shrink-0 ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[10px] text-[#7F92B0]">
                      <span className="truncate">{stream.game}</span>
                      <span className="flex items-center gap-1 text-[#00F2FE] shrink-0 font-mono">
                        <Eye size={10} />
                        {stream.viewers}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Box 3: TOP PLAYERS (Leaderboard) ── */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0A1026] border border-[#152248] flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-black text-xs sm:text-[13px] text-white tracking-wider uppercase mb-4">
              TOP PLAYERS
            </h3>

            <div className="space-y-2.5">
              {topPlayers.map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between py-1 border-b border-[#0F1836] last:border-none"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Rank Badge */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${player.badge}`}
                    >
                      {player.rank}
                    </div>

                    {/* Player Info */}
                    <div className="leading-tight truncate">
                      <p className="font-heading font-bold text-xs text-white truncate">
                        {player.name}
                      </p>
                      <p className="text-[10px] text-[#5A6E8D] mt-0.5">
                        {player.sub}
                      </p>
                    </div>
                  </div>

                  {/* Player Score */}
                  <span className="font-heading font-bold text-xs text-white shrink-0 font-mono">
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
