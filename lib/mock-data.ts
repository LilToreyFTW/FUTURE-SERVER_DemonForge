import { Server, Alert, Backup, ScalingRule, SecurityRule } from './types';

export const mockServers: Server[] = [
  {
    id: 'srv-001',
    name: 'Game Server Alpha',
    status: 'online',
    cpu: 45,
    ram: 62,
    bandwidth: 234,
    diskIO: 45,
    temperature: 42,
    uptime: '45d 12h 30m',
    ip: '192.168.1.100',
    os: 'Ubuntu 22.04 LTS',
    specs: {
      cpuCores: 16,
      ramGB: 128,
      diskGB: 2000,
      network: '10Gbps'
    }
  },
  {
    id: 'srv-002',
    name: 'Web Server Beta',
    status: 'online',
    cpu: 23,
    ram: 45,
    bandwidth: 567,
    diskIO: 23,
    temperature: 38,
    uptime: '30d 8h 15m',
    ip: '192.168.1.101',
    os: 'Debian 12',
    specs: {
      cpuCores: 8,
      ramGB: 64,
      diskGB: 1000,
      network: '10Gbps'
    }
  },
  {
    id: 'srv-003',
    name: 'Database Server Gamma',
    status: 'maintenance',
    cpu: 0,
    ram: 0,
    bandwidth: 0,
    diskIO: 0,
    temperature: 35,
    uptime: '0d 0h 0m',
    ip: '192.168.1.102',
    os: 'Ubuntu 22.04 LTS',
    specs: {
      cpuCores: 32,
      ramGB: 256,
      diskGB: 4000,
      network: '10Gbps'
    }
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'alt-001',
    type: 'cpu',
    severity: 'warning',
    message: 'CPU usage above 80% on Game Server Alpha',
    timestamp: new Date(),
    serverId: 'srv-001'
  },
  {
    id: 'alt-002',
    type: 'temperature',
    severity: 'info',
    message: 'Temperature normal on all servers',
    timestamp: new Date(Date.now() - 3600000),
    serverId: 'srv-002'
  }
];

export const mockBackups: Backup[] = [
  {
    id: 'bak-001',
    name: 'Daily Backup - Game Server Alpha',
    size: 45.6,
    created: new Date(),
    serverId: 'srv-001',
    status: 'completed'
  },
  {
    id: 'bak-002',
    name: 'Weekly Backup - Web Server Beta',
    size: 23.4,
    created: new Date(Date.now() - 86400000),
    serverId: 'srv-002',
    status: 'completed'
  }
];

export const mockScalingRules: ScalingRule[] = [
  {
    id: 'scl-001',
    name: 'Auto-scale CPU',
    condition: 'CPU > 80% for 5 minutes',
    action: 'Add 2 CPU cores',
    enabled: true
  },
  {
    id: 'scl-002',
    name: 'Auto-scale RAM',
    condition: 'RAM > 85% for 5 minutes',
    action: 'Add 32GB RAM',
    enabled: true
  }
];

export const mockSecurityRules: SecurityRule[] = [
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
];
