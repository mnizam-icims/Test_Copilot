# QA Command Center

A production-ready internal dashboard for QA teams to track tickets, assignments, and test status.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Validation | Zod (backend) + React Hook Form + Zod (frontend) |
| Charts | Recharts |
| Notifications | react-hot-toast |
| Export | csv-writer (CSV) + pdfkit (PDF) |

## Project Structure

```
/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # DB models: User, Ticket, ActivityLog
│   │   └── seed.js              # 4 users, 20 tickets, activity logs
│   └── src/
│       ├── controllers/         # auth, ticket, user, dashboard, export, activity
│       ├── middleware/          # auth.js (JWT), errorHandler.js
│       ├── routes/              # auth, tickets, users, dashboard, export
│       ├── validators/          # Zod schemas
│       ├── lib/prisma.js        # Prisma client singleton
│       └── server.js
└── frontend/
    └── src/
        ├── api/                 # axios instance + API call helpers
        ├── components/          # Reusable UI components
        ├── context/             # AuthContext (JWT storage)
        ├── pages/               # Login, Dashboard, Tickets
        ├── App.jsx
        └── main.jsx
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Clone & configure environment

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/qa_command_center"
JWT_SECRET="replace-with-a-long-random-string"
JWT_EXPIRES_IN="7d"
PORT=5000
VITE_API_URL="http://localhost:5000"
```

### 2. Backend setup

```bash
cd backend
npm install

# Generate Prisma client and run migrations
npx prisma migrate dev --name init

# Seed the database (4 users + 20 tickets + activity logs)
npm run db:seed
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

### 4. Run the application

**Backend** (terminal 1):
```bash
cd backend
npm run dev       # uses nodemon, restarts on file changes
# or: npm start   # production
```

**Frontend** (terminal 2):
```bash
cd frontend
npm run dev       # Vite dev server on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000)

### Default seed credentials

| Name | Email | Password | Role |
|---|---|---|---|
| Ravi Kumar | ravi@qacc.dev | password123 | QA_LEAD |
| Priya Sharma | priya@qacc.dev | password123 | QA_ENGINEER |
| Ankit Singh | ankit@qacc.dev | password123 | QA_ENGINEER |
| Sneha Patel | sneha@qacc.dev | password123 | QA_ENGINEER |

## API Reference

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Login → returns JWT |
| POST | `/api/auth/register` | Register new user |

### Tickets (JWT required)
| Method | Path | Description |
|---|---|---|
| GET | `/api/tickets` | List tickets (filters: assigneeId, status, priority, sprint, testType) |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/:id` | Get ticket + activity log |
| PATCH | `/api/tickets/:id` | Update ticket (logs every change) |
| DELETE | `/api/tickets/:id` | Delete ticket |
| GET | `/api/tickets/:id/activity` | Get activity log for ticket |

### Other (JWT required)
| Method | Path | Description |
|---|---|---|
| GET | `/api/users` | List all users |
| GET | `/api/dashboard/summary` | Counts by status, assignee workload, priority breakdown |
| GET | `/api/export/csv` | Download all tickets as CSV |
| GET | `/api/export/pdf` | Download all tickets as PDF |

## Features

- **Dashboard** — Summary cards, bar chart (tickets per assignee), pie chart (tickets by priority), recent activity feed
- **Tickets page** — Filterable table, inline status update, ticket detail side panel
- **Ticket Detail** — Inline editing of all fields, Playwright test file + test case ID with copy button, blocked reason (shown only when status = BLOCKED), full activity log timeline
- **Create/Edit Modal** — React Hook Form + Zod validation, conditional blocked reason field
- **Activity Logging** — Every field change on a ticket creates an ActivityLog entry (who, what, old→new, when)
- **Export** — CSV and PDF download of all tickets
- **Dark theme** — Slate-900/800 color scheme throughout
- **Rate limiting** — Auth (30/15min), API (200/min), Export (20/min)

## Production Notes

- Change `JWT_SECRET` to a cryptographically random value
- Use environment variables for all secrets (never commit `.env`)
- Run `npx prisma migrate deploy` (not `dev`) in production
- Build the frontend with `npm run build` and serve `dist/` via a static host or Express
