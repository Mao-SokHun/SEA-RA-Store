'use client';

import { MessageSquare, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

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
    posts: '7 new post',
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
  { rank: 2, name: 'Oscurians', sub: '2 Players', score: '950', badge: 'bg-[#94A3B8] text-black font-black' },
  { rank: 3, name: 'Ninja', sub: '3 Players', score: '250', badge: 'bg-[#CD7F32] text-white font-black' },
  { rank: 4, name: 'Geonkick', sub: '3 Players', score: '205', badge: 'bg-[#152248] text-[#7F92B0]' },
  { rank: 5, name: 'Gama', sub: '3 Players', score: '190', badge: 'bg-[#152248] text-[#7F92B0]' },
];

export default function CommunityHub() {
  return (
    <section id="community" className="py-8 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">

      {/* ── Section Header (COMMUNITY HUB in Mockup) ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-en font-black text-lg sm:text-xl text-white tracking-wider uppercase">
          COMMUNITY HUB
        </h2>

        {/* Header Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Previous"
            className="w-7 h-7 rounded-md bg-[#0A1026] border border-[#16244C] hover:border-[#00A3FF] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            aria-label="Next"
            className="w-7 h-7 rounded-md bg-[#0A1026] border border-[#16244C] hover:border-[#00A3FF] text-[#7F92B0] hover:text-white flex items-center justify-center transition-all"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 3 Equal Box Panels Matching Mockup 100% ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* ── Box 1: RECENT FORUM POSTS ── */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0A1026] border border-[#152248] flex flex-col justify-between">
          <div>
            <h3 className="font-en font-black text-xs sm:text-[13px] text-white tracking-wider uppercase mb-4">
              RECENT FORUM POSTS
            </h3>

            <div className="space-y-4">
              {forumPosts.map((post) => (
                <div
                  key={post.id}
                  className="group cursor-pointer flex items-start gap-3 hover:opacity-90 transition-opacity"
                >
                  {/* Circular chat bubble icon */}
                  <div className="w-8 h-8 rounded-full bg-[#081026] border border-[#1A2A54] flex items-center justify-center text-[#7F92B0] flex-shrink-0 group-hover:border-[#00A3FF] group-hover:text-[#00A3FF] transition-all">
                    <MessageSquare size={13} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-en font-bold text-xs text-white group-hover:text-[#00A3FF] transition-colors truncate">
                      {post.title}
                    </h4>
                    <p className="font-en text-[11px] text-[#5A6E8D] mt-0.5">
                      {post.guild} • {post.posts}
                    </p>
                  </div>

                  <span className="font-en text-[10px] text-[#5A6E8D] whitespace-nowrap mt-0.5">
                    {post.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Box 2: LIVE STREAM ── */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0A1026] border border-[#152248] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-en font-black text-xs sm:text-[13px] text-white tracking-wider uppercase">
                LIVE STREAM
              </h3>
              <span className="font-en font-bold text-xs text-[#E63946] hover:underline cursor-pointer">
                &gt;
              </span>
            </div>

            <div className="space-y-3.5">
              {liveStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="group cursor-pointer flex items-center gap-3 p-1.5 rounded-lg hover:bg-[#00A3FF]/5 transition-all"
                >
                  {/* Streamer Avatar with Live Badge */}
                  <div className="relative w-14 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-[#E63946]/50">
                    <img
                      src={stream.avatar}
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-[#E63946] text-white text-[8px] font-black font-en px-1 rounded-sm uppercase tracking-wider">
                      LIVE
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-en font-bold text-xs text-white group-hover:text-[#00A3FF] transition-colors truncate">
                      {stream.title}
                    </h4>
                    <p className="font-en text-[11px] text-[#5A6E8D] mt-0.5 truncate">
                      {stream.game}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[#E63946] text-[11px] font-en font-bold flex-shrink-0">
                    <Eye size={12} />
                    <span>{stream.viewers}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Box 3: TOP PLAYERS ── */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0A1026] border border-[#152248] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-en font-black text-xs sm:text-[13px] text-white tracking-wider uppercase">
                TOP PLAYERS
              </h3>
            </div>

            <div className="space-y-2.5">
              {topPlayers.map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between p-1 px-1.5 rounded-lg hover:bg-[#00A3FF]/5 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Rank Circle Badge */}
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-en flex-shrink-0 ${player.badge}`}
                    >
                      {player.rank}
                    </span>

                    {/* Circular Avatar */}
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-[#1A2A54] flex-shrink-0">
                      <img
                        src={`https://images.unsplash.com/photo-${1570295999919 + player.rank * 100}?w=60&h=60&fit=crop&q=80`}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Player Info */}
                    <div className="flex flex-col min-w-0">
                      <span className="font-en font-bold text-xs text-white truncate leading-tight">
                        {player.name}
                      </span>
                      <span className="font-en text-[10px] text-[#5A6E8D] leading-tight">
                        {player.sub}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <span className="font-en font-bold text-xs text-white">
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
