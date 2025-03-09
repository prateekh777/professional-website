// Simple script to test SendGrid email sending
// Run with: node scripts/test-sendgrid.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

/**
 * This script tests SendGrid email functionality by sending a test email
 */
async function testSendGridEmail() {
  console.log('Testing SendGrid email functionality...');
  
  // Check for API key
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error('❌ SendGrid API key not found in environment variables.');
    console.log('Please set the SENDGRID_API_KEY environment variable and try again.');
    return;
  }
  
  console.log(`API key starts with: ${apiKey.substring(0, 5)}...`);
  
  const testData = {
    name: 'Test User',
    email: 'noreply@example.com',
    message: 'This is a test email sent from the portfolio website to verify SendGrid integration.',
    recaptchaToken: 'test-token'
  };
  
  console.log('Sending test email:');
  console.log('- From: verified sender');
  console.log('- To: prateek@edoflip.com');
  
  console.log('Email data:', JSON.stringify(testData, null, 2));
  
  // First, test a direct email to make sure API key has proper permissions
  console.log('Attempting to send a direct test email to verify API key permissions...');
  
  const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || 'prateek@edoflip.com';
  
  // Create the raw JSON data for admin notification - exactly matching the curl format
  const adminRawData = {
    personalizations: [
      {
        to: [{ email: 'prateek@edoflip.com' }],
        subject: `SendGrid API Test`
      }
    ],
    from: { email: verifiedSender },
    content: [
      {
        type: "text/plain",
        value: `This is a test email to verify SendGrid API key permissions.`
      }
    ]
  };
  
  console.log('Direct test email config:', JSON.stringify(adminRawData, null, 2));
  
  try {
    // Use the same approach as the curl script
    const { execSync } = require('child_process');
    
    // Create a temporary file for the JSON payload
    const fs = require('fs');
    const tempFile = '/tmp/sendgrid_test.json';
    fs.writeFileSync(tempFile, JSON.stringify(adminRawData));
    
    // Execute the curl command
    const curlCommand = `curl -s \\
      --request POST \\
      --url https://api.sendgrid.com/v3/mail/send \\
      --header "Authorization: Bearer ${apiKey}" \\
      --header 'Content-Type: application/json' \\
      --data-binary @${tempFile}`;
    
    console.log('Executing curl command...');
    const result = execSync(curlCommand).toString();
    
    // Clean up the temporary file
    fs.unlinkSync(tempFile);
    
    if (result.trim() === '') {
      console.log('✅ Test email sent successfully!');
      console.log('Email functionality is working correctly.');
    } else {
      console.error('❌ Failed to send test email.');
      console.error('SendGrid API Error Response:', result);
      console.log('Check your SendGrid configuration and try again.');
    }
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    console.log('Check your SendGrid configuration and try again.');
  }
}

// Execute the test
testSendGridEmail().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
}); 