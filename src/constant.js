import nodemailer from "nodemailer";
const DB_NAME = "twitter";
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASSWORD,
  },
});

let mailOptions = {
  from: process.env.MY_EMAIL,
  to: "recipient-email@example.com",
  subject: "Forgot Password",
  text: "Now enter your this password to ",
};

export { DB_NAME, transporter, mailOptions };
