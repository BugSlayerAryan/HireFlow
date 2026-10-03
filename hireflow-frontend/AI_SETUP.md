# HireFlow AI setup

HireFlow keeps Gemini credentials on the Spring Boot backend. Do not add Gemini API keys to React, `localStorage`, or committed source files.

1. Configure `GEMINI_API_KEY` in the backend process/IDE environment.
2. Optionally set `GEMINI_MODEL`; the project default is `gemini-3.8-flash`.
3. Start Spring Boot on port `8081`.
4. Start the React frontend on port `5173`.
5. Sign in and open the HireFlow AI assistant.

The React assistant sends requests to `/api/ai/chat`. Job-description generation, profile-bio generation, resume matching, and screening feedback use the same backend AI configuration.

If `GEMINI_API_KEY` is absent or the provider is unavailable, the UI falls back to local HireFlow navigation guidance and displays a configuration notice instead of exposing or requesting a browser-side key.
