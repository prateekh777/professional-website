import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { serverEnv } from '@/lib/env';

/**
 * GET /api/health
 * 
 * Returns system status including database and email configuration
 */
export async function GET() {
  const healthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    services: {
      database: {
        status: 'unknown',
        message: ''
      },
      email: {
        status: 'unknown',
        message: ''
      },
      storage: {
        status: 'unknown',
        message: ''
      }
    }
  };

  // Check database connection
  try {
    await connectToMongoDB();
    healthStatus.services.database.status = 'ok';
    healthStatus.services.database.message = 'Connected to MongoDB';
  } catch (error) {
    healthStatus.services.database.status = 'error';
    healthStatus.services.database.message = 'Failed to connect to MongoDB';
    healthStatus.status = 'error';
  }

  // Check email configuration
  if (serverEnv.SENDGRID_API_KEY) {
    healthStatus.services.email.status = 'ok';
    healthStatus.services.email.message = 'SendGrid API key is configured';
  } else {
    healthStatus.services.email.status = 'error';
    healthStatus.services.email.message = 'SendGrid API key is not configured';
    healthStatus.status = 'error';
  }

  // Check S3 storage configuration
  if (
    serverEnv.AWS_ACCESS_KEY_ID &&
    serverEnv.AWS_SECRET_ACCESS_KEY &&
    serverEnv.AWS_S3_BUCKET
  ) {
    healthStatus.services.storage.status = 'ok';
    healthStatus.services.storage.message = 'AWS S3 is configured';
  } else {
    healthStatus.services.storage.status = 'error';
    healthStatus.services.storage.message = 'AWS S3 is not fully configured';
    healthStatus.status = 'error';
  }

  // Return health status with appropriate status code
  return NextResponse.json(
    healthStatus,
    { status: healthStatus.status === 'ok' ? 200 : 500 }
  );
} 