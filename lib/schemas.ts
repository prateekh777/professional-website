import { z } from "zod";

// Define the Action schema
export const ActionSchema = z.object({
  text: z.string(),
  url: z.string(),
  icon: z.string().optional(),
});

export type Action = z.infer<typeof ActionSchema>;

// Define the CaseStudy schema
export const CaseStudySchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  coverImage: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean(),
  actions: z.array(ActionSchema).optional(),
});

export type CaseStudy = z.infer<typeof CaseStudySchema>;

// Define the AiWork schema
export const AiWorkSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  url: z.string().optional(),
  tags: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  date: z.string().optional(),
  featured: z.boolean().optional(),
});

export type AiWork = z.infer<typeof AiWorkSchema>;

// Define the Interest Media schema
export const InterestMediaSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  type: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  interestId: z.string().optional(),
});

export type InterestMedia = z.infer<typeof InterestMediaSchema>;

// Define the Interest schema
export const InterestSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  featured: z.boolean().optional(),
  media: z.array(InterestMediaSchema).optional(),
});

export type Interest = z.infer<typeof InterestSchema>;

// Define the Section schema
export const SectionSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  order: z.number().optional(),
  type: z.string().optional(),
  featured: z.boolean().optional(),
  buttons: z.array(ActionSchema).optional(),
});

export type Section = z.infer<typeof SectionSchema>;

// Schema for inserting a new section
export const insertSectionSchema = SectionSchema.omit({ id: true });

// Schema for updating an existing section
export const updateSectionSchema = SectionSchema.partial().extend({
  id: z.string(),
}); 