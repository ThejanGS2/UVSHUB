# 🎓 Educational Platform

A full-stack educational platform built with **React (Vite)** on the frontend and **Node.js + Express.js** on the backend.

---

## 📁 Project Structure

```
Educational-Platform/
├── frontend/                  # React (Vite) app
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── backend/                   # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── courseController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js        # JWT protect & authorise
│   │   │   ├── errorHandler.js
│   │   │   └── notFound.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Course.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/          # Business logic layer (extend here)
│   │   ├── utils/             # Helpers & utilities
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Entry point
│   ├── .env.example
│   └── package.json
│
├── package.json               # Root — runs both with concurrently
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI, JWT_SECRET, etc.
```

### 3. Run in Development

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run individually
npm run dev:frontend   # React app  → http://localhost:5173
npm run dev:backend    # Express API → http://localhost:5000
```

---

## 🔌 API Endpoints

### Auth — `/api/v1/auth`
| Method | Endpoint    | Access  | Description          |
|--------|-------------|---------|----------------------|
| POST   | `/register` | Public  | Register new user    |
| POST   | `/login`    | Public  | Login & get JWT      |
| GET    | `/me`       | Private | Get current user     |

### Courses — `/api/v1/courses`
| Method | Endpoint | Access              | Description       |
|--------|----------|---------------------|-------------------|
| GET    | `/`      | Public              | List all courses  |
| POST   | `/`      | Instructor / Admin  | Create course     |
| GET    | `/:id`   | Public              | Get single course |
| PUT    | `/:id`   | Instructor / Admin  | Update course     |
| DELETE | `/:id`   | Instructor / Admin  | Delete course     |

### Users — `/api/v1/users`
| Method | Endpoint    | Access  | Description          |
|--------|-------------|---------|----------------------|
| GET    | `/`         | Admin   | List all users       |
| GET    | `/:id`      | Private | Get user profile     |
| PUT    | `/profile`  | Private | Update own profile   |
| DELETE | `/:id`      | Admin   | Delete user          |

---

## 🛠️ Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18 + Vite                         |
| Backend   | Node.js + Express.js                    |
| Database  | MongoDB + Mongoose                      |
| Auth      | JWT (jsonwebtoken) + bcryptjs           |
| Security  | Helmet, CORS, express-rate-limit        |
| Dev tools | Nodemon, concurrently                   |
