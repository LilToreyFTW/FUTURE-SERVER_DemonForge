import { NextRequest, NextResponse } from 'next/server';
import { serverOperations, metricsOperations, alertOperations } from '@/lib/db/queries';
import { SSHClient } from '@/lib/ssh/client';
import { requireAuth } from '@/lib/auth/middleware';

// GET server by ID with latest metrics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const server = serverOperations.getById(params.id);
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Get latest metrics
    const metrics = metricsOperations.getLatest(params.id, 1);
    const latestMetrics = metrics[0] || null;

    return NextResponse.json({ server, metrics: latestMetrics });
  } catch (error) {
    console.error('Error fetching server:', error);
    return NextResponse.json({ error: 'Failed to fetch server' }, { status: 500 });
  }
}

// PUT update server
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updates = {
      name: body.name,
      ip: body.ip,
      port: body.port,
      username: body.username,
      password: body.password,
      private_key: body.privateKey,
      os: body.os,
    };

    serverOperations.update(params.id, updates);
    const updatedServer = serverOperations.getById(params.id);
    return NextResponse.json(updatedServer);
  } catch (error) {
    console.error('Error updating server:', error);
    return NextResponse.json({ error: 'Failed to update server' }, { status: 500 });
  }
}

// DELETE server
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    serverOperations.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting server:', error);
    return NextResponse.json({ error: 'Failed to delete server' }, { status: 500 });
  }
}
