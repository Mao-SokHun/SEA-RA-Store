'use client';

import { Zap, Globe, AtSign, PlaySquare, MessageCircle, Send, Heart } from 'lucide-react';

const footerLinks = {
  'Company': ['About Us', 'Careers', 'Legal', 'Press'],
  'Games': ['Mobile Legends', 'Genshin Impact', 'Free Fire', 'PUBG Mobile'],
  'Community': ['Forum', 'Discord', 'Blog', 'Support'],
  'Support': ['FAQ', 'Contact Us', 'Terms of Service', 'Privacy Policy'],
};

const socials = [
  { icon: <Globe size={18} />, label: 'Facebook', color: '#1877f2' },
  { icon: <AtSign size={18} />, label: 'Twitter/X', color: '#1da1f2' },
  { icon: <PlaySquare size={18} />, label: 'YouTube', color: '#ef4444' },
  { icon: <MessageCircle size={18} />, label: 'Discord', color: '#5865f2' },
  { icon: <Heart size={18} />, label: 'Instagram', color: '#e1306c' },
  { icon: <Send size={18} />, label: 'Telegram', color: '#26a5e4' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid #1a2a4a' }}>
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <Zap size={22} style={{ color: '#00a8ff' }} fill="#00a8ff" />
              <span className="font-black text-lg gradient-text tracking-wider">TOPUPVERSE</span>
            </div>
            <p className="text-xs leading-relaxed mb-5" style={{ color: '#4a5a7a' }}>
              The #1 Game Top Up Platform in Southeast Asia. Fast, safe, and affordable top ups for all your favorite games.
            </p>

            {/* Social icons */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-white mb-3">Social Media</p>
              <div className="flex items-center gap-2 flex-wrap">
                {socials.map((s) => (
                  <button
                    key={s.label}
                    title={s.label}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}30` }}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs font-bold text-white mb-3 uppercase tracking-wider">{category}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs transition-colors"
                      style={{ color: '#4a5a7a' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#00a8ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#4a5a7a')}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Subscribe */}
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid #1a2a4a' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white">Subscribe for updates!</p>
              <p className="text-xs" style={{ color: '#4a5a7a' }}>Get notified about flash sales and new game packages</p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="input-dark text-sm"
                style={{ width: '220px' }}
              />
              <button className="btn-topup" style={{ width: 'auto', padding: '10px 20px' }}>
                <Zap size={14} fill="white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderTop: '1px solid #1a2a4a' }}>
          <p className="text-xs" style={{ color: '#4a5a7a' }}>© 2025 TOPUPVERSE. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <Zap size={14} style={{ color: '#00a8ff' }} fill="#00a8ff" />
            <span className="font-black text-sm gradient-text">TOPUPVERSE</span>
          </div>
          <p className="text-xs" style={{ color: '#4a5a7a' }}>Powered by TopUpVerse Team</p>
        </div>
      </div>
    </footer>
  );
}
