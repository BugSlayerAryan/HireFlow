# HireFlow Frontend

React/Vite frontend for HireFlow AI.

## Run

```bash
npm install
npm run dev
```

Default API: `http://localhost:8081/api`. Override it with `VITE_API_BASE_URL` in `.env` if needed.

## Commands

```bash
npm test
npm run lint
npm run build
```

## Security and AI

The frontend never stores a Gemini API key. All live AI requests go to the Spring Boot backend through `/api/ai/**`. Authentication uses the JWT returned by `/api/auth/login`, and role-specific pages are guarded for Job Seekers, Recruiters, and Admins.

## UI features

- Persistent light/dark mode
- Responsive sidebar/top navigation
- Profile image display and upload
- Recruiter company image uploader and job-card branding
- Theme-aware AI chat
- Per-account chat history
