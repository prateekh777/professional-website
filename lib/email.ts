import { z } from 'zod';
import { serverEnv } from './env';

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
    // Get the secret key from environment variables
    const secretKey = serverEnv.RECAPTCHA_SECRET_KEY;
    
    // Skip verification in development if no secret key is provided
    if (!secretKey) {
      console.warn('No reCAPTCHA secret key found. Verification skipped.');
      return true;
    }
    
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
export async function sendContactFormEmail(data: ContactFormData): Promise<boolean> {
  try {
    // Verify reCAPTCHA if token is provided
    if (data.recaptchaToken) {
      const isValidRecaptcha = await verifyRecaptcha(data.recaptchaToken);
      if (!isValidRecaptcha) {
        console.error('reCAPTCHA verification failed');
        return false;
      }
    }
    
    // Get SendGrid API key from environment
    const sendgridApiKey = serverEnv.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
      console.error('SendGrid API key not found. Unable to send email.');
      return false;
    }
    
    // Use verified sender email from environment or fallback to the hardcoded one
    const verifiedSender = serverEnv.SENDGRID_VERIFIED_SENDER || 'prateek@edoflip.com';
    
    // Create the raw JSON data for admin notification - exactly matching the curl format
    const adminRawData = {
      personalizations: [
        {
          to: [{ email: 'prateek@edoflip.com' }],
          subject: `New contact form submission from ${data.name}`
        }
      ],
      from: { email: verifiedSender },
      content: [
        {
          type: "text/plain",
          value: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
        }
      ]
    };
    
    // Create the raw JSON data for sender confirmation - exactly matching the curl format
    const senderRawData = {
      personalizations: [
        {
          to: [{ email: data.email }],
          subject: `Thank you for contacting Prateek`
        }
      ],
      from: { email: verifiedSender },
      content: [
        {
          type: "text/plain",
          value: `Dear ${data.name},\n\nThank you for reaching out to me through my portfolio website. I've received your message and will get back to you as soon as possible.\n\nFor your reference, here's a copy of your message:\n"${data.message}"\n\nBest regards,\nPrateek`
        }
      ]
    };
    
    // Use direct API calls with fetch - exactly matching the curl format
    try {
      // Send admin notification email
      const adminResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminRawData)
      });
      
      if (!adminResponse.ok) {
        const errorText = await adminResponse.text();
        console.error('Error sending admin email:', errorText);
        throw new Error(`Failed to send admin email: ${errorText}`);
      }
      
      // Send confirmation email to sender
      const senderResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(senderRawData)
      });
      
      if (!senderResponse.ok) {
        const errorText = await senderResponse.text();
        console.error('Error sending confirmation email:', errorText);
        throw new Error(`Failed to send confirmation email: ${errorText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error in SendGrid API call:', error);
      throw error; // Rethrow to be caught by outer catch block
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
} 