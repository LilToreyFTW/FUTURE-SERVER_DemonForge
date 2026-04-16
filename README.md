# DemonForge Engine

The DemonForge Engine is a premium, proprietary GUI control panel for rack hosting infrastructure. It transforms raw physical servers into a seamless, app-like management experience without ever needing SSH or command-line tools.

## Features

### Pillar 1: DemonForge Foundation
- Full rack allocation with custom hardware specs
- Complete custom DemonForge GUI installation
- Pre-configured base OS with proprietary Demonware-OS optimizations
- Personalized dashboard tailored to your use case

### Pillar 2: Live Command Dashboard
- 24/7 access to the proprietary DemonForge GUI (web + mobile-friendly)
- Real-time graphs for CPU, RAM, bandwidth, disk I/O, temperature, and per-server metrics
- One-click server actions: reboot, snapshot, clone, migrate between rack nodes
- Custom alerts delivered straight to Discord/Slack/Email

### Pillar 3: Autonomous Optimization Engine
- Weekly automated performance reports + one-click optimization recommendations
- Auto-scaling rules (add/remove resources or spin up new VMs/containers)
- Built-in load balancing and traffic routing inside the GUI
- Predictive maintenance alerts before hardware issues hit

### Pillar 4: Ironclad Fortress
- Zero-trust security hardening + automatic daily encrypted backups (off-rack)
- DDoS protection, firewall rules, and intrusion detection managed through the GUI
- Monthly 1-hour strategy call with the rack owner
- 15-minute response SLA for any critical issue

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
forgeengine/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── page.tsx             # Overview dashboard
│   │   ├── servers/             # Server management
│   │   ├── monitoring/          # Real-time monitoring
│   │   ├── security/            # Security controls
│   │   ├── backups/             # Backup management
│   │   └── settings/            # Settings configuration
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page (redirects to dashboard)
├── components/
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── types.ts                 # TypeScript type definitions
│   ├── mock-data.ts             # Mock data for development
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## Pages

### Dashboard Overview
- Real-time server status
- CPU, RAM, bandwidth, and temperature metrics
- Active alerts
- Server list with live updates

### Servers
- List all servers in your rack
- Add new servers
- One-click actions: reboot, power, snapshot
- Server configuration
- Delete servers

### Monitoring
- Detailed real-time metrics
- Server selection
- Historical data views
- Performance trends

### Security
- Firewall management
- DDoS protection configuration
- Intrusion detection settings
- Security rules

### Backups
- Backup history
- Create new backups
- Restore backups
- Download backups
- Delete backups

### Settings
- General settings
- Notification preferences (Email, Discord, Slack)
- Security settings (2FA, password)
- API key management

## DemonForge Orchestration Protocol

The proprietary GUI and backend system that no other host on the planet can offer. Unlike generic control panels (cPanel, Plesk, Webmin) or cloud dashboards that force you into someone else's infrastructure, the DemonForge Engine is a from-scratch, self-hosted GUI built specifically for physical rack ownership.

**Key Differentiators:**
- Deep hardware-level integration (fans, power, sensors)
- One-click everything (no CLI ever needed)
- Container/VM orchestration that feels like Heroku but on your own metal
- Proprietary "Forge Link" system that lets clients chain multiple servers together instantly

## License

Proprietary - Part of the DemonForge Engine Signature Service ($3,000/mo)

## Support

For support, contact your dedicated rack manager or use the 15-minute response SLA for critical issues.
