import { NextRequest, NextResponse } from 'next/server';
import { alertOperations } from '@/lib/db/queries';
import { requireAuth } from '@/lib/auth/middleware';

// GET alert by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const alert = alertOperations.getById(params.id);
    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error fetching alert:', error);
    return NextResponse.json({ error: 'Failed to fetch alert' }, { status: 500 });
  }
}

// PATCH resolve alert
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    alertOperations.resolve(params.id);
    const alert = alertOperations.getById(params.id);
    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error resolving alert:', error);
    return NextResponse.json({ error: 'Failed to resolve alert' }, { status: 500 });
  }
}

// DELETE alert
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    alertOperations.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
  }
}
