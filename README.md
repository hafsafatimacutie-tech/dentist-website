# SmileFit Dental Studio — Full Stack Website

A complete MERN stack website for a dental clinic with an appointment booking system
and an admin dashboard to manage bookings.

## Tech Stack
- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (admin only — patients don't need accounts)

## Project Structure
```
dentist-website/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/                # Service, Booking, Admin schemas
│   ├── routes/                # auth, services, bookings API routes
│   ├── middleware/auth.js     # JWT verification for admin routes
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/              # Home, About, Services, Booking, Contact, Admin*
    │   ├── components/         # Navbar, Footer, ProtectedRoute
    │   ├── api/client.js       # Axios instance
    │   └── styles/global.css
    └── index.html
```

## Setup — Backend

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in real values:
   - `MONGO_URI` — your MongoDB connection string (local or MongoDB Atlas free tier)
   - `JWT_SECRET` — any long random string
   - `ADMIN_SETUP_KEY` — a temporary secret you'll use once to create your admin account
4. `npm run dev` (or `npm start`) — runs on `http://localhost:5000`

### Create your admin account (one-time)
Send a POST request to `http://localhost:5000/api/auth/setup` with:
```json
{
  "username": "admin",
  "password": "your-secure-password",
  "setupKey": "the ADMIN_SETUP_KEY from your .env"
}
```
You can do this with Postman, curl, or Thunder Client. After this, log in normally
through the website's `/admin/login` page.

**Important:** Once your admin account is created, consider removing or disabling
the `/setup` route in `routes/auth.js` so nobody else can create admin accounts.

### Add your services (one-time, via admin)
Once logged in as admin, you'll need an admin panel UI for creating services, or you
can POST directly to `/api/services` with your JWT token in the Authorization header:
```json
{
  "name": "Teeth Cleaning",
  "description": "Routine cleaning and polish",
  "price": 800,
  "durationMinutes": 30
}
```
(A simple "Add Service" form can be added to the admin dashboard as a next step —
see "Suggested Next Steps" below.)

## Setup — Frontend

1. `cd frontend`
2. `npm install`
3. Create a `.env` file with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
4. `npm run dev` — runs on `http://localhost:3000`

## Photo Gallery & Image Uploads
The clinic owner can upload their own photos directly through the admin
panel — no code changes needed:
- Log in as admin, click **"Manage Photos"** from the bookings dashboard
- Upload JPEG/PNG/WEBP/GIF images (5MB max each)
- Choose where each photo appears: the public Gallery page, the About page,
  or the homepage feature section
- Uploaded files are stored in `backend/uploads/` (git-ignored, so they
  won't clutter version control) and served at `/uploads/<filename>`
- Delete any photo from the same admin screen

## How Booking Works
- Patients pick a service, date, and time slot on `/booking` — already-booked slots
  for that date are automatically greyed out.
- New bookings are created with `status: "pending"`.
- Admin logs in at `/admin/login`, views all bookings at `/admin/dashboard`, and can
  change each booking's status (confirmed / rejected / completed / cancelled).

## Deployment Notes
- **Backend:** Deploy to Render, Railway, or a VPS. Use MongoDB Atlas (free tier)
  instead of local MongoDB for production.
- **Frontend:** Deploy to Vercel or Netlify. Set `VITE_API_URL` to your deployed
  backend URL in the platform's environment variables.
- Update CORS in `server.js` if you want to restrict it to your live frontend domain
  instead of allowing all origins.

## Suggested Next Steps (not yet built)
- Admin UI form to add/edit services (currently done via API call — see above)
- Email/SMS confirmation when a booking is approved (Nodemailer or Twilio)
- Image gallery page if the client wants before/after photos
- Patient-facing "cancel my booking" link (currently only admin can change status)

Discuss these with your client to decide what's actually needed for v1 vs. a
later update — don't build features they haven't asked for yet.
