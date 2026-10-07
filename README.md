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
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to the Firebase service account JSON | Added in the auth ticket |

### 3. Start the app
```bash
npm run dev
```
The client runs on http://localhost:5173 and the server on http://localhost:3000.

### Notes
- Use the **Session pooler** string, not the direct connection. The direct one only works on IPv6 networks.
- Never commit `.env` or any Firebase service account file. If a secret is ever pushed to GitHub, treat it as stolen and replace it.
- Free Supabase projects pause after a week of inactivity. If the server can't connect after a break, restore the project from the Supabase dashboard.