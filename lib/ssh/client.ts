import { NodeSSH } from 'node-ssh';
import { promisify } from 'util';

export interface SSHConfig {
  host: string;
  port?: number;
  username: string;
  password?: string;
  privateKey?: string;
}

export interface ServerMetrics {
  cpu_usage: number;
  ram_usage: number;
  bandwidth: number;
  disk_io: number;
  temperature: number;
  uptime: string;
}

export class SSHClient {
  private ssh: NodeSSH;

  constructor() {
    this.ssh = new NodeSSH();
  }

  async connect(config: SSHConfig): Promise<void> {
    await this.ssh.connect({
      host: config.host,
      port: config.port || 22,
      username: config.username,
      password: config.password,
      privateKey: config.privateKey,
    });
  }

  async disconnect(): Promise<void> {
    await this.ssh.dispose();
  }

  async executeCommand(command: string): Promise<string> {
    const result = await this.ssh.execCommand(command);
    if (result.stderr && !result.stdout) {
      throw new Error(`SSH command failed: ${result.stderr}`);
    }
    return result.stdout.trim();
  }

  async getMetrics(): Promise<ServerMetrics> {
    // Get CPU usage
    const cpuResult = await this.executeCommand(
      "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'"
    );
    const cpu_usage = parseFloat(cpuResult) || 0;

    // Get RAM usage
    const ramResult = await this.executeCommand(
      "free | grep Mem | awk '{print ($3/$2) * 100.0}'"
    );
    const ram_usage = parseFloat(ramResult) || 0;

    // Get network bandwidth (simplified)
    const bandwidthResult = await this.executeCommand(
      "cat /proc/net/dev | grep eth0 | awk '{print $2 + $10}'"
    );
    const bandwidth = parseFloat(bandwidthResult) / 1024 / 1024 || 0; // Convert to MB

    // Get disk I/O (simplified)
    const diskIOResult = await this.executeCommand(
      "iostat -x 1 2 | tail -n +4 | awk '{print $14}' | head -n 1"
    );
    const disk_io = parseFloat(diskIOResult) || 0;

    // Get temperature (if available)
    let temperature = 0;
    try {
      const tempResult = await this.executeCommand(
        "sensors | grep 'Core 0' | awk '{print $3}' | sed 's/[^0-9.]//g'"
      );
      temperature = parseFloat(tempResult) || 0;
    } catch {
      // Temperature not available
    }

    // Get uptime
    const uptimeResult = await this.executeCommand("uptime -p");
    const uptime = uptimeResult || "unknown";

    return {
      cpu_usage,
      ram_usage,
      bandwidth,
      disk_io,
      temperature,
      uptime,
    };
  }

  async reboot(): Promise<void> {
    await this.executeCommand('sudo reboot');
  }

  async powerOff(): Promise<void> {
    await this.executeCommand('sudo poweroff');
  }

  async createSnapshot(name: string): Promise<string> {
    // This would need to be implemented based on your virtualization platform
    // For now, return a mock snapshot ID
    const timestamp = Date.now();
    return `snap-${name}-${timestamp}`;
  }

  async getUptime(): Promise<string> {
    return await this.executeCommand('uptime -p');
  }

  async getOSInfo(): Promise<string> {
    return await this.executeCommand('cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2 | tr -d \\"');
  }
}
