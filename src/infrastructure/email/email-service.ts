import { emailTransport } from './nodemailer-transport.js';

export const emailService = {
  sendConfirmation: async (to: string, code: string): Promise<void> => {
    try {
      const url = new URL('/registration/confirmation', 'https://nightingale.com/');
      url.searchParams.set('code', code);

      const info = await emailTransport.sendMail({
        from: '"Vyacheslav Solovev" <slavyan1990@rambler.ru>',
        to: to,
        subject: 'Confirm your email',
        text: `Thank you for your registration. To confirm your profile please follow the link below:\n${url.href}`,
        html: `<h1>Thank you for your registration</h1><p>To confirm your profile please follow the link below:</p><a href='${url.href}'>Complete registration</a>`,
      });

      console.log(info);
    } catch (e) {
      console.error(e);
    }
  },
};
