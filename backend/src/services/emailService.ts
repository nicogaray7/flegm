import nodemailer from 'nodemailer';
import { env } from '../config/env';
import logger from '../config/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection established successfully');
    } catch (error) {
      logger.error('Error verifying email service connection:', error);
    }
  }

  public async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"Your App" <${env.SMTP_USER}>`,
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
      logger.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  public async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationUrl = `${env.APP_URL}/verify-email?token=${token}`;
    const html = `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>If you did not request this verification, please ignore this email.</p>
    `;

    await this.sendEmail({
      to,
      subject: 'Verify Your Email',
      html,
    });
  }

  public async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${env.APP_URL}/reset-password?token=${token}`;
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Please click the link below to reset it:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this reset, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `;

    await this.sendEmail({
      to,
      subject: 'Password Reset Request',
      html,
    });
  }

  public async sendWelcomeEmail(to: string, username: string): Promise<void> {
    const html = `
      <h1>Welcome to Our App!</h1>
      <p>Hello ${username},</p>
      <p>Thank you for joining our platform. We're excited to have you on board!</p>
      <p>If you have any questions, feel free to reply to this email.</p>
    `;

    await this.sendEmail({
      to,
      subject: 'Welcome to Our App!',
      html,
    });
  }
}

export const emailService = new EmailService();
