# Environment Variables Guide

This document explains how to set up environment variables for both local development and Vercel deployment.

## Environment Variables Overview

Our application uses the following environment variables:

| Variable | Description | Required | Public |
|----------|-------------|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | The URL of the website | Yes | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key ID for S3 access | Yes | No |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key for S3 access | Yes | No |
| `AWS_REGION` | AWS region (defaults to us-east-1) | No | No |
| `AWS_S3_BUCKET` | AWS S3 bucket name for file storage | Yes | No |
| `SENDGRID_API_KEY` | SendGrid API key for sending emails | Yes | No |
| `MONGODB_URI` | MongoDB connection string | Yes | No |

## Local Development Setup

For local development, follow these steps:

1. Copy the `.env.local.template` file to `.env.local`:
   ```bash
   cp .env.local.template .env.local
   ```

2. Edit the `.env.local` file and fill in your actual values for each environment variable.

3. The `.env.local` file is automatically loaded by Next.js during development.

4. **Important**: Never commit your `.env.local` file to version control. It's already added to `.gitignore`.

## Vercel Deployment Setup

For Vercel deployment, follow these steps:

1. Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard).

2. Navigate to the project settings.

3. Go to the "Environment Variables" section.

4. Add each environment variable with its corresponding value:
   - `NEXT_PUBLIC_SITE_URL` (set to your production URL)
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_S3_BUCKET`
   - `SENDGRID_API_KEY`
   - `MONGODB_URI`

5. You can specify different values for different environments (Production, Preview, Development).

## Using Environment Variables in Code

### In Server Components or API Routes

```typescript
import { serverEnv, validateEnv } from '@/lib/env';

export async function GET() {
  // Validate that all required environment variables are present
  validateEnv();
  
  // Use server-only environment variables
  const s3Bucket = serverEnv.AWS_S3_BUCKET;
  const mongoUri = serverEnv.MONGODB_URI;
  
  // Your code here...
}
```

### In Client Components

Only use public environment variables (prefixed with `NEXT_PUBLIC_`) in client components:

```typescript
import { publicEnv } from '@/lib/env';

export default function MyComponent() {
  // Use public environment variables
  const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL;
  
  // Your code here...
}
```

## Security Best Practices

1. Never expose sensitive environment variables to the client. Only variables prefixed with `NEXT_PUBLIC_` are available in the browser.

2. Use the `validateEnv()` function at the beginning of server-side code to ensure all required environment variables are present.

3. Rotate your API keys and secrets regularly.

4. Use different API keys for development and production environments.

5. Consider using Vercel's integration with AWS Secrets Manager or similar services for managing sensitive credentials in production. 