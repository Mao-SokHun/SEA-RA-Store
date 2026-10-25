'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  CheckCircle2,
  Lock,
  Zap,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  AlertTriangle,
  Upload,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Game } from '@/types';

export default function SellAccountWizardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const [step, setStep] = useState(1);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Game & Server
    gameId: '',
    serverRegion: 'Global',

    // Step 2: Meta Details
    title: '',
    description: '',
    tierRank: '',
    deliveryType: 'instant' as 'instant' | 'manual',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',

    // Step 3: Bind Health
    bindProvider: 'moonton',
    bindType: 'clean' as 'clean' | 'changeable' | 'unchangeable',
    firstMailIncluded: true,

    // Step 4: Vault Credentials
    loginIdentifier: '',
    password: '',
    twoFactorSecret: '',
    recoveryEmail: '',
    recoveryEmailPassword: '',
    additionalNotes: '',

    // Step 5: Pricing
    price: 100,
  });

  useEffect(() => {
    async function fetchGames() {
      try {
        const list = await api.games.list();
        setGames(list || []);
        if (list?.length) {
          setFormData((prev) => ({ ...prev, gameId: list[0].id }));
        }
      } catch (err) {
        console.error('Error fetching games:', err);
      }
    }
    fetchGames();
  }, []);

  const platformFee = Number(formData.price) * 0.1;
  const sellerNetAmount = Number(formData.price) - platformFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const created = await api.accounts.create({
        gameId: formData.gameId,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        tierRank: formData.tierRank || 'Max Tier',
        serverRegion: formData.serverRegion,
        deliveryType: formData.deliveryType,
        firstMailIncluded: formData.firstMailIncluded,
        binds: [
          {
            provider: formData.bindProvider,
            bindType: formData.bindType,
            notes: formData.firstMailIncluded ? 'First-Mail Included' : '',
          },
        ],
        images: [{ imageUrl: formData.imageUrl, isCover: true }],
        credentials: {
          loginIdentifier: formData.loginIdentifier,
          password: formData.password,
          twoFactorSecret: formData.twoFactorSecret,
          recoveryEmail: formData.recoveryEmail,
          recoveryEmailPassword: formData.recoveryEmailPassword,
          additionalNotes: formData.additionalNotes,
        },
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        router.push(`/accounts/${created.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to list account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0b0e14] py-10 ${language === 'kh' ? 'font-kantumruy' : ''}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Wizard Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
            <span>
              {language === 'kh' ? `ជំហានទី ${step} នៃ ៥` : `Step ${step} of 5`}
            </span>
            <span className="text-[#f2ca50]">
              {step === 1 && (language === 'kh' ? '១. ហ្គេម & Server' : 'Game & Server')}
              {step === 2 && (language === 'kh' ? '២. ព័ត៌មានគណនី' : 'Account Details')}
              {step === 3 && (language === 'kh' ? '៣. ស្ថានភាព Binds' : 'Bind Health')}
              {step === 4 && (language === 'kh' ? '៤. លេខសម្ងាត់ Vault' : 'Encrypted Vault')}
              {step === 5 && (language === 'kh' ? '៥. កំណត់តម្លៃ & ចំណូល' : 'Pricing & Payout')}
            </span>
          </div>
          <div className="w-full bg-[#151a23] h-2 rounded-full overflow-hidden border border-white/[0.08]">
            <div
              className="bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#00e4f2] h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-6">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Form Container */}
        <div className="bg-[#151a23] p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-2xl space-y-6">
          {/* =========================================================================
              STEP 1: Game & Server Region
          ========================================================================== */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">
                  {language === 'kh' ? 'ជ្រើសរើសហ្គេម & Server' : 'Select Game & Server'}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {language === 'kh'
                    ? 'ជ្រើសរើសប្រភេទហ្គេម និងតំបន់ Server នៃគណនីដែលត្រូវដាក់លក់។'
                    : 'Choose the gaming title and geographical server region for this account.'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                    {language === 'kh' ? 'ឈ្មោះហ្គេម' : 'Gaming Title'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {games.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => setFormData({ ...formData, gameId: g.id })}
                        className={`p-3.5 rounded-xl border cursor-pointer text-center transition-all ${
                          formData.gameId === g.id
                            ? 'bg-[#1d222e] border-[#f2ca50] shadow-[0_0_15px_rgba(242,202,80,0.2)]'
                            : 'bg-[#0b0e14] border-white/[0.08] hover:border-white/[0.2]'
                        }`}
                      >
                        <span className="text-xs font-bold text-white block truncate">{g.title}</span>
                        <span className="text-[10px] text-neutral-500 uppercase">{g.platform}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                    {language === 'kh' ? 'តំបន់ Server' : 'Server / Region'}
                  </label>
                  <select
                    value={formData.serverRegion}
                    onChange={(e) => setFormData({ ...formData, serverRegion: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Global">Global</option>
                    <option value="Asia">Asia / SEA</option>
                    <option value="North America">North America (NA)</option>
                    <option value="Europe">Europe (EU)</option>
                    <option value="Cambodia">Cambodia Server</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2: Account Details & Rank
          ========================================================================== */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">
                  {language === 'kh' ? 'ព័ត៌មានលម្អិត & កម្រិត Rank' : 'Account Details & Rank'}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {language === 'kh'
                    ? 'បញ្ជាក់ចំណងជើងទាក់ទាញ កម្រិត Rank និងបញ្ជី Skins សំខាន់ៗ។'
                    : 'Highlight key skins, inventory values, and competitive tier.'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                    {language === 'kh' ? 'ចំណងជើងដាក់លក់' : 'Listing Title'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'kh' ? 'ឧ. Mythic Glory 120★ + 5 Collector Skins + អ៊ីមែលដើម OGO' : 'e.g. Mythic Immortal 120★ + 5 Collector Skins + Clean OGO'}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {language === 'kh' ? 'កម្រិត Rank / Tier' : 'Tier / Rank'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radiant, Mythic Glory, Conqueror"
                      value={formData.tierRank}
                      onChange={(e) => setFormData({ ...formData, tierRank: e.target.value })}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {t('filterDelivery')}
                    </label>
                    <select
                      value={formData.deliveryType}
                      onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value as any })}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      <option value="instant">{t('instantDelivery')} (&lt;3s)</option>
                      <option value="manual">{t('escrowChat')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                    {language === 'kh' ? 'ការពិពណ៌នាអំពី Skins & សមិទ្ធផល' : 'Inventory Description & Skin Highlights'}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={language === 'kh' ? 'រាយបញ្ជី Skins កម្រ, ចំនួន Hero, Win Rate...' : 'List all legendary skins, win rates, badges, hero count...'}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: Bind Health Matrix
          ========================================================================== */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">
                  {language === 'kh' ? 'សុវត្ថិភាព Bind គណនី' : 'Bind Health & Security'}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {language === 'kh'
                    ? 'ស្ថានភាព Bind ច្បាស់លាស់ ជួយបង្កើនការទុកចិត្តរបស់អ្នកទិញ និងជៀសវាងវិវាទ។'
                    : 'Accurate bind status guarantees high buyer trust and avoids disputes.'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                    {language === 'kh' ? 'ប្រភេទគណនីចម្បង' : 'Primary Account Provider'}
                  </label>
                  <select
                    value={formData.bindProvider}
                    onChange={(e) => setFormData({ ...formData, bindProvider: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="roblox">Roblox Account (User ID / Email)</option>
                    <option value="moonton">Moonton Account</option>
                    <option value="riot">Riot Games ID</option>
                    <option value="steam">Steam Account</option>
                    <option value="hoyoverse">Hoyoverse Account</option>
                    <option value="google">Google Play</option>
                    <option value="apple">Apple ID</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                    {language === 'kh' ? 'ស្ថានភាព Bind' : 'Bind Type Status'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                      onClick={() => setFormData({ ...formData, bindType: 'clean' })}
                      className={`p-3 rounded-xl border cursor-pointer text-center ${
                        formData.bindType === 'clean'
                          ? 'bg-[#1d222e] border-emerald-400 text-emerald-400'
                          : 'bg-[#0b0e14] border-white/[0.08] text-neutral-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">{t('cleanFirstMail')}</span>
                      <span className="text-[10px]">{language === 'kh' ? 'រួមបញ្ចូលអ៊ីមែលដើម' : 'First-mail included'}</span>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, bindType: 'changeable' })}
                      className={`p-3 rounded-xl border cursor-pointer text-center ${
                        formData.bindType === 'changeable'
                          ? 'bg-[#1d222e] border-[#00e4f2] text-[#00e4f2]'
                          : 'bg-[#0b0e14] border-white/[0.08] text-neutral-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">{t('changeableBinds')}</span>
                      <span className="text-[10px]">{language === 'kh' ? 'អ្នកទិញប្តូរអ៊ីមែលខ្លួនឯង' : 'Buyer binds own mail'}</span>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, bindType: 'unchangeable' })}
                      className={`p-3 rounded-xl border cursor-pointer text-center ${
                        formData.bindType === 'unchangeable'
                          ? 'bg-[#1d222e] border-amber-400 text-amber-400'
                          : 'bg-[#0b0e14] border-white/[0.08] text-neutral-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">
                        {language === 'kh' ? 'មិនអាចប្តូរបាន' : 'Unchangeable'}
                      </span>
                      <span className="text-[10px]">Dead / fixed bind</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0b0e14] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {t('cleanFirstMail')}
                    </span>
                    <span className="text-[11px] text-neutral-400 block">
                      {language === 'kh'
                        ? 'អ្នកទិញនឹងទទួលបានអ៊ីមែលបង្កើតដំបូងរួមជាមួយលេខសម្ងាត់។'
                        : 'Buyer receives the creation email with credentials.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.firstMailIncluded}
                    onChange={(e) => setFormData({ ...formData, firstMailIncluded: e.target.checked })}
                    className="w-5 h-5 accent-[#f2ca50] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 4: Zero-Knowledge Encrypted Vault
          ========================================================================== */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#f2ca50]" />
                  {t('vaultDecryptedTitle')}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {language === 'kh'
                    ? 'លេខសម្ងាត់ត្រូវបានអ៊ិនគ្រីប AES-256-GCM មុនពេលរក្សាទុក។ គ្មាននរណាម្នាក់អាចមើលឃើញរហូតដល់អ្នកទិញបង់ប្រាក់។'
                    : 'Credentials are encrypted client-side with AES-256-GCM. Passwords remain locked until escrow payment is secured.'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {t('loginIdentifier')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. player_one@game.com"
                      value={formData.loginIdentifier}
                      onChange={(e) => setFormData({ ...formData, loginIdentifier: e.target.value })}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {t('loginPassword')}
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {language === 'kh' ? 'អ៊ីមែលដើម OGO (ស្រេចចិត្ត)' : 'First-Mail (OGO) Address (Optional)'}
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ogo_mail@gmail.com"
                      value={formData.recoveryEmail}
                      onChange={(e) => setFormData({ ...formData, recoveryEmail: e.target.value })}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      {language === 'kh' ? 'លេខសម្ងាត់អ៊ីមែលដើម (ស្រេចចិត្ត)' : 'First-Mail Password (Optional)'}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={formData.recoveryEmailPassword}
                      onChange={(e) => setFormData({ ...formData, recoveryEmailPassword: e.target.value })}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                    {language === 'kh' ? 'ការណែនាំពិសេសសម្រាប់អ្នកទិញ' : 'Special Handover Instructions'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={language === 'kh' ? 'ឧ. កូដផ្ទៀងផ្ទាត់ផ្ញើទៅ WhatsApp... សូមកុំប្តូរតំបន់ក្នុងរយៈពេល ៧ ថ្ងៃ' : 'e.g. Verification code sent to WhatsApp: +855..., please do not change region for 7 days'}
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 5: Pricing & Payout Calculation
          ========================================================================== */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">
                  {language === 'kh' ? 'កំណត់តម្លៃ & គណនាប្រាក់ចំណូល' : 'Pricing & Payout Calculation'}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {t('commissionNotice')}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                    {language === 'kh' ? 'តម្លៃដាក់លក់ ($USD)' : 'Listing Price ($USD)'}
                  </label>
                  <div className="relative">
                    <DollarSign className="w-5 h-5 text-[#f2ca50] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="5"
                      max="10000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-[#0b0e14] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3.5 text-lg font-black text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Financial Ledger Breakdown */}
                <div className="p-5 rounded-2xl bg-[#0b0e14] border border-white/[0.08] space-y-3">
                  <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    {language === 'kh' ? 'តារាងសង្ខេបប្រាក់ចំណូល' : 'Settlement Ledger Preview'}
                  </h4>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>{language === 'kh' ? 'តម្លៃលក់សរុប' : 'Listing Buyer Price'}</span>
                    <span className="font-mono text-white font-bold">${Number(formData.price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>{language === 'kh' ? 'កម្រៃសេវាប្រព័ន្ធ (10%)' : 'Platform Commission (10%)'}</span>
                    <span className="font-mono text-rose-400">-${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-white/[0.08] flex justify-between text-sm font-bold">
                    <span className="text-neutral-200">{t('payoutPreview')}</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      ${sellerNetAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {language === 'kh'
                      ? 'ប្រាក់នឹងបញ្ចូលទៅកាបូបរបស់អ្នកភ្លាមៗ នៅពេលអ្នកទិញបញ្ជាក់ការទទួលបាន។'
                      : 'Funds will credit instantly to your Seller Wallet once the buyer confirms handover.'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0b0e14] text-neutral-300 hover:text-white border border-white/[0.08] flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('prevStep')}
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-md flex items-center gap-1.5"
              >
                {t('nextStep')}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#ffe088] via-[#d4af37] to-[#8f6b10] text-[#0b0e14] shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? (language === 'kh' ? 'កំពុងបញ្ចូលក្នុង Vault...' : 'Publishing to Vault...') : t('submitListing')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
