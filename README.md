# SHMS — Smart Hostel Management System

> A full-featured hostel management platform for tertiary institutions,
> built with React, Vite, and TailwindCSS. Manages hostels, room allocations,
> accommodation applications, fee payments, maintenance complaints,
> and institutional announcements — for both students and administrators.
> ⚡ This project was largely vibe-coded with [Claude](https://claude.ai)
> by Anthropic as an AI pair programmer.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Credentials](#demo-credentials)
- [Architecture](#architecture)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

SHMS is a two-phase project:

- **Phase 1 (current)** — Complete frontend MVP powered by in-memory mock data.
  All features are fully functional within the browser session;
  no backend or database is required to run or evaluate the application.
- **Phase 2 (planned)** — Supabase backend integration.
  The service layer will be replaced with real Supabase Auth and database queries.
  All UI components remain unchanged.

The system supports two user roles:

- **Admin** — manages hostels, rooms, students, fee configurations,
  accommodation applications, payments, complaints, and announcements
- **Student** — applies for accommodation, views room allocation,
  tracks fee payment instalments, submits and monitors maintenance complaints

---

## Live Demo

> Deployment pending. Will be hosted on Vercel.

**Demo credentials are listed [below](#demo-credentials).**

---

## Tech Stack

| Layer              | Technology                                  |
| ------------------ | ------------------------------------------- |
| Framework          | React 19 + Vite 7                           |
| Styling            | TailwindCSS 4                               |
| Routing            | React Router v7                             |
| Icons              | Lucide React                                |
| Animations         | Framer Motion                               |
| Fonts              | DM Serif Display · DM Sans · JetBrains Mono |
| State Management   | React Context API                           |
| Auth (Phase 1)     | In-memory mock service                      |
| Database (Phase 1) | In-memory mock data                         |
| Auth (Phase 2)     | Supabase Auth                               |
| Database (Phase 2) | Supabase (PostgreSQL)                       |
| Deployment         | Vercel                                      |

---

## Features

### Authentication

- Role-based login with automatic redirect (admin → admin dashboard, student → student dashboard)
- Student self-registration with field validation
- Session persistence via `localStorage`
- Quick-fill demo credential buttons on the login page
- New registrations immediately visible in the admin Students list

### Student Portal

| Page                    | Description                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard               | Room summary, payment status, outstanding fee alerts, recent complaints, institutional announcements                               |
| Apply for Accommodation | Select hostel, preferred room type, and academic year; view fee schedule before submitting; track application status               |
| My Room                 | Full allocation details, hostel and block info, room amenities, roommate list                                                      |
| Payments                | Per-academic-year instalment breakdown with progress tracking, paid/unpaid/overdue status per instalment                           |
| Complaints              | Submit maintenance requests with category and priority; track status from pending through to resolved; view admin resolution notes |

### Admin Portal

| Page              | Description                                                                                                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard         | Occupancy rate per hostel, key stats, pending application alerts, high-priority complaint alerts, recent activity feeds                                                                      |
| Hostels           | Full CRUD for hostel buildings; defines blocks, floors, gender type; shows per-hostel occupancy, room counts, student counts                                                                 |
| Rooms             | Full CRUD scoped to a hostel; filter by hostel/status; occupancy bar per room; amenities management                                                                                          |
| Students          | Full student list with search; add students manually; view student profiles; allocate and deallocate rooms                                                                                   |
| Applications      | Review accommodation applications; assign specific rooms on approval; reject with reason; auto-generates payment instalments on approval                                                     |
| Fee Configuration | Define annual accommodation fees per hostel per academic year; configure instalment count, amounts, and due dates; bulk-generate payment records for all allocated students                  |
| Payments          | View all payment records grouped and filterable by hostel/status; mark instalments paid with payment method; mark overdue; add manual records; per-hostel collection summary                 |
| Complaints        | Review all complaints across all hostels; filter by hostel/priority/status; mark in-progress or resolved with resolution notes; re-open resolved complaints; per-hostel open complaint count |
| Announcements     | Full CRUD for institution-wide notices; priority levels (high/medium/low)                                                                                                                    |

### Notifications

- Bell icon in the top bar with live unread count badge
- Role-filtered: admins see new complaints and new applications; students see application status changes and overdue payment alerts
- Click-to-navigate to the relevant page
- Mark individual notifications read or mark all read

---

## Project Structure

```
shms/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx                        # Route definitions + protected route logic
    ├── index.css                      # Global styles + Tailwind directives
    ├── components/
    │   ├── layout/
    │   │   └── AppLayout.jsx          # Sidebar, topbar, notifications panel
    │   └── ui/
    │       └── index.jsx              # Button, Modal, Badge, Alert, StatCard, Avatar, etc.
    ├── context/
    │   ├── AuthContext.jsx            # Session state, login/register/logout
    │   └── DataContext.jsx            # Global data store, all CRUD operations, notifications
    ├── data/
    │   └── mockData.js                # Seed data: users, hostels, rooms, allocations,
    │                                  # fee configs, payments, complaints, applications, announcements
    ├── services/
    │   └── authService.js             # Mock auth — replace with Supabase Auth in Phase 2
    └── pages/
        ├── auth/
        │   ├── LoginPage.jsx
        │   └── RegisterPage.jsx
        ├── student/
        │   ├── StudentDashboard.jsx
        │   ├── StudentApply.jsx
        │   ├── StudentRoom.jsx
        │   ├── StudentPayments.jsx
        │   └── StudentComplaints.jsx
        └── admin/
            ├── AdminDashboard.jsx
            ├── AdminHostels.jsx
            ├── AdminRooms.jsx
            ├── AdminStudents.jsx
            ├── AdminApplications.jsx
            ├── AdminPayments.jsx
            ├── AdminFees.jsx
            ├── AdminComplaints.jsx
            └── AdminAnnouncements.jsx
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/TonyFred-code/shms.git
cd shms

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Script             | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start development server with hot reload |
| `npm run build`    | Build for production                     |
| `npm run preview`  | Preview the production build locally     |
| `npm run lint`     | Run ESLint                               |
| `npm run lint:fix` | Run ESLint with auto-fix                 |
| `npm run format`   | Format all files with Prettier           |

---

## Demo Credentials

| Role    | Email             | Password   |
| ------- | ----------------- | ---------- |
| Admin   | admin@shms.ac     | admin123   |
| Student | james@student.ac  | student123 |
| Student | amara@student.ac  | student123 |
| Student | kofi@student.ac   | student123 |
| Student | fatima@student.ac | student123 |

All demo accounts are pre-seeded with realistic data including room allocations, payment records, complaints, and applications.

---

## Architecture

### Data Flow

```
mockData.js  →  DataContext  →  Page Components  →  UI Components
                    ↑
             authService.js
                    ↑
             AuthContext
```

In Phase 1, all state lives in `DataContext` (React state, in-memory). In Phase 2, only `authService.js` and the CRUD functions inside `DataContext` are replaced — the component tree above them is untouched.

### Data Model

```
Hostel
  └── Room (many)

FeeConfig (per Hostel, per Academic Year)
  └── Instalments (array of { number, label, amount, dueDate })

Student (User with role: 'student')
  └── Application → (on approval) Allocation → Room
                                             └── Payment (one per instalment)
  └── Complaints (linked to Room + Hostel)

Announcement (institution-wide, admin-authored)
Notification (in-memory, role-filtered)
```

### Role-Based Access

| Route prefix          | Role required        |
| --------------------- | -------------------- |
| `/student/*`          | `student`            |
| `/admin/*`            | `admin`              |
| `/login`, `/register` | unauthenticated only |

Route guards redirect unauthorised access automatically.

---

## Roadmap

### Phase 2 — Supabase Backend

- [ ] PostgreSQL schema with foreign keys and indexes
- [ ] Row Level Security policies per table
- [ ] Supabase Auth (replaces mock authService)
- [ ] Real-time subscriptions for complaints and applications
- [ ] Persistent notifications

### Phase 3 — Payments & Finance

- [ ] Payment gateway integration (Paystack / Flutterwave)
- [ ] PDF receipt generation per payment
- [ ] Late payment penalty rules
- [ ] Financial report export (CSV / PDF)

### Phase 4 — Communications

- [ ] Email notifications on application approval/rejection
- [ ] SMS alerts for payment due dates

### Phase 5 — Extended Features

- [ ] Room transfer and swap requests
- [ ] Maintenance staff role (can only update assigned complaints)
- [ ] Multi-admin support with hostel-scoped permissions
- [ ] Audit log for all admin actions
- [ ] Analytics dashboard (occupancy trends, revenue over time, complaint resolution times)

---

## Author

**Alfred O. Faith (Tony Fred)**
[GitHub](https://github.com/TonyFred-code) · [Issues](https://github.com/TonyFred-code/shms/issues)

---

## Acknowledgements

Built with [Claude](https://claude.ai) by Anthropic as an AI pair programmer.
