const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');

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
  
  // Initialize API key
  sgMail.setApiKey(apiKey);
  console.log('✅ SendGrid API key configured');
  
  const testData = {
    name: 'Test User',
    email: 'noreply@example.com',
    message: 'This is a test email sent from the portfolio website to verify SendGrid integration.',
  };
  
  const verifiedSender = process.env.EMAIL_FROM || process.env.SENDGRID_VERIFIED_SENDER || 'prateek@edoflip.com';
  const adminEmail = process.env.EMAIL_TO || 'prateek@edoflip.com';
  
  console.log('Sending test email:');
  console.log('- From:', verifiedSender);
  console.log('- To:', adminEmail);
  
  // Simple email object
  const msg = {
    to: adminEmail,
    from: verifiedSender,
    subject: 'SendGrid API Key Test',
    text: `This is a test email to verify SendGrid API key permissions.
    
Name: ${testData.name}
Email: ${testData.email}
Message: ${testData.message}`,
    html: `<p>This is a test email to verify SendGrid API key permissions.</p>
    <h2>Test Contact Form Data</h2>
    <p><strong>Name:</strong> ${testData.name}</p>
    <p><strong>Email:</strong> ${testData.email}</p>
    <p><strong>Message:</strong> ${testData.message}</p>`,
  };
  
  try {
    console.log('Sending email...');
    await sgMail.send(msg);
    console.log('✅ Test email sent successfully!');
    console.log('Email functionality is working correctly.');
  } catch (error) {
    console.error('❌ Error sending test email:', error);
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