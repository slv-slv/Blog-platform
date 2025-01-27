import { emailTransport } from './nodemailer-transport.js';

export const emailService = {
  sendConfirmation: async (subject: string, uuid: string): Promise<void> => {
    try {
      const url = new URL('/registration/confirmation', 'https://nightingale.com/');
      url.searchParams.set('code', uuid);

      const info = await emailTransport.sendMail({
        from: '"Vyacheslav Solovev" <xNightingale@yandex.ru>',
        to: subject,
        subject: 'Confirm your email',
        text: `Thank for your registration. To confirm your profile please follow the link below:\n${url.href}`,
        html: `<h1>Thank for your registration</h1><p>To confirm your profile please follow the link below:<a href='${url.href}'>Complete registration</a></p>`,
      });

      console.log(info);
    } catch (e) {
      console.error(e);
    }
  },
};
