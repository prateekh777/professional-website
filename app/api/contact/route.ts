import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { contactFormSchema } from '@/lib/schemas/contact';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendContactFormEmail } from '@/lib/email';

// Rate limiting
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5; // Maximum 5 requests per hour

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();

/**
 * POST /api/contact
 * 
 * Processes contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    const now = Date.now();
    const rateLimit = rateLimitMap.get(ip);
    
    if (rateLimit) {
      // Reset count if window has passed
      if (now - rateLimit.timestamp > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      } 
      // Increment count if within window
      else if (rateLimit.count < MAX_REQUESTS_PER_WINDOW) {
        rateLimitMap.set(ip, { count: rateLimit.count + 1, timestamp: rateLimit.timestamp });
      } 
      // Return error if rate limit exceeded
      else {
        return NextResponse.json(
          { message: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    } else {
      // First request from this IP
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }
    
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);
    
    // Verify reCAPTCHA token
    const isValidRecaptcha = await verifyRecaptcha(validatedData.recaptchaToken);
    
    if (!isValidRecaptcha) {
      return NextResponse.json(
        { message: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }
    
    // Send the email
    const emailSent = await sendContactFormEmail({
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
      subject: validatedData.subject,
    });
    
    if (!emailSent) {
      return NextResponse.json(
        { message: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    // Return a generic error response
    return NextResponse.json(
      { message: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
} 