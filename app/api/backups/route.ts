import { NextRequest, NextResponse } from 'next/server';
import { backupOperations } from '@/lib/db/queries';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '@/lib/auth/middleware';

// GET all backups
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get('server_id');
    
    let backups;
    if (serverId) {
      backups = backupOperations.getByServerId(serverId);
    } else {
      backups = backupOperations.getAll();
    }
    
    return NextResponse.json(backups);
  } catch (error) {
    console.error('Error fetching backups:', error);
    return NextResponse.json({ error: 'Failed to fetch backups' }, { status: 500 });
  }
}

// POST create new backup
export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { server_id, name, size } = body;

    if (!server_id || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: server_id, name' },
        { status: 400 }
      );
    }

    const backupId = uuidv4();
    const newBackup = backupOperations.create({
      id: backupId,
      server_id,
      name,
      size: size || 0,
      status: 'in-progress',
    });

    return NextResponse.json(newBackup, { status: 201 });
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}
