import { NextResponse } from 'next/server';
import { serverEnv, publicEnv, validateEnv } from '@/lib/env';

export async function GET() {
  try {
    // This will throw an error if any required environment variables are missing
    validateEnv();
    
    // Return a success response with some environment variable information
    // Note: We're only returning non-sensitive information
    return NextResponse.json({
      message: 'Environment variables are properly configured',
      publicVariables: {
        siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
      },
      serverVariablesConfigured: {
        aws: Boolean(serverEnv.AWS_ACCESS_KEY_ID && serverEnv.AWS_SECRET_ACCESS_KEY && serverEnv.AWS_S3_BUCKET),
        awsRegion: serverEnv.AWS_REGION,
        sendgrid: Boolean(serverEnv.SENDGRID_API_KEY),
        mongodb: Boolean(serverEnv.MONGODB_URI),
      }
    }, { status: 200 });
  } catch (error) {
    // If validateEnv() throws an error, return it
    if (error instanceof Error) {
      return NextResponse.json({
        error: 'Environment variables configuration error',
        message: error.message,
      }, { status: 500 });
    }
    
    // For any other errors
    return NextResponse.json({
      error: 'Unknown error',
      message: 'An unknown error occurred while checking environment variables',
    }, { status: 500 });
  }
} 