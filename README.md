# Taskly — Mini SaaS Task Management App

A full-stack, multi-user task management application built with Node.js, Express, PostgreSQL, and React.

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Sequelize ORM
- **Auth**: bcrypt + JSON Web Tokens (JWT)
- **Frontend**: React (Vite) + Tailwind CSS
- **HTTP Client**: Axios

---

## Project Structure

```
Mini-SaaS-Task-App/
├── backend/
│   ├── controllers/       # authController.js, taskController.js
│   ├── middlewares/       # verifyToken.js, errorHandler.js
│   ├── models/            # User.js, Task.js, index.js
│   ├── routes/            # authRoutes.js, taskRoutes.js
│   ├── .env               # Environment variables
│   └── server.js
└── frontend/
    └── src/
        ├── components/    # TaskItem.jsx, Navbar.jsx, ProtectedRoute.jsx
        ├── pages/         # Login.jsx, Signup.jsx, Dashboard.jsx
        ├── services/      # api.js (axios instance with JWT interceptor)
        ├── App.jsx
        └── index.css
```

---

## Prerequisites

- **Node.js** v18+ and npm
- **PostgreSQL** v14+ running locally (or a remote connection string)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Mini-SaaS-Task-App
```

---

### 2. Set Up PostgreSQL

Make sure PostgreSQL is running, then create the database:

```bash
psql -U postgres
CREATE DATABASE taskdb;
\q
```

> The Sequelize ORM will automatically create and sync all tables on server start — no manual migration needed.

---

### 3. Configure Environment Variables

#### Backend (`backend/.env`)

Copy the example and fill in your values:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=5000
DB_URI=postgres://your_pg_user:your_pg_password@localhost:5432/taskdb
JWT_SECRET=replace_with_a_long_random_secret_string
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`)

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

### 4. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

### 5. Run the Application

Open **two terminal windows**.

#### Terminal 1 — Start the Backend

```bash
cd backend
npm run dev       # Uses nodemon for hot reload
# or
npm start         # Production start
```

You should see:
```
✅ Database connection established successfully.
✅ Database models synchronized.
🚀 Server running on http://localhost:5000
```

#### Terminal 2 — Start the Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE ready in Xms
  ➜  Local: http://localhost:5173/
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

### Auth

| Method | Endpoint            | Description            | Auth Required |
|--------|---------------------|------------------------|---------------|
| POST   | `/api/auth/signup`  | Register a new user    | No            |
| POST   | `/api/auth/login`   | Login and receive JWT  | No            |

### Tasks

| Method | Endpoint          | Description                      | Auth Required |
|--------|-------------------|----------------------------------|---------------|
| GET    | `/api/tasks`      | Get all tasks for logged-in user | Yes           |
| POST   | `/api/tasks`      | Create a new task                | Yes           |
| PATCH  | `/api/tasks/:id`  | Toggle task status               | Yes           |
| DELETE | `/api/tasks/:id`  | Delete a task                    | Yes           |

---

## Security Features

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT signed with secret, expires in **7 days**
- **IDOR protection**: ownership verified on every task update/delete
- Password never returned in any API response
- CORS configured to allow only the frontend origin

---

## Environment Variable Reference

### Backend `.env`

| Variable       | Description                          | Example                                      |
|----------------|--------------------------------------|----------------------------------------------|
| `PORT`         | Port the server listens on           | `5000`                                       |
| `DB_URI`       | PostgreSQL connection string         | `postgres://user:pass@localhost:5432/taskdb` |
| `JWT_SECRET`   | Secret key for signing JWTs          | `a-very-long-random-string`                  |
| `FRONTEND_URL` | Allowed CORS origin                  | `http://localhost:5173`                      |

### Frontend `.env`

| Variable        | Description                     | Example                   |
|-----------------|---------------------------------|---------------------------|
| `VITE_API_URL`  | Base URL for the backend API    | `http://localhost:5000`   |
