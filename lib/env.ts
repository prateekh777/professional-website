/**
 * Environment variables utility
 * 
 * This file provides type-safe access to environment variables
 * and validates that required variables are present.
 */

// Public environment variables (accessible in browser)
export const publicEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

// Server-only environment variables (not exposed to browser)
export const serverEnv = {
  // AWS Configuration
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || '',
  
  // Email Service
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  SENDGRID_VERIFIED_SENDER: process.env.SENDGRID_VERIFIED_SENDER || 'prateek@edoflip.com',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI,
  
  // Other server environment variables
  NODE_ENV: process.env.NODE_ENV || 'development',
};

/**
 * Validates that all required environment variables are present
 * Call this function in your API routes or server components
 * to ensure environment variables are properly configured
 */
export function validateEnv() {
  const requiredEnvVars = [
    { key: 'AWS_ACCESS_KEY_ID', value: serverEnv.AWS_ACCESS_KEY_ID },
    { key: 'AWS_SECRET_ACCESS_KEY', value: serverEnv.AWS_SECRET_ACCESS_KEY },
    { key: 'AWS_S3_BUCKET', value: serverEnv.AWS_S3_BUCKET },
    { key: 'SENDGRID_API_KEY', value: serverEnv.SENDGRID_API_KEY },
    { key: 'MONGODB_URI', value: serverEnv.MONGODB_URI },
  ];

  const missingEnvVars = requiredEnvVars
    .filter(({ value }) => !value)
    .map(({ key }) => key);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }

  return true;
} 