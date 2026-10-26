import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../../config';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter(): void {
    const { smtpHost, smtpPort, smtpUser, smtpPass } = config.email;

    if (smtpHost && smtpUser) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      console.log(`📧 EmailService initialized with SMTP host: ${smtpHost}:${smtpPort}`);
    } else {
      console.log('📧 EmailService running in dev mode (console logger fallback). Configure SMTP_HOST to send real emails.');
    }
  }

  /**
   * Generic send email method
   */
  async sendMail(options: SendMailOptions): Promise<boolean> {
    const from = `"${config.email.fromName}" <${config.email.fromEmail}>`;

    if (!this.transporter) {
      console.log(`
======================================================
📧 [MOCK EMAIL DISPATCH]
To      : ${options.to}
From    : ${from}
Subject : ${options.subject}
Body    :
${options.text || options.html.replace(/<[^>]*>?/gm, '')}
======================================================
      `);
      return true;
    }

    try {
      await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      return true;
    } catch (err) {
      console.error(`Failed to send email to ${options.to}:`, err);
      return false;
    }
  }

  /**
   * Send Password Reset Link Email
   */
  async sendPasswordResetEmail(to: string, username: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${config.frontendUrl}/auth/reset-password?token=${resetToken}`;

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0e14; color: #ffffff; padding: 20px; }
          .container { max-width: 560px; margin: 0 auto; background-color: #121721; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 24px; font-weight: 900; color: #f2ca50; letter-spacing: 1px; }
          .title { font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #ffffff; }
          .text { font-size: 14px; line-height: 1.6; color: #a3a3a3; margin-bottom: 24px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #f2ca50, #d4af37); color: #0b0e14; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
          .token-box { background-color: #0b0e14; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px; font-family: monospace; font-size: 14px; color: #00e4f2; margin-top: 16px; word-break: break-all; }
          .footer { margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; font-size: 12px; color: #737373; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎮 GAME MARKETPLACE</div>
          </div>
          <div class="title">Password Reset Request</div>
          <div class="text">
            Hello <b>${username}</b>,<br><br>
            We received a request to reset your password. Click the button below to choose a new password. This link is valid for 1 hour.
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
          </div>
          <div class="text" style="font-size: 12px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <div class="token-box">${resetUrl}</div>
          </div>
          <div class="footer">
            If you did not request a password reset, you can safely ignore this email. Your password will not change.
          </div>
        </div>
      </body>
    </html>
    `;

    return this.sendMail({
      to,
      subject: 'Password Reset Request - Game Marketplace',
      html,
      text: `Hello ${username}, reset your password using this link: ${resetUrl}`,
    });
  }

  /**
   * Send Order Confirmation / Receipt Email
   */
  async sendOrderReceiptEmail(
    to: string,
    username: string,
    orderNumber: string,
    amount: number,
    accountTitle: string
  ): Promise<boolean> {
    const orderUrl = `${config.frontendUrl}/orders/${orderNumber}`;

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0e14; color: #ffffff; padding: 20px; }
          .container { max-width: 560px; margin: 0 auto; background-color: #121721; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 24px; font-weight: 900; color: #f2ca50; }
          .status { display: inline-block; background-color: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
          .title { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
          .order-details { background-color: #181f2c; border-radius: 12px; padding: 16px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
          .detail-label { color: #a3a3a3; }
          .detail-value { color: #ffffff; font-weight: 600; }
          .btn { display: inline-block; background: #00e4f2; color: #0b0e14; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 13px; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎮 GAME MARKETPLACE</div>
          </div>
          <div style="text-align: center;">
            <div class="status">✓ PAYMENT RECEIVED & ESCROW SECURED</div>
          </div>
          <div class="title">Thank you for your purchase, ${username}!</div>
          <div style="color: #a3a3a3; font-size: 14px;">Your payment has been placed in secure escrow. You can now access your account credentials.</div>
          
          <div class="order-details">
            <div class="detail-row">
              <span class="detail-label">Order Number:</span>
              <span class="detail-value" style="font-family: monospace;">#${orderNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Item:</span>
              <span class="detail-value">${accountTitle}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Paid:</span>
              <span class="detail-value" style="color: #f2ca50; font-size: 15px;">$${amount.toFixed(2)} USD</span>
            </div>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${orderUrl}" class="btn" target="_blank">View Order & Credentials</a>
          </div>
        </div>
      </body>
    </html>
    `;

    return this.sendMail({
      to,
      subject: `Order Confirmation #${orderNumber} - Game Marketplace`,
      html,
      text: `Thank you for your order #${orderNumber}! View credentials here: ${orderUrl}`,
    });
  }
}

export const emailService = new EmailService();
export default emailService;
