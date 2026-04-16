'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { serverApi } from '@/lib/api/client';
import { Cpu, Activity, HardDrive, Thermometer, Network } from 'lucide-react';

export default function MonitoringPage() {
  const [servers, setServers] = useState<any[]>([]);
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    try {
      const data = await serverApi.getAll();
      const serversWithMetrics = await Promise.all(
        data.map(async (server) => {
          try {
            const serverWithMetrics = await serverApi.getById(server.id);
            return {
              ...server,
              cpu: serverWithMetrics.metrics?.cpu_usage || 0,
              ram: serverWithMetrics.metrics?.ram_usage || 0,
              bandwidth: serverWithMetrics.metrics?.bandwidth || 0,
              diskIO: serverWithMetrics.metrics?.disk_io || 0,
              temperature: serverWithMetrics.metrics?.temperature || 0,
            };
          } catch {
            return {
              ...server,
              cpu: 0,
              ram: 0,
              bandwidth: 0,
              diskIO: 0,
              temperature: 0,
            };
          }
        })
      );
      setServers(serversWithMetrics);
      if (serversWithMetrics.length > 0) {
        setSelectedServer(serversWithMetrics[0]);
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentServer = selectedServer;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Monitoring</h1>
        <p className="text-muted-foreground mt-2">
          Real-time metrics and performance monitoring
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="history">Historical Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentServer ? Math.round(currentServer.cpu) : '0'}%</div>
                <Progress value={currentServer?.cpu || 0} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Real-time CPU usage
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">RAM Usage</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentServer ? Math.round(currentServer.ram) : '0'}%</div>
                <Progress value={currentServer?.ram || 0} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Real-time RAM usage
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bandwidth</CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentServer ? Math.round(currentServer.bandwidth) : '0'} Mbps</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Network throughput
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentServer ? Math.round(currentServer.temperature) : '0'}°C</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {currentServer && currentServer.temperature > 50 ? 'High' : 'Normal'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Server Selection</CardTitle>
              <CardDescription>Select a server to view its metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {servers.map((server) => (
                  <button
                    key={server.id}
                    onClick={() => setSelectedServer(server)}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      selectedServer.id === server.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{server.name}</div>
                        <div className="text-sm opacity-70">{server.ip}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{Math.round(server.cpu)}% CPU</div>
                        <div className="text-sm opacity-70">{Math.round(server.ram)}% RAM</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Metrics - {currentServer?.name || 'No server selected'}</CardTitle>
              <CardDescription>Comprehensive performance data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!currentServer ? (
                <p className="text-sm text-muted-foreground">Select a server to view detailed metrics.</p>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm text-muted-foreground">{Math.round(currentServer.cpu || 0)}%</span>
                    </div>
                    <Progress value={currentServer.cpu || 0} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">RAM Usage</span>
                      <span className="text-sm text-muted-foreground">{Math.round(currentServer.ram || 0)}%</span>
                    </div>
                    <Progress value={currentServer.ram || 0} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Disk I/O</span>
                      <span className="text-sm text-muted-foreground">{Math.round(currentServer.diskIO || 0)}%</span>
                    </div>
                    <Progress value={currentServer.diskIO || 0} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Network Bandwidth</span>
                      <span className="text-sm text-muted-foreground">{Math.round(currentServer.bandwidth || 0)} Mbps</span>
                    </div>
                    <Progress value={((currentServer.bandwidth || 0) / 10000) * 100} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Temperature</span>
                      <span className="text-sm text-muted-foreground">{Math.round(currentServer.temperature || 0)}°C</span>
                    </div>
                    <Progress value={((currentServer.temperature || 0) / 80) * 100} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Data</CardTitle>
              <CardDescription>Performance trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Historical data visualization would be displayed here. This feature would show
                CPU, RAM, bandwidth, and temperature trends over customizable time ranges.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
