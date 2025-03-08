import { z } from 'zod';

/**
 * Case Study Schema
 * 
 * Defines the structure for detailed case studies
 */

// Context information schema
export const contextSchema = z.object({
  challenge: z.string(),
  audience: z.string().optional(),
  constraints: z.string().optional(),
  goals: z.array(z.string()).optional(),
});

// Action taken schema
export const actionSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().url().optional(),
  order: z.number().int().nonnegative(),
});

// Result schema
export const resultSchema = z.object({
  title: z.string(),
  description: z.string(),
  metrics: z.record(z.string()).optional(),
  testimonial: z.string().optional(),
});

// Main case study schema
export const caseStudySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  coverImageUrl: z.string().url().optional(),
  clientName: z.string().optional(),
  clientLogoUrl: z.string().url().optional(),
  duration: z.string().optional(),
  year: z.number().int().optional(),
  context: contextSchema,
  actions: z.array(actionSchema),
  result: resultSchema,
  projectId: z.string().uuid().optional(), // Reference to a project if applicable
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Insert schema (omits auto-generated fields)
export const insertCaseStudySchema = caseStudySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema
export const updateCaseStudySchema = insertCaseStudySchema.partial();

// TypeScript type definitions
export type Context = z.infer<typeof contextSchema>;
export type Action = z.infer<typeof actionSchema>;
export type Result = z.infer<typeof resultSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type UpdateCaseStudy = z.infer<typeof updateCaseStudySchema>; 