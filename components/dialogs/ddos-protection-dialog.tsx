'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Lock } from 'lucide-react';

export function DDoSProtectionDialog() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState({
    enabled: true,
    threshold: 10000,
    mitigationMode: 'automatic',
    whitelistIPs: ''
  });

  const handleSubmit = () => {
    console.log('Configuring DDoS protection:', config);
    // API call would go here
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Lock className="h-4 w-4 mr-2" />
          Configure DDoS Protection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure DDoS Protection</DialogTitle>
          <DialogDescription>
            Set up DDoS mitigation rules and thresholds
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ddos-enabled">Enable DDoS Protection</Label>
              <p className="text-sm text-muted-foreground">Activate DDoS mitigation</p>
            </div>
            <Switch
              id="ddos-enabled"
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="threshold">Traffic Threshold (Mbps)</Label>
            <Input
              id="threshold"
              type="number"
              value={config.threshold}
              onChange={(e) => setConfig({ ...config, threshold: parseInt(e.target.value) })}
              placeholder="10000"
            />
            <p className="text-xs text-muted-foreground">Traffic above this threshold triggers mitigation</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mitigation-mode">Mitigation Mode</Label>
            <select
              id="mitigation-mode"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={config.mitigationMode}
              onChange={(e) => setConfig({ ...config, mitigationMode: e.target.value })}
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
              <option value="monitor">Monitor Only</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whitelist">Whitelisted IPs (one per line)</Label>
            <textarea
              id="whitelist"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="192.168.1.100&#10;10.0.0.50"
              value={config.whitelistIPs}
              onChange={(e) => setConfig({ ...config, whitelistIPs: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">These IPs will bypass DDoS protection</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
