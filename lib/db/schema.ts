import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'demonforge.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create servers table
db.exec(`
  CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ip TEXT NOT NULL UNIQUE,
    port INTEGER DEFAULT 22,
    username TEXT NOT NULL,
    password TEXT,
    private_key TEXT,
    os TEXT,
    status TEXT DEFAULT 'offline',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create server_metrics table for historical data
db.exec(`
  CREATE TABLE IF NOT EXISTS server_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT NOT NULL,
    cpu_usage REAL,
    ram_usage REAL,
    bandwidth REAL,
    disk_io REAL,
    temperature REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (server_id) REFERENCES servers(id)
  )
`);

// Create alerts table
db.exec(`
  CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL,
    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    message TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (server_id) REFERENCES servers(id)
  )
`);

// Create backups table
db.exec(`
  CREATE TABLE IF NOT EXISTS backups (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL,
    name TEXT NOT NULL,
    size REAL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (server_id) REFERENCES servers(id)
  )
`);

// Create security_rules table
db.exec(`
  CREATE TABLE IF NOT EXISTS security_rules (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    description TEXT NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create scaling_rules table
db.exec(`
  CREATE TABLE IF NOT EXISTS scaling_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    condition TEXT NOT NULL,
    action TEXT NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create indexes for better query performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_server_metrics_server_id ON server_metrics(server_id);
  CREATE INDEX IF NOT EXISTS idx_server_metrics_timestamp ON server_metrics(timestamp);
  CREATE INDEX IF NOT EXISTS idx_alerts_server_id ON alerts(server_id);
  CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved);
  CREATE INDEX IF NOT EXISTS idx_backups_server_id ON backups(server_id);
`);

export default db;
