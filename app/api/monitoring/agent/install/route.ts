import { NextRequest, NextResponse } from 'next/server';
import { serverOperations } from '@/lib/db/queries';
import { MonitoringAgent } from '@/lib/monitoring/agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serverId } = body;

    if (!serverId) {
      return NextResponse.json({ error: 'Server ID required' }, { status: 400 });
    }

    const server = serverOperations.getById(serverId);
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    const agent = new MonitoringAgent();
    await agent.connect(
      server.ip,
      server.username,
      server.password,
      server.private_key,
      server.port
    );

    await agent.installNodeExporter();
    await agent.disconnect();

    return NextResponse.json({ success: true, message: 'Node Exporter installed successfully' });
  } catch (error) {
    console.error('Error installing Node Exporter:', error);
    return NextResponse.json({ error: 'Failed to install Node Exporter' }, { status: 500 });
  }
}
