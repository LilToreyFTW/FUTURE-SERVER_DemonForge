import { SSHClient } from '../ssh/client';

export interface MonitoringConfig {
  cpuThreshold: number;
  ramThreshold: number;
  diskThreshold: number;
  temperatureThreshold: number;
}

export class MonitoringAgent {
  private ssh: SSHClient;
  private config: MonitoringConfig;

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.ssh = new SSHClient();
    this.config = {
      cpuThreshold: config.cpuThreshold || 80,
      ramThreshold: config.ramThreshold || 85,
      diskThreshold: config.diskThreshold || 90,
      temperatureThreshold: config.temperatureThreshold || 70,
    };
  }

  async connect(host: string, username: string, password?: string, privateKey?: string, port?: number) {
    await this.ssh.connect({
      host,
      port: port || 22,
      username,
      password,
      privateKey,
    });
  }

  async disconnect() {
    await this.ssh.disconnect();
  }

  async checkThresholds(): Promise<{
    cpuAlert: boolean;
    ramAlert: boolean;
    diskAlert: boolean;
    temperatureAlert: boolean;
    alerts: string[];
  }> {
    const metrics = await this.ssh.getMetrics();
    const alerts: string[] = [];

    const cpuAlert = metrics.cpu_usage > this.config.cpuThreshold;
    const ramAlert = metrics.ram_usage > this.config.ramThreshold;
    const diskAlert = metrics.disk_io > this.config.diskThreshold;
    const temperatureAlert = metrics.temperature > this.config.temperatureThreshold;

    if (cpuAlert) alerts.push(`CPU usage ${metrics.cpu_usage.toFixed(1)}% exceeds threshold ${this.config.cpuThreshold}%`);
    if (ramAlert) alerts.push(`RAM usage ${metrics.ram_usage.toFixed(1)}% exceeds threshold ${this.config.ramThreshold}%`);
    if (diskAlert) alerts.push(`Disk I/O ${metrics.disk_io.toFixed(1)}% exceeds threshold ${this.config.diskThreshold}%`);
    if (temperatureAlert) alerts.push(`Temperature ${metrics.temperature.toFixed(1)}°C exceeds threshold ${this.config.temperatureThreshold}°C`);

    return {
      cpuAlert,
      ramAlert,
      diskAlert,
      temperatureAlert,
      alerts,
    };
  }

  async installNodeExporter(): Promise<void> {
    // Install Node Exporter on the server
    await this.ssh.executeCommand('wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz');
    await this.ssh.executeCommand('tar xvfz node_exporter-1.6.1.linux-amd64.tar.gz');
    await this.ssh.executeCommand('mv node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/');
    await this.ssh.executeCommand('chmod +x /usr/local/bin/node_exporter');
    
    // Create systemd service
    const service = `[Unit]
Description=Node Exporter
After=network.target

[Service]
User=root
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target`;

    await this.ssh.executeCommand(`echo '${service}' > /etc/systemd/system/node_exporter.service`);
    await this.ssh.executeCommand('systemctl daemon-reload');
    await this.ssh.executeCommand('systemctl enable node_exporter');
    await this.ssh.executeCommand('systemctl start node_exporter');
  }

  async getNodeExporterMetrics(): Promise<string> {
    try {
      const metrics = await this.ssh.executeCommand('curl http://localhost:9100/metrics');
      return metrics;
    } catch {
      throw new Error('Node Exporter not running or not installed');
    }
  }

  parsePrometheusMetrics(metrics: string): Map<string, number> {
    const result = new Map<string, number>();
    const lines = metrics.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('#') || line.trim() === '') continue;
      
      const match = line.match(/^(\w+)\s+(\d+\.?\d*)/);
      if (match) {
        result.set(match[1], parseFloat(match[2]));
      }
    }
    
    return result;
  }
}
