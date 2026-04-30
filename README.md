# 💰 Finance Tracker — Angular + Node + MongoDB

A full-stack personal finance tracker. Tracks salary, expenses by category, savings goals, and monthly trends. Multi-device via cloud DB.

---

## Tech Stack
- **Frontend**: Angular 17 (standalone components, lazy loading)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas (free 512MB)
- **Auth**: JWT + bcrypt PIN-based login

---

## Project Structure
```
finance-tracker/
├── backend/             Node + Express API
│   ├── models/          Mongoose models (User, Expense, Goal)
│   ├── routes/          API routes (auth, expenses, goals, summary)
│   ├── middleware/      JWT auth middleware
│   └── server.js        Entry point
└── frontend/            Angular 17 app
    └── src/app/
        ├── core/        Services, guards, interceptors
        ├── shared/      Models, interfaces
        └── features/    Dashboard, Expenses, Goals, Settings, Auth
```

---

## Step 1 — MongoDB Atlas (Free DB)

1. Go to https://cloud.mongodb.com and create a free account
2. Create a new project → Build a Database → **Free (M0)** cluster
3. Choose any region (Mumbai ap-south-1 recommended for India)
4. Create a DB user: Database Access → Add New User (username + password)
5. Allow all IPs: Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. Get connection string: Clusters → Connect → Connect your application → Copy URI
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`


theyashbansal_db_user
fbu8qzBxWvPmYuBH

mongodb+srv://theyashbansal_db_user:<db_password>@cluster0.amlsjn8.mongodb.net/?appName=Cluster0
---

## Step 2 — Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/finance-tracker?retryWrites=true&w=majority
JWT_SECRET=pick_any_long_random_string_here_123456
JWT_EXPIRES_IN=30d
```

Run locally:
```bash
npm run dev
```

Test: Open http://localhost:3000/api/health → should return `{"status":"ok"}`

---

## Step 3 — Frontend Setup

```bash
cd frontend
npm install
npm start
```

Open http://localhost:4200 — register an account and start tracking!

---

## Step 4 — Deploy Backend FREE on Render

1. Push your project to GitHub (keep `.env` in .gitignore — never commit it!)
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo → select the `backend` folder as root
4. Settings:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables (same as your .env):
   - `MONGODB_URI` = your Atlas URI
   - `JWT_SECRET` = your secret
   - `JWT_EXPIRES_IN` = 30d
   - `FRONTEND_URL` = your Vercel URL (after step 5)
6. Deploy! Render gives you a URL like `https://finance-tracker-api.onrender.com`

---

## Step 5 — Deploy Frontend FREE on Vercel

1. Go to https://vercel.com → New Project → Import your GitHub repo
2. Set **Root Directory** to `frontend`
3. Build settings:
   - **Framework**: Angular
   - **Build Command**: `npm run build:prod`
   - **Output Directory**: `dist/finance-tracker`
4. Add Environment Variable: (not needed — set the API URL in environment.prod.ts first)
5. Before deploying: Edit `frontend/src/environments/environment.prod.ts`:
   ```ts
   export const environment = {
     production: true,
     apiUrl: 'https://your-render-app.onrender.com/api'  // your Render URL
   };
   ```
6. Deploy! Vercel gives you a URL like `https://finance-tracker.vercel.app`

---

## Using the App

1. Open your Vercel URL on any device (phone, laptop, tablet)
2. Register with your email + create a PIN
3. Set your monthly salary
4. Start adding expenses — all synced across devices via MongoDB!

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/salary | Update salary |
| PUT | /api/auth/pin | Change PIN |
| GET | /api/expenses?month=YYYY-MM | Get expenses |
| POST | /api/expenses | Add expense |
| PUT | /api/expenses/:id | Update expense |
| DELETE | /api/expenses/:id | Delete expense |
| GET | /api/goals | Get all goals |
| POST | /api/goals | Add goal |
| PUT | /api/goals/:id | Update goal |
| DELETE | /api/goals/:id | Delete goal |
| GET | /api/summary/monthly?month=YYYY-MM | Monthly breakdown |
| GET | /api/summary/trend | Last 6 months trend |

---

## Notes
- Never commit your `.env` file to GitHub
- MongoDB Atlas free tier = 512MB, plenty for years of expense data
- Render free tier sleeps after 15 min inactivity (first load may be slow)
- Vercel free tier is very generous for personal projects
