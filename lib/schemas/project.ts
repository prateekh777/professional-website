import { z } from 'zod';

/**
 * Project Schema
 * 
 * Defines the structure for portfolio projects
 */

// Project tag schema
export const projectTagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
});

// Main project schema
export const projectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  subtitle: z.string().optional(),
  slug: z.string(),
  description: z.string(),
  content: z.string().optional(),
  imageUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  projectUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().optional(),
  completedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Insert schema (omits auto-generated fields)
export const insertProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema
export const updateProjectSchema = insertProjectSchema.partial();

// TypeScript type definitions
export type ProjectTag = z.infer<typeof projectTagSchema>;
export type Project = z.infer<typeof projectSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>; 