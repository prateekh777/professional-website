const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: '.env.local' });

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
  
  // Re-initialize API key to ensure it's set
  console.log('Re-initializing SendGrid API key...');
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(apiKey);
  console.log('✅ SendGrid API key found');
  
  const testData = {
    name: 'Test User',
    email: 'noreply@example.com',
    message: 'This is a test email sent from the portfolio website to verify SendGrid integration.',
    recaptchaToken: 'test-token'
  };
  
  console.log('Sending test email:');
  console.log('- From:', testData.email);
  console.log('- To: recipient@example.com');
  
  console.log('Email data:', JSON.stringify(testData, null, 2));
  
  // First, test a direct email to make sure API key has proper permissions
  console.log('Attempting to send a direct test email to verify API key permissions...');
  
  const verifiedSender = process.env.EMAIL_FROM || process.env.SENDGRID_VERIFIED_SENDER || 'prateek@edoflip.com';
  const adminEmail = process.env.EMAIL_TO || 'prateek@edoflip.com';
  
  // Simple email object
  const msg = {
    to: adminEmail,
    from: verifiedSender,
    subject: 'SendGrid API Key Test',
    text: 'This is a test email to verify SendGrid API key permissions.',
    html: '<p>This is a test email to verify SendGrid API key permissions.</p>',
  };
  
  console.log('Direct test email config:', JSON.stringify(msg, null, 2));
  
  try {
    await sgMail.send(msg);
    console.log('✅ Direct test email sent successfully!');
    console.log('\nNow testing the contact email flow using curl...');
    
    // Create a temporary JSON file for the request body
    const tempJsonPath = path.join(__dirname, 'temp_sendgrid_test.json');
    
    // Create the raw JSON data for admin notification
    const adminRawData = {
      personalizations: [
        {
          to: [{ email: adminEmail }],
          subject: `New contact form submission from ${testData.name}`
        }
      ],
      from: { email: verifiedSender },
      reply_to: { email: testData.email },
      content: [
        {
          type: "text/plain",
          value: `Name: ${testData.name}\nEmail: ${testData.email}\n\nMessage:\n${testData.message}`
        },
        {
          type: "text/html",
          value: `<h2>New Contact Form Submission</h2><p><strong>From:</strong> ${testData.name}</p><p><strong>Email:</strong> ${testData.email}</p><h3>Message:</h3><p>${testData.message}</p>`
        }
      ]
    };
    
    // Write the JSON to a temporary file
    fs.writeFileSync(tempJsonPath, JSON.stringify(adminRawData, null, 2));
    
    // Execute curl command
    console.log('Sending email via curl...');
    try {
      const curlCommand = `curl -s --request POST --url https://api.sendgrid.com/v3/mail/send --header "Authorization: Bearer ${apiKey}" --header "Content-Type: application/json" --data-binary @${tempJsonPath}`;
      execSync(curlCommand);
      console.log('✅ Test email sent successfully via curl!');
      console.log('Email functionality is working correctly.');
    } catch (curlError) {
      console.error('❌ Error executing curl command:', curlError.message);
      console.error('Curl output:', curlError.stdout?.toString() || 'No output');
      console.error('Curl error:', curlError.stderr?.toString() || 'No error output');
    }
    
    // Clean up the temporary file
    if (fs.existsSync(tempJsonPath)) {
      fs.unlinkSync(tempJsonPath);
    }
    
  } catch (error) {
    console.error('❌ Error sending direct test email:', error);
    if (error.response) {
      console.error('SendGrid API Error Response:', error.response.body);
    }
    console.log('Check your SendGrid configuration and try again.');
  }
}

// Execute the test
testSendGridEmail().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
}); 