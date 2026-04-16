'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { serverApi } from '@/lib/api/client';
import { Plus, Power, RefreshCw, Copy, Settings, Trash2 } from 'lucide-react';

export default function ServersPage() {
  const [servers, setServers] = useState<any[]>([]);
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    try {
      const data = await serverApi.getAll();
      setServers(data);
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (serverId: string, action: string) => {
    try {
      await serverApi.executeAction(serverId, action);
      // Refresh servers after action
      fetchServers();
    } catch (error) {
      console.error(`Error executing ${action}:`, error);
    }
  };

  const handleDelete = async (serverId: string) => {
    try {
      await serverApi.delete(serverId);
      fetchServers();
    } catch (error) {
      console.error('Error deleting server:', error);
    }
  };

  const handleAddServer = async (data: any) => {
    try {
      await serverApi.create(data);
      fetchServers();
    } catch (error) {
      console.error('Error adding server:', error);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Server Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and control all servers in your rack
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Server
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Server</DialogTitle>
              <DialogDescription>
                Configure a new server to add to your rack
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Server Name</Label>
                <Input id="name" placeholder="My Server" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip">IP Address</Label>
                <Input id="ip" placeholder="192.168.1.100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">SSH Username</Label>
                <Input id="username" placeholder="root" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">SSH Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">SSH Port</Label>
                <Input id="port" placeholder="22" defaultValue="22" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                const name = (document.getElementById('name') as HTMLInputElement)?.value;
                const ip = (document.getElementById('ip') as HTMLInputElement)?.value;
                const username = (document.getElementById('username') as HTMLInputElement)?.value;
                const password = (document.getElementById('password') as HTMLInputElement)?.value;
                const port = parseInt((document.getElementById('port') as HTMLInputElement)?.value || '22');
                if (name && ip && username) {
                  handleAddServer({ name, ip, username, password, port });
                }
              }}>Add Server</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {servers.map((server) => (
          <Card key={server.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{server.name}</CardTitle>
                  <CardDescription className="mt-1">{server.ip}</CardDescription>
                </div>
                <Badge variant={server.status === 'online' ? 'default' : 'secondary'}>
                  {server.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">OS:</span>
                  <span>{server.os}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPU:</span>
                  <span>{server.specs.cpuCores} cores</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RAM:</span>
                  <span>{server.specs.ramGB} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disk:</span>
                  <span>{server.specs.diskGB} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span>{server.specs.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span>{server.uptime}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleAction(server.id, 'reboot')}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reboot
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleAction(server.id, 'power')}
                >
                  <Power className="h-4 w-4 mr-1" />
                  Power
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleAction(server.id, 'snapshot')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Snapshot
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedServer(server)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Server</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {server.name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(server.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
