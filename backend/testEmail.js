require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

async function test() {
  try {
    await sendEmail({
      to: 'your_donor_email@example.com', // replace with a real email
      subject: 'Test Email from MediaID',
      text: 'Hello! This is a test email to check SMTP settings.'
    });
    console.log('✅ Email sent successfully');
  } catch (err) {
    console.error('❌ Email failed:', err);
  }
}

test();
