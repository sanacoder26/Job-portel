# Job Portal — Backend (Node.js + Express + MongoDB)

REST API for the MERN Job Portal. Host this independently from the frontend.

## Run

```bash
cd backend
cp .env.example .env      # then edit values
npm install
npm run dev               # or: npm start
```

Server starts on `http://localhost:5000`.

## Endpoints

| Method | Route                | Auth | Description                          |
|--------|----------------------|------|--------------------------------------|
| GET    | `/health`            | —    | Health check                         |
| POST   | `/api/jobs`          | yes  | Create a job                         |
| GET    | `/api/jobs`          | —    | Get all jobs                         |
| GET    | `/api/jobs/my`       | yes  | Get jobs posted by the logged-in user|
| POST   | `/api/jobs/:id/apply`| yes  | Apply to a job                       |

## Auth

`middleware/verifyToken.js` is a **dummy** drop-in. It attaches `req.user`
(a fallback fake user when no token is given, or a decoded JWT when one is).
Replace it with your real JWT verification — routes already call it, so no
other changes are needed.

## Data model (`models/Job.js`)

```
title, company, location, salary, description
postedBy   -> User (ObjectId)
applicants -> [{ name, email, coverLetter, appliedBy }]
```
