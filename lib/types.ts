export interface Server {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  cpu: number;
  ram: number;
  bandwidth: number;
  diskIO: number;
  temperature: number;
  uptime: string;
  ip: string;
  os: string;
  specs: {
    cpuCores: number;
    ramGB: number;
    diskGB: number;
    network: string;
  };
}

export interface Alert {
  id: string;
  type: 'cpu' | 'ram' | 'disk' | 'temperature' | 'network';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  serverId: string;
}

export interface Backup {
  id: string;
  name: string;
  size: number;
  created: Date;
  serverId: string;
  status: 'completed' | 'in-progress' | 'failed';
}

export interface ScalingRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export interface SecurityRule {
  id: string;
  type: 'firewall' | 'ddos' | 'intrusion';
  status: 'active' | 'inactive';
  description: string;
}
