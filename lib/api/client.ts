const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'demo-api-key-change-me';

export interface Server {
  id: string;
  name: string;
  ip: string;
  port: number;
  username: string;
  os?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ServerMetrics {
  id: number;
  server_id: string;
  cpu_usage: number;
  ram_usage: number;
  bandwidth: number;
  disk_io: number;
  temperature: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  server_id: string;
  type: string;
  severity: string;
  message: string;
  resolved: boolean;
  created_at: string;
  resolved_at?: string;
}

export interface Backup {
  id: string;
  server_id: string;
  name: string;
  size: number;
  status: string;
  created_at: string;
  completed_at?: string;
}

// Server API
export const serverApi = {
  getAll: async (): Promise<Server[]> => {
    const res = await fetch(`${API_BASE_URL}/servers`, {
      headers: { 'x-api-key': API_KEY },
    });
    if (!res.ok) throw new Error('Failed to fetch servers');
    return res.json();
  },

  getById: async (id: string): Promise<{ server: Server; metrics: ServerMetrics | null }> => {
    const res = await fetch(`${API_BASE_URL}/servers/${id}`, {
      headers: { 'x-api-key': API_KEY },
    });
    if (!res.ok) throw new Error('Failed to fetch server');
    return res.json();
  },

  create: async (data: Omit<Server, 'id' | 'created_at' | 'updated_at'>): Promise<Server> => {
    const res = await fetch(`${API_BASE_URL}/servers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create server');
    return res.json();
  },

  update: async (id: string, data: Partial<Server>): Promise<Server> => {
    const res = await fetch(`${API_BASE_URL}/servers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update server');
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/servers/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': API_KEY },
    });
    if (!res.ok) throw new Error('Failed to delete server');
  },

  fetchMetrics: async (id: string): Promise<ServerMetrics> => {
    const res = await fetch(`${API_BASE_URL}/servers/${id}/metrics`, {
      method: 'POST',
      headers: { 'x-api-key': API_KEY },
    });
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return res.json();
  },

  executeAction: async (id: string, action: string, data?: any): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/servers/${id}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify({ action, ...data }),
    });
    if (!res.ok) throw new Error('Failed to execute action');
    return res.json();
  }
};

// Alert API
export const alertApi = {
  getAll: async (resolved?: boolean): Promise<Alert[]> => {
    const params = resolved !== undefined ? `?resolved=${resolved}` : '';
    const res = await fetch(`${API_BASE_URL}/alerts${params}`, {
      headers: { 'x-api-key': API_KEY },
    });
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  create: async (data: Omit<Alert, 'id' | 'created_at' | 'resolved_at'>): Promise<Alert> => {
    const res = await fetch(`${API_BASE_URL}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create alert');
    return res.json();
  },

  resolve: async (id: string): Promise<Alert> => {
    const res = await fetch(`${API_BASE_URL}/alerts/${id}`, {
      method: 'PATCH',
      headers: { 'x-api-key': API_KEY },
    });
    if (!res.ok) throw new Error('Failed to resolve alert');
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/alerts/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': API_KEY },
    });
    if (!res.ok) throw new Error('Failed to delete alert');
  }
};

// Backup API
export const backupApi = {
  getAll: async (serverId?: string): Promise<Backup[]> => {
    const params = serverId ? `?server_id=${serverId}` : '';
    const res = await fetch(`${API_BASE_URL}/backups${params}`, {
      headers: { 'x-api-key': API_KEY },
    });
    if (!res.ok) throw new Error('Failed to fetch backups');
    return res.json();
  },

  create: async (data: Omit<Backup, 'id' | 'created_at' | 'completed_at'>): Promise<Backup> => {
    const res = await fetch(`${API_BASE_URL}/backups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create backup');
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/backups/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': API_KEY },
    });
    if (!res.ok) throw new Error('Failed to delete backup');
  }
};
