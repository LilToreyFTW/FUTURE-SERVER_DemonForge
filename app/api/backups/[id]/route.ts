import { NextRequest, NextResponse } from 'next/server';
import { backupOperations } from '@/lib/db/queries';
import { requireAuth } from '@/lib/auth/middleware';

// GET backup by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const backup = backupOperations.getById(params.id);
    if (!backup) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }
    return NextResponse.json(backup);
  } catch (error) {
    console.error('Error fetching backup:', error);
    return NextResponse.json({ error: 'Failed to fetch backup' }, { status: 500 });
  }
}

// PATCH update backup
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    backupOperations.update(params.id, body);
    const backup = backupOperations.getById(params.id);
    return NextResponse.json(backup);
  } catch (error) {
    console.error('Error updating backup:', error);
    return NextResponse.json({ error: 'Failed to update backup' }, { status: 500 });
  }
}

// DELETE backup
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    backupOperations.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting backup:', error);
    return NextResponse.json({ error: 'Failed to delete backup' }, { status: 500 });
  }
}
