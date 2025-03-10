// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import storageInstance from "@/lib/storage-instance";
import { Project, ProjectSchema } from "@/lib/schemas";
import { getMediaUrl, formatItemUrls } from "@/lib/s3-url";

/**
 * GET /api/projects
 *
 * Get all projects or featured projects
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    
    // Convert featured string parameter to boolean if present
    const featuredBool = featured ? featured === 'true' : undefined;

    // Get projects from storage
    const projects = await storageInstance.getProjects(featuredBool);

    // Transform S3 URLs for media fields
    const transformedProjects = projects.map((project: Project) =>
      formatItemUrls(project)
    );

    // Return projects
    return NextResponse.json({ projects: transformedProjects });
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
