import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import storageInstance from "@/lib/storage-instance";
import { AiWork } from "@/lib/schemas";
import { getMediaUrl, formatItemUrls } from "@/lib/s3-url";

// Query parameters schema
const querySchema = z.object({
  featured: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  technology: z.string().optional(),
});

type QueryParams = z.infer<typeof querySchema>;

/**
 * GET /api/ai-works
 *
 * Returns all AI works or filtered by featured status or technology
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const featuredParam = searchParams.get("featured");
    const technologyParam = searchParams.get("technology");

    const query: QueryParams = querySchema.parse({
      featured: featuredParam || undefined,
      technology: technologyParam || undefined,
    });

    // Get AI works from the database
    let aiWorks = await storageInstance.getAiWorks(
      query.featured !== undefined ? query.featured : undefined
    );

    // Filter by technology if specified
    if (query.technology) {
      aiWorks = aiWorks.filter((aiWork: AiWork) =>
        aiWork.technologies.includes(query.technology as any)
      );
    }

    // Transform S3 URLs for media fields
    const transformedAiWorks = aiWorks.map((aiWork: AiWork) =>
      formatItemUrls(aiWork, ["imageUrl"])
    );

    // Return the AI works
    return NextResponse.json(transformedAiWorks);
  } catch (error) {
    console.error("Error getting AI works:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    // Return a generic error response
    return NextResponse.json(
      { error: "Failed to get AI works" },
      { status: 500 }
    );
  }
}

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
