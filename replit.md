# ÉTHIQUE Magazine App

## Overview
A React-based magazine/content management application built with Vite, Tailwind CSS, and shadcn/ui components.

## Tech Stack
- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **UI Components**: Radix UI primitives

## Project Structure
```
├── api/                    # API client and entity definitions
│   ├── base44Client.js     # Mock API client (original used @base44/sdk)
│   ├── entities.js         # Entity exports
│   └── integrations.js     # Integration exports
├── components/
│   ├── admin/              # Admin dashboard components
│   ├── advertiser/         # Advertiser dashboard components
│   ├── affiliate/          # Affiliate dashboard components
│   ├── category/           # Category page components
│   ├── home/               # Home page components
│   ├── hooks/              # Custom React hooks
│   ├── layout/             # Layout components (nav, footer, popups)
│   ├── magazine/           # Magazine/article components
│   └── ui/                 # shadcn/ui component library
├── lib/                    # Utility functions
├── pages/                  # Page components (routes)
├── utils/                  # Additional utilities
├── App.jsx                 # Main app component
├── main.jsx                # Entry point with providers
└── index.css               # Global styles with Tailwind
```

## Running the App
- **Development**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Notes
- The original project used `@base44/sdk` for backend services which is not available on npm
- A mock client has been created in `api/base44Client.js` that returns empty data
- The app will show loading states since no real backend is connected

## Recent Changes
- December 10, 2025: Initial Replit setup
  - Added Vite configuration with proper host settings
  - Set up Tailwind CSS and PostCSS
  - Created mock base44 client
  - Reorganized component folder structure
  - Added QueryClientProvider for React Query
