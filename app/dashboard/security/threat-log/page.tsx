'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Shield, Lock, Search, Filter } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'demo-api-key-change-me';

export default function ThreatLogPage() {
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchThreats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/security/threats?filter=${filter}`, {
        headers: { 'x-api-key': API_KEY },
      });
      if (!res.ok) throw new Error('Failed to fetch threats');
      const data = await res.json();
      setThreats(data);
    } catch (error) {
      console.error('Error fetching threats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, [filter]);

  const filteredThreats = threats.filter(threat =>
    threat.message.toLowerCase().includes(filter.toLowerCase()) ||
    threat.source.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Threat Log</h1>
        <p className="text-muted-foreground mt-2">
          View and manage security threats detected by your infrastructure
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Recent threats and security incidents</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search threats..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading threats...</p>
          ) : filteredThreats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No threats found.</p>
          ) : (
            <div className="space-y-3">
              {filteredThreats.map((threat) => (
                <div key={threat.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    threat.severity === 'critical' ? 'bg-red-500/10' :
                    threat.severity === 'warning' ? 'bg-yellow-500/10' :
                    'bg-blue-500/10'
                  }`}>
                    {threat.type === 'ddos' && <Lock className="h-5 w-5 text-red-500" />}
                    {threat.type === 'intrusion' && <Shield className="h-5 w-5 text-yellow-500" />}
                    {threat.type === 'firewall' && <Shield className="h-5 w-5 text-blue-500" />}
                    {threat.type === 'malware' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                    {threat.type === 'brute_force' && <Lock className="h-5 w-5 text-yellow-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{threat.message}</span>
                      <Badge variant={
                        threat.severity === 'critical' ? 'destructive' :
                        threat.severity === 'warning' ? 'secondary' :
                        'outline'
                      }>
                        {threat.severity}
                      </Badge>
                      <Badge variant="outline">{threat.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Source: {threat.source} → Target: {threat.target}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(threat.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
