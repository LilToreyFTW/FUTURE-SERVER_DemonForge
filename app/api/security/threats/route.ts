import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter');

  // Fetch threats from database
  console.log('Fetching threats with filter:', filter);

  const threats = [
    {
      id: 1,
      type: 'ddos',
      severity: 'critical',
      source: '192.168.1.100',
      target: '10.0.0.5',
      message: 'DDoS attack detected - 50,000 requests/second',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'mitigated'
    },
    {
      id: 2,
      type: 'intrusion',
      severity: 'warning',
      source: '203.0.113.45',
      target: '10.0.0.3',
      message: 'Suspicious login attempt from unknown IP',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'blocked'
    },
  ];

  return NextResponse.json(threats);
}
