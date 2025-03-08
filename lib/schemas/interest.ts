import { z } from 'zod';

/**
 * Interest Schema
 * 
 * Defines the structure for personal interests
 */

// Interest category enum
export const interestCategoryEnum = z.enum([
  'startups',
  'science',
  'spirituality',
  'technology',
  'art',
  'music',
  'literature',
  'travel',
  'sports',
  'food',
  'other',
]);

// Interest media schema
export const interestMediaSchema = z.object({
  type: z.enum(['image', 'video', 'embed']),
  url: z.string().url(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

// Main interest schema
export const interestSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  category: interestCategoryEnum,
  description: z.string(),
  content: z.string().optional(),
  media: z.array(interestMediaSchema).optional(),
  links: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
  })).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Insert schema (omits auto-generated fields)
export const insertInterestSchema = interestSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema
export const updateInterestSchema = insertInterestSchema.partial();

// TypeScript type definitions
export type InterestCategory = z.infer<typeof interestCategoryEnum>;
export type InterestMedia = z.infer<typeof interestMediaSchema>;
export type Interest = z.infer<typeof interestSchema>;
export type InsertInterest = z.infer<typeof insertInterestSchema>;
export type UpdateInterest = z.infer<typeof updateInterestSchema>; 