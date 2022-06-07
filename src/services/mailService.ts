import * as nodemailer from "nodemailer";
require("dotenv").config();

export const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: `${process.env.MAIL_ID}`,
    pass: `${process.env.PASSWORD}`,
  },
});
