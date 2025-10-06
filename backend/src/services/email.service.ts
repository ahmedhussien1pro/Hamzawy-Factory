// src/services/email.service.ts
import nodemailer from 'nodemailer';
import { AppError } from '../utils/error';

const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

// إنشاء transporter
const transporter = nodemailer.createTransport(emailConfig);

let emailEnabled = false;

// التحقق من اتصال الإيميل
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    emailEnabled = true;
  } catch (error) {
    console.warn('⚠️ Email service is disabled - Gmail configuration needed');
    console.log(
      '📧 To enable emails, configure Gmail App Password in .env file'
    );
    emailEnabled = false;
    // لا نرمي error علشان مايفشلش التطبيق
  }
}

// إرسال إيميل إعادة تعيين كلمة المرور
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName: string
) {
  if (!emailEnabled) {
    console.log(
      `📧 [SIMULATED] Password reset email would be sent to: ${email}`
    );
    console.log(`📧 [SIMULATED] Reset token: ${resetToken}`);
    return;
  }

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"نظام إدارة المصنع" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'إعادة تعيين كلمة المرور - نظام إدارة المصنع',
    html: `... نفس الـ HTML السابق ...`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to: ${email}`);
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new AppError('Failed to send password reset email', 500);
  }
}

// إرسال إيميل تأكيد تغيير كلمة المرور
export async function sendPasswordChangedEmail(
  email: string,
  userName: string
) {
  if (!emailEnabled) {
    console.log(
      `📧 [SIMULATED] Password changed notification would be sent to: ${email}`
    );
    return;
  }

  const mailOptions = {
    from: `"نظام إدارة المصنع" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'تم تغيير كلمة المرور - نظام إدارة المصنع',
    html: `... نفس الـ HTML السابق ...`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password changed notification sent to: ${email}`);
  } catch (error) {
    console.error('❌ Failed to send password changed email:', error);
    // لا نرمي error علشان عملية تغيير الباسورد اتعملت بنجاح
  }
}

export { emailEnabled };
