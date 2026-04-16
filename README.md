# DemonForge Engine

**Copyright (c) 2026 TOREY. All rights reserved.**

This software is proprietary and protected by copyright law. See LICENSE file for complete terms and restrictions.

The DemonForge Engine is a premium, proprietary GUI control panel for rack hosting infrastructure. It transforms raw physical servers into a seamless, app-like management experience with real SSH integration, database storage, and comprehensive monitoring - no command-line tools required.

## Features

### Core Capabilities
- **Real Server Integration**: Connect to physical servers via SSH with real-time metric fetching
- **Database Storage**: SQLite database for servers, metrics, alerts, backups, and security rules
- **Authentication**: API key-based authentication for all endpoints
- **Real-time Monitoring**: Live CPU, RAM, bandwidth, disk I/O, and temperature metrics
- **Server Management**: Add, configure, and control servers through the GUI
- **Security Operations**: Firewall rules, DDoS protection, security audits, threat logging
- **Backup Management**: Create, restore, and manage server backups
- **Alert System**: Real-time alerts with Discord webhook integration
- **Monitoring Agent**: Prometheus Node Exporter integration support

### Dashboard Pages

**Overview**
- Real-time server status and metrics
- Active alerts display
- Server list with live updates
- Average CPU/RAM usage across all servers

**Servers**
- Add servers with SSH credentials
- View server configuration and status
- Execute server actions (reboot, poweroff, snapshot)
- Delete servers from management

**Monitoring**
- Detailed per-server metrics
- Server selection for focused monitoring
- Historical data views
- Performance trends over time

**Security**
- Quick Actions: Add firewall rules, configure DDoS protection, run security audits
- Threat log with search and filtering
- Security settings with 2FA and password management

**Backups**
- Backup history across all servers
- Create new backups
- Backup status tracking
- Download and delete backups

**Settings**
- General settings (company name, timezone, dark mode)
- Notification preferences (Email, Discord, Slack)
- Security settings (2FA, password update)
- API key management and integrations

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Database**: SQLite with better-sqlite3
- **SSH Integration**: node-ssh, ssh2
- **Real-time Updates**: WebSocket (ws)
- **Authentication**: Custom API key middleware
- **Monitoring**: Prometheus Node Exporter support
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- SSH access to your servers
- SQLite (included as dependency)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
forgeengine/
├── app/
│   ├── api/                      # API routes
│   │   ├── servers/              # Server management endpoints
│   │   ├── alerts/               # Alert management endpoints
│   │   ├── backups/              # Backup management endpoints
│   │   ├── settings/             # Settings endpoints
│   │   ├── security/             # Security operation endpoints
│   │   └── monitoring/           # Monitoring agent endpoints
│   ├── dashboard/
│   │   ├── layout.tsx           # Dashboard layout with sidebar
│   │   ├── page.tsx              # Overview dashboard
│   │   ├── servers/              # Server management page
│   │   ├── monitoring/           # Real-time monitoring page
│   │   ├── security/
│   │   │   ├── page.tsx          # Security settings page
│   │   │   └── threat-log/       # Threat log page
│   │   ├── backups/              # Backup management page
│   │   └── settings/             # Settings configuration page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── dashboard/                # Dashboard-specific components
│   │   └── quick-actions.tsx     # Quick security actions
│   ├── dialogs/                  # Dialog components
│   │   ├── firewall-rule-dialog.tsx
│   │   ├── ddos-protection-dialog.tsx
│   │   └── security-audit-dialog.tsx
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── api/                      # API client
│   │   └── client.ts             # Frontend API client
│   ├── auth/                     # Authentication
│   │   └── middleware.ts        # API key middleware
│   ├── db/                       # Database
│   │   ├── schema.ts             # Database schema
│   │   └── queries.ts            # Database queries
│   ├── monitoring/               # Monitoring
│   │   └── agent.ts              # Monitoring agent integration
│   ├── ssh/                      # SSH client
│   │   └── client.ts             # SSH connection manager
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utility functions
├── .env.example                  # Environment variables template
├── LICENSE                       # Proprietary license
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

## API Endpoints

### Servers
- `GET /api/servers` - List all servers
- `POST /api/servers` - Add new server
- `GET /api/servers/[id]` - Get server details
- `PUT /api/servers/[id]` - Update server
- `DELETE /api/servers/[id]` - Delete server
- `POST /api/servers/[id]/metrics` - Fetch server metrics via SSH
- `POST /api/servers/[id]/actions` - Execute server command (reboot, poweroff, snapshot)

### Alerts
- `GET /api/alerts` - List all alerts
- `POST /api/alerts` - Create new alert
- `GET /api/alerts/[id]` - Get alert details
- `PATCH /api/alerts/[id]` - Resolve alert
- `DELETE /api/alerts/[id]` - Delete alert

### Backups
- `GET /api/backups` - List all backups
- `POST /api/backups` - Create new backup
- `GET /api/backups/[id]` - Get backup details
- `PATCH /api/backups/[id]` - Update backup
- `DELETE /api/backups/[id]` - Delete backup

### Security
- `POST /api/security/firewall` - Add firewall rule
- `POST /api/security/ddos` - Configure DDoS protection
- `POST /api/security/audit` - Run security audit
- `GET /api/security/threats` - Get threat log

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings
- `POST /api/settings/password` - Update password
- `POST /api/settings/api-key` - Generate new API key

### Monitoring
- `POST /api/monitoring/check` - Check thresholds and create alerts
- `POST /api/monitoring/agent/install` - Install Node Exporter on server

## Database Schema

- **servers**: Server configuration, credentials, and status
- **server_metrics**: Historical server performance data
- **alerts**: Security and threshold alerts
- **backups**: Backup records
- **security_rules**: Firewall and security configuration
- **scaling_rules**: Auto-scaling configuration

## Authentication

All API endpoints are protected with API key authentication. Include the `x-api-key` header with your API key in requests.

## License

**Copyright (c) 2026 TOREY. All rights reserved.**

This software is proprietary. Modification, editing, or alteration of this code is strictly prohibited except by the copyright holder (TOREY) and authorized developers. Use is limited to launching and running the application on localhost or your own server rack. See LICENSE file for complete terms.

## Important Notes

- This software connects to real servers via SSH
- Ensure your servers have SSH access enabled
- The database file (demonforge.db) is created automatically on first run
- API keys should be kept secure and not shared
- Discord webhook is pre-configured for alert notifications
