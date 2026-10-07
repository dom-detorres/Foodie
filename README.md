# Foodie

A pantry, fridge and freezer tracker that shows what's about to expire and suggests recipes. Work in progress.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create your `.env` file
`.env` holds secrets, so it is **never committed** to git. Copy the example and fill in your own values:

```bash
cp .env.example .env
```

| Variable | What it is | Where to get it |
|---|---|---|
| `DATABASE_URL` | Connection string for the Supabase Postgres database | Supabase dashboard > Connect > **Session pooler** (URI). Replace `[YOUR-PASSWORD]` with your database password |
| `PORT` | Port the server listens on (optional, defaults to 3000) | Leave as `3000` |
| `GEMINI_API_KEY` | API key for recipe suggestions | Added in the AI ticket |
| `VITE_FIREBASE_API_KEY` | Firebase web app config | Firebase console > Project settings > Your apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase web app config | Firebase console > Project settings > Your apps |
| `VITE_FIREBASE_PROJECT_ID` | Firebase web app config | Firebase console > Project settings > Your apps |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase web app config | Firebase console > Project settings > Your apps |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase web app config | Firebase console > Project settings > Your apps |
| `VITE_FIREBASE_APP_ID` | Firebase web app config | Firebase console > Project settings > Your apps |
| `GOOGLE_APPLICATION_CREDENTIALS` | Full path to the Firebase service account JSON (used by the server only) | Firebase console > Project settings > Service accounts > **Generate new private key**. Save the file **outside the repo** (for example `~/secrets/`) and put its full path here |

### 3. Start the app
```bash
npm run dev
```
The client runs on http://localhost:5173 and the server on http://localhost:3000.

## Firebase
Foodie uses a **single Firebase project on purpose**. Separate dev and production projects can be added later if needed. Email/Password and Google sign-in are both enabled in that project.

The `VITE_FIREBASE_*` values are not secret (they only identify the project, and Vite puts any `VITE_` variable into the browser bundle). The service account key **is** secret because it gives full admin access, so it lives outside the repo and is only referenced by path.

## Notes
- Use the **Session pooler** string, not the direct connection. The direct one only works on IPv6 networks.
- Never commit `.env` or any Firebase service account file. If a secret is ever pushed to GitHub, treat it as stolen and replace it.
- Never put a real secret behind a `VITE_` name.
- Free Supabase projects pause after a week of inactivity. If the server can't connect after a break, restore the project from the Supabase dashboard.