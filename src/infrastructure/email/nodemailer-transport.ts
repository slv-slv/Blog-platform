import nodemailer from 'nodemailer';
import { SETTINGS } from '../../settings.js';

export const emailTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: SETTINGS.EMAIL_CREDENTIALS.user,
    pass: SETTINGS.EMAIL_CREDENTIALS.password,
  },
});
