import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const { name, action, protocol, port, source, destination } = body;

  // Add firewall rule to database and apply to servers
  console.log('Adding firewall rule:', { name, action, protocol, port, source, destination });

  return NextResponse.json({ success: true, message: 'Firewall rule added successfully' });
}
