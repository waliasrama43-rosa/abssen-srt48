# EduSmart Asrama - SaaS Boarding School Management

Sistem manajemen asrama berbasis cloud yang dirancang untuk pondok pesantren dan boarding school di Indonesia.

## Architecture Overview

```
[PWA Client] <---> [Google Apps Script API] <---> [Google Sheets Database]
     |                                                    |
     +-- IndexedDB (offline cache)              Spreadsheet per tenant/month
     +-- Service Worker (offline shell)         Auto-sharding by period
```

### Tech Stack

- **Frontend**: Progressive Web App (vanilla JS/CSS/HTML)
  - Offline-first with Service Worker
  - IndexedDB for local caching and offline queue
  - Hash-based SPA routing
  - Mobile-first responsive design

- **Backend**: Google Apps Script (GAS)
  - RESTful-style API via doGet/doPost
  - Multi-tenant architecture
  - Session-based authentication via CacheService

- **Database**: Google Sheets
  - One master spreadsheet per tenant (config, users, students)
  - Monthly log spreadsheets (auto-created, auto-sharded)
  - Global config spreadsheet for tenant registry

## Setup Instructions

### PWA Development

1. Serve the `pwa/` directory with any static file server
2. Open in browser (Chrome recommended for PWA features)
3. For production, deploy to any static hosting (GitHub Pages, Netlify, etc.)

### GAS Backend

1. Create a new Google Apps Script project
2. Copy all files from `gas/` directory
3. Deploy as Web App (Execute as: Me, Access: Anyone)
4. Copy the deployment URL to PWA config

### Google Sheets Setup

1. Create the Global Config spreadsheet
2. Add tenant registry sheet
3. Update `GLOBAL_CONFIG_SHEET_ID` in `Config.gs`

## Project Status

- [x] Phase 1: Foundation (PWA shell, auth, offline support)
- [ ] Phase 2: Core features (attendance, activities)
- [ ] Phase 3: Reporting and analytics
- [ ] Phase 4: Advanced features (multi-tenant, billing)

## License

Proprietary - All rights reserved.
