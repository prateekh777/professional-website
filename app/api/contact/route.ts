import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define the contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  recaptchaToken: z.string(),
});

// Function to verify reCAPTCHA token
async function verifyRecaptcha(token: string) {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'}&response=${token}`,
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    try {
      contactFormSchema.parse(body);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid form data' },
        { status: 400 }
      );
    }
    
    const { name, email, message, recaptchaToken } = body;

    // Verify reCAPTCHA token
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // In a real application, you would send an email here
    // For example, using a service like SendGrid, Mailgun, etc.
    // For now, we'll just log the data and return a success response
    console.log('Contact form submission:', { name, email, message });

    // Send confirmation email to user
    // await sendConfirmationEmail(email, name);

    // Send notification email to admin
    // await sendNotificationEmail(name, email, message);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your request' 
      },
      { status: 500 }
    );
  }
} 