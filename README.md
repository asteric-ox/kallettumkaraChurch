# Infant Jesus Church, Kallettumkara

Official website of **Infant Jesus Church, Kallettumkara** — built on the **MERN Stack with TypeScript**.

## Features

- **Dynamic Home Page**: Announcements marquee, daily mass widget, parish council cards, and prayer request form.
- **Multilingual Support**: Toggle between English and Malayalam.
- **Admin Dashboard**: Full CRUD for Mass Timings, Announcements, Parish Council, Trustees, Family Units, and Site Settings.
- **Family Units**: 25 family units with leadership profiles and family member management.
- **Maintenance Mode**: Admin can enable a maintenance page with a custom message.
- **Premium Design**: Maroon and Gold theme, glassmorphism cards, parallax hero, and smooth animations.

## Tech Stack

| Layer | Technology |
|---|---|
| **Database** | MongoDB (Mongoose ODM) |
| **Backend** | Express.js + Node.js (TypeScript) |
| **Frontend** | React.js + Vite (TypeScript) |
| **Auth** | JWT (JSON Web Tokens) |
| **Styling** | Vanilla CSS (custom design system) |
| **File Uploads** | Multer |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Installation

1. Install all dependencies:

   ```bash
   # Server
   cd server && npm install

   # Client
   cd ../client && npm install
   ```

2. Configure the server environment (`server/.env`):

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/kallettumkara_church
   JWT_SECRET=your-secret-key
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. Run the backend:

   ```bash
   cd server
   npm run dev
   ```

4. Run the frontend:

   ```bash
   cd client
   npm run dev
   ```

5. Open in browser:

   - **Website**: `http://localhost:5173`
   - **Admin Panel**: `http://localhost:5173/admin/login`
     - Username: `admin`
     - Password: `admin123`

## Project Structure

```
Church Website (Mern)/
├── server/                  # Express.js Backend (TypeScript)
│   ├── src/
│   │   ├── config/db.ts     # MongoDB connection
│   │   ├── models/          # Mongoose schemas (Admin, MassTiming, etc.)
│   │   ├── routes/          # REST API route handlers
│   │   ├── middleware/       # JWT auth & Multer upload
│   │   ├── seed.ts          # Initial data seeder
│   │   └── index.ts         # Entry point
│   ├── uploads/             # Uploaded images (served as /uploads/*)
│   └── data/                # Translation JSON (en.json, ml.json)
│
└── client/                  # React.js Frontend (Vite + TypeScript)
    ├── src/
    │   ├── pages/           # Public pages + Admin pages
    │   ├── components/      # Reusable UI components
    │   ├── context/         # Auth context (JWT management)
    │   ├── services/api.ts  # Axios HTTP client
    │   └── types/index.ts   # Shared TypeScript interfaces
    └── index.html
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/api/auth/login` | ❌ | Admin login → returns JWT |
| GET | `/api/mass-timings` | ❌ | Get all mass timings |
| POST | `/api/mass-timings` | ✅ | Add mass timing |
| PUT | `/api/mass-timings/:id` | ✅ | Update mass timing |
| DELETE | `/api/mass-timings/:id` | ✅ | Delete mass timing |
| GET | `/api/announcements` | ❌ | Get active announcements |
| GET | `/api/announcements/all` | ✅ | Get all announcements (admin) |
| POST | `/api/announcements` | ✅ | Publish announcement |
| DELETE | `/api/announcements/:id` | ✅ | Delete announcement |
| GET | `/api/parish-council` | ❌ | Get parish council members |
| POST | `/api/parish-council` | ✅ | Add member |
| PUT | `/api/parish-council/:id` | ✅ | Update member |
| DELETE | `/api/parish-council/:id` | ✅ | Delete member |
| GET | `/api/trustees` | ❌ | Get trustees |
| GET | `/api/family-units` | ❌ | Get all family units |
| GET | `/api/family-units/:id` | ❌ | Get single family unit |
| POST | `/api/prayer-requests` | ❌ | Submit prayer intention |
| GET | `/api/prayer-requests` | ✅ | View prayer requests (admin) |
| GET | `/api/settings` | ❌ | Get site settings |
| PUT | `/api/settings/maintenance` | ✅ | Toggle maintenance mode |
| GET | `/api/translations/:lang` | ❌ | Get translations (en/ml) |

✅ = Requires `Authorization: Bearer <token>` header
