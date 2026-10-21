import QRCode from 'qrcode';

/**
 * CRC16-CCITT calculation for EMVCo / Bakong KHQR
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

/**
 * Format an EMVCo Tag-Length-Value (TLV) segment
 */
function formatTLV(tag: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${tag}${len}${value}`;
}

export interface KHQRData {
  orderNumber: string;
  amount: number;
  currency?: 'USD' | 'KHR';
  merchantName?: string;
  merchantAccount?: string;
}

/**
 * Generate standardized Bakong KHQR String according to NBC EMVCo spec
 */
export function generateBakongKHQRString(data: KHQRData): string {
  const {
    orderNumber,
    amount,
    currency = 'USD',
    merchantName = 'GAME MARKETPLACE',
    merchantAccount = 'gameplatform@dev',
  } = data;

  const currencyCode = currency === 'USD' ? '840' : '116';
  const formattedAmount = amount.toFixed(currency === 'USD' ? 2 : 0);

  // Merchant Account Info (Tag 29)
  const tag29 =
    formatTLV('00', 'bakong@nbc.gov.kh') +
    formatTLV('01', merchantAccount) +
    formatTLV('02', 'INDIVIDUAL');

  // Additional Data (Tag 62) - Bill/Order Number
  const tag62 = formatTLV('01', orderNumber);

  let payload = '';
  payload += formatTLV('00', '01'); // Payload Format Indicator
  payload += formatTLV('01', '12'); // Point of Initiation: Dynamic
  payload += formatTLV('29', tag29); // Merchant Account Information
  payload += formatTLV('52', '5999'); // Merchant Category Code
  payload += formatTLV('53', currencyCode); // Currency
  payload += formatTLV('54', formattedAmount); // Amount
  payload += formatTLV('58', 'KH'); // Country Code
  payload += formatTLV('59', merchantName.slice(0, 25)); // Merchant Name
  payload += formatTLV('60', 'Phnom Penh'); // Merchant City
  payload += formatTLV('62', tag62); // Additional Data

  // Prepare Tag 63 for CRC checksum
  const payloadWithTag63 = payload + '6304';
  const checksum = crc16(payloadWithTag63);

  return `${payloadWithTag63}${checksum}`;
}

/**
 * Generate QR code as Base64 Data URL (png) for instant frontend rendering
 */
export async function generateQRCodeImage(qrString: string): Promise<string> {
  return QRCode.toDataURL(qrString, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    margin: 2,
    color: {
      dark: '#0f172a', // Deep slate navy
      light: '#ffffff',
    },
    width: 320,
  });
}
