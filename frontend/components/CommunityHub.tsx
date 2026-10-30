'use client';

import { MessageSquare, Radio, Trophy, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const forumPosts = [
  {
    id: 1,
    title: 'Shadowfall Guild Recruitment',
    guild: 'Shadowfall Guild',
    posts: '1 new post',
    time: '1 hour ago',
  },
  {
    id: 2,
    title: 'Patch 1.2 Discussion & Meta Changes',
    guild: 'Shadowfall Guild',
    posts: '1 new post',
    time: '1 day ago',
  },
  {
    id: 3,
    title: 'Best Character Builds for Season 5',
    guild: 'Shadowfall Guild',
    posts: '7 new post',
    time: '1 day ago',
  },
];

const liveStreams = [
  {
    id: 1,
    title: 'Shroud - Valorant Ranked Gameplay',
    streamer: 'Shroud',
    game: 'Valorant',
    viewers: '3.2K',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&h=120&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Ninja - Fortnite Duo Cash Cup',
    streamer: 'Ninja',
    game: 'Fortnite',
    viewers: '1.2K',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&q=80',
  },
];

const topPlayers = [
  { rank: 1, name: 'BlazeRunner', score: '135K', badgeBg: 'from-amber-400 to-yellow-500', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&q=80' },
  { rank: 2, name: 'Oscurians', score: '950', badgeBg: 'from-slate-300 to-slate-400', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80' },
  { rank: 3, name: 'Ninja', score: '250', badgeBg: 'from-amber-600 to-amber-700', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80' },
  { rank: 4, name: 'Geonkick', score: '205', badgeBg: 'bg-[#1a2a4a]', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80' },
  { rank: 5, name: 'Gama', score: '190', badgeBg: 'bg-[#1a2a4a]', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&h=80&fit=crop&q=80' },
];

export default function CommunityHub() {
  return (
    <section className="py-10 bg-[#040b1a]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header (COMMUNITY HUB in Reference) ── */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-en font-black text-lg sm:text-xl text-white tracking-wider uppercase">
            COMMUNITY HUB
          </h2>

          <div className="flex items-center gap-2">
            <button
              aria-label="Previous"
              className="w-8 h-8 rounded-lg bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff] text-[#8b9ab4] hover:text-white flex items-center justify-center transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              aria-label="Next"
              className="w-8 h-8 rounded-lg bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff] text-[#8b9ab4] hover:text-white flex items-center justify-center transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ── 3 Balanced Columns (Forum, Live Streams, Top Players) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* ── Column 1: RECENT FORUM POSTS ── */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1428] border border-[#1a335a] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a335a]">
                <MessageSquare size={16} className="text-[#00a8ff]" />
                <h3 className="font-en font-black text-sm text-white tracking-wider uppercase">
                  RECENT FORUM POSTS
                </h3>
              </div>

              <div className="space-y-3.5">
                {forumPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group cursor-pointer flex items-start gap-3 p-2 rounded-xl hover:bg-[#00a8ff]/5 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#040b1a] border border-[#1a335a] flex items-center justify-center text-[#00a8ff] flex-shrink-0 group-hover:border-[#00a8ff]/50">
                      <MessageSquare size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-en font-bold text-xs sm:text-sm text-white group-hover:text-[#00a8ff] transition-colors truncate">
                        {post.title}
                      </h4>
                      <p className="font-en text-[11px] text-[#5a6f90] mt-0.5">
                        {post.guild} • {post.posts}
                      </p>
                    </div>
                    <span className="font-en text-[10px] text-[#5a6f90] whitespace-nowrap mt-0.5">
                      {post.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-4 w-full py-2 rounded-xl bg-[#040b1a] border border-[#1a335a] hover:border-[#00a8ff] text-[#8b9ab4] hover:text-white font-en font-bold text-xs transition-all uppercase tracking-wider">
              VIEW ALL DISCUSSIONS
            </button>
          </div>

          {/* ── Column 2: LIVE STREAM ── */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1428] border border-[#1a335a] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1a335a]">
                <div className="flex items-center gap-2">
                  <Radio size={16} className="text-[#ef4444]" />
                  <h3 className="font-en font-black text-sm text-white tracking-wider uppercase">
                    LIVE STREAM
                  </h3>
                </div>
                <span className="text-xs font-en font-bold text-[#00a8ff] hover:underline cursor-pointer">
                  LIVE &gt;
                </span>
              </div>

              <div className="space-y-3.5">
                {liveStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="group cursor-pointer flex items-center gap-3 p-2 rounded-xl hover:bg-[#00a8ff]/5 transition-all"
                  >
                    {/* Streamer Avatar with Live Ring */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-[#ef4444]/60">
                      <img
                        src={stream.avatar}
                        alt={stream.streamer}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 left-0 right-0 bg-[#ef4444] text-white text-[8px] font-black font-en text-center uppercase tracking-wider py-0.5">
                        LIVE
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-en font-bold text-xs sm:text-sm text-white group-hover:text-[#00a8ff] transition-colors truncate">
                        {stream.title}
                      </h4>
                      <p className="font-en text-[11px] text-[#5a6f90] mt-0.5">
                        {stream.streamer} • {stream.game}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[#ef4444] text-xs font-en font-bold flex-shrink-0">
                      <Eye size={12} />
                      <span>{stream.viewers}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-4 w-full py-2 rounded-xl bg-[#040b1a] border border-[#1a335a] hover:border-[#00a8ff] text-[#8b9ab4] hover:text-white font-en font-bold text-xs transition-all uppercase tracking-wider">
              BROWSE ALL STREAMS
            </button>
          </div>

          {/* ── Column 3: TOP PLAYERS (or TOP BUYERS) ── */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1428] border border-[#1a335a] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a335a]">
                <Trophy size={16} className="text-[#facc15]" />
                <h3 className="font-en font-black text-sm text-white tracking-wider uppercase">
                  TOP PLAYERS
                </h3>
              </div>

              <div className="space-y-2.5">
                {topPlayers.map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center justify-between p-1.5 px-2 rounded-xl hover:bg-[#00a8ff]/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Number Badge */}
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black font-en ${
                          player.rank === 1
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-[0_0_10px_#facc15]'
                            : player.rank === 2
                            ? 'bg-slate-300 text-black'
                            : player.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-[#1a2a4a] text-[#8b9ab4]'
                        }`}
                      >
                        {player.rank}
                      </span>

                      {/* Avatar */}
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-[#1a335a]">
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Name */}
                      <span className="font-en font-bold text-xs sm:text-sm text-white">
                        {player.name}
                      </span>
                    </div>

                    {/* Score / Amount */}
                    <span className="font-en font-black text-xs text-[#00a8ff]">
                      {player.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-4 w-full py-2 rounded-xl bg-[#040b1a] border border-[#1a335a] hover:border-[#00a8ff] text-[#8b9ab4] hover:text-white font-en font-bold text-xs transition-all uppercase tracking-wider">
              VIEW LEADERBOARD
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
