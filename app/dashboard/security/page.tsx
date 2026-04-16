'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SecurityPage() {
  const [rules, setRules] = useState([
    {
      id: 'sec-001',
      type: 'firewall',
      status: 'active',
      description: 'Block all traffic except ports 80, 443, 22'
    },
    {
      id: 'sec-002',
      type: 'ddos',
      status: 'active',
      description: 'DDoS protection enabled with 10Gbps threshold'
    },
    {
      id: 'sec-003',
      type: 'intrusion',
      status: 'active',
      description: 'Intrusion detection system monitoring all ports'
    }
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Center</h1>
        <p className="text-muted-foreground mt-2">
          Manage firewall, DDoS protection, and intrusion detection
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Firewall Status</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-2">
              12 rules configured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DDoS Protection</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Enabled</div>
            <p className="text-xs text-muted-foreground mt-2">
              10Gbps threshold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intrusion Detection</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Monitoring</div>
            <p className="text-xs text-muted-foreground mt-2">
              0 threats detected
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Rules</CardTitle>
          <CardDescription>Manage your security configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    rule.status === 'active' ? 'bg-green-500/10' : 'bg-gray-500/10'
                  }`}>
                    {rule.type === 'firewall' && <Lock className="h-5 w-5 text-green-500" />}
                    {rule.type === 'ddos' && <Shield className="h-5 w-5 text-blue-500" />}
                    {rule.type === 'intrusion' && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                  </div>
                  <div>
                    <div className="font-semibold capitalize">{rule.type}</div>
                    <div className="text-sm text-muted-foreground">{rule.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                    {rule.status}
                  </Badge>
                  <Switch checked={rule.status === 'active'} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common security operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Add Firewall Rule
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Configure DDoS Protection
            </Button>
            <Button variant="outline" className="justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Run Security Audit
            </Button>
            <Button variant="outline" className="justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              View Threat Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
