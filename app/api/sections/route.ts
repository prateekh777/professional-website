import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import storageInstance from "@/lib/storage-instance";
import { insertSectionSchema, Section } from "@/lib/schemas";
import { getMediaUrl, formatMediaUrls } from "@/lib/s3-url";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

/**
 * GET /api/sections
 *
 * Get all sections or sections of a specific type
 */
export async function GET(request: NextRequest) {
  try {
    // Get the type query parameter
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // Get sections from the database
    const sections = await storageInstance.getSections(type || undefined);

    // Transform S3 URLs for media fields
    const transformedSections = sections.map((section: Section) => ({
      ...section,
      media: section.media ? formatMediaUrls(section.media) : undefined,
    }));

    // Return the sections
    return NextResponse.json(transformedSections);
  } catch (error) {
    console.error("Error getting sections:", error);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to get sections" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sections
 *
 * Create a new section
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the request body
    const validatedSection = insertSectionSchema.parse(body);

    // Create the section
    const section = await storageInstance.createSection(validatedSection);

    // Transform S3 URLs for media fields in the response
    const transformedSection = {
      ...section,
      media: section.media ? formatMediaUrls(section.media) : undefined,
    };

    // Return the created section
    return NextResponse.json(transformedSection, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);

    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    // Return a generic error response
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}
