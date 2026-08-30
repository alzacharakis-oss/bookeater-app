# Bookeater

A full-stack book wishlist application. Users can browse a shared library of books, add titles to their personal wishlist, mark them as read, and rate the ones they've finished. Built as the final project for Coding Factory 10 (Athens University of Economics and Business).

Search for books, add them to your wishlist, and rate them once you've finished reading.

## Tech Stack

**Backend:** Node.js, Express, TypeScript
**Database:** PostgreSQL 16 (via Docker)
**Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing
**API Documentation:** Swagger / OpenAPI 3.0
**Frontend:** React, TypeScript, Vite
**UI:** shadcn/ui (Base UI), Tailwind CSS v4
**Forms & Validation:** react-hook-form, Zod
**Routing:** React Router v7
**Notifications:** Sonner (toast messages)

## Project Structure

This is a monorepo with two independent projects:

```
bookeater-app/
├── backend/          # Express + TypeScript API
│   └── src/
│       ├── config/       # Database connection, Swagger config
│       ├── controllers/  # Request/response handling
│       ├── services/     # Business logic
│       ├── repositories/ # Database queries
│       ├── models/       # TypeScript interfaces
│       ├── routes/       # Route definitions + Swagger annotations
│       ├── middleware/   # JWT auth middleware
│       └── db/           # SQL schema and seed data
├── frontend/         # React + Vite application
│   └── src/
│       ├── api/          # Centralized API client
│       ├── context/      # Auth context (React Context API)
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route-level page components
│       └── schemas/      # Zod validation schemas
└── docker-compose.yml    # PostgreSQL container definition
```

## Prerequisites

Before you begin, make sure you have installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A REST client for testing (e.g. [Postman](https://www.postman.com/)) — optional, since the API also has a built-in Swagger UI (see below)

## Setup & Build Instructions

### 1. Clone the repository

```bash
git clone https://github.com/alzacharakis-oss/bookeater-app.git
cd bookeater-app
```

### 2. Start the database

From the project root (where `docker-compose.yml` is located):

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container, exposed on **port 5433** on your machine (not the default 5432 — this avoids conflicts with any local PostgreSQL installation you may already have).

Verify it's running:

```bash
docker ps
```

You should see a container named `bookeater-db` with status `Up`.

### 3. Set up the database schema

Copy the schema file into the running container and execute it:

```bash
docker cp backend/src/db/schema.sql bookeater-db:/schema.sql
docker exec -it bookeater-db psql -U bookeater_user -d bookeater -f /schema.sql
```

> **Note (Windows / Git Bash users):** if you're using Git Bash and the path gets mistranslated, prefix the command with `MSYS_NO_PATHCONV=1`, or run it from PowerShell instead, where this isn't an issue.

Optionally, seed the database with some starter books:

```bash
docker cp backend/src/db/seed.sql bookeater-db:/seed.sql
docker exec -it bookeater-db psql -U bookeater_user -d bookeater -f /seed.sql
```

### 4. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the following content:

```
JWT_SECRET=replace-this-with-a-long-random-string
PORT=3000
```

Then start the development server:

```bash
npm run dev
```

The API will be running at `http://localhost:3000`.

**Database connection details** (currently hardcoded in `src/config/database.ts`, matching the Docker setup above):
- Host: `localhost`
- Port: `5433`
- User: `bookeater_user`
- Password: `bookeater_pass`
- Database: `bookeater`

### 5. Set up the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

### 6. You're ready

With Docker, the backend, and the frontend all running, open `http://localhost:5173` in your browser to use the app.

## API Documentation

Once the backend is running, full interactive API documentation is available at:

```
http://localhost:3000/api-docs
```

This includes all endpoints (auth, books, user-books), request/response schemas, and a built-in "Try it out" feature. Protected endpoints are marked with a lock icon — click **Authorize** at the top of the page and paste in a JWT token (obtained via the login endpoint) to test them directly from the browser.

## Creating an Admin User

By design, no one can register as an admin through the API — this is intentional, so that regular sign-up can't grant elevated permissions. To promote a user to admin (allowing them to edit or delete books in the shared library), connect to the database directly:

```bash
docker exec -it bookeater-db psql -U bookeater_user -d bookeater
```

```sql
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
```

The user will need to log in again afterwards, since the admin flag is embedded in the JWT at login time.

## Domain Model

- **User** — id, username, email, password (hashed with bcrypt), isAdmin
- **Book** — id, title, author (shared across all users)
- **UserBook** — the relationship between a user and a book: id, userId, bookId, status (`wishlist` or `read`), rating (1–5, nullable)

A user cannot add the same book to their list twice — this is enforced both at the application level and via a database `UNIQUE` constraint on `(user_id, book_id)`.

## Permissions

| Action | Who |
|---|---|
| Browse/search books | Anyone |
| Add a new book to the shared library | Any logged-in user |
| Edit or delete a book | Admins only |
| Add/remove a book from your own wishlist, rate it | The owning user only |

Books can be freely added by any logged-in user; admins are expected to review new entries and correct or remove duplicates/mistakes as needed, rather than the system preventing them upfront.

## Known Limitations

These are conscious trade-offs made to keep the project's scope manageable, not oversights:

- **No duplicate-book prevention:** the same title/author can be added to the shared library more than once. This is mitigated by admin moderation rather than a hard constraint.
- **Author field has no server-side format validation:** the frontend restricts the author field to letters (Latin and Greek), spaces, and basic punctuation, but this is not currently re-validated on the backend — a determined user bypassing the UI (e.g. via Postman) could submit a book with a numeric or symbol-only author name.
- **Password strength is not enforced beyond a minimum length** (8 characters on registration). Rules such as requiring an uppercase letter or number were deliberately left out to keep the scope focused, with the intention of revisiting this if time permits.
- **Database credentials are currently hardcoded** in `backend/src/config/database.ts` rather than read from environment variables (only the JWT secret uses `.env`). In a production setting, these would also be externalized.

## Testing

All endpoints were manually tested throughout development using Postman, covering both expected success paths and edge cases (invalid input, unauthorized access, ownership violations, duplicate entries, and database persistence across server restarts). The same tests can now also be run directly from the Swagger UI at `/api-docs`.