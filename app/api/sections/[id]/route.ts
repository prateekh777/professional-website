export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import storageInstance from '@/lib/storage-instance';
import { updateSectionSchema } from '@/lib/schemas';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/sections/[id]
 * 
 * Get a section by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Get the section ID from the route parameters
    const { id } = params;
    
    // Get the section from the database
    const section = await storageInstance.getSection(id);
    
    // If the section doesn't exist, return a 404 response
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    // Return the section
    return NextResponse.json(section);
  } catch (error) {
    console.error(`Error getting section (id: ${params.id}):`, error);
    
    // Return an error response
    return NextResponse.json(
      { error: 'Failed to get section' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/sections/[id]
 * 
 * Update a section
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Get the section ID from the route parameters
    const { id } = params;
    
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const validatedSection = updateSectionSchema.parse(body);
    
    // Update the section
    const section = await storageInstance.updateSection(id, validatedSection);
    
    // If the section doesn't exist, return a 404 response
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    // Return the updated section
    return NextResponse.json(section);
  } catch (error) {
    console.error(`Error updating section (id: ${params.id}):`, error);
    
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    // Return a generic error response
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sections/[id]
 * 
 * Delete a section
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Get the section ID from the route parameters
    const { id } = params;
    
    // Delete the section
    const success = await storageInstance.deleteSection(id);
    
    // If the section doesn't exist, return a 404 response
    if (!success) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }
    
    // Return a success response
    return NextResponse.json(
      { message: 'Section deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting section (id: ${params.id}):`, error);
    
    // Return an error response
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
} 