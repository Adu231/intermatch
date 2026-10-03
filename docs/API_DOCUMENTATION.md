# InternMatch Complete API Documentation

Official REST API Reference for the **InternMatch** platform.

All responses follow the consistent JSON format:
```json
{
  "success": true,
  "message": "Optional response message",
  "data": {}
}
```

---

## 1. Authentication APIs

### `POST /api/auth/register`
- **Description**: Registers a new user (Student or Recruiter) and initializes their profile.
- **Auth Required**: No
- **Rate Limited**: Yes (100 requests per 15 min)
- **Request Body**:
  ```json
  {
    "name": "Maya Singh",
    "email": "maya@example.com",
    "password": "password123",
    "role": "student",
    "details": {
      "college": "RV College of Engineering"
    }
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": "6701a2b3...",
        "name": "Maya Singh",
        "email": "maya@example.com",
        "role": "student",
        "college": "RV College of Engineering"
      }
    }
  }
  ```

---

### `POST /api/auth/login`
- **Description**: Authenticates user credentials and returns JWT session token.
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "student@demo.com",
    "password": "demo1234"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": "6701a2b3...",
        "name": "Maya Singh",
        "email": "student@demo.com",
        "role": "student"
      }
    }
  }
  ```

---

### `GET /api/auth/me`
- **Description**: Returns authenticated user profile information.
- **Auth Required**: Yes (Bearer Token)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "...", "name": "Maya Singh", "email": "student@demo.com", "role": "student" },
      "profile": { "education": "B.Tech Computer Science", "skills": ["React", "JavaScript"] }
    }
  }
  ```

---

### `POST /api/auth/logout`
- **Description**: Invalidates session token.
- **Auth Required**: Yes

---

## 2. Student APIs

### `GET /api/students/profile`
- **Auth Required**: Yes
- **Role**: `student`
- **Success Response (200 OK)**: Returns full `StudentProfile` object.

### `PUT /api/students/profile`
- **Auth Required**: Yes
- **Role**: `student`
- **Request Body**: `{ "phone": "...", "education": "...", "skills": ["React", "Git"] }`

### `POST /api/students/resume`
- **Auth Required**: Yes
- **Role**: `student`
- **Content-Type**: `multipart/form-data`
- **Request Body**: `resume` (PDF or Word document file)
- **Response**: `{ "success": true, "data": { "resumeUrl": "https://res.cloudinary.com/..." } }`

### `GET /api/students/recommended`
- **Auth Required**: Yes
- **Role**: `student`
- **Description**: Returns internships with match score >= 75% calculated dynamically against student profile.

### `GET /api/students/applications`
- **Auth Required**: Yes
- **Role**: `student`
- **Description**: Lists applications submitted by current student.

### `GET /api/students/interviews`
- **Auth Required**: Yes
- **Role**: `student`
- **Description**: Lists interviews scheduled for student.

### `GET /api/students/saved`
- **Auth Required**: Yes
- **Role**: `student`

### `POST /api/students/saved/:internshipId`
- **Auth Required**: Yes
- **Role**: `student`

### `DELETE /api/students/saved/:internshipId`
- **Auth Required**: Yes
- **Role**: `student`

---

## 3. Internship APIs

### `GET /api/internships`
- **Auth Required**: No (Public)
- **Query Parameters**: `query` (search keyword), `mode` (Remote | Hybrid | On-site)
- **Response**: Array of published internship opportunities.

### `GET /api/internships/:id`
- **Auth Required**: No (Public)
- **Response**: Single internship details object.

### `GET /api/internships/my`
- **Auth Required**: Yes
- **Role**: `recruiter`
- **Description**: Returns internships posted by logged-in recruiter.

### `POST /api/internships`
- **Auth Required**: Yes
- **Role**: `recruiter`
- **Request Body**:
  ```json
  {
    "title": "Frontend Development Intern",
    "description": "Ship thoughtful product experiences.",
    "location": "Bengaluru, India",
    "workMode": "Remote",
    "stipend": "₹10,000 / month",
    "requiredSkills": ["React", "JavaScript", "Git"]
  }
  ```

### `PUT /api/internships/:id`
- **Auth Required**: Yes
- **Role**: `recruiter` (Must be post owner)

### `DELETE /api/internships/:id`
- **Auth Required**: Yes
- **Role**: `recruiter` (Must be post owner)

### `PATCH /api/internships/:id/status`
- **Auth Required**: Yes
- **Role**: `recruiter`
- **Request Body**: `{ "status": "Published" | "Draft" | "Closed" }`

---

## 4. Application APIs

### `POST /api/applications/:internshipId`
- **Auth Required**: Yes
- **Role**: `student`
- **Description**: Submits application. Prevents duplicate applications for the same internship.

### `GET /api/applications/my`
- **Auth Required**: Yes
- **Role**: `student`

### `GET /api/applications/internship/:internshipId`
- **Auth Required**: Yes
- **Role**: `recruiter`
- **Description**: Retrieves candidate applications for recruiter's internship post.

### `PATCH /api/applications/:id/status`
- **Auth Required**: Yes
- **Role**: `recruiter`
- **Request Body**: `{ "status": "Applied" | "Under review" | "Shortlisted" | "Interview" | "Selected" | "Rejected" }`

---

## 5. Interview APIs

### `POST /api/interviews`
- **Auth Required**: Yes
- **Role**: `recruiter`
- **Request Body**:
  ```json
  {
    "studentId": "6701...",
    "internshipId": "6702...",
    "date": "Oct 09, 2026",
    "time": "3:30 PM IST",
    "mode": "Video call",
    "meetingLink": "meet.technova.co/maya"
  }
  ```

### `GET /api/interviews/recruiter`
- **Auth Required**: Yes
- **Role**: `recruiter`

### `GET /api/interviews/student`
- **Auth Required**: Yes
- **Role**: `student`

### `PUT /api/interviews/:id`
- **Auth Required**: Yes
- **Role**: `recruiter`
