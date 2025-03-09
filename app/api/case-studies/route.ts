import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import storageInstance from "@/lib/storage-instance";
import { CaseStudy, Action } from "@/lib/schemas";
import { getMediaUrl, formatItemUrls } from "@/lib/s3-url";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

// Query parameters schema
const querySchema = z.object({
  featured: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

type QueryParams = z.infer<typeof querySchema>;

/**
 * GET /api/case-studies
 *
 * Returns all case studies or featured case studies if the featured query parameter is true
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    // Get the case studies directory
    const caseStudiesDirectory = path.join(process.cwd(), 'content/case-studies');
    
    // If a slug is provided, return a single case study
    if (slug) {
      const fullPath = path.join(caseStudiesDirectory, `${slug}.md`);
      
      // Check if the file exists
      if (!fs.existsSync(fullPath)) {
        return NextResponse.json(
          { error: 'Case study not found' },
          { status: 404 }
        );
      }
      
      // Read the markdown file
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // Parse the front matter
      const { data, content } = matter(fileContents);
      
      // Process the markdown content
      const processedContent = await remark().use(html).process(content);
      const contentHtml = processedContent.toString();
      
      // Create the case study object
      const transformedCaseStudy: CaseStudy | null = {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        coverImage: data.coverImage || '',
        content: contentHtml,
        tags: data.tags || [],
        featured: data.featured || false,
        actions: data.actions || [],
      };
      
      // Transform image URLs in actions
      if (
        transformedCaseStudy && 
        transformedCaseStudy.actions && 
        transformedCaseStudy.actions.length > 0
      ) {
        transformedCaseStudy.actions = transformedCaseStudy.actions.map(
          (action) => ({
            ...action,
            icon: action.icon || undefined,
          })
        );
      }
      
      return NextResponse.json(transformedCaseStudy);
    }
    
    // Otherwise, return all case studies
    const fileNames = fs.readdirSync(caseStudiesDirectory);
    const allCaseStudies = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        // Remove ".md" from file name to get slug
        const slug = fileName.replace(/\.md$/, '');
        
        // Read markdown file as string
        const fullPath = path.join(caseStudiesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        // Parse front matter
        const { data } = matter(fileContents);
        
        // Return case study data
        return {
          slug,
          title: data.title || '',
          description: data.description || '',
          date: data.date || '',
          coverImage: data.coverImage || '',
          tags: data.tags || [],
          featured: data.featured || false,
        };
      })
      // Sort case studies by date in descending order
      .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
    
    return NextResponse.json(allCaseStudies);
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case studies' },
      { status: 500 }
    );
  }
}
