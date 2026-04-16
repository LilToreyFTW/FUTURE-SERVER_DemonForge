import { NextRequest, NextResponse } from 'next/server';
import { alertOperations } from '@/lib/db/queries';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '@/lib/auth/middleware';

// GET all alerts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved');
    
    const resolvedBool = resolved === null ? null : resolved === 'true';
    const alerts = alertOperations.getAll(resolvedBool);
    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

// POST create new alert
export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { server_id, type, severity, message } = body;

    if (!server_id || !type || !severity || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const alertId = uuidv4();
    const newAlert = alertOperations.create({
      id: alertId,
      server_id,
      type,
      severity,
      message,
      resolved: false,
    });

    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
  }
}
