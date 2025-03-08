import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import storageInstance from "@/lib/storage-instance";
import { Project } from "@/lib/schemas";
import { getMediaUrl, formatItemUrls } from "@/lib/s3-url";

// Query parameters schema
const querySchema = z.object({
  featured: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

type QueryParams = z.infer<typeof querySchema>;

/**
 * GET /api/projects
 *
 * Returns all projects or featured projects if the featured query parameter is true
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const featuredParam = searchParams.get("featured");

    const query: QueryParams = querySchema.parse({
      featured: featuredParam || undefined,
    });

    // Get projects from the database
    const projects = await storageInstance.getProjects(
      query.featured !== undefined ? query.featured : undefined
    );

    // Transform S3 URLs for media fields
    const transformedProjects = projects.map((project: Project) =>
      formatItemUrls(project, ["imageUrl", "thumbnailUrl", "videoUrl"])
    );

    // Return the projects
    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error("Error getting projects:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    // Return a generic error response
    return NextResponse.json(
      { error: "Failed to get projects" },
      { status: 500 }
    );
  }
}

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";
