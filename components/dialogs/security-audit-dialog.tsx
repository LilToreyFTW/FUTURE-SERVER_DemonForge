'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function SecurityAuditDialog() {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const runAudit = async () => {
    setRunning(true);
    setProgress(0);
    
    // Simulate audit progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    setResults({
      overall: 'warning',
      checks: [
        { name: 'Firewall Configuration', status: 'pass', message: 'All rules properly configured' },
        { name: 'SSH Security', status: 'warning', message: 'Consider disabling password auth' },
        { name: 'SSL/TLS Certificates', status: 'pass', message: 'All certificates valid' },
        { name: 'Software Updates', status: 'fail', message: '3 servers need security updates' },
        { name: 'Access Control', status: 'pass', message: 'No unauthorized access detected' },
        { name: 'DDoS Protection', status: 'pass', message: 'Protection active and configured' },
      ]
    });
    setRunning(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Run Security Audit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Security Audit</DialogTitle>
          <DialogDescription>
            Comprehensive security assessment of your infrastructure
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {running ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Running audit...</Label>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          ) : results ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium">Audit Complete</div>
                  <div className="text-sm text-muted-foreground">Found 1 issue requiring attention</div>
                </div>
              </div>
              <div className="space-y-2">
                {results.checks.map((check: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {check.status === 'pass' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                    {check.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                    {check.status === 'fail' && <XCircle className="h-5 w-5 text-red-500 mt-0.5" />}
                    <div className="flex-1">
                      <div className="font-medium">{check.name}</div>
                      <div className="text-sm text-muted-foreground">{check.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Audit Scope</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Firewall Rules</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSH Configuration</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL/TLS Certificates</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Software Updates</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Access Control</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setOpen(false);
            setResults(null);
          }}>Close</Button>
          {!running && !results && <Button onClick={runAudit}>Run Audit</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
