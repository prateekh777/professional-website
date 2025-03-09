import { serverEnv } from './env';

/**
 * S3 URL utility for handling pre-uploaded media files
 */

// S3 bucket and region from environment variables
const bucketName = serverEnv.AWS_S3_BUCKET || '';
const region = serverEnv.AWS_REGION || 'us-east-1';

// Base URL for media files
const baseMediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || '';

/**
 * Get the full URL for a media file
 * @param path The path to the media file
 * @returns The full URL to the media file
 */
export function getMediaUrl(path: string): string {
  if (!path) return '';
  
  // If the path is already a full URL, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Combine base URL with path
  return `${baseMediaUrl}/${cleanPath}`;
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
    [urlField]: getMediaUrl(item[urlField] ? String(item[urlField]) : '')
  }));
}

/**
 * Format all image URLs in an object
 * @param item The object containing image URLs
 * @returns The object with formatted image URLs
 */
export function formatItemUrls<T extends Record<string, any>>(item: T): T {
  if (!item) return item;
  
  const result = { ...item } as Record<string, any>;
  
  // Process image fields
  if ('image' in result && result.image) {
    result.image = getMediaUrl(String(result.image));
  }
  
  if ('coverImage' in result && result.coverImage) {
    result.coverImage = getMediaUrl(String(result.coverImage));
  }
  
  if ('thumbnail' in result && result.thumbnail) {
    result.thumbnail = getMediaUrl(String(result.thumbnail));
  }
  
  // Process arrays of images
  if ('images' in result && result.images && Array.isArray(result.images)) {
    result.images = result.images.map((img: string) => getMediaUrl(img));
  }
  
  return result as T;
}