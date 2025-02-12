import { emailTransport } from './nodemailer-transport.js';

class EmailService {
  async sendConfirmationCode(to: string, code: string): Promise<void> {
    try {
      const url = new URL('/auth/registration-confirmation', 'https://nightingale.com/');
      url.searchParams.set('code', code);

      const info = await emailTransport.sendMail({
        from: '"Vyacheslav Solovev" <slvsl.spb@gmail.com>',
        to: to,
        subject: 'Confirm your email',
        text: `Thank you for your registration. To confirm your profile please follow the link below:\n${url.href}`,
        html: `<h1>Thank you for your registration</h1><p>To confirm your profile please follow the link below:</p><a href='${url.href}'>Complete registration</a>`,
      });

      console.log(info);
    } catch (e) {
      console.error(e);
    }
  }

  async sendRecoveryCode(to: string, code: string): Promise<void> {
    try {
      const url = new URL('/auth/password-recovery', 'https://nightingale.com/');
      url.searchParams.set('code', code);

      const info = await emailTransport.sendMail({
        from: '"Vyacheslav Solovev" <slvsl.spb@gmail.com>',
        to: to,
        subject: 'Password recovery',
        text: `To reset your password please follow the link below:\n${url.href}`,
        html: `<h1>Password recovery</h1><p>To reset your password please follow the link below:</p><a href='${url.href}'>Reset password</a>`,
      });

      console.log(info);
    } catch (e) {
      console.error(e);
    }
  }
}

export const emailService = new EmailService();
