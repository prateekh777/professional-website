import { z } from 'zod';

/**
 * AI Work Schema
 * 
 * Defines the structure for AI-related projects
 */

// AI technology enum
export const aiTechnologyEnum = z.enum([
  'machine_learning',
  'deep_learning',
  'natural_language_processing',
  'computer_vision',
  'reinforcement_learning',
  'generative_ai',
  'recommendation_systems',
  'other',
]);

// AI model schema
export const aiModelSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.string().optional(),
  framework: z.string().optional(),
  accuracy: z.number().min(0).max(100).optional(),
});

// AI dataset schema
export const aiDatasetSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  source: z.string().optional(),
  size: z.string().optional(),
});

// Main AI work schema
export const aiWorkSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  description: z.string(),
  imageUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  paperUrl: z.string().url().optional(),
  technologies: z.array(aiTechnologyEnum),
  models: z.array(aiModelSchema).optional(),
  datasets: z.array(aiDatasetSchema).optional(),
  results: z.string().optional(),
  challenges: z.string().optional(),
  futureWork: z.string().optional(),
  collaborators: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().optional(),
  completedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Insert schema (omits auto-generated fields)
export const insertAiWorkSchema = aiWorkSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema
export const updateAiWorkSchema = insertAiWorkSchema.partial();

// TypeScript type definitions
export type AiTechnology = z.infer<typeof aiTechnologyEnum>;
export type AiModel = z.infer<typeof aiModelSchema>;
export type AiDataset = z.infer<typeof aiDatasetSchema>;
export type AiWork = z.infer<typeof aiWorkSchema>;
export type InsertAiWork = z.infer<typeof insertAiWorkSchema>;
export type UpdateAiWork = z.infer<typeof updateAiWorkSchema>; 