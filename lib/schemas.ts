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