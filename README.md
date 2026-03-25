# AQSAMS - Aviation Quality & Safety Management System

AQSAMS is a high-fidelity, enterprise-grade digital platform designed for aviation safety oversight, compliance management, and operations control. It is built to maintain compliance with ICAO, IATA, and Nigerian Civil Aviation Regulations (Nig. CARs).

## 🚀 System Architecture
- **Tech Stack**: Next.js 15+ (App Router), Tailwind CSS v4, Framer Motion, Iconsax.
- **Modularity**: Clean separation of concerns with a dedicated `src/modules/` layer for scalable aviation logic.
- **Safety Centric**: Built-in support for ICAO Annex 19 and NCAA Advisory Circulars.

## 🛠️ Performance & Compliance Features
- **Technical Audit Core**: Automated checklists for MEL/MMEL, Avionics Workshops, and SMS audits.
- **Operations Console**: Real-time On-Time Performance (OTP) tracking with IATA Delay Code mapping.
- **Regulatory Engine**: Pre-integrated mapping for Nig. CAR Part 20 and safety oversight standards.
- **Findings Management**: Automated tracking, Level 1/2 finding alerts, and closure execution logs.

## 🏁 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd aviation-audit
npm install
```

### Development
Since this project uses modern Next.js features and native bindings, if you encounter SWC/Turbopack issues on Windows, run the development server with:

```bash
npm run dev -- --webpack
```

## 📂 Project Structure
```bash
src/
├── app/                  # Next.js App Router
├── components/           # UI Components (Shadcn/UI)
├── lib/                  # Utilities & Design System
└── modules/
    └── website/          # Landing Page & Marketing Module
        ├── components/   # Aviation-specific components
        ├── constants/    # Regulatory data & menu structures
        └── views/        # Page views
```

## ⚖️ Regulatory Disclaimer
This system is designed as a tool for safety management. Users must ensure all data collection is performed in accordance with their respective Civil Aviation Authority (CAA) manual of procedures.
