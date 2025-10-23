const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,      // e.g., smtp.gmail.com
      port: process.env.EMAIL_PORT || 587,
      secure: false,                     // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,    // your email
        pass: process.env.EMAIL_PASS,    // email password / app password
      },
    });

    // send mail
    await transporter.sendMail({
      from: `"Blood Donation App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Email not sent");
  }
};

module.exports = sendEmail;
