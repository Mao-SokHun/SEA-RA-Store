'use client';

import { Zap, ShieldCheck, QrCode, Headphones } from 'lucide-react';

const stats = [
  { value: '5M+',   label: 'អ្នកប្រើប្រាស់ជឿជាក់', icon: '👥' },
  { value: '200+',  label: 'ហ្គេមដែលគាំទ្រ',       icon: '🎮' },
  { value: '99.9%', label: 'អត្រាជោគជ័យ',         icon: '✅' },
  { value: '24/7',  label: 'ជំនួយការអតិថិជន',     icon: '🛡️' },
];

const features = [
  {
    icon: <Zap size={24} className="text-[#00a8ff]" fill="#00a8ff" />,
    iconBg: 'rgba(0,168,255,0.12)',
    iconBorder: 'rgba(0,168,255,0.3)',
    title: 'ចូលលឿនត្រឹម ៣ វិនាទី',
    desc: 'ប្រព័ន្ធ API ស្វ័យប្រវត្តិតភ្ជាប់ផ្ទាល់/កាត់ផ្ទាល់ចូលភ្លាម ID ភ្លាមៗ',
  },
  {
    icon: <ShieldCheck size={24} className="text-[#10b981]" />,
    iconBg: 'rgba(16,185,129,0.12)',
    iconBorder: 'rgba(16,185,129,0.3)',
    title: 'សុវត្ថិភាព ១០០% គ្មាន Password',
    desc: 'បញ្ចូលតែ User ID ឬ Player ID ប៉ុណ្ណោះ មិនប៉ះពាល់ Password ឬគណនីឡើយ។',
  },
  {
    icon: <QrCode size={24} className="text-[#ef4444]" />,
    iconBg: 'rgba(239,68,68,0.12)',
    iconBorder: 'rgba(239,68,68,0.3)',
    title: 'វេរតាម Bakong KHQR 0% ថ្លៃសេវា',
    desc: 'ឥតគិតថ្លៃសេវាជាមួយ ABA, Wing, ACLEDA, Canadia និងគ្រប់ធនាគារក្នុងស្រុក។',
  },
  {
    icon: <Headphones size={24} className="text-[#00a8ff]" />,
    iconBg: 'rgba(0,168,255,0.12)',
    iconBorder: 'rgba(0,168,255,0.3)',
    title: 'ក្រុមការងារជំនួយ ២៤/៧',
    desc: 'ក្រុមការងារឆ្លើយតបរហ័សរាល់ថ្ងៃ និងអតិថិជនរួសរាយ ការដោះស្រាយ ២៤ ម៉ោង។',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-14 bg-[#040b1a]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="text-center mb-10">
          <h2 className="font-km font-black text-2xl sm:text-3xl text-white mb-2">
            ហេតុអ្វីជ្រើសរើស{' '}
            <span className="font-en text-[#00a8ff]">GAMEVERSE?</span>
          </h2>
          <p className="font-km text-xs sm:text-sm text-[#8b9ab4]">
            សេវាកម្មបញ្ចូលទឹកប្រាក់ហ្គេមឈានមុខគេនៅកម្ពុជា ជាមួយសុវត្ថិភាពខ្ពស់ ១០០%
          </p>
        </div>

        {/* ── Feature Cards (4 in a row) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((feat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#0a1428] border border-[#1a335a] hover:border-[#00a8ff]/50 transition-all duration-300 flex flex-col gap-3.5 shadow-md hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,168,255,0.15)]"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: feat.iconBg,
                  border: `1px solid ${feat.iconBorder}`,
                }}
              >
                {feat.icon}
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-km font-bold text-white text-sm leading-snug mb-1.5">
                  {feat.title}
                </h3>
                <p className="font-km text-xs text-[#8b9ab4] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-xl bg-[#0a1428]/60 border border-[#1a335a]"
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <p className="font-en font-black text-2xl text-[#00a8ff] mb-0.5">{stat.value}</p>
              <p className="font-km text-[11px] text-[#5a6f90]">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
