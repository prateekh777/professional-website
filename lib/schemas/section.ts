import { z } from 'zod';

/**
 * Section Schema
 * 
 * Defines the structure for website content sections
 */

// Media reference schema for section content
export const mediaSectionSchema = z.object({
  type: z.enum(['image', 'video', 'embed']),
  url: z.string().url(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

// Section types enum
export const sectionTypeEnum = z.enum([
  'hero',
  'grid',
  'carousel',
  'testimonial',
  'feature',
  'cta',
  'text',
  'media',
  'contact',
]);

// Main section schema
export const sectionSchema = z.object({
  id: z.string().uuid(),
  type: sectionTypeEnum,
  title: z.string(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  order: z.number().int().nonnegative(),
  isActive: z.boolean().default(true),
  media: z.array(mediaSectionSchema).optional(),
  metadata: z.record(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Insert schema (omits auto-generated fields)
export const insertSectionSchema = sectionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  type: sectionTypeEnum,
});

// Update schema
export const updateSectionSchema = insertSectionSchema.partial();

// TypeScript type definitions
export type MediaSection = z.infer<typeof mediaSectionSchema>;
export type SectionType = z.infer<typeof sectionTypeEnum>;
export type Section = z.infer<typeof sectionSchema>;
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type UpdateSection = z.infer<typeof updateSectionSchema>; 