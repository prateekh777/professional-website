import sgMail from '@sendgrid/mail';
import { serverEnv } from './env';

// Initialize SendGrid with API key
if (serverEnv.SENDGRID_API_KEY) {
  console.log('🔑 SendGrid API key found, initializing SendGrid...');
  sgMail.setApiKey(serverEnv.SENDGRID_API_KEY);
  console.log('✅ SendGrid initialized successfully');
  
  // Log the first few characters of the API key for debugging
  const apiKeyPreview = serverEnv.SENDGRID_API_KEY.substring(0, 5) + '...' + 
    serverEnv.SENDGRID_API_KEY.substring(serverEnv.SENDGRID_API_KEY.length - 3);
  console.log(`📝 Using SendGrid API key: ${apiKeyPreview}`);
} else {
  console.warn('⚠️ SENDGRID_API_KEY is not set. Email functionality will not work.');
}

/**
 * Email utility functions
 * 
 * This file contains functions for sending emails using SendGrid.
 */

type EmailData = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
};

/**
 * Sends an email using SendGrid
 */
export async function sendEmail(emailData: EmailData): Promise<{ success: boolean; message: string }> {
  console.log('📧 ===== SEND EMAIL ATTEMPT =====');
  
  // Log the email data for debugging
  console.log('📧 Email details:');
  console.log(`📧 To: ${emailData.to}`);
  console.log(`📧 From: ${emailData.from}`);
  console.log(`📧 Subject: ${emailData.subject}`);
  console.log(`📧 Text length: ${emailData.text.length} characters`);
  
  // Check if SendGrid API key is set
  if (!serverEnv.SENDGRID_API_KEY) {
    console.error('❌ SendGrid API key is not set. Cannot send email.');
    return { 
      success: false, 
      message: 'SendGrid API key is not configured' 
    };
  }
  
  try {
    // Prepare the email data
    const msg = {
      to: emailData.to,
      from: emailData.from,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html || emailData.text.replace(/\n/g, '<br>'),
    };
    
    console.log('📧 Preparing to send email via SendGrid...');
    console.log('📧 Message configuration:', JSON.stringify({
      to: msg.to,
      from: msg.from,
      subject: msg.subject,
      textLength: msg.text.length,
      htmlLength: msg.html.length
    }));
    
    // Send the email using SendGrid
    console.log('📧 Calling sgMail.send()...');
    const response = await sgMail.send(msg);
    
    console.log(`📧 SendGrid API response status code: ${response[0].statusCode}`);
    console.log(`📧 SendGrid API response headers:`, response[0].headers);
    
    if (response[0].statusCode >= 200 && response[0].statusCode < 300) {
      console.log('✅ Email sent successfully via SendGrid');
      return { 
        success: true, 
        message: 'Email sent successfully' 
      };
    } else {
      console.error(`❌ SendGrid returned non-success status code: ${response[0].statusCode}`);
      return { 
        success: false, 
        message: `SendGrid returned status code: ${response[0].statusCode}` 
      };
    }
  } catch (error) {
    console.error('❌ Error sending email via SendGrid:', error);
    
    // Extract more detailed error information
    let errorMessage = 'Failed to send email';
    let errorDetails = {};
    
    if (error.response) {
      console.error('❌ SendGrid error response:', error.response);
      errorDetails.statusCode = error.response.statusCode;
      
      if (error.response.body) {
        console.error('❌ SendGrid error body:', error.response.body);
        errorDetails.body = error.response.body;
        errorMessage = `SendGrid error: ${JSON.stringify(error.response.body)}`;
      }
    } else if (error.code) {
      console.error('❌ Error code:', error.code);
      errorDetails.code = error.code;
      errorMessage = `Error code: ${error.code}`;
    }
    
    if (error.message) {
      console.error('❌ Error message:', error.message);
      errorDetails.message = error.message;
    }
    
    console.error('❌ Full error details:', errorDetails);
    
    return { 
      success: false, 
      message: errorMessage,
      details: errorDetails
    };
  } finally {
    console.log('📧 ===== END SEND EMAIL ATTEMPT =====');
  }
}

/**
 * Sends a contact form submission notification
 */
export async function sendContactFormEmail(name: string, email: string, message: string): Promise<{ success: boolean; message: string }> {
  console.log('📝 ===== CONTACT FORM EMAIL PROCESS =====');
  console.log(`📝 Processing contact form submission for: ${name} (${email})`);
  
  // Verify sender email is configured
  const senderEmail = serverEnv.EMAIL_FROM || 'prateek@edoflip.com';
  const adminEmail = serverEnv.EMAIL_TO || 'prateek@edoflip.com';
  
  console.log(`📝 Using sender email: ${senderEmail}`);
  console.log(`📝 Using admin email: ${adminEmail}`);
  
  // Send notification to admin
  console.log('📝 Sending admin notification email...');
  const adminNotification = await sendEmail({
    to: adminEmail,
    from: senderEmail,
    subject: `New Contact Form Submission from ${name}`,
    text: `
      You received a new message from your website contact form:
      
      Name: ${name}
      Email: ${email}
      
      Message:
      ${message}
    `,
  });
  
  console.log('📝 Admin notification result:', adminNotification);
  
  // Send confirmation to user
  console.log('📝 Sending user confirmation email...');
  const userConfirmation = await sendEmail({
    to: email,
    from: senderEmail,
    subject: 'Thank you for contacting Prateek Hakay',
    text: `
      Hi ${name},
      
      Thank you for reaching out! I've received your message and will get back to you as soon as possible.
      
      For your records, here's a copy of your message:
      
      ${message}
      
      Best regards,
      Prateek Hakay
    `,
  });
  
  console.log('📝 User confirmation result:', userConfirmation);
  
  const success = adminNotification.success && userConfirmation.success;
  const message = success 
    ? 'Emails sent successfully' 
    : `Failed to send emails: ${adminNotification.message || 'Unknown admin email error'}, ${userConfirmation.message || 'Unknown user email error'}`;
  
  console.log(`📝 Overall email sending ${success ? 'succeeded' : 'failed'}: ${message}`);
  console.log('📝 ===== END CONTACT FORM EMAIL PROCESS =====');
  
  return {
    success,
    message,
    adminResult: adminNotification,
    userResult: userConfirmation
  };
} 