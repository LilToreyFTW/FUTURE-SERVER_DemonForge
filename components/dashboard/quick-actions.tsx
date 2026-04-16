'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, AlertTriangle, FileText } from 'lucide-react';
import { FirewallRuleDialog } from '@/components/dialogs/firewall-rule-dialog';
import { DDoSProtectionDialog } from '@/components/dialogs/ddos-protection-dialog';
import { SecurityAuditDialog } from '@/components/dialogs/security-audit-dialog';
import Link from 'next/link';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common security operations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <FirewallRuleDialog />
        <DDoSProtectionDialog />
        <SecurityAuditDialog />
        <Link href="/dashboard/security/threat-log">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            View Threat Log
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
