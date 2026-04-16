import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter');

  // Fetch threats from database
  console.log('Fetching threats with filter:', filter);

  // Return empty array - no threats without real servers
  const threats: any[] = [];

  return NextResponse.json(threats);
}
