import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import storageInstance from "@/lib/storage-instance";
import { CaseStudy, Action } from "@/lib/schemas";
import { getMediaUrl, formatItemUrls } from "@/lib/s3-url";

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
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const featuredParam = searchParams.get("featured");

    const query: QueryParams = querySchema.parse({
      featured: featuredParam || undefined,
    });

    // Get case studies from the database
    const caseStudies = await storageInstance.getCaseStudies(
      query.featured !== undefined ? query.featured : undefined
    );

    // Transform S3 URLs for media fields
    const transformedCaseStudies = caseStudies.map((caseStudy: CaseStudy) => {
      // Transform the main case study image URLs
      const transformedCaseStudy = formatItemUrls(caseStudy, [
        "coverImageUrl",
        "clientLogoUrl",
      ]);

      // Transform image URLs in actions
      if (
        transformedCaseStudy.actions &&
        transformedCaseStudy.actions.length > 0
      ) {
        transformedCaseStudy.actions = transformedCaseStudy.actions.map(
          (action: Action) => formatItemUrls(action, ["imageUrl"])
        );
      }

      return transformedCaseStudy;
    });

    // Return the case studies
    return NextResponse.json(transformedCaseStudies);
  } catch (error) {
    console.error("Error getting case studies:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    // Return a generic error response
    return NextResponse.json(
      { error: "Failed to get case studies" },
      { status: 500 }
    );
  }
}
