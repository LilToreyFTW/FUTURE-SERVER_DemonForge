'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield } from 'lucide-react';

export function FirewallRuleDialog() {
  const [open, setOpen] = useState(false);
  const [rule, setRule] = useState({
    name: '',
    action: 'allow',
    protocol: 'tcp',
    port: '',
    source: '',
    destination: ''
  });

  const handleSubmit = () => {
    console.log('Adding firewall rule:', rule);
    // API call would go here
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Shield className="h-4 w-4 mr-2" />
          Add Firewall Rule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Firewall Rule</DialogTitle>
          <DialogDescription>
            Create a new firewall rule to control network traffic
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rule-name">Rule Name</Label>
            <Input
              id="rule-name"
              placeholder="e.g., Allow HTTP Traffic"
              value={rule.name}
              onChange={(e) => setRule({ ...rule, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select value={rule.action} onValueChange={(value) => setRule({ ...rule, action: value })}>
                <SelectTrigger id="action">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="protocol">Protocol</Label>
              <Select value={rule.protocol} onValueChange={(value) => setRule({ ...rule, protocol: value })}>
                <SelectTrigger id="protocol">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tcp">TCP</SelectItem>
                  <SelectItem value="udp">UDP</SelectItem>
                  <SelectItem value="icmp">ICMP</SelectItem>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              placeholder="e.g., 80, 443, or 80-443"
              value={rule.port}
              onChange={(e) => setRule({ ...rule, port: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Source IP/CIDR</Label>
            <Input
              id="source"
              placeholder="e.g., 192.168.1.0/24 or 0.0.0.0/0"
              value={rule.source}
              onChange={(e) => setRule({ ...rule, source: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Destination IP/CIDR</Label>
            <Input
              id="destination"
              placeholder="e.g., 10.0.0.0/8"
              value={rule.destination}
              onChange={(e) => setRule({ ...rule, destination: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
