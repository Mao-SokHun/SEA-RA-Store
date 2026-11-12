/**
 * NBC KHQR Official EMVCo Generator (Client-Side & Server-Side)
 * Compliant with National Bank of Cambodia (NBC) KHQR Specification Version 2.9
 */

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= (data.charCodeAt(i) & 0xff) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatTLV(tag: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${tag}${len}${value}`;
}

export interface GenerateKHQRParams {
  merchantName?: string;
  merchantCity?: string;
  bakongAccount?: string;
  amount: number;
  currency?: 'USD' | 'KHR';
  orderNumber?: string;
  storeLabel?: string;
}

/**
 * Generates an official EMVCo-compliant KHQR payload string.
 * This string format starts with "000201010212..." and is recognized
 * by all Cambodian banking applications (ABA, Wing, ACLEDA, Bakong).
 */
export function generateOfficialKHQRString({
  merchantName = 'SEA RA PRESTIGE',
  merchantCity = 'Phnom Penh',
  bakongAccount = 'searaprestige@abaa',
  amount,
  currency = 'USD',
  orderNumber = 'ORDER-001',
  storeLabel = 'OFFICIAL STORE',
}: GenerateKHQRParams): string {
  const currencyCode = currency === 'USD' ? '840' : '116';
  const formattedAmount = currency === 'USD' ? amount.toFixed(2) : Math.round(amount).toString();

  // Tag 29: Merchant Account Information
  const tag29 =
    formatTLV('00', 'bakong@nbc.gov.kh') +
    formatTLV('01', bakongAccount) +
    formatTLV('02', 'INDIVIDUAL');

  // Tag 62: Additional Data (Order Reference & Store Label)
  const tag62 =
    formatTLV('01', orderNumber.slice(0, 25)) +
    formatTLV('03', storeLabel.slice(0, 20));

  let payload = '';
  payload += formatTLV('00', '01'); // Payload Format Indicator (01)
  payload += formatTLV('01', '12'); // Point of Initiation Method (12 = Dynamic)
  payload += formatTLV('29', tag29); // Merchant Account Info
  payload += formatTLV('52', '5999'); // Merchant Category Code (General)
  payload += formatTLV('53', currencyCode); // Transaction Currency (840=USD, 116=KHR)
  payload += formatTLV('54', formattedAmount); // Transaction Amount
  payload += formatTLV('58', 'KH'); // Country Code (KH)
  payload += formatTLV('59', merchantName.slice(0, 25)); // Merchant Name
  payload += formatTLV('60', merchantCity.slice(0, 15)); // Merchant City
  payload += formatTLV('62', tag62); // Additional Data

  // Tag 63: CRC Checksum
  const payloadWithTag63 = payload + '6304';
  const checksum = crc16(payloadWithTag63);

  return `${payloadWithTag63}${checksum}`;
}
