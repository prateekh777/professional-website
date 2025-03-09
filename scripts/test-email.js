/**
 * SendGrid Email Test Script
 * 
 * This script tests sending an email using SendGrid.
 * Run this script with: node scripts/test-email.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const sgMail = require('@sendgrid/mail');

// Get the API key from environment variables
const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  console.error('❌ SENDGRID_API_KEY is not set in your .env.local file');
  process.exit(1);
}

// Set the API key
sgMail.setApiKey(apiKey);

// Get email addresses from environment variables or use defaults
const fromEmail = process.env.EMAIL_FROM || 'prateek@edoflip.com';
const toEmail = process.env.EMAIL_TO || 'prateek@edoflip.com';

async function sendTestEmail() {
  console.log('📧 Sending test email...');
  console.log(`📧 From: ${fromEmail}`);
  console.log(`📧 To: ${toEmail}`);
  
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: 'SendGrid Test Email',
    text: 'This is a test email sent from the SendGrid test script.',
    html: '<strong>This is a test email sent from the SendGrid test script.</strong>',
  };
  
  try {
    const response = await sgMail.send(msg);
    console.log(`✅ Email sent successfully! Status code: ${response[0].statusCode}`);
    console.log('✅ Response headers:', response[0].headers);
  } catch (error) {
    console.error('❌ Failed to send email!');
    
    if (error.response) {
      console.error(`❌ Status code: ${error.response.statusCode}`);
      console.error('❌ Error details:', error.response.body);
      
      if (error.response.statusCode === 401) {
        console.error('❌ Authentication failed. Your API key is invalid or revoked.');
      } else if (error.response.statusCode === 403) {
        console.error('❌ Permission denied. Your API key may not have the necessary permissions.');
      } else if (error.response.body && error.response.body.errors) {
        error.response.body.errors.forEach(err => {
          console.error(`❌ Error: ${err.message}`);
          
          if (err.field === 'from') {
            console.error('❌ The from email address is not verified. You need to verify it in your SendGrid account.');
            console.error('❌ Visit https://app.sendgrid.com/settings/sender_auth to verify your sender identity.');
          }
        });
      }
    } else {
      console.error('❌ Error:', error.message);
    }
    
    process.exit(1);
  }
}

sendTestEmail(); 