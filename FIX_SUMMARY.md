# HireFlow fix summary

## Fixed / added

- Role-aware login now sends the selected role and rejects account-role mismatches.
- React role guards protect Job Seeker, Recruiter, and Admin routes.
- Spring Security protects recruiter/job-seeker/admin APIs server-side.
- Recruiters can only update applications belonging to their own jobs.
- Global API errors preserve correct HTTP status codes (401/403/503 etc.).
- AI chat is server-side only; no Gemini key is stored in React/localStorage.
- Gemini configuration uses environment variables and defaults to `gemini-3.8-flash`.
- Profile image upload is available from Profile.
- Company image upload is available when a recruiter posts a job.
- Images are validated (JPG/PNG/WEBP/GIF, max 5 MB), stored under `uploads/`, and served by Spring Boot.
- Job cards display company images and the top bar displays the user's profile image.
- Global light/dark theme is loaded before React renders and persists in localStorage.
- Chat, forms, cards, auth screens, dashboard navigation, profile and job composer have theme-aware UI.
- Chat history is separated by signed-in user.
- Spring Boot parent changed from the snapshot build to the official 3.5.11 release and duplicate MySQL dependencies were removed.
- Password is write-only in user JSON responses.

## Required local environment

Backend:

```text
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/hireflow_ai
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=<your mysql password>
GEMINI_API_KEY=<your Gemini key>
JWT_SECRET=<long random secret>
```

Frontend defaults to `http://localhost:8081/api`. See `hireflow-frontend/.env.example` if you need another backend URL.

## Run

```bash
# backend
cd hireflow-ai-backend/hireflow-ai-backend
./mvnw spring-boot:run

# frontend (new terminal)
cd hireflow-frontend
npm install
npm run dev
```

Do not copy the old `node_modules` folder between Windows/Linux machines; run `npm install` on the machine where you run the project.
