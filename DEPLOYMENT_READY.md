# HireFlow deployment checklist

## Frontend (Vercel)

Set the project Root Directory to `hireflow-frontend`.

Environment variable:

- `VITE_API_BASE_URL=https://hireflow-b9sf.onrender.com/api`

The included `vercel.json` rewrites SPA routes to `index.html`, so refreshing routes such as `/dashboard/profile` or `/admin/users` does not return a Vercel 404.

After changing a `VITE_` variable, redeploy the frontend because Vite embeds it during the build.

## Backend (Render)

Set the service Root Directory to `hireflow-ai-backend/hireflow-ai-backend` and use the included Dockerfile.

Required environment variables:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `ADMIN_EMAIL` (only needed to seed an admin)
- `ADMIN_INITIAL_PASSWORD` (only needed to seed an admin)

Optional variables:

- `JWT_EXPIRATION=86400000`
- `GEMINI_API_BASE_URL=https://generativelanguage.googleapis.com/v1beta/models`
- `GEMINI_MODEL=gemini-3.8-flash`
- `HIREFLOW_UPLOAD_DIR=uploads`

Do not commit real passwords, API keys, JWT secrets, or database credentials.

## Database (Aiven MySQL)

Use a JDBC URL, for example:

`jdbc:mysql://HOST:PORT/defaultdb?sslMode=REQUIRED`

## Authentication persistence

Login data is saved in browser `localStorage`. A valid JWT survives page refreshes and browser restarts. Expired JWTs are automatically cleared and the user is sent back to login.

## WebSocket

The frontend derives the SockJS endpoint from `VITE_API_BASE_URL`:

- REST: `https://hireflow-b9sf.onrender.com/api`
- SockJS: `https://hireflow-b9sf.onrender.com/ws-hireflow`

The STOMP CONNECT frame carries the JWT so private `/user/queue/notifications` messages can resolve to the authenticated user.

## GitHub push protection / clean source

This delivery zip intentionally excludes `.git`, IDE metadata, build output, and dependency folders. If an older local Git commit is blocked because it contains a secret, do not bypass GitHub Push Protection. Rotate the exposed credential and either reset the blocked local commits to the remote branch or initialize a fresh Git repository from this clean delivery folder.
