import { NextRequest, NextResponse } from 'next/server';
import { serverOperations, alertOperations } from '@/lib/db/queries';
import { MonitoringAgent } from '@/lib/monitoring/agent';
import { v4 as uuidv4 } from 'uuid';

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

    const thresholdCheck = await agent.checkThresholds();
    await agent.disconnect();

    // Create alerts for any threshold violations
    for (const message of thresholdCheck.alerts) {
      const alertId = uuidv4();
      alertOperations.create({
        id: alertId,
        server_id: serverId,
        type: 'threshold',
        severity: 'warning',
        message,
        resolved: false,
      });
    }

    return NextResponse.json({
      serverId,
      alerts: thresholdCheck.alerts,
      hasAlerts: thresholdCheck.alerts.length > 0,
    });
  } catch (error) {
    console.error('Error checking thresholds:', error);
    return NextResponse.json({ error: 'Failed to check thresholds' }, { status: 500 });
  }
}
