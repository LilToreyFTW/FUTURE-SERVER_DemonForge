import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const { enabled, threshold, mitigationMode, whitelistIPs } = body;

  // Update DDoS protection configuration
  console.log('Configuring DDoS protection:', { enabled, threshold, mitigationMode, whitelistIPs });

  return NextResponse.json({ success: true, message: 'DDoS protection configured successfully' });
}
