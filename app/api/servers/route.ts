import { NextRequest, NextResponse } from 'next/server';
import { serverOperations, metricsOperations } from '@/lib/db/queries';
import { SSHClient } from '@/lib/ssh/client';
import { v4 as uuidv4 } from 'uuid';

// GET all servers
export async function GET() {
  try {
    const servers = serverOperations.getAll();
    return NextResponse.json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error);
    return NextResponse.json({ error: 'Failed to fetch servers' }, { status: 500 });
  }
}

// POST create new server
export async function POST(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, ip, port, username, password, privateKey, os } = body;

    if (!name || !ip || !username) {
      return NextResponse.json(
        { error: 'Missing required fields: name, ip, username' },
        { status: 400 }
      );
    }

    const serverId = uuidv4();
    const newServer = serverOperations.create({
      id: serverId,
      name,
      ip,
      port: port || 22,
      username,
      password,
      private_key: privateKey,
      os: os || 'Unknown',
      status: 'offline',
    });

    return NextResponse.json(newServer, { status: 201 });
  } catch (error) {
    console.error('Error creating server:', error);
    return NextResponse.json({ error: 'Failed to create server' }, { status: 500 });
  }
}
