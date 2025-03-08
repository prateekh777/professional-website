import sgMail from '@sendgrid/mail';
import { serverEnv } from './env';

// Initialize SendGrid with API key
if (serverEnv.SENDGRID_API_KEY) {
  sgMail.setApiKey(serverEnv.SENDGRID_API_KEY);
}

/**
 * Email template for contact form submissions
 */
interface ContactFormEmailData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

/**
 * Sends a contact form email using SendGrid
 * 
 * @param data The contact form data
 * @returns A promise that resolves when the email is sent
 */
export async function sendContactFormEmail(data: ContactFormEmailData): Promise<boolean> {
  try {
    // Check if SendGrid API key is configured
    if (!serverEnv.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not configured');
      return false;
    }

    const { name, email, message, subject } = data;
    const defaultSubject = 'New Contact Form Submission';

    // Create the email
    const msg = {
      to: process.env.CONTACT_EMAIL || 'your-email@example.com', // Your email address
      from: process.env.FROM_EMAIL || 'noreply@yourdomain.com', // Your verified sender email
      subject: subject || defaultSubject,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Message:</strong></p>
  <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
    ${message.replace(/\n/g, '<br>')}
  </div>
</div>
      `,
    };

    // Send the email
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return false;
  }
} 