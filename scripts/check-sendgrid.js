/**
 * SendGrid API Key Validation Script
 * 
 * This script checks if your SendGrid API key is valid by making a simple API call.
 * Run this script with: node scripts/check-sendgrid.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');

// Get the API key from environment variables
const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  console.error('❌ SENDGRID_API_KEY is not set in your .env.local file');
  process.exit(1);
}

// Set the API key for both mail and client
sgMail.setApiKey(apiKey);
sgClient.setApiKey(apiKey);

async function checkApiKey() {
  console.log('🔑 Checking SendGrid API key validity...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 3)}`);
  
  try {
    // Make a simple API call to get sender identities
    const [response, body] = await sgClient.request({
      method: 'GET',
      url: '/v3/verified_senders',
    });
    
    console.log(`✅ API key is valid! Status code: ${response.statusCode}`);
    console.log('✅ Verified senders:');
    
    if (body && body.results) {
      body.results.forEach(sender => {
        console.log(`   - ${sender.from_email} (${sender.verified ? 'Verified' : 'Not Verified'})`);
      });
    } else {
      console.log('   No verified senders found');
    }
    
    // Now try to check if we can send emails
    console.log('\n🔑 Checking if we can send emails...');
    
    // Get the from email from environment or use a default
    const fromEmail = process.env.EMAIL_FROM || 'prateek@edoflip.com';
    const toEmail = process.env.EMAIL_TO || 'prateek@edoflip.com';
    
    console.log(`🔑 From email: ${fromEmail}`);
    console.log(`🔑 To email: ${toEmail}`);
    
    // Check if the from email is in the verified senders
    let fromEmailVerified = false;
    if (body && body.results) {
      fromEmailVerified = body.results.some(sender => 
        sender.from_email === fromEmail && sender.verified
      );
    }
    
    if (!fromEmailVerified) {
      console.warn(`⚠️ Warning: ${fromEmail} is not in your verified senders list`);
      console.warn('⚠️ You may need to verify this email in your SendGrid account');
    }
    
    console.log('\n🔑 SendGrid API key is valid and ready to use!');
    
  } catch (error) {
    console.error('❌ API key validation failed!');
    
    if (error.response) {
      console.error(`❌ Status code: ${error.response.statusCode}`);
      console.error('❌ Error details:', error.response.body);
      
      if (error.response.statusCode === 401) {
        console.error('❌ Authentication failed. Your API key is invalid or revoked.');
      } else if (error.response.statusCode === 403) {
        console.error('❌ Permission denied. Your API key may not have the necessary permissions.');
      }
    } else {
      console.error('❌ Error:', error.message);
    }
    
    process.exit(1);
  }
}

checkApiKey(); 