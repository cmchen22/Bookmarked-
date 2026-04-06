# Bookmarked

Bookmarked is a social books app with the emotional shape of Letterboxd and the cataloging itch of Rate Your Music. The current MVP focuses on three things: a browsable shelf, a recent-review feed, and a lightweight review composer.

## Current MVP

- Browse a featured shelf of books with ratings, genres, and short blurbs.
- Read a live-style review feed with scores and timestamps.
- Post new reviews through a React client backed by an Express API.
- Use a Postgres-ready Prisma schema for the next stage of persistence.

## Stack

- Frontend: React, TypeScript, Vite
- Backend: Express, TypeScript, Zod
- Database layer: Prisma with Postgres schema
- Workspace: npm workspaces

## Project Structure

```text
frontend/  React app for the Bookmarked UI
backend/   Express API, Prisma schema, and seed scaffold
```

## Run Locally

1. Install dependencies:

	```bash
	npm install
	```

2. Start both frontend and backend:

	```bash
	npm run dev
	```

3. Open the frontend at `http://localhost:5173`.

The API runs on `http://localhost:4000`.

## Database Setup

The backend currently works with in-memory sample data so the MVP runs immediately. Prisma is already wired for a real Postgres database when you want persistence.

1. Copy the backend environment template:

	```bash
	copy backend\.env.example backend\.env
	```

2. Update `DATABASE_URL` in `backend/.env`.

3. Generate the Prisma client:

	```bash
	npm run prisma:generate --workspace backend
	```

4. Run migrations and seed data when ready:

	```bash
	npm run prisma:migrate --workspace backend
	npm run prisma:seed --workspace backend
	```

## Build

```bash
npm run build
```

## Next Product Steps

- User profiles and follow graph
- Lists, shelves, and favorites
- Reading status tracking
- Search across a larger catalog
- Persistent reviews stored in Postgres

## License

MIT. See [LICENSE](LICENSE).
