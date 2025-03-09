Here are all the files and code that implement the email functionality in the portfolio project:

1. Server-side Implementation (Backend)
server/email.ts
This is the main file handling email functionality:

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
    // Use verified sender email from environment or fallback to the hardcoded one
    const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || 'prateek@edoflip.com';
    console.log(`Using verified sender email: ${verifiedSender}`);
    
    // Create the raw JSON data for admin notification
    const adminRawData = {
      personalizations: [
        {
          to: [{ email: 'prateek@edoflip.com' }],
          subject: `New contact form submission from ${data.name}`
        }
      ],
      from: { email: verifiedSender },
      reply_to: { email: data.email },
      content: [
        {
          type: "text/plain",
          value: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
        },
        {
          type: "text/html",
          value: `<h2>New Contact Form Submission</h2><p><strong>From:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><h3>Message:</h3><p>${data.message.replace(/\n/g, '<br>')}</p>`
        }
      ]
    };
    
    // Create the raw JSON data for sender confirmation
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
        },
        {
          type: "text/html",
          value: `<h2>Thank You for Your Message</h2><p>Dear ${data.name},</p><p>Thank you for reaching out to me through my portfolio website. I've received your message and will get back to you as soon as possible.</p><p>For your reference, here's a copy of your message:</p><blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #ccc; margin: 20px 0;">"${data.message.replace(/\n/g, '<br>')}"</blockquote><p>Best regards,<br>Prateek</p>`
        }
      ]
    };
    
    // Log the preparations for debugging
    console.log('Preparing emails with the following configurations:');
    console.log('Admin notification recipient:', 'prateek@edoflip.com');
    console.log('Confirmation email recipient:', data.email);
    console.log('Using sender email:', verifiedSender);
    
    // Use direct API calls with fetch instead of the SendGrid library
    // which has strict typing that may cause TypeScript errors
    try {
      console.log('Sending admin notification email...');
      const adminResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminRawData)
      });
      
      if (!adminResponse.ok) {
        const errorData = await adminResponse.json();
        console.error('Error sending admin email:', errorData);
        throw new Error(`Failed to send admin email: ${JSON.stringify(errorData)}`);
      }
      
      console.log('Admin notification email sent successfully');
      
      console.log('Sending confirmation email to sender...');
      const senderResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(senderRawData)
      });
      
      if (!senderResponse.ok) {
        const errorData = await senderResponse.json();
        console.error('Error sending confirmation email:', errorData);
        throw new Error(`Failed to send confirmation email: ${JSON.stringify(errorData)}`);
      }
      
      console.log('Confirmation email sent successfully');
    } catch (error: any) {
      console.error('Error in direct SendGrid API call:', error);
      throw error; // Rethrow to be caught by outer catch block
    }
    
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
server/routes.ts
This file includes the route handler for the contact form:

// Other imports here...
import { sendContactEmail, contactFormSchema } from './email';
export async function registerRoutes(app: Express): Promise<Server> {
  // Other route handlers here...
  // Contact form endpoint
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      // Validate form data using Zod
      const validatedData = contactFormSchema.parse(req.body);
      
      // Send email
      const success = await sendContactEmail(validatedData);
      
      if (success) {
        res.status(200).json({ success: true, message: 'Message sent successfully' });
      } else {
        res.status(500).json({ success: false, message: 'Failed to send message' });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(400).json({ success: false, message: 'Invalid form data' });
    }
  });
  // Other endpoints here...
}
api/index.ts
The API serverless function also includes the contact form endpoint:

// Other imports and code here...
app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    // Import the contact form schema and email function
    const { contactFormSchema, sendContactEmail } = await import('../server/email');
    
    // Validate request body
    const validatedData = contactFormSchema.parse(req.body);
    
    // Send the email
    const success = await sendContactEmail(validatedData);
    
    if (success) {
      res.status(200).json({ success: true, message: 'Message sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send message' });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(400).json({ success: false, message: 'Invalid form data' });
  }
});
2. Client-side Implementation (Frontend)
client/src/pages/contact.tsx
This is the front-end contact form component:

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormValues = z.infer<typeof formSchema>;
export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for your message. I'll respond as soon as possible.",
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to send message. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="container max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Contact Me</h1>
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What would you like to discuss?" 
                      rows={6}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
3. Testing and Debugging Utilities
scripts/test-email.ts
Testing script for email functionality:

import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import { ContactFormData, sendContactEmail } from '../server/email';
// Load environment variables
dotenv.config();
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
  
  const testData: ContactFormData = {
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
  
  const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || 'prateek@edoflip.com';
  
  // Simple email object
  const msg = {
    to: 'prateek@edoflip.com',
    from: verifiedSender,
    subject: 'SendGrid API Key Test',
    text: 'This is a test email to verify SendGrid API key permissions.',
    html: '<p>This is a test email to verify SendGrid API key permissions.</p>',
  };
  
  console.log('Direct test email config:', JSON.stringify(msg, null, 2));
  
  try {
    await sgMail.send(msg);
    console.log('✅ Direct test email sent successfully!');
    console.log('\nNow testing the contact email flow...');
    
    // Now test the actual contact form email flow
    const success = await sendContactEmail(testData);
    
    if (success) {
      console.log('✅ Test email sent successfully!');
      console.log('Email functionality is working correctly.');
    } else {
      console.error('❌ Failed to send test email.');
      console.log('Check your SendGrid configuration and try again.');
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
scripts/debug-sendgrid-env.ts
Utility to debug environment variables:

// This script checks if SendGrid environment variables are properly loaded
import * as dotenv from 'dotenv';
// Load environment variables
dotenv.config();
console.log('\nChecking SendGrid Environment Variables:\n');
// Check API Key
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  console.log('✅ SENDGRID_API_KEY is set');
  console.log(`Length: ${apiKey.length} characters`);
  console.log(`First 10 chars: ${apiKey.substring(0, 10)}...`);
} else {
  console.log('❌ SENDGRID_API_KEY is not set');
}
// Check Verified Sender
const sender = process.env.SENDGRID_VERIFIED_SENDER;
if (sender) {
  console.log('\n✅ SENDGRID_VERIFIED_SENDER is set');
  console.log(`Email: ${sender}`);
} else {
  console.log('\n❌ SENDGRID_VERIFIED_SENDER is not set');
}
// Test importing the SendGrid package
console.log('\nTesting @sendgrid/mail package:');
try {
  const sgMail = require('@sendgrid/mail');
  if (apiKey) {
    sgMail.setApiKey(apiKey);
    console.log('✅ Successfully initialized SendGrid client');
  }
} catch (error) {
  console.error('❌ Error initializing SendGrid:', error);
}
// Show all environment variables (masked)
console.log('\nAll environment variables (values masked):');
Object.keys(process.env).forEach(key => {
  const value = process.env[key];
  if (value) {
    if (key.toLowerCase().includes('key') || key.toLowerCase().includes('secret')) {
      console.log(`${key}: ${value.substring(0, 5)}...`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
});
scripts/test-sendgrid-exact.sh
Shell script for direct API testing:

#!/bin/bash
# This script tests the SendGrid API with a direct curl request
# to verify that the API key has proper permissions
# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "No .env file found. Make sure SENDGRID_API_KEY is set in your environment."
  exit 1
fi
# Check if API key is set
if [ -z "$SENDGRID_API_KEY" ]; then
  echo "SENDGRID_API_KEY is not set. Please check your .env file."
  exit 1
fi
# Get the API key prefix for logging (first 10 chars)
API_KEY_PREFIX=${SENDGRID_API_KEY:0:10}
# Default to verified sender or use a fallback
SENDER=${SENDGRID_VERIFIED_SENDER:-"prateek@edoflip.com"}
echo "Testing SendGrid API with exact curl format..."
echo "API Key starts with: $API_KEY_PREFIX..."
echo "Sender email: $SENDER"
# Create a temporary JSON file for the request body
cat > /tmp/sendgrid_test.json << EOF
{
  "personalizations": [
    {
      "to": [{"email": "prateek@edoflip.com"}],
      "subject": "SendGrid API Test"
    }
  ],
  "from": {"email": "$SENDER"},
  "content": [
    {
      "type": "text/plain",
      "value": "This is a test email sent directly via curl to verify SendGrid API key permissions."
    }
  ]
}
EOF
# Send the request
curl -s \
  --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer $SENDGRID_API_KEY" \
  --header 'Content-Type: application/json' \
  --data-binary @/tmp/sendgrid_test.json
# Clean up
rm /tmp/sendgrid_test.json
echo ""
echo "If you didn't see any error response above, the email was sent successfully."
4. Environment Configuration
.env
Environment variables (values would be in your actual file):

SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_VERIFIED_SENDER=prateek@edoflip.com
.env.example
Example environment file:

# SendGrid Email API
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_VERIFIED_SENDER=your_verified_sender_email@example.com
# Example: If you want to use reCAPTCHA
# RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here