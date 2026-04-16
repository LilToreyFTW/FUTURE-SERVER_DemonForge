'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { backupApi } from '@/lib/api/client';
import { Database, Play, Download, Trash2, Clock } from 'lucide-react';

export default function BackupsPage() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBackups = async () => {
    try {
      const data = await backupApi.getAll();
      setBackups(data);
    } catch (error) {
      console.error('Error fetching backups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (backupId: string, action: string) => {
    try {
      if (action === 'delete') {
        await backupApi.delete(backupId);
        fetchBackups();
      }
    } catch (error) {
      console.error(`Error ${action} backup:`, error);
    }
  };

  const handleCreateBackup = async (serverId: string, name: string) => {
    try {
      await backupApi.create({ server_id: serverId, name, size: 0, status: 'in-progress' });
      fetchBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backup Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage automated and manual backups
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Backup</DialogTitle>
              <DialogDescription>
                Configure a new backup for your servers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Backup Name</label>
                <input
                  type="text"
                  id="backup-name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="My Backup"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Server</label>
                <select id="backup-server" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select a server...</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                const name = (document.getElementById('backup-name') as HTMLInputElement)?.value;
                const serverId = (document.getElementById('backup-server') as HTMLSelectElement)?.value;
                if (name && serverId) {
                  handleCreateBackup(serverId, name);
                }
              }}>Create Backup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backups.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Across all servers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {backups.reduce((acc, b) => acc + b.size, 0).toFixed(1)} GB
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Of 500 GB allocated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground mt-2">
              Game Server Alpha
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>All backups across your infrastructure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading backups...</p>
            ) : backups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No backups created yet.</p>
            ) : (
              backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Database className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-semibold">{backup.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {backup.size} GB • {new Date(backup.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={backup.status === 'completed' ? 'default' : 'secondary'}>
                      {backup.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction(backup.id, 'restore')}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction(backup.id, 'download')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction(backup.id, 'delete')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
