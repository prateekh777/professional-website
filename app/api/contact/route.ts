import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendContactFormEmail, verifyRecaptcha } from '@/lib/email';
import { serverEnv } from '@/lib/env';

// Define the contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  recaptchaToken: z.string(),
});

export async function POST(request: Request) {
  console.log('📨 ===== CONTACT FORM SUBMISSION =====');
  console.log('📨 Received contact form submission');
  
  try {
    // Parse the request body
    const body = await request.json();
    console.log('📨 Form data received:', {
      name: body.name,
      email: body.email,
      messageLength: body.message?.length || 0,
      hasRecaptchaToken: !!body.recaptchaToken,
      tokenLength: body.recaptchaToken?.length || 0
    });
    
    // Check if required fields are present
    if (!body.name || !body.email || !body.message) {
      console.error('❌ Missing required fields in form submission');
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check environment variables
    console.log('📨 Checking environment variables...');
    console.log(`📨 NODE_ENV: ${serverEnv.NODE_ENV}`);
    console.log(`📨 SENDGRID_API_KEY set: ${!!serverEnv.SENDGRID_API_KEY}`);
    console.log(`📨 EMAIL_FROM: ${serverEnv.EMAIL_FROM}`);
    console.log(`📨 EMAIL_TO: ${serverEnv.EMAIL_TO}`);
    
    // Check if SendGrid API key is configured
    if (!serverEnv.SENDGRID_API_KEY) {
      console.warn('⚠️ SendGrid API key is not configured. Email will not be sent.');
      
      // For development, we'll still return success
      if (serverEnv.NODE_ENV === 'development') {
        console.log('📨 In development mode - returning success despite missing SendGrid API key');
        return NextResponse.json(
          { 
            success: true, 
            message: 'Message received (Note: Email not sent - SendGrid API key not configured)',
            debug: true
          },
          { status: 200 }
        );
      } else {
        // In production, we should return an error
        return NextResponse.json(
          { success: false, message: 'Server configuration error: Email service not available' },
          { status: 500 }
        );
      }
    }
    
    // Send email using our utility
    console.log('📨 Starting email sending process...');
    const emailResult = await sendContactFormEmail(
      body.name, 
      body.email, 
      body.message,
      body.recaptchaToken
    );
    
    console.log('📨 Email sending result:', emailResult);
    
    if (!emailResult.success) {
      console.error('❌ Email sending failed:', emailResult.message);
      console.error('❌ Admin email result:', emailResult.adminResult);
      console.error('❌ User email result:', emailResult.userResult);
      
      // In development, we might want to continue anyway
      if (serverEnv.NODE_ENV === 'development') {
        console.log('📨 In development mode - returning success despite email sending failure');
        return NextResponse.json(
          { 
            success: true, 
            message: 'Message received (Note: Email sending failed but ignored in development)',
            emailError: emailResult.message,
            emailDetails: {
              adminResult: emailResult.adminResult,
              userResult: emailResult.userResult
            },
            debug: true
          },
          { status: 200 }
        );
      } else {
        // In production, we should return an error
        return NextResponse.json(
          { 
            success: false, 
            message: 'Failed to send email: ' + emailResult.message,
            details: {
              adminResult: emailResult.adminResult,
              userResult: emailResult.userResult
            }
          },
          { status: 500 }
        );
      }
    }
    
    // Return success response
    console.log('✅ Contact form submission processed successfully');
    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error processing contact form submission:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your request',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } finally {
    console.log('📨 ===== END CONTACT FORM SUBMISSION =====');
  }
} 