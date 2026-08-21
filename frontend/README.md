# Job Portal — Frontend (React + Vite + Tailwind CSS)

Standalone React app for the MERN Job Portal. Host independently from the backend.

## Run

```bash
cd frontend
npm install
npm run dev
```

App starts on `http://localhost:5173`.

## Connect to your backend

Edit `src/api/client.ts` — change `BASE_URL` to your hosted backend:

```ts
export const BASE_URL = 'https://api.yourdomain.com/api';
```

…or set an env var (see `.env.example`):

```
VITE_API_URL=https://api.yourdomain.com/api
```

> The app ships with **demo data fallback** — when the backend is unreachable,
> it shows sample jobs so the UI is never blank. Once your backend is live and
> `BASE_URL` points to it, real data is used automatically.

## Screens

- **Job Feed** (`/`) — browse all jobs, search, and apply via a modal form.
- **Post a Job** — form to publish a new job listing.
- **Dashboard** — view jobs you posted and expand each to see applicants.
