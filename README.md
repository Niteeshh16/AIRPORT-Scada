# 🏢 Long Thanh International Airport (LTIA) — SCADA / HBMS

> **Hub Building Management System (HBMS) & Industrial SCADA Control Room**  
> High-performance, real-time supervisory control, spatial layout tracking, and telemetry monitoring for Long Thanh International Airport Terminal 1.

---

## 🌟 Overview

The **Long Thanh SCADA / HBMS** dashboard is an enterprise-grade airport building automation and facility monitoring system. It provides facility managers, systems supervisors, and control-room operators with unified, real-time observability over all terminal operations, mechanical assets, electrical distribution, fire protection, baggage handling, and security subsystems.

Designed according to modern **high-performance SCADA standards (ISA-101 / ANSI-18.2)**, the interface prioritizes high-contrast legibility, situational awareness, and split-second operational response.

---

## 🚀 Key Modules & Capabilities

### 1. 🎛️ Command Center (`/` or `/command-center`)
- **System Health Metrics**: Fleet-wide equipment availability, active DDC controller health, active critical alarms, and substation power demand (`kW`).
- **Terminal 1 Spatial Blueprint**: Center-stage interactive SCADA layout with real-time equipment status markers.
- **12 Subsystems Directory**: Grid showing operational status, health scores, warnings, and active faults for all terminal services.
- **Floating & Docked Alarm Notifications**: Non-blocking alarm banner with one-click acknowledgment and mute controls.

### 2. 🗺️ Live Building Map (`/map`)
- **6-Floor Multi-Floor Grid**: 3x2 view displaying all terminal levels simultaneously:
  - `PIT Floor` (Utility Tunnels & Chiller Plants)
  - `Ground Floor (GF)` (Baggage Sortation & Apron Gates)
  - `First Floor (1F)` (Departures & Passenger Concourse — with active Zone 23 thermal alert indicator)
  - `Second Floor (2F)` (Retail & Dining Atrium)
  - `Third Floor (3F)` (Airline Lounges & Admin Complex)
  - `Fourth Floor (4F)` (Roof HVAC & Mechanical Plant)
- **Official 29-Zone Geometric Schematic**:
  - **North Pier (Vertical Spire)**: Gates 30–37 (`37`, `36`, `35`, `34`, `33`)
  - **West Pier Wing**: Gates 10–25 (`24`, `23`, `22`, `21`)
  - **East Pier Wing**: Gates 40–55 (`44`, `43`, `42`, `41`)
  - **Central Concourse Hub (Upper)**: Core Hub (`31`, `11`, `12`, `13`, `14`, `15`, `32`)
  - **Central Concourse Hub (Middle)**: Departures Hall (`01`, `02`, `03`, `04`, `05`)
  - **Curbside / Roadway (Lower)**: APM Loop & Ground Transport (`51`, `52`, `53`, `54`, `55`)
- **High-Contrast Dark Theme**: Clean black background (`#000000`) with no background clutter or noisy blueprint overlays.
- **Inspect Single Floor**: Toggle to zoom into any floor level and inspect device nodes directly.

### 3. 🛡️ Supervisor Observability Mode (`/supervisor-mode`)
- **Executive Fleet KPIs**: Availability and health tracking for 12 key equipment families:
  - Overall Equipment Availability (`97.1%`)
  - Overall Device Health (`97.8%`)
  - BACnet/IP & OPC-UA Communication Availability (`99.2%`)
  - AHU, PAU, MAU, CRAH, FCU, VAV, Chillers, Plumbing, and Fire Fighting Interfaces
- **Multi-Floor Availability Overview**: Compact 6-floor status tile matrix with active incident flags.
- **Interactive Trend Analysis**: Historical SLA charts with date range selectors and resolution toggles (1H, 24H, 7D, 30D).
- **Live Event Log Stream**: Real-time BACnet, Modbus TCP, OPC-UA, and MQTT protocol packet telemetry.

### 4. 🕹️ Operator Cockpit Mode (`/operator-mode`)
- **Rapid Fault Response**: Immediate triage of critical alarms and equipment trips.
- **AHU Fleet Cockpit**: Grid of Air Handling Unit control cards with return/supply air temperatures, fan speeds, cooling valve modulation, and pressure sensors.
- **Equipment Inspection & Control Drawer**:
  - Direct device command: **Start / Stop** toggle.
  - Operating mode: **Auto / Manual / Override**.
  - Setpoint calibration: Increment / decrement temperature targets in real time.

### 5. 🏗️ All 12 Building Subsystems (`/subsystems` & `/subsystems/:id`)
Comprehensive SCADA monitoring across all 12 airport engineering domains:
1. **LBMS** — HVAC & Climate Control
2. **BHS** — Baggage Handling System
3. **FAS** — Fire Alarm System
4. **SACS** — Security & Access Control System
5. **SSE** — Security Screening Equipment (X-Ray, CT Scanners)
6. **AGAC** — Airport Gate Access Control
7. **VDGS** — Visual Docking Guidance System
8. **CMS** — Central Monitoring (Electrical Substations & Power Distribution)
9. **PAS** — Public Address & Evacuation Sound System
10. **MCS** — Master Clock & NTP Time Synchronization System
11. **SCADA** — Supervisory Control & Data Acquisition Core
12. **IASS** — Integrated Aircraft Stand System

### 6. 📊 Additional Facility Management Tools
- **Equipment Explorer (`/equipment`)**: Filterable, searchable directory of all assets by floor, subsystem, and operational health.
- **Alerts & Events Manager (`/alerts`)**: Centralized alarm log with priority classification and acknowledgment audit trails.
- **Analytics & Trends (`/analytics`)**: Energy consumption trends, equipment runtime, and predictive maintenance analysis.
- **Work Orders (`/work-orders`)**: Task management and technician dispatch for corrective and preventative maintenance.
- **Asset Management (`/assets`)**: Asset lifecycle, installation records, and warranty details.
- **SOP Management (`/sop`)**: Standard Operating Procedure checklists for emergency and maintenance workflows.
- **User Management (`/users`)**: Access control and operator role permission profiles.

---

## ⚡ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Core UI rendering engine |
| **Vite 8** | Lightning-fast development & production bundling |
| **React Router v7** | Single Page Application (SPA) client routing |
| **Lucide React** | Industrial and engineering icon toolkit |
| **Recharts** | Interactive telemetry and KPI trend charts |
| **Vanilla CSS** | Tailored dark-mode SCADA design system with CSS custom properties |

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Niteeshh16/AIRPORT-Scada.git
   cd AIRPORT-Scada
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## ⌨️ Keyboard Shortcuts

| Shortcut Key | Action |
|---|---|
| <kbd>M</kbd> | Navigate to **Live Building Map** |
| <kbd>O</kbd> | Navigate to **Operator Cockpit** |
| <kbd>S</kbd> | Navigate to **Supervisor Observability** |
| <kbd>A</kbd> | Navigate to **Alerts & Events** |
| <kbd>E</kbd> | Navigate to **Equipment Explorer** |
| <kbd>Esc</kbd> | Close slide-in equipment inspection drawer |

---

## 📁 Project Structure

```
Airport-Dashboard/
├── public/                     # Static assets (favicons, SVGs)
├── src/
│   ├── assets/                 # Brand logos and images
│   ├── components/             # Reusable SCADA UI components
│   │   ├── AHUCard.jsx         # Air handling unit status card
│   │   ├── BottomOpsWidgets.jsx# Quick metric telemetry widgets
│   │   ├── EmergencyBanner.jsx # Critical building emergency alert
│   │   ├── FloatingAlerts.jsx  # Live alarm notification ticker
│   │   ├── FloorMap.jsx        # Single-floor interactive vector map
│   │   ├── Header.jsx          # App header with clock and status indicators
│   │   ├── InspectionPanel.jsx # Slide-in device control and inspection drawer
│   │   ├── LotusLogo.jsx       # Long Thanh terminal branding badge
│   │   ├── ModeSwitcherBar.jsx # Quick switcher (Supervisor, Operator, Map View)
│   │   ├── MultiFloorMapGrid.jsx# 6-floor 29-zone schematic grid (Screenshot 1)
│   │   ├── OpsPanel.jsx        # Operational desk log & protocol monitor
│   │   ├── SCADASchematic.jsx  # Engineering P&ID schematic view
│   │   ├── Sidebar.jsx         # Subsystem and navigation sidebar
│   │   └── TrendAnalysisModal.jsx # Historical availability analytics modal
│   ├── context/
│   │   └── LiveDataContext.jsx # Global SCADA telemetry & real-time simulation state
│   ├── data/
│   │   └── mockData.js         # Comprehensive equipment, floor, and zone registries
│   ├── pages/                  # Top-level module views
│   │   ├── AlertsEvents.jsx
│   │   ├── Analytics.jsx
│   │   ├── AssetManagement.jsx
│   │   ├── CommandCenter.jsx
│   │   ├── EquipmentExplorer.jsx
│   │   ├── LiveMap.jsx
│   │   ├── OperatorMode.jsx
│   │   ├── SOPManagement.jsx
│   │   ├── SubsystemDetail.jsx
│   │   ├── Subsystems.jsx
│   │   ├── SupervisorMode.jsx
│   │   ├── UserManagement.jsx
│   │   └── WorkOrders.jsx
│   ├── App.jsx                 # Routing and root layout container
│   ├── index.css               # Complete SCADA dark theme design tokens & styles
│   └── main.jsx                # Application bootstrap entry point
├── package.json
└── README.md
```

---

## 🔒 Security & Standards Compliance

- **ISA-101 / High-Performance HMI Guidelines**: Minimalist backgrounds, purposeful color coding (green = normal, amber = warning, red = critical fault).
- **Industrial Protocols Emulated**: Real-time simulation of **BACnet/IP**, **Modbus TCP**, **OPC-UA**, and **MQTT**.
- **Role-Based Access Control**: Structured for Super Admin, Facility Supervisor, and Control Room Operator duty roles.

---

## 📄 License

Internal use for **Long Thanh International Airport (LTIA) SCADA / HBMS Development Team**. All rights reserved.
