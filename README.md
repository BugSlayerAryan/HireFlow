# HireFlow AI

HireFlow is a React + Spring Boot recruitment portal with separate Job Seeker, Recruiter, and Admin experiences, JWT authentication, AI assistance, resume matching, applications, profile images, and recruiter company branding.

## What is included

- Role-aware login and route protection for `JOB_SEEKER`, `RECRUITER`, and `ADMIN`
- Server-side Spring Security authorization for recruiter/job-seeker/admin APIs
- AI chat, job-description generation, profile-bio generation, resume matching, and screening feedback through the backend
- Job-seeker profile image upload
- Recruiter company image upload for job posts
- Persistent light/dark theme
- Responsive dashboard/navigation and refreshed login/profile/job-posting UX
- Per-user browser chat history

## Local setup

### 1. MySQL

Create the database:

```sql
CREATE DATABASE hireflow_ai;
```

The default local backend settings expect MySQL on port `3306` with user `root`. Prefer environment variables instead of committing credentials.

### 2. Backend

```bash
cd hireflow-ai-backend/hireflow-ai-backend
```

Copy `.env.example` values into your IDE/run configuration or shell environment. At minimum, configure your database and add a Gemini key for live AI:

```text
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.8-flash
JWT_SECRET=use_a_long_random_secret
```

Then run:

```bash
./mvnw spring-boot:run
```

Backend: `http://localhost:8081`

Uploaded profile/company images are stored in `uploads/` by default and served from `/uploads/**`.

### 3. Frontend

```bash
cd hireflow-frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Optional frontend environment values are documented in `hireflow-frontend/.env.example`.

## AI configuration

AI keys are **not stored in the browser**. React calls `/api/ai/**`; Spring Boot calls Gemini with the server-side `GEMINI_API_KEY`. If no key is configured, the assistant still provides local HireFlow navigation guidance and clearly reports that live AI is unavailable.

## Image uploads

- Profile: Profile page → choose image → upload
- Recruiter company logo/image: Post Job → company image uploader
- Accepted types: JPG, PNG, WEBP, GIF
- Maximum size: 5 MB

For Docker, the root `docker-compose.yml` mounts `./uploads:/app/uploads` so images survive backend container recreation.

## Verification commands

Frontend:

```bash
npm test
npm run lint
npm run build
```

Backend:

```bash
./mvnw test
```

## Main stack

- React 19 + Vite 7
- Bootstrap 5 + custom responsive CSS
- Spring Boot 3.5.11 / Java 17+
- Spring Security + JWT
- Spring Data JPA + MySQL
- Apache Tika
- Gemini API through the backend
- WebSocket notifications
