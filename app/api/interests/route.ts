// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import storageInstance from "@/lib/storage-instance";
import { Interest, InterestMedia } from "@/lib/schemas";
import { getMediaUrl, formatMediaUrls } from "@/lib/s3-url";

// Query parameters schema
const querySchema = z.object({
  featured: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  category: z.string().optional(),
});

type QueryParams = z.infer<typeof querySchema>;

/**
 * GET /api/interests
 *
 * Returns all interests or filtered by featured status or category
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const featuredParam = searchParams.get("featured");
    const categoryParam = searchParams.get("category");

    const query: QueryParams = querySchema.parse({
      featured: featuredParam || undefined,
      category: categoryParam || undefined,
    });

    // Get interests from the database
    const interests = await storageInstance.getInterests(
      query.category,
      query.featured !== undefined ? query.featured : undefined
    );

    // Transform S3 URLs for media fields
    const transformedInterests = interests.map((interest: Interest) => {
      // Create a copy of the interest
      const transformedInterest = { ...interest };

      // Transform media URLs if present
      if (transformedInterest.media && transformedInterest.media.length > 0) {
        transformedInterest.media = formatMediaUrls(transformedInterest.media);
      }

      return transformedInterest;
    });

    // Return the interests
    return NextResponse.json(transformedInterests);
  } catch (error) {
    console.error("Error getting interests:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    // Return a generic error response
    return NextResponse.json(
      { error: "Failed to get interests" },
      { status: 500 }
    );
  }
}
