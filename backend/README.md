# InternMatch Backend API Server

A production-grade RESTful API backend for the **InternMatch** fit-first internship platform built using **Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, and Cloudinary**.

---

## 🏗️ Architecture Overview

The backend is built following a clean, decoupled MVC & Controller-Service pattern:

```
backend/
├── src/
│   ├── config/          # Database (MongoDB Mongoose) & Cloudinary configuration
│   ├── controllers/     # Business logic handlers for Auth, Student, Recruiter, Internship, Application, Interview
│   ├── middleware/      # JWT protection, Role RBAC, Rate Limiting, Error Handling, Multer Upload
│   ├── models/          # Mongoose Schemas (User, StudentProfile, RecruiterProfile, Internship, Application, Interview)
│   ├── routes/          # Express route definitions
│   ├── utils/           # JWT generator, Isolated matchScore algorithm, Validation, DB Seeder
│   └── server.js        # Main Express application entry point
├── .env                 # Environment variables
├── .env.example         # Environment template
└── package.json
```

---

## ⚡ Quick Start & Local Setup

### 1. Installation
Navigate into the `backend` folder and install dependencies:
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure your credentials:
```bash
cp .env.example .env
```

`.env` configuration keys:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/internmatch
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

### 3. Database Seeding (Optional)
To seed initial demo accounts (`student@demo.com` and `recruiter@demo.com` with password `demo1234`) and internships into MongoDB:
```bash
npm run seed
```

### 4. Running the Backend Server
Start the development server with auto-reloading:
```bash
npm run dev
```
Or start in standard production mode:
```bash
npm start
```

The API server will listen on `http://localhost:5000`. Health check endpoint is available at `http://localhost:5000/api/health`.

---

## 🔑 Authentication & Authorization

- **Password Hashing**: Passwords are securely hashed using `bcrypt` (10 salt rounds) before storing in MongoDB.
- **JWT Authentication**: Users receive a Signed JSON Web Token upon registration/login, passed in the `Authorization: Bearer <token>` header for protected endpoints.
- **Role-Based Access Control (RBAC)**: Enforced via `authorize('student')` and `authorize('recruiter')` middlewares.

---

## 🎯 Candidate Match Algorithm (`utils/matchScore.js`)

The match engine compares a candidate's profile against internship criteria:
1. Matches student skills (`React`, `JavaScript`, `Git`, `Figma`) against internship `requiredSkills` & `preferredSkills`.
2. Adds weighted alignment score for matching educational background.
3. Calculates `matchPercentage` (0–100%), `matchedSkills`, `missingSkills`, and `profileAlignment` (`High` | `Medium` | `Low`).
4. Isolated within `src/utils/matchScore.js` for future extension with machine learning recommendation models.

---

## ☁️ Cloudinary Resume Upload

- Resumes are accepted as PDF or Word documents via Multer in `uploadMiddleware.js`.
- Securely streamed to Cloudinary using backend-controlled upload endpoints (`POST /api/students/resume`).
- API keys and secrets remain strictly hidden on the server.

---

## 📜 Full API Documentation

For the complete API reference guide including endpoints, request/response formats, status codes, and permissions, view [`docs/API_DOCUMENTATION.md`](../docs/API_DOCUMENTATION.md).
