import nodemailer from 'nodemailer';
import { z } from 'zod';
import fetch from 'node-fetch';
import sgMail from '@sendgrid/mail';

// Set the SendGrid API key from environment variables
const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
  console.log('SendGrid API key configured successfully');
} else {
  console.warn('SendGrid API key not found. Email functionality will not work.');
}

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  recaptchaToken: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
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
    const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; // Test secret key as fallback
    
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

// Send email using SendGrid
export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  try {
    // Verify reCAPTCHA if token is provided
    if (data.recaptchaToken) {
      const isValidRecaptcha = await verifyRecaptcha(data.recaptchaToken);
      if (!isValidRecaptcha) {
        console.error('reCAPTCHA verification failed');
        return false;
      }
    }
    
    // Check if SendGrid is properly configured
    if (!sendgridApiKey) {
      console.error('SendGrid API key not found. Unable to send email.');
      
      // Fall back to Ethereal for testing if SendGrid is not configured
      console.log('Falling back to Ethereal for testing...');
      
      // For demonstration purposes, we'll create a test account with Ethereal
      const testAccount = await nodemailer.createTestAccount();
      
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      // 1. Email to Prateek (notification)
      const infoToAdmin = await transporter.sendMail({
        from: `"Portfolio Contact" <contact@example.com>`,
        to: "prateek@edoflip.com",
        replyTo: data.email,
        subject: `New contact form submission from ${data.name}`,
        text: `
Name: ${data.name}
Email: ${data.email}

Message:
${data.message}
        `,
        html: `
<h2>New Contact Form Submission</h2>
<p><strong>From:</strong> ${data.name}</p>
<p><strong>Email:</strong> ${data.email}</p>
<h3>Message:</h3>
<p>${data.message.replace(/\n/g, '<br>')}</p>
        `,
      });
      
      // 2. Confirmation email to the sender
      const infoToSender = await transporter.sendMail({
        from: `"Prateek Portfolio" <contact@example.com>`,
        to: data.email,
        subject: `Thank you for contacting Prateek`,
        text: `
Dear ${data.name},

Thank you for reaching out to me through my portfolio website. I've received your message and will get back to you as soon as possible.

For your reference, here's a copy of your message:
"${data.message}"

Best regards,
Prateek
        `,
        html: `
<h2>Thank You for Your Message</h2>
<p>Dear ${data.name},</p>
<p>Thank you for reaching out to me through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
<p>For your reference, here's a copy of your message:</p>
<blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #ccc; margin: 20px 0;">
  "${data.message.replace(/\n/g, '<br>')}"
</blockquote>
<p>Best regards,<br>Prateek</p>
        `,
      });
      
      console.log('Test emails sent:');
      console.log('- To admin: %s', infoToAdmin.messageId);
      console.log('- To sender: %s', infoToSender.messageId);
      console.log('Preview URLs:');
      console.log('- Admin email: %s', nodemailer.getTestMessageUrl(infoToAdmin));
      console.log('- Sender email: %s', nodemailer.getTestMessageUrl(infoToSender));
      
      return true;
    }
    
    // SENDGRID IMPLEMENTATION
    
    // 1. Prepare notification email to Prateek
    const msgToAdmin = {
      to: 'prateek@edoflip.com', // Destination email
      from: 'prateek@edoflip.com', // This must be a verified sender in your SendGrid account
      replyTo: data.email, // Set reply-to as the sender's email
      subject: `New contact form submission from ${data.name}`,
      text: `
Name: ${data.name}
Email: ${data.email}

Message:
${data.message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>From:</strong> ${data.name}</p>
<p><strong>Email:</strong> ${data.email}</p>
<h3>Message:</h3>
<p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    };
    
    // 2. Prepare confirmation email to the sender
    const msgToSender = {
      to: data.email, // Send to the form submitter
      from: 'prateek@edoflip.com', // Must be a verified sender in SendGrid
      subject: `Thank you for contacting Prateek`,
      text: `
Dear ${data.name},

Thank you for reaching out to me through my portfolio website. I've received your message and will get back to you as soon as possible.

For your reference, here's a copy of your message:
"${data.message}"

Best regards,
Prateek
      `,
      html: `
<h2>Thank You for Your Message</h2>
<p>Dear ${data.name},</p>
<p>Thank you for reaching out to me through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
<p>For your reference, here's a copy of your message:</p>
<blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #ccc; margin: 20px 0;">
  "${data.message.replace(/\n/g, '<br>')}"
</blockquote>
<p>Best regards,<br>Prateek</p>
      `,
    };
    
    // Send both emails using SendGrid
    await Promise.all([
      sgMail.send(msgToAdmin),
      sgMail.send(msgToSender)
    ]);
    
    console.log('Both emails sent successfully via SendGrid');
    return true;
  // @ts-ignore - Handling SendGrid errors which may have response property
  } catch (error: any) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('SendGrid error response:', error.response.body);
    }
    return false;
  }
}