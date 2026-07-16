# EventHub: Full-Stack Event Management System

A robust full-stack Event Management System built with Express, MongoDB, and Next.js App Router (TypeScript).

## Features
- **Authentication:** JWT-based auth with access and refresh cookies.
- **Role-Based Access Control:** `user` (Admin) and `siteuser` roles.
- **Dynamic Event Properties:** Admins can create events with a dynamic array of custom properties (Text, Number, Boolean, Date, Select).
- **Event Booking:** Users can browse and book events, enforcing capacity limits and preventing double bookings.
- **Reviews:** Users can review and rate events they attended/viewed.

## Setup & Environment Variables

### 1. Database
Ensure you have MongoDB running locally on `mongodb://127.0.0.1:27017` or update the `MONGO_URI` in your `.env` file.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file by copying `.env.example`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/event_management
   JWT_ACCESS_SECRET=change_me
   JWT_REFRESH_SECRET=change_me_too
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   ```
4. Seed the database (creates demo accounts and sample events):
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify your `.env.local` contains:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/proxy
   API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Seeded Credentials

After running `npm run seed` in the backend, use these accounts to test the application:

| Role | Email | Password |
|---|---|---|
| Admin (`user`) | `admin@demo.com` | `Password123!` |
| Site User (`siteuser`) | `siteuser@demo.com` | `Password123!` |

## Run Commands

**Backend:**
- `npm run dev`: Starts Express via ts-node-dev
- `npm run build`: Compiles TypeScript
- `npm start`: Runs the compiled output
- `npm run seed`: Seeds database

**Frontend:**
- `npm run dev`: Starts Next.js development server
- `npm run build`: Builds the Next.js app for production
- `npm start`: Starts the Next.js production server

## API Reference

Base path: `/api`

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | public | Register (name, email, password, role) |
| POST | `/auth/login` | public | Login, sets cookies |
| POST | `/auth/logout` | auth | Clears cookies |
| POST | `/auth/refresh` | public (cookie) | New access token |
| GET | `/auth/me` | auth | Current user |
| GET | `/events` | public/auth | Published events; `?search=&category=&page=&limit=` |
| GET | `/events/:id` | public/auth | Single event + properties + avg rating |
| POST | `/events` | `user` only | Create event with properties array |
| PUT | `/events/:id` | `user` only (owner) | Update event + properties |
| PATCH | `/events/:id/status` | `user` only (owner) | Publish / unpublish |
| DELETE | `/events/:id` | `user` only (owner) | Delete event |
| GET | `/events/admin/mine` | `user` only | Admin's own events incl. drafts |
| GET | `/events/:id/bookings` | `user` only (owner) | Bookings for that event |
| POST | `/bookings` | `siteuser` only | Book an event `{ eventId, quantity }` |
| GET | `/bookings/my` | `siteuser` only | **Booked events history** |
| PATCH | `/bookings/:id/cancel` | `siteuser` only (owner) | Cancel own booking |
| GET | `/reviews/event/:eventId` | public | Reviews for an event |
| POST | `/reviews` | `siteuser` only | Create review `{ eventId, rating, comment }` |
| PUT | `/reviews/:id` | `siteuser` only (author) | Update own review |
| DELETE | `/reviews/:id` | `siteuser` (author) or `user` (event owner) | Delete review |
