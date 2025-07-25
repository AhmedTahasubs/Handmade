---
description: Repository Information Overview
alwaysApply: true
---

# HandmadeITIv0 Information

## Summary
HandmadeITIv0 is an Angular-based web application for a handmade products marketplace. The project includes user-facing pages, authentication functionality, and an admin dashboard for managing products, orders, services, users, and categories.

## Structure
- **src/app/adminPages**: Admin dashboard pages for managing various resources
- **src/app/authPages**: Authentication-related pages (login, register, forgot password)
- **src/app/components**: Reusable UI components (navbar, footer, forms, etc.)
- **src/app/guards**: Authentication guards for route protection
- **src/app/layouts**: Layout components (main layout and dashboard layout)
- **src/app/pages**: Main application pages (home, categories, etc.)
- **src/app/services**: Service classes for authentication, theming, and language
- **public**: Static assets directory

## Language & Runtime
**Language**: TypeScript
**Version**: ~5.8.2
**Framework**: Angular 20.1.0
**Build System**: Angular CLI
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- Angular Core/Common/Router (^20.1.0)
- FontAwesome (^6.7.2)
- RxJS (~7.8.0)
- Zone.js (~0.15.0)

**Development Dependencies**:
- Angular CLI/Build (^20.1.0)
- Jasmine/Karma (testing)
- TailwindCSS (^3.4.17)
- TypeScript (~5.8.2)

## Build & Installation
```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build
```

## UI Framework
**CSS Framework**: TailwindCSS 3.4.17
**Configuration**: tailwind.config.js with dark mode support
**Icon Library**: FontAwesome 6.7.2

## Application Structure
**Entry Point**: src/main.ts
**Main Component**: src/app/app.ts
**Routing**: Two main layouts:
- Main Layout: Public-facing pages (home, categories)
- Dashboard Layout: Admin and user dashboard pages

## Testing
**Framework**: Jasmine with Karma
**Test Location**: Spec files alongside components
**Configuration**: tsconfig.spec.json
**Run Command**:
```bash
ng test
```