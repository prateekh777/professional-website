import { serverEnv } from './env';

/**
 * Verifies a reCAPTCHA token with Google's reCAPTCHA API
 * 
 * @param token The reCAPTCHA token to verify
 * @returns A boolean indicating whether the token is valid
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    // Check if reCAPTCHA secret key is configured
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.warn('RECAPTCHA_SECRET_KEY is not configured');
      return true; // Skip verification in development if not configured
    }

    // Verify the token with Google's reCAPTCHA API
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    // Parse the response
    const data = await response.json();

    // Return whether the token is valid
    return data.success === true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA token:', error);
    return false;
  }
} 