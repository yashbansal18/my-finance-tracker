# Finance Tracker

A full-stack personal finance web app to track salary, expenses, savings goals, and monthly trends — accessible across all devices.

🔗 **Live App**: https://my-finance-tracker-qxfo.vercel.app/auth/login

---

## Tech Stack

- **Frontend**: Angular 17 (standalone components, lazy loading)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Auth**: JWT + bcrypt PIN-based login

---

## Features

- Track monthly salary and expenses by category
- Set and monitor savings goals
- View 6-month spending trends
- Multi-device sync via cloud database
- Secure PIN-based authentication

---

## Architecture
finance-tracker/
├── backend/ Node.js + Express REST API
│ ├── models/ Mongoose models (User, Expense, Goal)
│ ├── routes/ Auth, expenses, goals, summary
│ └── middleware/ JWT authentication
└── frontend/ Angular 17
└── src/app/
├── core/ Services, guards, interceptors
├── shared/ Models, interfaces
└── features/ Dashboard, Expenses, Goals, Auth

---

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/expenses | Get expenses |
| POST | /api/expenses | Add expense |
| GET | /api/goals | Get goals |
| GET | /api/summary/trend | 6-month trend |

---

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
