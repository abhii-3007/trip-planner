# TripEdu — College Trip Planner

A full-stack academic trip management platform for college students and faculty coordinators. Built with React + Vite + Tailwind CSS (frontend) and Node.js + Express + Prisma + PostgreSQL (backend).

---

## ✨ Features

- **Public** — Browse upcoming trips, view seat availability, register as a student
- **Admin Dashboard** — Manage trips (CRUD), view student records, update payment statuses
- **JWT Auth** — Secure login for admins and coordinators
- **Responsive** — Mobile-first design throughout

---

## 📁 Project Structure

```
college-trip-planner/
├── client/              # React + Vite + Tailwind frontend
│   └── src/
│       ├── components/  # Navbar, TripCard, AdminSidebar, etc.
│       ├── contexts/    # AuthContext (JWT)
│       ├── lib/         # Axios instance, TypeScript types
│       └── pages/       # Home, Trips, TripDetail, Login, admin/*
└── server/              # Express + Prisma backend
    ├── prisma/          # schema.prisma + seed.ts
    └── src/
        ├── controllers/ # Business logic
        ├── middleware/   # JWT auth
        ├── routes/      # Express routers
        └── validators/  # Zod schemas
```

---

## ⚙️ Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- PostgreSQL ≥ 14 (running locally or remote)

---

## 🚀 Setup & Running

### 1. Clone & enter project

```bash
cd college-trip-planner
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/college_trip_planner"
JWT_SECRET="a_strong_random_secret_here"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

### 3. Install server dependencies

```bash
npm install
```

### 4. Create the database & run migrations

```bash
# Make sure PostgreSQL is running and the DB exists:
createdb college_trip_planner

# Apply Prisma migrations:
npm run db:migrate
```

### 5. Seed the database

```bash
npm run db:seed
```

This creates:
- 1 College (Greenfield University)
- 1 Admin user: `admin@greenfield.edu / admin123`
- 1 Coordinator: `coordinator@greenfield.edu / coord123`
- 3 Sample trips
- 5 Students with registrations

### 6. Start the backend

```bash
npm run dev
# → Server running on http://localhost:5000
```

### 7. Install & start the frontend (new terminal)

```bash
cd ../client
npm install
npm run dev
# → App running on http://localhost:5173
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | JWT | Get current user |
| GET | `/api/trips` | Public | List all trips |
| GET | `/api/trips/:id` | Public | Trip detail |
| POST | `/api/trips` | JWT | Create trip |
| PUT | `/api/trips/:id` | JWT | Update trip |
| DELETE | `/api/trips/:id` | Admin | Delete trip |
| POST | `/api/students` | Public | Register student |
| GET | `/api/students` | JWT | List students |
| POST | `/api/registrations` | Public | Register for trip |
| GET | `/api/registrations?trip_id=` | JWT | List registrations |
| PUT | `/api/registrations/:id/payment` | JWT | Update payment status |

---

## 🗃️ Database Schema

```
College ──< Student ──< TripRegistration >── Trip
                                              │
                                         User (organizer)
```

**Enums:**
- `TripStatus`: upcoming | ongoing | completed | cancelled
- `PaymentStatus`: paid | pending | waived
- `Role`: admin | coordinator

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary (Navy) | `#1a2744` |
| Accent (Amber) | `#f59e0b` |
| Heading Font | Plus Jakarta Sans |
| Body Font | DM Sans |

---

## 🔧 Useful Commands

```bash
# Backend
npm run dev          # Start dev server with ts-node-dev
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:reset     # Reset DB and re-seed

# Frontend
npm run dev          # Start Vite dev server
npm run build        # Production build
```
