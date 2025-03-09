import { NextResponse } from 'next/server';
import { contactFormSchema, sendContactFormEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate form data using Zod
    try {
      const validatedData = contactFormSchema.parse(body);
      
      // Send email
      const success = await sendContactFormEmail(validatedData);
      
      if (success) {
        return NextResponse.json(
          { success: true, message: 'Message sent successfully' },
          { status: 200 }
        );
      } else {
        console.error('Email sending failed but did not throw an error');
        return NextResponse.json(
          { success: false, message: 'Failed to send message' },
          { status: 500 }
        );
      }
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { success: false, message: 'Invalid form data', error: String(validationError) },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in contact API route:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error. Please try again later.',
        error: String(error)
      },
      { status: 500 }
    );
  }
} 