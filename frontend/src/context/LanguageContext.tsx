'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'kh';

interface Translations {
  [key: string]: {
    en: string;
    kh: string;
  };
}

export const translations: Translations = {
  // Navigation
  brandSub: { en: 'Safe Game Account Marketplace', kh: 'ផ្សារទិញ-លក់គណនីហ្គេមសុវត្ថិភាព' },
  navCatalog: { en: 'Buy Accounts', kh: 'ទិញគណនី' },
  navTopUp: { en: 'Top Up Game', kh: 'បញ្ចូលលុយហ្គេម' },
  navSell: { en: 'Sell Account', kh: 'ដាក់លក់គណនី' },
  navHowItWorks: { en: 'How It Works', kh: 'របៀបទិញ-លក់' },
  navWarranty: { en: 'Warranty', kh: 'ការធានារ៉ាប់រង' },
  navEscrow: { en: 'Escrow Protocol', kh: 'ប្រព័ន្ធ Escrow' },
  navVip: { en: 'VIP Whale OTC', kh: 'បន្ទប់ VIP Whale' },
  navProof: { en: 'Proof of Reserves', kh: 'តម្លាភាពមូលនិធិ' },
  navOrders: { en: 'My Orders', kh: 'ការបញ្ជាទិញ' },
  navAdmin: { en: 'Admin Desk', kh: 'ផ្ទាំង Admin' },
  navSignIn: { en: 'Sign In', kh: 'ចូលប្រើ' },
  navGetStarted: { en: 'Sign Up', kh: 'ចុះឈ្មោះ' },
  navSignOut: { en: 'Sign Out', kh: 'ចាកចេញ' },
  navWalletVault: { en: 'WALLET', kh: 'កាបូបប្រាក់' },
  navSupport: { en: 'Telegram Support', kh: 'ជំនួយ Telegram' },
  selectLanguage: { en: 'Select Language', kh: 'ជ្រើសរើសភាសា' },
  languageKhmer: { en: 'ភាសាខ្មែរ (Khmer)', kh: 'ភាសាខ្មែរ (Khmer)' },
  languageEnglish: { en: 'English (English)', kh: 'English (English)' },

  // Hero Section
  heroBadge1: { en: '#1 GAMING MARKETPLACE', kh: 'ផ្សារគណនីហ្គេមឈានមុខគេ' },
  heroBadge2: { en: '100% SAFE & VERIFIED', kh: 'សុវត្ថិភាព & ធានា ១០០%' },
  heroTitlePrefix: { en: 'BUY & SELL', kh: 'ផ្សារទិញ-លក់' },
  heroTitleElite: { en: 'GAME ACCOUNTS', kh: 'គណនីហ្គេម' },
  heroTitleMid: { en: 'WITH', kh: 'សុវត្ថិភាព និង' },
  heroTitleZeroRisk: { en: '100% PROTECTION', kh: 'រហ័សបំផុត' },
  heroSubtitle: {
    en: 'The safest marketplace to buy and sell Roblox, Mobile Legends, Free Fire, PUBG Mobile, and Valorant accounts. Instant delivery, KHQR payments, and 100% anti-scam escrow guarantee.',
    kh: 'វេទិកាដែលទុកចិត្តបំផុតសម្រាប់ទិញ-លក់គណនី Roblox, Mobile Legends, Free Fire, PUBG Mobile និង Valorant។ ទទួលគណនីភ្លាមៗ បង់ប្រាក់តាម KHQR និងធានាមិនបាត់គណនី ១០០%។',
  },
  ctaExplore: { en: 'BROWSE ACCOUNTS', kh: 'ចូលមើលគណនីទាំងអស់' },
  ctaListAsset: { en: 'SELL AN ACCOUNT', kh: 'ដាក់លក់គណនីរបស់អ្នក' },
  ctaTelegram: { en: 'TELEGRAM SUPPORT', kh: 'ទាក់ទងជំនួយ TELEGRAM' },
  slaInstant: { en: 'Instant Delivery', kh: 'ផ្ទេរគណនីរហ័ស' },
  slaInstantSub: { en: 'Credentials in < 3s', kh: 'ទទួលលេខកូដក្នុង ៣វិនាទី' },
  slaBonds: { en: 'Bakong KHQR', kh: 'បង់ប្រាក់តាម KHQR' },
  slaBondsSub: { en: 'ABA, Wing & Bakong', kh: 'គាំទ្រគ្រប់ធនាគារ' },
  slaAntiRecall: { en: '100% Anti-Recall', kh: 'ធានាមិនបាត់គណនី' },
  slaAntiRecallSub: { en: 'Full Escrow Guarantee', kh: 'ធានាសងប្រាក់វិញ ១០០%' },

  // How It Works Section
  howItWorksTitle: { en: 'How NEXUS Works', kh: 'របៀបទិញ-លក់លើ NEXUS' },
  howItWorksSubtitle: {
    en: 'Simple, fast, and 100% scam-free gaming transactions in 3 easy steps.',
    kh: 'ងាយស្រួល រហ័ស និងមានសុវត្ថិភាពខ្ពស់ គ្មានការបោកប្រាស់ ត្រឹមតែ ៣ ជំហានប៉ុណ្ណោះ។',
  },
  tabBuyer: { en: 'How to Buy (3 Steps)', kh: 'របៀបទិញគណនី (៣ ជំហាន)' },
  tabSeller: { en: 'How to Sell (3 Steps)', kh: 'របៀបដាក់លក់ (៣ ជំហាន)' },
  buyStep1Title: { en: '1. Choose Your Account', kh: '១. ជ្រើសរើសគណនីដែលពេញចិត្ត' },
  buyStep1Desc: {
    en: 'Browse Roblox (Blox Fruits), MLBB, Free Fire, PUBG, or Valorant with verified skins, ranks, and transparent pricing.',
    kh: 'ស្វែងរកហ្គេម Roblox (Blox Fruits), MLBB, Free Fire, PUBG ឬ Valorant ជាមួយ Skin និង Rank តាមតម្រូវការរបស់អ្នក។',
  },
  buyStep2Title: { en: '2. Scan & Pay via KHQR', kh: '២. ស្កេនបង់ប្រាក់តាម KHQR' },
  buyStep2Desc: {
    en: 'Pay safely with any Cambodian bank (ABA, Bakong). Your money is protected in Escrow until confirmed.',
    kh: 'បង់ប្រាក់តាម ABA, Bakong... ប្រាក់របស់អ្នកត្រូវបានរក្សាទុកដោយសុវត្ថិភាពក្នុង Escrow មិនខ្លាចបោក។',
  },
  buyStep3Title: { en: '3. Instant Credentials Reveal', kh: '៣. ទទួលព័ត៌មានគណនីភ្លាមៗ' },
  buyStep3Desc: {
    en: 'Get login details within seconds. Change password safely with 100% anti-recall money back warranty.',
    kh: 'ទទួល Email និង Password ភ្លាមៗ អាចប្តូរលេខសម្ងាត់បាន និងមានការធានាសងលុយវិញ ១០០%។',
  },
  sellStep1Title: { en: '1. List Your Account Details', kh: '១. បញ្ចូលព័ត៌មានគណនី' },
  sellStep1Desc: {
    en: 'Select your game, set rank, upload screenshots, and choose your price.',
    kh: 'ជ្រើសរើសហ្គេម បញ្ចូល Rank ដាក់រូបភាព និងកំណត់តម្លៃដែលអ្នកចង់លក់។',
  },
  sellStep2Title: { en: '2. Safe Escrow Protection', kh: '២. ប្រព័ន្ធការពារ Escrow' },
  sellStep2Desc: {
    en: 'The system locks buyer payment first before you deliver account access. Zero risk of non-payment.',
    kh: 'ប្រព័ន្ធនឹងទទួល និងរក្សាទុកប្រាក់ពីអ្នកទិញមុនពេលផ្ទេរគណនី ធានាមិនបារម្ភរឿងគេបោក។',
  },
  sellStep3Title: { en: '3. Instant Bank Payout', kh: '៣. ដកប្រាក់ចូលធនាគារភ្លាមៗ' },
  sellStep3Desc: {
    en: 'Withdraw your earnings straight to your Cambodian bank account anytime with fast approval.',
    kh: 'ដកប្រាក់ចំណូលចូលគណនីធនាគារក្នុងស្រុករបស់អ្នកបានភ្លាមៗគ្រប់ពេលវេលា។',
  },

  // Popular Games Grid
  topGamesTitle: { en: 'Popular Games', kh: 'ប្រភេទហ្គេមពេញនិយម' },
  topGamesSubtitle: {
    en: 'Select your game to find verified accounts ready for instant delivery',
    kh: 'ជ្រើសរើសហ្គេមដែលអ្នកចង់ទិញ ដើម្បីមើលគណនីដែលមានស្រាប់ភ្លាមៗ',
  },
  quickSearchPlaceholder: {
    en: 'Search games, skins, or ranks (e.g. Roblox Blox Fruits, MLBB Mythic, Free Fire, PUBG)...',
    kh: 'ស្វែងរកតាមឈ្មោះហ្គេម, Skin, ឬ Rank (ឧ. Roblox Blox Fruits, MLBB Mythic, Free Fire, PUBG...)...',
  },

  // Why Gamers Trust NEXUS
  whyTrustTitle: { en: 'Why Gamers Trust NEXUS', kh: 'ហេតុអ្វីត្រូវជ្រើសរើស NEXUS?' },
  whyTrustSubtitle: {
    en: 'Built specifically for Cambodian gamers with real safety guarantees and zero scam tolerance.',
    kh: 'បង្កើតឡើងសម្រាប់អ្នកលេងហ្គេមនៅកម្ពុជា ជាមួយការធានាសុវត្ថិភាពពិតប្រាកដ ១០០% គ្មានការបោកប្រាស់។',
  },
  trust1Title: { en: '100% Escrow Protection', kh: 'ប្រព័ន្ធ Escrow ការពារ ១០០%' },
  trust1Desc: {
    en: 'Sellers do not receive your money until you login, verify credentials, and confirm satisfaction.',
    kh: 'អ្នកលក់មិនទាន់ទទួលបានប្រាក់ទេ រហូតដល់អ្នកបានចូលលេង និងពិនិត្យគណនីត្រឹមត្រូវរួចរាល់។',
  },
  trust2Title: { en: 'Instant Delivery < 3 Seconds', kh: 'ផ្ទេរស្វ័យប្រវត្តិក្នង ៣ វិនាទី' },
  trust2Desc: {
    en: 'Accounts marked Instant Delivery automatically reveal credentials right after payment.',
    kh: 'សម្រាប់គណនី Instant Delivery អ្នកនឹងទទួលបាន Email និង Password ភ្លាមៗក្រោយពេលស្កេនបង់ប្រាក់។',
  },
  trust3Title: { en: 'Bakong KHQR - Zero Fees', kh: 'ទូទាត់ងាយស្រួលតាម KHQR' },
  trust3Desc: {
    en: 'Scan and pay directly using ABA Mobile, Wing, ACLEDA, or any local bank app with 0% extra fee.',
    kh: 'ស្កេនបង់ប្រាក់តាម ABA Mobile, Wing, ACLEDA ឬធនាគារក្នុងស្រុកណាមួយ ដោយឥតគិតថ្លៃសេវា។',
  },
  trust4Title: { en: '24/7 Dedicated Support', kh: 'ជំនួយ ២៤/៧ តាម Telegram' },
  trust4Desc: {
    en: 'Our admin team is always active on Telegram to assist you with trades, questions, or disputes.',
    kh: 'មានចម្ងល់ ឬត្រូវការជំនួយ? ក្រុមការងារ Admin របស់យើងរង់ចាំជួយសម្របសម្រួលជានិច្ចតាម Telegram។',
  },

  // Metrics Ticker
  metricVolume: { en: 'Protected Trading Volume', kh: 'ទំហំទឹកប្រាក់ត្រូវបានការពារ' },
  metricRooms: { en: 'Active Trades', kh: 'ការជួញដូរកំពុងដំណើរការ' },
  metricDecryptions: { en: 'Successful Orders', kh: 'គណនីបានលក់ជោគជ័យ' },
  metricRecallRate: { en: 'Success Satisfaction Rate', kh: 'អត្រាពេញចិត្តរបស់អតិថិជន' },

  // Catalog & Cards
  catalogTitle: { en: 'Verified Account Catalog', kh: 'កាតាឡុកគណនីហ្គេមសុវត្ថិភាព' },
  catalogSubtitle: { en: 'Explore verified accounts with full escrow protection and instant delivery.', kh: 'រុករកគណនីដែលបានផ្ទៀងផ្ទាត់ត្រឹមត្រូវ ជាមួយការធានា Escrow និងការប្រគល់ជូនភ្លាមៗ។' },
  allGames: { en: 'All Games', kh: 'ហ្គេមទាំងអស់' },
  searchPlaceholder: { en: 'Search skins, titles, ranks (e.g. Blox Fruits, Kuronami, Radiant, Mythic)...', kh: 'ស្វែងរក Skins, ចំណងជើង, Rank (ឧ. Blox Fruits, Kuronami, Radiant, Mythic)...' },
  cleanFirstMail: { en: 'Clean First-Mail', kh: 'អ៊ីមែលដើមបង្កើតដំបូង' },
  changeableBinds: { en: 'Changeable Binds', kh: 'អាចប្តូរព័ត៌មានបាន' },
  instantDelivery: { en: 'Instant Auto-Delivery', kh: 'ទទួលគណនីភ្លាមៗ' },
  escrowChat: { en: 'Seller Handover', kh: 'អ្នកលក់ផ្ទេរផ្ទាល់' },
  buyButton: { en: 'BUY NOW', kh: 'ទិញភ្លាមៗ' },
  inspectButton: { en: 'View Details', kh: 'មើលលម្អិត' },
  priceTag: { en: 'Price', kh: 'តម្លៃ' },
  sortNewest: { en: 'Sort: Newest Listed', kh: 'តម្រៀប: ទើបដាក់លក់ថ្មី' },
  sortPriceAsc: { en: 'Price: Low to High', kh: 'តម្លៃ: ពីទាបទៅខ្ពស់' },
  sortPriceDesc: { en: 'Price: High to Low', kh: 'តម្លៃ: ពីខ្ពស់ទៅទាប' },
  sortEscrowScore: { en: 'Escrow Score: High to Low', kh: 'ពិន្ទុសុវត្ថិភាព: ខ្ពស់ទៅទាប' },
  filterPriceBudget: { en: 'Price Budget ($USD)', kh: 'ថវិកាតម្លៃ ($USD)' },
  filterDelivery: { en: 'Delivery Mechanism', kh: 'របៀបប្រគល់គណនី' },
  filterBindHealth: { en: 'Account Bind Health', kh: 'សុវត្ថិភាពការភ្ជាប់ Binds' },
  filterDeliveryAll: { en: 'All Delivery Types', kh: 'គ្រប់ប្រភេទការប្រគល់' },
  filterBindAll: { en: 'All Bind Types', kh: 'គ្រប់ប្រភេទ Bind' },
  filterCleanOnly: { en: 'Clean First Mail (OGO) Only', kh: 'តែអ៊ីមែលដើម OGO ប៉ុណ្ណោះ' },
  clearFilters: { en: 'Reset Filters', kh: 'កំណត់ឡើងវិញ' },
  showingResults: { en: 'Showing', kh: 'កំពុងបង្ហាញ' },
  verifiedAssets: { en: 'verified assets', kh: 'គណនីបានផ្ទៀងផ្ទាត់' },
  noAccountsFound: { en: 'No accounts match your current filter parameters.', kh: 'មិនមានគណនីត្រូវនឹងលក្ខខណ្ឌចម្រាញ់របស់អ្នកទេ។' },

  // Account Details (PDP)
  pdpBack: { en: 'Back to Catalog', kh: 'ត្រឡប់ទៅកាតាឡុក' },
  pdpInspecting: { en: 'Buyers Inspecting Now', kh: 'អ្នកទិញកំពុងពិនិត្យមើល' },
  pdpHandoverScore: { en: 'Handover Trust Score', kh: 'ពិន្ទុភាពជឿជាក់នៃការប្រគល់' },
  pdpSellerBonded: { en: 'Bonded Seller Collateral', kh: 'ប្រាក់ធានារបស់អ្នកលក់' },
  pdpAccountBindsHealth: { en: 'Account Bind Health Matrix', kh: 'តារាងត្រួតពិនិត្យសុវត្ថិភាព Binds' },
  pdpOriginalMail: { en: 'Original Email (OGO)', kh: 'អ៊ីមែលដើមបង្កើតដំបូង (OGO)' },
  pdpPhoneLinked: { en: 'Phone Binding', kh: 'ការភ្ជាប់លេខទូរស័ព្ទ' },
  pdpTwoFactor: { en: '2-Factor Authentication', kh: 'ប្រព័ន្ធសុវត្ថិភាព ២ ជាន់' },
  pdpCleanNoRecovery: { en: 'Clean - Transferred to buyer without recovery strikes', kh: 'សុវត្ថិភាព - ផ្ទេរទៅអ្នកទិញដោយគ្មានការជាប់ពាក់ព័ន្ធ' },
  pdpUnlinked: { en: 'Unlinked / Clean slate ready', kh: 'មិនទាន់ភ្ជាប់ / ស្អាតស្អំ ១០០%' },
  pdpTransferReady: { en: 'Ready to configure on buyer device', kh: 'រួចរាល់សម្រាប់កំណត់លើទូរស័ព្ទអ្នកទិញ' },
  pdpSelectWarranty: { en: 'Select Warranty Protection Plan', kh: 'ជ្រើសរើសគម្រោងធានារ៉ាប់រង' },
  pdpWarrantyStandard: { en: 'Standard 30-Day Escrow Warranty (Included)', kh: 'ការធានាស្តង់ដារ ៣០ ថ្ងៃ (រួមបញ្ចូលឥតគិតថ្លៃ)' },
  pdpWarrantyLifetime: { en: 'Lifetime Anti-Recall Protection (+10% Fee)', kh: 'ការធានារ៉ាប់រងពេញមួយជីវិត (+១០%)' },
  pdpProceedCheckout: { en: 'PROCEED TO SECURE CHECKOUT', kh: 'បន្តទៅកាន់ការទូទាត់ប្រាក់ប្រកបដោយសុវត្ថិភាព' },
  pdpInstantDecryptNotice: { en: 'Instant credential reveal upon payment confirmation via Redlock dual-custody.', kh: 'ដោះសោលេខសម្ងាត់ភ្លាមៗក្រោយពេលទូទាត់ប្រាក់ជោគជ័យតាមប្រព័ន្ធ Redlock Escrow។' },

  // Checkout & Bakong KHQR
  checkoutTitle: { en: 'Redlock Escrow Reservation Active', kh: 'ការកក់ទុកតាមប្រព័ន្ធ Redlock Escrow សកម្ម' },
  checkoutSubtitle: { en: 'This listing is reserved exclusively for you for 15 minutes. Complete payment before the timer expires.', kh: 'គណនីនេះត្រូវបានបម្រុងទុកសម្រាប់អ្នកផ្តាច់មុខរយៈពេល ១៥ នាទី។ សូមទូទាត់ប្រាក់មុនពេលម៉ោងផុតកំណត់។' },
  checkoutTimeRemaining: { en: 'Time Remaining to Complete Payment', kh: 'ពេលវេលានៅសល់សម្រាប់ការទូទាត់' },
  checkoutSummary: { en: 'Order Summary', kh: 'សេចក្តីសង្ខេបនៃការបញ្ជាទិញ' },
  checkoutBasePrice: { en: 'Account Base Price', kh: 'តម្លៃគណនីដើម' },
  checkoutEscrowFee: { en: 'Escrow Protection Fee (0% Buyer)', kh: 'សេវា Escrow (០% សម្រាប់អ្នកទិញ)' },
  checkoutTotalDue: { en: 'Total Amount Due', kh: 'ទឹកប្រាក់សរុបត្រូវបង់' },
  khqrScanTitle: { en: 'Scan & Pay with Bakong KHQR', kh: 'ស្កេនទូទាត់ជាមួយបាគង KHQR' },
  khqrScanDesc: { en: 'Open ABA Mobile, Wing Bank, ACLEDA mobile or any Cambodian banking app to scan.', kh: 'បើកកម្មវិធី ABA Mobile, Wing Bank, ACLEDA ឬធនាគារក្នុងប្រទេសកម្ពុជាណាមួយដើម្បីស្កេន។' },
  khqrSupportedBanks: { en: 'Supports 60+ Cambodian Financial Institutions', kh: 'គាំទ្រជាង ៦០ គ្រឹះស្ថានធនាគារនៅកម្ពុជា' },
  khqrAwaitingPayment: { en: 'Awaiting Bank Confirmation...', kh: 'កំពុងរង់ចាំការបញ្ជាក់ពីធនាគារ...' },
  walletBalance: { en: 'Available Wallet Balance', kh: 'សមតុល្យកាបូបដែលអាចប្រើបាន' },
  payWithWallet: { en: 'Pay from Nexus Wallet', kh: 'បង់ប្រាក់ពីកាបូប Nexus' },
  simulateTest: { en: 'Instant Test Simulation (Dev Sandbox)', kh: 'សាកល្បងបង់ប្រាក់ភ្លាមៗ (Dev Sandbox)' },
  simulatingNotice: { en: 'Click to simulate a real-time Bakong webhook payment confirmation.', kh: 'ចុចដើម្បីធ្វើតេស្តការទទួលប្រាក់តាមប្រព័ន្ធ Bakong Webhook ភ្លាមៗ។' },

  // Vault Decryption & Orders
  vaultDecryptedTitle: { en: 'Zero-Knowledge Credential Vault', kh: 'បន្ទប់សុវត្ថិភាពរក្សាទុកពាក្យសម្ងាត់' },
  vaultDecryptedSubtitle: { en: 'Encrypted via AES-256-GCM. Decrypted in-memory on your secure device.', kh: 'អ៊ិនគ្រីបតាមកម្រិត AES-256-GCM។ ដោះសោរក្នុងអង្គចងចាំនៃឧបករណ៍សុវត្ថិភាពរបស់អ្នក។' },
  revealPasswords: { en: 'Reveal Sensitive Passwords', kh: 'បង្ហាញលេខសម្ងាត់' },
  hidePasswords: { en: 'Hide Sensitive Passwords', kh: 'លាក់លេខសម្ងាត់' },
  copySuccess: { en: 'Copied to clipboard!', kh: 'បានចម្លងរួចរាល់!' },
  loginIdentifier: { en: 'Login / Username / Email', kh: 'ឈ្មោះគណនី / អ៊ីមែល' },
  loginPassword: { en: 'Account Password', kh: 'លេខសម្ងាត់គណនី' },
  emailPassword: { en: 'First-Mail (OGO) Password', kh: 'លេខសម្ងាត់អ៊ីមែលដើម (OGO)' },
  backupCodes: { en: '2FA Backup Recovery Codes', kh: 'កូដសង្គ្រោះសុវត្ថិភាព 2FA' },
  confirmReceived: { en: 'Release Escrow & Complete Order', kh: 'បញ្ជាក់ការទទួលបាន & ដោះលែងប្រាក់ Escrow' },
  raiseDispute: { en: 'Raise Escrow Dispute', kh: 'ប្តឹងតវ៉ា Escrow' },
  escrowRoomBtn: { en: 'Enter Live Escrow Room', kh: 'ចូលបន្ទប់ជជែក Escrow' },
  orderStatus: { en: 'Order Status', kh: 'ស្ថានភាពបញ្ជាទិញ' },
  orderDate: { en: 'Purchased On', kh: 'កាលបរិច្ឆេទបញ្ជាទិញ' },
  orderNumber: { en: 'Order Ref #', kh: 'លេខកូដបញ្ជាទិញ #' },
  ordersEmpty: { en: 'No orders found in your vault yet.', kh: 'មិនទាន់មានការបញ្ជាទិញក្នុងគណនីរបស់អ្នកនៅឡើយទេ។' },

  // Escrow Live Room
  escrowChatTitle: { en: 'Live Escrow Handover Room', kh: 'បន្ទប់ជជែកផ្ទេរគណនីផ្ទាល់ Escrow' },
  escrowChatDesc: { en: 'End-to-end encrypted channel between buyer, seller, and automated verification bots.', kh: 'បណ្តាញជជែកសុវត្ថិភាពរវាងអ្នកទិញ អ្នកលក់ និងប្រព័ន្ធត្រួតពិនិត្យស្វ័យប្រវត្តិ។' },
  escrowTypePlaceholder: { en: 'Type a message or paste bind verification code...', kh: 'វាយសារ ឬបញ្ចូលកូដផ្ទៀងផ្ទាត់...' },
  escrowSend: { en: 'Send', kh: 'ផ្ញើ' },
  escrowRules: { en: 'Escrow Handover Protocols', kh: 'បទបញ្ជាសុវត្ថិភាពក្នុងការផ្ទេរគណនី' },
  escrowRule1: { en: 'Do not share off-platform contact details (Telegram/Facebook).', kh: 'ហាមផ្ញើព័ត៌មានទំនាក់ទំនងក្រៅប្រព័ន្ធ (Telegram/Facebook)។' },
  escrowRule2: { en: 'Verify email ownership change before releasing escrow funds.', kh: 'សូមពិនិត្យការផ្លាស់ប្តូរអ៊ីមែលឱ្យរួចរាល់មុនចុចបញ្ជាក់ដោះលែងប្រាក់។' },
  escrowRule3: { en: 'Admin concierge can intervene within 120 seconds if needed.', kh: 'Admin អាចចូលជួយសម្របសម្រួលក្នុងរយៈពេល ១២០ វិនាទី។' },

  // Seller Studio
  sellerTitle: { en: 'Seller Studio: 5-Step Account Listing Wizard', kh: 'អ្នកជំនួយការដាក់លក់គណនី ៥ ជំហាន' },
  sellerSubtitle: { en: 'List your account with automated valuation, AES-256 zero-knowledge encryption, and instant payout upon sale.', kh: 'ដាក់លក់គណនីរបស់អ្នកជាមួយប្រព័ន្ធវាយតម្លៃស្វ័យប្រវត្តិ អ៊ិនគ្រីប AES-256 និងដកប្រាក់បានភ្លាមៗ។' },
  step1: { en: '1. Game & Title', kh: '១. ហ្គេម & ចំណងជើង' },
  step2: { en: '2. Rank & Attributes', kh: '២. កម្រិត Rank & ព័ត៌មាន' },
  step3: { en: '3. Bind Health Matrix', kh: '៣. ស្ថានភាព Binds' },
  step4: { en: '4. Pricing & Payout', kh: '៤. កំណត់តម្លៃ & ចំណូល' },
  step5: { en: '5. Encrypted Vault Credentials', kh: '៥. បញ្ចូលលេខសម្ងាត់ក្នុង Vault' },
  payoutPreview: { en: 'Your Estimated Net Wallet Payout', kh: 'ប្រាក់សុទ្ធដែលអ្នកនឹងទទួលបាន' },
  commissionNotice: { en: '10% platform commission deducted automatically upon successful escrow sale.', kh: 'កម្រៃសេវា 10% ត្រូវបានកាត់ស្វ័យប្រវត្តិនៅពេលបញ្ចប់ការលក់ជោគជ័យ។' },
  nextStep: { en: 'Next Step', kh: 'ជំហានបន្ទាប់' },
  prevStep: { en: 'Previous Step', kh: 'ត្រឡប់ក្រោយ' },
  submitListing: { en: 'PUBLISH TO ESCROW MARKETPLACE', kh: 'ផ្សាយដាក់លក់ក្នុងទីផ្សារ Escrow' },

  // Wallet
  walletTitle: { en: 'Sovereign Digital Asset Wallet', kh: 'កាបូបឌីជីថលសុវត្ថិភាព' },
  walletSubtitle: { en: 'Real-time ledger tracking platform earnings, escrow balances, and instant Cambodian bank payouts.', kh: 'តាមដានសមតុល្យប្រាក់ចំណូល ប្រាក់ Escrow និងការដកប្រាក់ចូលធនាគារកម្ពុជាភ្លាមៗ។' },
  walletTotalBal: { en: 'Total Portfolio Balance', kh: 'សមតុល្យសរុប' },
  walletEscrowLocked: { en: 'Funds in Escrow Custody', kh: 'ទឹកប្រាក់កំពុងស្ថិតក្នុង Escrow' },
  walletAvailable: { en: 'Available for Withdrawal', kh: 'ទឹកប្រាក់ដែលអាចដកបាន' },
  withdrawButton: { en: 'Withdraw Funds', kh: 'ដកប្រាក់ចេញ' },
  depositButton: { en: 'Deposit with KHQR', kh: 'បញ្ចូលប្រាក់តាម KHQR' },
  transactionsTitle: { en: 'Audited Transaction History', kh: 'ប្រវត្តិប្រតិបត្តិការដែលបានត្រួតពិនិត្យ' },
  txId: { en: 'Transaction ID', kh: 'លេខកូដប្រតិបត្តិការ' },
  txType: { en: 'Type', kh: 'ប្រភេទ' },
  txAmount: { en: 'Amount', kh: 'ចំនួនទឹកប្រាក់' },
  txStatus: { en: 'Status', kh: 'ស្ថានភាព' },
  txDate: { en: 'Date & Time', kh: 'កាលបរិច្ឆេទ' },
  withdrawModalTitle: { en: 'Request Payout to Cambodian Bank', kh: 'ស្នើសុំដកប្រាក់ចូលធនាគារក្នុងស្រុក' },
  withdrawBankSelect: { en: 'Choose Target Bank', kh: 'ជ្រើសរើសធនាគារទទួល' },
  withdrawAccountName: { en: 'Bank Account Holder Name', kh: 'ឈ្មោះម្ចាស់គណនីធនាគារ' },
  withdrawAccountNumber: { en: 'Account / Phone Number', kh: 'លេខគណនី ឬលេខទូរស័ព្ទ' },
  withdrawAmountLabel: { en: 'Withdrawal Amount ($USD)', kh: 'ចំនួនប្រាក់ត្រូវដក ($USD)' },
  confirmWithdrawal: { en: 'Confirm Payout Request', kh: 'បញ្ជាក់ការស្នើសុំដកប្រាក់' },
  cancelBtn: { en: 'Cancel', kh: 'បោះបង់' },

  // Warranty Portal
  warrantyHeroTitle: { en: 'Anti-Recall Sovereign Guarantee', kh: 'ការធានារ៉ាប់រងប្រឆាំងការលួចយកគណនីមកវិញ' },
  warrantyHeroDesc: { en: 'Instant 100% financial reimbursement backed by $1,000,000 reserve liquidity pool.', kh: 'សងប្រាក់ត្រឡប់មកវិញ 100% ភ្លាមៗ ធានាដោយមូលនិធិបម្រុង $1,000,000។' },
  fileClaimBtn: { en: 'FILE WARRANTY CLAIM', kh: 'ដាក់ពាក្យទាមទារសំណង' },
  emergencyLockoutBtn: { en: 'Trigger Emergency Lockout', kh: 'ចាក់សោបន្ទាន់បង្ការគ្រោះថ្នាក់' },
  warrantyFeature1Title: { en: '2-Hour Dispute Adjudication', kh: 'ដោះស្រាយវិវាទក្នុងរយៈពេល ២ ម៉ោង' },
  warrantyFeature1Desc: { en: 'Concierge agents review original creation receipts and IP logs to enforce immediate payouts.', kh: 'ក្រុមការងារជំនាញត្រួតពិនិត្យបង្កាន់ដៃដើម និងប្រវត្តិ IP ដើម្បីសងប្រាក់ភ្លាមៗ។' },
  warrantyFeature2Title: { en: 'Automated Account Lockout', kh: 'ចាក់សោគណនីស្វ័យប្រវត្តិ' },
  warrantyFeature2Desc: { en: 'Instant security signal sent to game publisher recovery systems upon confirmed unauthorized recall.', kh: 'ផ្ញើសញ្ញាសុវត្ថិភាពទៅកាន់ប្រព័ន្ធហ្គេមភ្លាមៗនៅពេលមានការលួចយកវិញដោយគ្មានការអនុញ្ញាត។' },
  warrantyFeature3Title: { en: 'Seller Bond Forfeiture', kh: 'ដកហូតប្រាក់តម្កល់របស់អ្នកលក់' },
  warrantyFeature3Desc: { en: 'Offending sellers forfeit their $2,000 security collateral, paid straight to the victim.', kh: 'អ្នកលក់ដែលលួចយកគណនីមកវិញ នឹងត្រូវរឹបអូសប្រាក់តម្កល់ $2,000 សងជូនជនរងគ្រោះ។' },

  // VIP Whale Desk
  vipHeroTitle: { en: 'VIP Whale Sanctuary & Private OTC Desk', kh: 'បន្ទប់ VIP Whale & ការទិញលក់ឯកជន OTC' },
  vipHeroDesc: { en: 'High-roller concierge brokerage for gaming assets valued at $1,000 to $50,000+.', kh: 'សេវាកម្មទិញលក់គណនីតម្លៃខ្ពស់ ចាប់ពី $1,000 ដល់លើសពី $50,000+។' },
  vipCustomSourcing: { en: 'Request Bespoke Sourcing', kh: 'ស្នើសុំស្វែងរកគណនីកម្រពិសេស' },
  vipLiveConcierge: { en: 'Speak to Private Broker', kh: 'ជជែកជាមួយអ្នកសម្របសម្រួលផ្ទាល់' },
  vipSla1Title: { en: '0% Public Fingerprint', kh: 'គ្មានដានជាសាធារណៈ' },
  vipSla1Desc: { en: 'Off-market private escrow transfers keeping whale identities completely anonymous.', kh: 'ការផ្ទេរគណនីជាសម្ងាត់ក្រៅទីផ្សារ រក្សាអនាមិក ១០០% សម្រាប់អតិថិជនលំដាប់ខ្ពស់។' },
  vipSla2Title: { en: 'Dedicated Legal Contract', kh: 'កិច្ចសន្យាផ្លូវច្បាប់រឹងមាំ' },
  vipSla2Desc: { en: 'Notarized bill of sale with binding anti-recall penalty clauses enforced internationally.', kh: 'កិច្ចសន្យាលក់មានការបញ្ជាក់ត្រឹមត្រូវ ជាមួយលក្ខខណ្ឌផាកពិន័យតឹងរ៉ឹងជាអន្តរជាតិ។' },
  vipSla3Title: { en: 'Direct Video Verification', kh: 'ផ្ទៀងផ្ទាត់ផ្ទាល់តាមវីដេអូ' },
  vipSla3Desc: { en: 'Live screenshare inventory auditing by senior cybersecurity engineers.', kh: 'ការត្រួតពិនិត្យបញ្ជី Skins និង Rank ផ្ទាល់តាមរយៈ Screenshare ដោយវិស្វករជំនាញ។' },

  // Proof of Reserves
  proofTitle: { en: 'Cryptographic Proof of Reserves', kh: 'តម្លាភាពមូលនិធិបម្រុង' },
  proofSubtitle: { en: 'Real-time on-chain and banking balance verification guaranteeing 100% backing of all client escrow balances.', kh: 'ការផ្ទៀងផ្ទាត់សមតុល្យមូលនិធិ និងធនាគារក្នុងពេលជាក់ស្តែង ធានាថវិកា ១០០% សម្រាប់រាល់ការទូទាត់។' },
  proofSolvency: { en: 'Current Solvency Ratio', kh: 'សមាមាត្រភាពរឹងមាំហិរញ្ញវត្ថុ' },
  proofTreasury: { en: 'Total Treasury Assets', kh: 'ទ្រព្យសកម្មក្នុងរតនាគារសរុប' },
  proofUserLiabilities: { en: 'Total User Escrow Balances', kh: 'សមតុល្យ Escrow របស់អ្នកប្រើប្រាស់' },

  // Admin Command Center
  adminTitle: { en: 'Concierge Command Center & SLA Desk', kh: 'ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល & សេវា SLA' },
  adminSubtitle: { en: 'Manage active escrow trades, audit dispute tickets, and approve banking withdrawals.', kh: 'គ្រប់គ្រងការទិញលក់ Escrow ដោះស្រាយពាក្យបណ្តឹង និងអនុម័តការដកប្រាក់ចូលធនាគារ។' },
  adminMetricsGmv: { en: 'Platform GMV (Volume)', kh: 'ទំហំជួញដូរសរុប (GMV)' },
  adminMetricsRevenue: { en: 'Net Escrow Fees Collected', kh: 'ចំណូលថ្លៃសេវា Escrow សរុប' },
  adminDisputesPending: { en: 'Active Dispute Cases', kh: 'ករណីវិវាទកំពុងដំណើរការ' },
  adminWithdrawalsPending: { en: 'Pending Bank Payouts', kh: 'ការស្នើសុំដកប្រាក់កំពុងរង់ចាំ' },
  adminApproveBtn: { en: 'Approve & Release', kh: 'អនុម័ត & ដោះលែងប្រាក់' },
  adminRejectBtn: { en: 'Reject', kh: 'បដិសេធ' },

  // Footer
  footerDesc: {
    en: 'Next-generation dual-custody escrow marketplace for vaulted high-tier game assets. Powered by zero-trust cryptography, Bakong KHQR, and guaranteed anti-recall insurance.',
    kh: 'ទីផ្សារ Escrow ជំនាន់ថ្មីសម្រាប់គណនីហ្គេមកម្រិតខ្ពស់។ ដំណើរការដោយបច្ចេកវិទ្យាសម្ងាត់កម្រិត Zero-Trust, ប្រព័ន្ធបាគង KHQR និងការធានារ៉ាប់រង ១០០%។',
  },
  footerPlatform: { en: 'Platform', kh: 'វេទិកា' },
  footerSecurity: { en: 'Security & Trust', kh: 'សុវត្ថិភាព & ទំនុកចិត្ត' },
  footerLegal: { en: 'Compliance & Legal', kh: 'ច្បាប់ & អនុលោមភាព' },
  footerRights: { en: 'All rights reserved. Dual-Custody Escrow Protocol V4.2.', kh: 'រក្សាសិទ្ធិគ្រប់យ៉ាង។ ប្រព័ន្ធ Dual-Custody Escrow Protocol V4.2។' },
  footerAuditedBy: { en: 'Security Audited & Penetration Tested', kh: 'បានត្រួតពិនិត្យ និងវាយតម្លៃសុវត្ថិភាពប្រព័ន្ធ' },

  // Top Up Game Section
  topUpNavBadge: { en: 'FAST & SAFE', kh: 'រហ័ស & សុវត្ថិភាព' },
  topUpPageTitle: { en: 'Direct Game Top Up', kh: 'បញ្ចូលលុយ / ពេជ្រ ចូលហ្គេមផ្ទាល់' },
  topUpPageSubtitle: {
    en: 'Instant Top Up for Roblox Robux, MLBB Diamonds, Free Fire, PUBG UC, Genshin & Valorant. Direct to your Game ID, scanned with Bakong KHQR.',
    kh: 'បញ្ចូល Robux, ពេជ្រ MLBB, Free Fire, PUBG UC, Genshin & Valorant ចូល ID ផ្ទាល់។ ទទួលភ្លាមៗក្នុង ៣ វិនាទី បង់ប្រាក់តាម Bakong KHQR ឬ Wallet។',
  },
  topUpStep1Title: { en: '1. Enter Game ID', kh: '១. បញ្ចូលលេខសម្គាល់ ID ហ្គេម' },
  topUpStep2Title: { en: '2. Select Denomination', kh: '២. ជ្រើសរើសកញ្ចប់ពេជ្រ / Robux' },
  topUpStep3Title: { en: '3. Instant Payment & Credit', kh: '៣. បង់ប្រាក់ & ចូលហ្គេមភ្លាមៗ' },
  topUpVerifyBtn: { en: 'Check Player ID', kh: 'ពិនិត្យមើល ID' },
  topUpVerifying: { en: 'Verifying...', kh: 'កំពុងពិនិត្យ...' },
  topUpVerifiedSuccess: { en: 'Account Verified', kh: 'គណនីត្រឹមត្រូវ' },
  topUpSelectGame: { en: 'Select Game', kh: 'ជ្រើសរើសហ្គេម' },
  topUpGuideBtn: { en: 'Where to find ID?', kh: 'របៀបមើល ID?' },
  topUpOrderSummary: { en: 'Order Summary', kh: 'សេចក្ដីសង្ខេបការបញ្ជាទិញ' },
  topUpPayWithKHQR: { en: 'Pay via Bakong KHQR', kh: 'បង់តាម Bakong KHQR' },
  topUpPayWithWallet: { en: 'Pay with Wallet Balance', kh: 'បង់តាមកាបូបប្រាក់ NEXUS' },
  topUpInstantNotice: { en: '⚡ 100% Automatic In-Game Credit within 3-10 seconds after payment confirmation.', kh: '⚡ ប្រព័ន្ធបញ្ចូលលុយស្វ័យប្រវត្តិ ១០០% ចូលក្នុងហ្គេមក្នុងរង្វង់ ៣ ទៅ ១០ វិនាទីក្រោយបង់ប្រាក់។' },
  topUpSubmitBtn: { en: 'Top Up Now', kh: 'បញ្ចូលលុយឥឡូវនេះ' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('nexus_language') as Language;
    if (saved === 'kh' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language === 'kh' ? 'km' : 'en';
      if (language === 'kh') {
        document.documentElement.classList.add('font-kantumruy');
      } else {
        document.documentElement.classList.remove('font-kantumruy');
      }
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nexus_language', lang);
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[language] || item.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
