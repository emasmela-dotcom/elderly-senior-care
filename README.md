# Senior Care Management System

A comprehensive management system for elderly and senior care facilities, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Resident Management**: Comprehensive profiles and health records for all residents
- **Caregiver Management**: Staff scheduling, assignments, and performance tracking
- **Care Schedules**: Manage medication schedules, appointments, and daily care routines
- **Health Records**: Track medical history, medications, and vital signs
- **Activity Tracking**: Monitor daily activities and engagement programs
- **Safety & Compliance**: Incident reports, safety protocols, and regulatory compliance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
senior-care-management/
├── app/                    # Next.js App Router pages
│   ├── activities/        # Activity management
│   ├── caregivers/        # Caregiver management
│   ├── health-records/    # Health record tracking
│   ├── residents/         # Resident management
│   ├── safety/            # Safety & compliance
│   ├── schedules/         # Care scheduling
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home/dashboard page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   └── Navigation.tsx    # Main navigation component
├── public/               # Static assets
└── ...config files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Next Steps

- [ ] Set up database (PostgreSQL, MongoDB, or similar)
- [ ] Implement authentication and authorization
- [ ] Add API routes for data management
- [ ] Create forms for adding/editing residents, caregivers, etc.
- [ ] Implement calendar view for schedules
- [ ] Add data visualization and reporting
- [ ] Set up testing framework
- [ ] Add dark mode support
- [ ] Implement search and filtering functionality

## License

This project is private and proprietary.

