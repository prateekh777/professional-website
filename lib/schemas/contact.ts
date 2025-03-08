import { z } from 'zod';

/**
 * Contact Form Schema
 * 
 * Defines the structure for contact form submissions
 */

// Main contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message must be less than 5000 characters'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject must be less than 200 characters').optional(),
  recaptchaToken: z.string().min(1, 'reCAPTCHA verification is required'),
});

// TypeScript type definition
export type ContactForm = z.infer<typeof contactFormSchema>; 