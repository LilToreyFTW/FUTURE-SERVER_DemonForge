import { NextRequest, NextResponse } from 'next/server';
import { serverOperations } from '@/lib/db/queries';
import { SSHClient } from '@/lib/ssh/client';
import { requireAuth } from '@/lib/auth/middleware';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { action } = body;

    const server = serverOperations.getById(params.id);
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    const ssh = new SSHClient();
    await ssh.connect({
      host: server.ip,
      port: server.port,
      username: server.username,
      password: server.password,
      privateKey: server.private_key,
    });

    let result;
    switch (action) {
      case 'reboot':
        await ssh.reboot();
        result = { success: true, message: 'Reboot initiated' };
        break;
      case 'poweroff':
        await ssh.powerOff();
        result = { success: true, message: 'Power off initiated' };
        break;
      case 'snapshot':
        const snapshotName = body.name || 'manual-snapshot';
        const snapshotId = await ssh.createSnapshot(snapshotName);
        result = { success: true, message: 'Snapshot created', snapshotId };
        break;
      case 'uptime':
        const uptime = await ssh.getUptime();
        result = { success: true, uptime };
        break;
      default:
        await ssh.disconnect();
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    await ssh.disconnect();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing server action:', error);
    return NextResponse.json({ error: 'Failed to execute action' }, { status: 500 });
  }
}
