// Simple script to test SendGrid email sending
// Run with: node scripts/test-sendgrid.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

/**
 * This script tests SendGrid email functionality by sending a test email
 */
async function testSendGridEmail() {
  try {
    // Check for SendGrid API key
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error('Error: SENDGRID_API_KEY not found in environment variables');
      return;
    }
    
    console.log(`SendGrid API key found: ${apiKey.substring(0, 5)}...`);
    
    // Get verified sender email
    const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || 'prateek@edoflip.com';
    console.log(`Using verified sender: ${verifiedSender}`);
    
    // Create test email data
    const testData = {
      personalizations: [
        {
          to: [{ email: verifiedSender }],
          subject: 'Test Email from SendGrid API'
        }
      ],
      from: { email: verifiedSender },
      content: [
        {
          type: "text/plain",
          value: "This is a test email sent using the SendGrid API to verify functionality."
        }
      ]
    };
    
    console.log('Sending test email...');
    
    // Send test email
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      console.log('Test email sent successfully!');
    } else {
      const errorText = await response.text();
      console.error('Error sending test email:', errorText);
    }
  } catch (error) {
    console.error('Error in test script:', error);
  }
}

// Run the test
testSendGridEmail(); 