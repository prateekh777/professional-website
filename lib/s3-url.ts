import { serverEnv } from './env';

/**
 * S3 URL utility for handling pre-uploaded media files
 */

// S3 bucket and region from environment variables
const bucketName = serverEnv.AWS_S3_BUCKET || '';
const region = serverEnv.AWS_REGION || 'us-east-1';

/**
 * Ensures a URL is a full S3 URL
 * If the input is already a full URL (starts with http), it returns it unchanged
 * If the input is a relative path, it converts it to a full S3 URL
 * 
 * @param path The path or URL of the media file
 * @returns A full URL to the media file
 */
export function getMediaUrl(path: string | undefined | null): string {
  if (!path) return '';
  
  // If it's already a full URL, return it as is
  if (path.startsWith('http')) return path;
  
  // If it's a relative path, convert it to an S3 URL
  return `https://${bucketName}.s3.${region}.amazonaws.com/${path.startsWith('/') ? path.substring(1) : path}`;
}

/**
 * Formats an array of media items to ensure all URLs are full S3 URLs
 * 
 * @param mediaItems Array of media items with URL properties
 * @param urlField The name of the URL field in each media item (default: 'url')
 * @returns The same array with all URLs converted to full S3 URLs
 */
export function formatMediaUrls<T extends Record<string, any>>(
  mediaItems: T[] | undefined | null,
  urlField: keyof T = 'url' as keyof T
): T[] {
  if (!mediaItems) return [];
  
  return mediaItems.map(item => ({
    ...item,
    [urlField]: getMediaUrl(item[urlField] as string | undefined | null)
  }));
}

/**
 * Formats an object to ensure all specified URL fields are full S3 URLs
 * 
 * @param item The object containing URL fields
 * @param urlFields Array of field names that contain URLs
 * @returns The same object with all specified URL fields converted to full S3 URLs
 */
export function formatItemUrls<T extends Record<string, any>>(
  item: T | undefined | null,
  urlFields: (keyof T)[]
): T | null {
  if (!item) return null;
  
  const formattedItem = { ...item };
  
  urlFields.forEach(field => {
    if (field in formattedItem) {
      (formattedItem as any)[field] = getMediaUrl((formattedItem as any)[field] as string | undefined | null);
    }
  });
  
  return formattedItem;
}