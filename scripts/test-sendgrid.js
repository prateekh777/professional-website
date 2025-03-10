// Test script for SendGrid email functionality
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the SendGrid API key
const apiKey = process.env.SENDGRID_API_KEY;
const verifiedSender = process.env.EMAIL_FROM || 'prateek@edoflip.com';
const recipientEmail = process.env.EMAIL_TO || 'prateek@edoflip.com';

// Check if API key exists
if (!apiKey) {
  console.error('❌ SendGrid API key not found in environment variables');
  console.log('Please set the SENDGRID_API_KEY environment variable and try again');
  process.exit(1);
}

console.log(`✅ SendGrid API key found: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 3)}`);
console.log(`✅ Using sender email: ${verifiedSender}`);
console.log(`✅ Using recipient email: ${recipientEmail}`);

// Initialize SendGrid
sgMail.setApiKey(apiKey);

// Create a test message
const msg = {
  to: recipientEmail,
  from: verifiedSender,
  subject: 'SendGrid Test Email',
  text: 'This is a test email sent using SendGrid to verify the API key and email functionality.',
  html: '<p>This is a test email sent using SendGrid to verify the API key and email functionality.</p>',
};

console.log('📧 Sending test email...');

// Send the email
sgMail.send(msg)
  .then((response) => {
    console.log('✅ Test email sent successfully!');
    console.log(`✅ Status code: ${response[0].statusCode}`);
    console.log('✅ Headers:', response[0].headers);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error sending test email:');
    
    if (error.response) {
      console.error('❌ Status code:', error.response.statusCode);
      console.error('❌ Response body:', error.response.body);
    } else {
      console.error('❌ Error:', error.message);
    }
    
    process.exit(1);
  }); 