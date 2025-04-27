import nodemailer from "nodemailer";
import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

dotenv.config({
  path:path.join(__dirname,"..",".env")
})
const testAccount = await nodemailer.createTestAccount()

export const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.MAIL_PASSWORD, 
  },
});

export const sender = process.env.SENDER_MAIL;

