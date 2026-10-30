'use client';

import { Zap, Shield, Clock, CreditCard, HeadphonesIcon, Star } from 'lucide-react';

const stats = [
  { value: '5M+', label: 'Happy Customers', icon: '👥' },
  { value: '200+', label: 'Games Supported', icon: '🎮' },
  { value: '99.9%', label: 'Success Rate', icon: '✅' },
  { value: '24/7', label: 'Support', icon: '🛡️' },
];

const features = [
  { icon: <Zap size={20} fill="#facc15" color="#facc15" />, title: 'Instant Delivery', desc: 'Top ups delivered in seconds after payment' },
  { icon: <Shield size={20} style={{ color: '#10b981' }} />, title: '100% Safe', desc: 'Secure transactions with buyer protection' },
  { icon: <CreditCard size={20} style={{ color: '#00a8ff' }} />, title: 'Multiple Payments', desc: 'ABA, ACLEDA, Wing, Visa, Mastercard, Crypto' },
  { icon: <Clock size={20} style={{ color: '#f97316' }} />, title: 'Best Price', desc: 'Guaranteed lowest price or we refund the difference' },
  { icon: <HeadphonesIcon size={20} style={{ color: '#8b5cf6' }} />, title: '24/7 Support', desc: 'Live chat support anytime you need help' },
  { icon: <Star size={20} style={{ color: '#facc15' }} fill="#facc15" />, title: 'Loyalty Rewards', desc: 'Earn points on every top up, redeem for discounts' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-xl" style={{ background: 'rgba(0,168,255,0.05)', border: '1px solid rgba(0,168,255,0.1)' }}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="font-black text-2xl gradient-text">{stat.value}</p>
              <p className="text-xs" style={{ color: '#4a5a7a' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Why choose us */}
        <div className="text-center mb-8">
          <h2 className="font-black text-2xl text-white mb-2">WHY CHOOSE <span className="gradient-text">TOPUPVERSE</span>?</h2>
          <p className="text-sm" style={{ color: '#4a5a7a' }}>The most trusted game top up platform in Southeast Asia</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <div key={i} className="card-game p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: 'rgba(0,168,255,0.1)' }}>
                {feat.icon}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">{feat.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#4a5a7a' }}>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

