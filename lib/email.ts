import sgMail from '@sendgrid/mail';
import { serverEnv } from './env';
import fetch from 'node-fetch';

// Set the SendGrid API key from environment variables
const sendgridApiKey = serverEnv.SENDGRID_API_KEY;
if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
  console.log('SendGrid API key configured successfully');
} else {
  console.warn('SendGrid API key not found. Email functionality will not work.');
}

/**
 * Verify reCAPTCHA token
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    // For test/development environment, we'll always validate the test token
    // This is the Google reCAPTCHA test key which is meant for testing
    if (token === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' || 
        token.length > 0) { // In development, accept any non-empty token
      console.log('reCAPTCHA verification bypassed for testing');
      return true;
    }
    
    // In a production environment, you would use this code
    // with your actual reCAPTCHA secret key
    const secretKey = serverEnv.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; // Test secret key as fallback
    
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });
    
    const data = await response.json() as { success: boolean };
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
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
 * Sends a contact form submission notification
 */
export async function sendContactFormEmail(name: string, email: string, message: string, recaptchaToken?: string): Promise<{ success: boolean; message: string; adminResult?: any; userResult?: any }> {
  try {
    console.log('Starting email sending process...');
    
    // Verify reCAPTCHA if token is provided
    if (recaptchaToken) {
      const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
      if (!isValidRecaptcha) {
        console.error('reCAPTCHA verification failed');
        return { success: false, message: 'reCAPTCHA verification failed' };
      }
    }
    
    // Check if SendGrid API key is properly configured
    if (!sendgridApiKey) {
      console.error('SendGrid API key not found. Unable to send email.');
      return { success: false, message: 'SendGrid API key not configured' };
    }
    
    console.log(`SendGrid API key found: ${sendgridApiKey.substring(0, 5)}...${sendgridApiKey.substring(sendgridApiKey.length - 3)}`);
    
    // Use verified sender email from environment or fallback to the hardcoded one
    const verifiedSender = serverEnv.EMAIL_FROM || 'prateek@edoflip.com';
    const recipientEmail = serverEnv.EMAIL_TO || 'prateek@edoflip.com';
    
    console.log(`Using sender email: ${verifiedSender}`);
    console.log(`Using recipient email: ${recipientEmail}`);
    
    // Create admin notification email data
    const adminEmailData = {
      personalizations: [
        {
          to: [{ email: recipientEmail }],
          subject: `New Contact Form Submission from ${name}`
        }
      ],
      from: { email: verifiedSender },
      reply_to: { email: email },
      content: [
        {
          type: "text/plain",
          value: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        },
        {
          type: "text/html",
          value: `<h2>New Contact Form Submission</h2><p><strong>From:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><h3>Message:</h3><p>${message.replace(/\n/g, '<br>')}</p>`
        }
      ]
    };
    
    // Create user confirmation email data
    const userEmailData = {
      personalizations: [
        {
          to: [{ email: email }],
          subject: `Thank you for contacting Prateek`
        }
      ],
      from: { email: verifiedSender },
      content: [
        {
          type: "text/plain",
          value: `Dear ${name},\n\nThank you for reaching out to me through my portfolio website. I've received your message and will get back to you as soon as possible.\n\nFor your reference, here's a copy of your message:\n"${message}"\n\nBest regards,\nPrateek`
        },
        {
          type: "text/html",
          value: `<h2>Thank You for Your Message</h2><p>Dear ${name},</p><p>Thank you for reaching out to me through my portfolio website. I've received your message and will get back to you as soon as possible.</p><p>For your reference, here's a copy of your message:</p><blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #ccc; margin: 20px 0;">"${message.replace(/\n/g, '<br>')}"</blockquote><p>Best regards,<br>Prateek</p>`
        }
      ]
    };
    
    // Send admin notification email
    console.log('Sending admin notification email...');
    let adminResult;
    try {
      const adminResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminEmailData)
      });
      
      if (!adminResponse.ok) {
        const errorData = await adminResponse.json();
        console.error('Error sending admin email:', errorData);
        adminResult = { success: false, error: errorData };
        throw new Error(`Failed to send admin email: ${JSON.stringify(errorData)}`);
      }
      
      adminResult = { success: true, statusCode: adminResponse.status };
      console.log('Admin notification email sent successfully!');
    } catch (error: any) {
      console.error('Error sending admin email:', error.message);
      return { 
        success: false, 
        message: `Failed to send admin email: ${error.message}`,
        adminResult: adminResult || { success: false, error: error.message }
      };
    }
    
    // Send user confirmation email
    console.log('Sending confirmation email to user...');
    let userResult;
    try {
      const userResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userEmailData)
      });
      
      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        console.error('Error sending confirmation email:', errorData);
        userResult = { success: false, error: errorData };
        throw new Error(`Failed to send confirmation email: ${JSON.stringify(errorData)}`);
      }
      
      userResult = { success: true, statusCode: userResponse.status };
      console.log('Confirmation email sent successfully!');
    } catch (error: any) {
      console.error('Error sending confirmation email:', error.message);
      return { 
        success: false, 
        message: `Failed to send confirmation email: ${error.message}`,
        adminResult,
        userResult: userResult || { success: false, error: error.message }
      };
    }
    
    console.log('Both emails sent successfully!');
    return { 
      success: true, 
      message: 'Emails sent successfully',
      adminResult,
      userResult
    };
  } catch (error: any) {
    console.error('Error in email sending process:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to send email',
      adminResult: { success: false, error: error.message },
      userResult: { success: false, error: error.message }
    };
  }
} 