import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import storageInstance from "@/lib/storage-instance";
import { SectionSchema, insertSectionSchema } from "@/lib/schemas";
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
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;

    // Get sections from storage
    const sections = await storageInstance.getSections(type);

    // Return sections
    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Error in GET /api/sections:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/sections
 *
 * Create a new section
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body against schema
    const validatedData = insertSectionSchema.parse(body);

    // Create section in storage
    const section = await storageInstance.createSection(validatedData);

    // Return created section
    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error in POST /api/sections:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
