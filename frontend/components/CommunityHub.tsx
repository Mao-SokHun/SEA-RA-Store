'use client';

import { MessageCircle, Radio, Trophy, Clock, Eye } from 'lucide-react';

const forumPosts = [
  {
    id: 1,
    title: 'ML Diamond Top Up Flash Sale 50% OFF!',
    subtitle: 'GamersHub • 1 hour ago',
    icon: '💎',
  },
  {
    id: 2,
    title: 'Genshin Impact 5.0 Bundle Guide',
    subtitle: 'CrystalHub • 1 day ago',
    icon: '✨',
  },
  {
    id: 3,
    title: 'Free Fire New Season Top Up Rewards',
    subtitle: 'FFCommunity • 1 day ago',
    icon: '🔥',
  },
];

const liveStreams = [
  {
    id: 1,
    title: 'Top Up Tutorial – Mobile Legends',
    streamer: 'FastTopUp • Live Now',
    viewers: '3.2K',
    live: true,
    color: '#00a8ff',
    img: 'https://placehold.co/100x70/040b1a/00a8ff?text=LIVE',
  },
  {
    id: 2,
    title: 'Genshin Top Up Guide & Welkin',
    streamer: 'GenshinGuide • Live Now',
    viewers: '1.8K',
    live: true,
    color: '#10b981',
    img: 'https://placehold.co/100x70/040b1a/10b981?text=LIVE',
  },
  {
    id: 3,
    title: 'Free Fire Diamond Top Up Tips',
    streamer: 'FFPro • Replay',
    viewers: '2.4K',
    live: false,
    color: '#f97316',
    img: 'https://placehold.co/100x70/040b1a/f97316?text=VOD',
  },
];

const topBuyers = [
  { rank: 1, name: 'DiamondKing', amount: '189K', game: 'MLBB' },
  { rank: 2, name: 'CrystalMaster', amount: '950', game: 'Genshin' },
  { rank: 3, name: 'FFPro', amount: '250', game: 'Free Fire' },
  { rank: 4, name: 'UCBoss', amount: '205', game: 'PUBG' },
  { rank: 5, name: 'CPKing', amount: '180', game: 'COD' },
];

function RankBadge({ rank }: { rank: number }) {
  const cls = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
  return <span className={`rank-badge ${cls}`}>{rank}</span>;
}

export default function CommunityHub() {
  return (
    <section className="py-10" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl text-white section-title">🌐 COMMUNITY HUB</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Forum Posts */}
          <div className="card-game p-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle size={16} style={{ color: '#00a8ff' }} />
              <span className="font-bold text-sm text-white">RECENT FORUM POSTS</span>
            </div>
            <div className="space-y-3">
              {forumPosts.map((post) => (
                <div key={post.id} className="flex items-start gap-3 pb-3 cursor-pointer group" style={{ borderBottom: '1px solid #1a2a4a' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                       style={{ background: 'rgba(0,168,255,0.1)' }}>
                    {post.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors leading-tight">{post.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#4a5a7a' }}>{post.subtitle}</p>
                  </div>
                  <Clock size={12} className="ml-auto flex-shrink-0 mt-1" style={{ color: '#4a5a7a' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Live Streams */}
          <div className="card-game p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio size={16} style={{ color: '#ef4444' }} />
                <span className="font-bold text-sm text-white">LIVE STREAM</span>
              </div>
              <span className="text-xs" style={{ color: '#00a8ff' }}>View All &gt;</span>
            </div>
            <div className="space-y-3">
              {liveStreams.map((stream) => (
                <div key={stream.id} className="flex gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: '90px', height: '60px' }}>
                    <img src={stream.img} alt={stream.title} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1">
                      {stream.live ? (
                        <span className="badge-live" style={{ fontSize: '9px', padding: '1px 5px' }}>
                          <span className="live-dot" />LIVE
                        </span>
                      ) : (
                        <span className="text-white px-1 rounded text-xs" style={{ background: '#374151', fontSize: '9px' }}>VOD</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white leading-tight group-hover:text-blue-400 transition-colors">{stream.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#4a5a7a' }}>{stream.streamer}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Eye size={10} style={{ color: stream.color }} />
                      <span className="text-xs" style={{ color: stream.color }}>{stream.viewers}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Buyers */}
          <div className="card-game p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={16} style={{ color: '#facc15' }} />
              <span className="font-bold text-sm text-white">TOP BUYERS</span>
            </div>
            <div className="space-y-3">
              {topBuyers.map((buyer) => (
                <div key={buyer.rank} className="flex items-center gap-3">
                  <RankBadge rank={buyer.rank} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{buyer.name}</p>
                    <p className="text-xs" style={{ color: '#4a5a7a' }}>{buyer.game}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: '#facc15' }}>\${buyer.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

