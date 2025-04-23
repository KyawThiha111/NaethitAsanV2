import nodemailer from "nodemailer";

const testAccount = await nodemailer.createTestAccount()

export const transport = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user:testAccount.user,
    pass:testAccount.pass,
  },
});

export const sender = {
    address: testAccount.user,
    name:"Kyaw Thiha"
}

