// Test script for SendGrid email functionality using fetch directly
import fetch from 'node-fetch';
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

// Create email data
const emailData = {
  personalizations: [
    {
      to: [{ email: recipientEmail }],
      subject: 'SendGrid Test Email'
    }
  ],
  from: { email: verifiedSender },
  content: [
    {
      type: "text/plain",
      value: "This is a test email sent using SendGrid to verify the API key and email functionality."
    },
    {
      type: "text/html",
      value: "<p>This is a test email sent using SendGrid to verify the API key and email functionality.</p>"
    }
  ]
};

console.log('📧 Sending test email...');

// Send the email using fetch
fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(emailData)
})
.then(response => {
  if (response.ok) {
    console.log('✅ Test email sent successfully!');
    console.log(`✅ Status code: ${response.status}`);
    return response.text();
  } else {
    return response.json().then(errorData => {
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    });
  }
})
.then(responseText => {
  console.log('✅ Response:', responseText || 'No response body');
  process.exit(0);
})
.catch(error => {
  console.error('❌ Error sending test email:', error.message);
  process.exit(1);
}); 