'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { serverApi, alertApi } from '@/lib/api/client';
import { Server as ServerIcon, Activity, AlertTriangle, Cpu, HardDrive, Thermometer, Network } from 'lucide-react';

export default function DashboardPage() {
  const [servers, setServers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serversData, alertsData] = await Promise.all([
          serverApi.getAll(),
          alertApi.getAll(false),
        ]);
        
        // Fetch metrics for each server
        const serversWithMetrics = await Promise.all(
          serversData.map(async (server) => {
            try {
              const serverWithMetrics = await serverApi.getById(server.id);
              return {
                ...server,
                cpu: serverWithMetrics.metrics?.cpu_usage || 0,
                ram: serverWithMetrics.metrics?.ram_usage || 0,
                bandwidth: serverWithMetrics.metrics?.bandwidth || 0,
                diskIO: serverWithMetrics.metrics?.disk_io || 0,
                temperature: serverWithMetrics.metrics?.temperature || 0,
                uptime: 'Unknown',
              };
            } catch {
              return {
                ...server,
                cpu: 0,
                ram: 0,
                bandwidth: 0,
                diskIO: 0,
                temperature: 0,
                uptime: 'Unknown',
              };
            }
          })
        );
        
        setServers(serversWithMetrics);
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const onlineServers = servers.filter(s => s.status === 'online').length;
  const totalServers = servers.length || 1;
  const avgCpu = totalServers > 0 ? Math.round(servers.reduce((acc, s) => acc + (s.cpu || 0), 0) / totalServers) : 0;
  const avgRam = totalServers > 0 ? Math.round(servers.reduce((acc, s) => acc + (s.ram || 0), 0) / totalServers) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Real-time monitoring and control of your rack infrastructure
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
            <ServerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : totalServers}</div>
            <p className="text-xs text-muted-foreground">
              {loading ? '...' : `${onlineServers} online`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCpu}%</div>
            <Progress value={avgCpu} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg RAM Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRam}%</div>
            <Progress value={avgRam} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {alerts.filter(a => a.severity === 'critical').length} critical
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Server List */}
      <Card>
        <CardHeader>
          <CardTitle>Server Status</CardTitle>
          <CardDescription>Real-time metrics from all servers in your rack</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading servers...</p>
            ) : servers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No servers configured. Add your first server to get started.</p>
            ) : (
              servers.map((server) => (
                <div key={server.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{server.name}</h3>
                      <Badge variant={server.status === 'online' ? 'default' : 'secondary'}>
                        {server.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {server.ip} • {server.os || 'Unknown OS'} • {server.uptime || 'Unknown uptime'}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <span>CPU: {Math.round(server.cpu || 0)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>RAM: {Math.round(server.ram || 0)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4 text-muted-foreground" />
                        <span>{Math.round(server.bandwidth || 0)} Mbps</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                        <span>{Math.round(server.temperature || 0)}°C</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Latest notifications from your infrastructure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent alerts</p>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'warning' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={
                    alert.severity === 'critical' ? 'destructive' :
                    alert.severity === 'warning' ? 'secondary' :
                    'outline'
                  }>
                    {alert.severity}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
