import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  // Generate new API key
  const newApiKey = `df_sk_${uuidv4().replace(/-/g, '').substring(0, 24)}`;

  // Update in database
  console.log('Generating new API key:', newApiKey);

  return NextResponse.json({ apiKey: newApiKey });
}
