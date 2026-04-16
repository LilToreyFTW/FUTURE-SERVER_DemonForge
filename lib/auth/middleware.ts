import { NextRequest, NextResponse } from 'next/server';

// Simple API key authentication middleware
// In production, use a proper authentication system like JWT or session-based auth

const API_KEY = process.env.DEMONFORGE_API_KEY || 'demo-api-key-change-me';

export function authenticate(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  return apiKey === API_KEY;
}

export function requireAuth(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
