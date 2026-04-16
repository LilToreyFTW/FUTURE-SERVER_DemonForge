import db from './schema';

export interface Server {
  id: string;
  name: string;
  ip: string;
  port: number;
  username: string;
  password?: string;
  private_key?: string;
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

// Server operations
export const serverOperations = {
  getAll: (): Server[] => {
    const stmt = db.prepare('SELECT * FROM servers ORDER BY created_at DESC');
    return stmt.all() as Server[];
  },

  getById: (id: string): Server | undefined => {
    const stmt = db.prepare('SELECT * FROM servers WHERE id = ?');
    return stmt.get(id) as Server | undefined;
  },

  create: (server: Omit<Server, 'created_at' | 'updated_at'>): Server => {
    const stmt = db.prepare(`
      INSERT INTO servers (id, name, ip, port, username, password, private_key, os, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      server.id,
      server.name,
      server.ip,
      server.port,
      server.username,
      server.password,
      server.private_key,
      server.os,
      server.status
    );
    return serverOperations.getById(server.id)!;
  },

  update: (id: string, updates: Partial<Omit<Server, 'id' | 'created_at' | 'updated_at'>>): void => {
    const fields = Object.keys(updates).filter(k => k !== 'id');
    const values = fields.map(f => updates[f as keyof typeof updates]);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    const stmt = db.prepare(`
      UPDATE servers 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    stmt.run(...values, id);
  },

  delete: (id: string): void => {
    const stmt = db.prepare('DELETE FROM servers WHERE id = ?');
    stmt.run(id);
  },

  updateStatus: (id: string, status: string): void => {
    const stmt = db.prepare('UPDATE servers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(status, id);
  }
};

// Server metrics operations
export const metricsOperations = {
  getLatest: (serverId: string, limit: number = 100): ServerMetrics[] => {
    const stmt = db.prepare(`
      SELECT * FROM server_metrics 
      WHERE server_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);
    return stmt.all(serverId, limit) as ServerMetrics[];
  },

  create: (metrics: Omit<ServerMetrics, 'id' | 'timestamp'>): ServerMetrics => {
    const stmt = db.prepare(`
      INSERT INTO server_metrics (server_id, cpu_usage, ram_usage, bandwidth, disk_io, temperature)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      metrics.server_id,
      metrics.cpu_usage,
      metrics.ram_usage,
      metrics.bandwidth,
      metrics.disk_io,
      metrics.temperature
    );
    
    const stmt2 = db.prepare('SELECT * FROM server_metrics WHERE id = ?');
    return stmt2.get(result.lastInsertRowid) as ServerMetrics;
  },

  deleteOld: (days: number = 30): void => {
    const stmt = db.prepare(`
      DELETE FROM server_metrics 
      WHERE timestamp < datetime('now', '-' || ? || ' days')
    `);
    stmt.run(days);
  }
};

// Alert operations
export const alertOperations = {
  getAll: (resolved: boolean | null = null): Alert[] => {
    let stmt;
    if (resolved === null) {
      stmt = db.prepare('SELECT * FROM alerts ORDER BY created_at DESC');
    } else {
      stmt = db.prepare('SELECT * FROM alerts WHERE resolved = ? ORDER BY created_at DESC');
      return stmt.all(resolved) as Alert[];
    }
    return stmt.all() as Alert[];
  },

  create: (alert: Omit<Alert, 'created_at' | 'resolved_at'>): Alert => {
    const stmt = db.prepare(`
      INSERT INTO alerts (id, server_id, type, severity, message, resolved)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(alert.id, alert.server_id, alert.type, alert.severity, alert.message, alert.resolved);
    return alertOperations.getById(alert.id)!;
  },

  getById: (id: string): Alert | undefined => {
    const stmt = db.prepare('SELECT * FROM alerts WHERE id = ?');
    return stmt.get(id) as Alert | undefined;
  },

  resolve: (id: string): void => {
    const stmt = db.prepare('UPDATE alerts SET resolved = TRUE, resolved_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(id);
  },

  delete: (id: string): void => {
    const stmt = db.prepare('DELETE FROM alerts WHERE id = ?');
    stmt.run(id);
  }
};

// Backup operations
export const backupOperations = {
  getAll: (): Backup[] => {
    const stmt = db.prepare('SELECT * FROM backups ORDER BY created_at DESC');
    return stmt.all() as Backup[];
  },

  getByServerId: (serverId: string): Backup[] => {
    const stmt = db.prepare('SELECT * FROM backups WHERE server_id = ? ORDER BY created_at DESC');
    return stmt.all(serverId) as Backup[];
  },

  create: (backup: Omit<Backup, 'created_at' | 'completed_at'>): Backup => {
    const stmt = db.prepare(`
      INSERT INTO backups (id, server_id, name, size, status)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(backup.id, backup.server_id, backup.name, backup.size, backup.status);
    return backupOperations.getById(backup.id)!;
  },

  getById: (id: string): Backup | undefined => {
    const stmt = db.prepare('SELECT * FROM backups WHERE id = ?');
    return stmt.get(id) as Backup | undefined;
  },

  update: (id: string, updates: Partial<Omit<Backup, 'id' | 'created_at'>>): void => {
    const fields = Object.keys(updates).filter(k => k !== 'id');
    const values = fields.map(f => updates[f as keyof typeof updates]);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    const stmt = db.prepare(`
      UPDATE backups 
      SET ${setClause} 
      WHERE id = ?
    `);
    stmt.run(...values, id);
  },

  delete: (id: string): void => {
    const stmt = db.prepare('DELETE FROM backups WHERE id = ?');
    stmt.run(id);
  }
};
