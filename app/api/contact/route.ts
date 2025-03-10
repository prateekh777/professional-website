import { NextResponse } from 'next/server';
import { contactFormSchema, sendContactEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // Validate form data using Zod
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);
    
    // Send email
    const success = await sendContactEmail(validatedData);
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Message sent successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Failed to send message' }, { status: 500 });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ success: false, message: 'Invalid form data' }, { status: 400 });
  }
} 