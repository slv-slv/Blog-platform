import nodemailer from 'nodemailer';

export const emailTransport = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 587,
  secure: false,
  auth: {
    user: 'xNightingale',
    pass: 'qrffkkyjgwnibvkm',
  },
});
