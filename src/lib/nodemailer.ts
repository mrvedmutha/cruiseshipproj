import nodemailer from "nodemailer";

export const nodemailerTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.MAIL_PASS,
  },
});
