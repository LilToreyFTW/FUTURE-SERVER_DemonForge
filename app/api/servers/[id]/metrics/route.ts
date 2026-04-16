import { NextRequest, NextResponse } from 'next/server';
import { serverOperations, metricsOperations } from '@/lib/db/queries';
import { SSHClient } from '@/lib/ssh/client';
import { requireAuth } from '@/lib/auth/middleware';

// GET server metrics
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

    // Fetch latest metrics from database
    const metrics = metricsOperations.getLatest(params.id, 100);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}

// POST fetch and store new metrics from server
export async function POST(
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

    // Connect to server via SSH and fetch metrics
    const ssh = new SSHClient();
    await ssh.connect({
      host: server.ip,
      port: server.port,
      username: server.username,
      password: server.password,
      privateKey: server.private_key,
    });

    const metrics = await ssh.getMetrics();
    await ssh.disconnect();

    // Store metrics in database
    const storedMetrics = metricsOperations.create({
      server_id: params.id,
      cpu_usage: metrics.cpu_usage,
      ram_usage: metrics.ram_usage,
      bandwidth: metrics.bandwidth,
      disk_io: metrics.disk_io,
      temperature: metrics.temperature,
    });

    // Update server status to online
    serverOperations.updateStatus(params.id, 'online');

    return NextResponse.json(storedMetrics);
  } catch (error) {
    console.error('Error fetching metrics from server:', error);
    
    // Update server status to offline
    serverOperations.updateStatus(params.id, 'offline');
    
    return NextResponse.json({ error: 'Failed to fetch metrics from server' }, { status: 500 });
  }
}
