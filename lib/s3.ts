import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { serverEnv } from './env';

// Initialize S3 client
const s3Client = new S3Client({
  region: serverEnv.AWS_REGION,
  credentials: {
    accessKeyId: serverEnv.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: serverEnv.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Bucket name from environment variables
const bucketName = serverEnv.AWS_S3_BUCKET || '';

/**
 * Generates a presigned URL for uploading a file to S3
 * @param key The key (path) where the file will be stored in S3
 * @param contentType The content type of the file
 * @param expiresIn Time in seconds until the presigned URL expires (default: 3600 seconds / 1 hour)
 * @returns A presigned URL for uploading the file
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    throw new Error('Failed to generate upload URL');
  }
}

/**
 * Generates a presigned URL for downloading a file from S3
 * @param key The key (path) of the file in S3
 * @param expiresIn Time in seconds until the presigned URL expires (default: 3600 seconds / 1 hour)
 * @returns A presigned URL for downloading the file
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

/**
 * Deletes a file from S3
 * @param key The key (path) of the file in S3
 */
export async function deleteFile(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Generates a full S3 URL for a file
 * @param key The key (path) of the file in S3
 * @returns The full S3 URL
 */
export function getS3Url(key: string): string {
  if (!key) return '';
  if (key.startsWith('http')) return key; // Already a full URL
  
  return `https://${bucketName}.s3.${serverEnv.AWS_REGION}.amazonaws.com/${key}`;
}

/**
 * Extracts the key from an S3 URL
 * @param url The S3 URL
 * @returns The key (path) of the file in S3
 */
export function getKeyFromUrl(url: string): string {
  if (!url) return '';
  if (!url.includes('amazonaws.com')) return url; // Not an S3 URL
  
  // Extract the key from the URL
  const urlObj = new URL(url);
  const key = urlObj.pathname.startsWith('/') 
    ? urlObj.pathname.substring(1) 
    : urlObj.pathname;
    
  return key;
}

/**
 * Generates a unique key for a file in S3
 * @param folder The folder to store the file in
 * @param fileName The original file name
 * @returns A unique key for the file
 */
export function generateUniqueKey(folder: string, fileName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = fileName.includes('.') 
    ? fileName.split('.').pop() 
    : '';
  
  const sanitizedFileName = fileName
    .split('.')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  
  return `${folder}/${sanitizedFileName}-${timestamp}-${randomString}.${extension}`;
} 