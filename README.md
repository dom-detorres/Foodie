# 🥕 Foodie

Foodie is a pantry, fridge and freezer tracker that helps you waste less food. It keeps track of what you have, warns you when things are about to expire, and uses AI to suggest recipes based on the ingredients you need to use up first.

Foodie is a student learning project and portfolio piece, and it is a work in progress.

## Table of contents

- [Problem and goal](#problem-and-goal)
- [MVP scope](#mvp-scope)
- [Decisions](#decisions)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Data model](#data-model)
- [API endpoints](#api-endpoints)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Workflow](#workflow)
- [Roadmap](#roadmap)
- [Team](#team)
- [License](#license)

---

## Problem and goal

Foodie started at home. My partner hates wasting food and would rather give spare food to people who need it, and I don't like wasting money, so we wanted the same thing: stop throwing food away.

In our kitchen the problem was forgotten vegetables and sauces. We would buy carrots without realising we already had some from a while ago, and sauces went past their date before we thought to use them.

**Who it's for:** the two of us first, and I'd like friends and other students to be able to try it. Families usually have an established system already, so they aren't the target.

**What's different:** Foodie is a learning project, so it isn't trying to beat existing apps. Its angle is simple: recipe ideas are driven by what is about to expire, not just by what is in the cupboard.

**The 30-second goal:** within about 30 seconds of opening the app, a new user can sign in and add their first item to a location. Filling a whole kitchen takes longer, which is why suggested expiry dates are on the stretch list.

---

## MVP scope

This section is **locked**. Anything not listed under MVP goes in Stretch, so scope doesn't creep. The MVP is web and desktop only, but the database is built for many users from the start. Development uses seed data.

### In the MVP

- [ ] Sign up and log in (Firebase Auth: Email/Password + Google)
- [ ] Add, edit and delete food items (deleting asks for confirmation)
- [ ] Organise items by location: name your own locations, each one a pantry, fridge or freezer (like "Garage freezer")
- [ ] Default expiry dates for dishes (7 days in the fridge, 3 months in the freezer, not allowed in the pantry)
- [ ] "Expiring soon" view with orange and red warnings, always shown with text as well as colour
- [ ] Expiry warning settings (per-user days for orange and red)
- [ ] AI recipe suggestions from expiring ingredients (Gemini)

### Stretch goals (only after the MVP works end to end)

In this order:

1. "I cooked this" button
2. Shopping list
3. Make a new ingredient from others (like jam)
4. Notifications
5. Barcode scanning
6. Categories and search
7. Gemini response caching
8. Mobile-friendly responsive layout
9. PWA install support
10. React Native app (Expo)
11. Suggested expiry dates for ingredients
12. Dietary preferences, allergies and favourite cuisines for recipe suggestions

---

## Decisions

These are locked so they don't get re-debated mid-build.

| # | Decision | Why |
|---|----------|-----|
| 1 | Solo-led workflow: pull requests, one branch per ticket, no required approvals on my own PRs. Commit prefixes `feat:`, `fix:`, `docs:`, `test:`, `chore:` | Keeps `main` working and the history readable |
| 2 | Multi-user-ready from the start: `user_id` on every table, and the user ID always comes from the verified token, never from the request body or URL | Users can't read each other's data, and there's no rewrite later |
| 3 | One Firebase project | Enough for now, and dev and production projects can be added later |
| 4 | Only ingredients (`is_dish = false`) feed recipe suggestions | Suggestions should be cookable from raw ingredients, not leftovers |
| 5 | Default expiry: dish in fridge 7 days, dish in freezer 3 months, dish in pantry not allowed. Ingredients get no automatic date. Homemade ingredients like jam are just ingredients with their own date | Dishes spoil on a predictable schedule, but ingredients vary too much |
| 6 | Expiry colours: orange at 5 days or fewer, red at 2 days or fewer or expired. Both are per-user settings, and the UI always shows text as well as colour | Different people want different warning times, and colour alone isn't accessible |
| 7 | A location that still has items can't be deleted (409 with a message, with the database foreign key set to RESTRICT as a backup) | Prevents losing items by accident |
| 8 | `PATCH` changes part of an item, `DELETE` removes it | Standard REST, and simple to explain |
| 9 | Gemini returns a fixed JSON shape: `title`, `timeMinutes`, `ingredientsUsed` (name, quantity, unit), `extraIngredientsNeeded`, `steps`. No caching for now. If it fails, show a simple "couldn't find any suggestions" message | A fixed shape is easy to display and test |
| 10 | The MVP is web and desktop only. Mobile, PWA and React Native are stretch goals | Keeps the scope small |
| 11 | Deleting asks for confirmation, with no undo. A 401 sends the user to login with a "session expired" message | Simple and predictable |
| 12 | Deployment is optional and last (Supabase database, Render server, Vercel client), with free tiers rechecked first | Free tiers change |
| 13 | License: MIT | Standard for portfolio projects |
| 14 | Stretch order is as listed in the Stretch section above | Decided up front so priorities don't drift |

---

## Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | React + Vite + TypeScript | From the project template |
| Data fetching | TanStack Query | Already installed in the template |
| Backend | Node + Express + TypeScript | From the project template |
| Database | PostgreSQL on Supabase | Accessed through Knex with a connection string (not Supabase's client library or auth) |
| Auth | Firebase Auth | Email/Password and Google. The Admin SDK verifies tokens on the server |
| AI | Gemini API | Called from the backend only |
| Tests | Vitest | |
| Hosting | Optional, last phase | Supabase (database), Render (server), Vercel (client). Free tiers get rechecked before deploying |

---

## Architecture

```
[React Frontend] <--HTTPS/JSON--> [Node/Express API] <--SQL--> [PostgreSQL]
       |                                 |
       v                                 v
[Firebase Auth SDK]              [Firebase Admin SDK]
                                         |
                                         v
                                  [Gemini API]
```

**Rule that must not be broken:** the frontend never talks to Gemini or the database directly. Everything goes through the backend, which holds all secret keys.

---

## Data model

**`users`**: `id`, `auth_id` (unique, the Firebase UID), `email` (unique), `warning_days` (default 5), `urgent_days` (default 2), `created_at`

**`locations`**: `id`, `user_id`, `name` (max 50), `kind` (`pantry`, `fridge` or `freezer`), `created_at`

**`food_items`**: `id`, `user_id`, `location_id`, `name` (max 100), `quantity` (decimal 8,2), `unit` (max 20, optional), `expiration_date` (optional), `is_dish`, `created_at`, `updated_at`

Every table has `user_id`, and it always comes from the verified token. A location that still has items can't be deleted.

---

## API endpoints

Planned routes, updated as they get built. Every route needs a valid Firebase token.

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/sync` | Create the local user record on first login |
| GET | `/items` | List items (filters: location, expiring soon) |
| POST | `/items` | Add an item |
| PATCH | `/items/:id` | Update an item |
| DELETE | `/items/:id` | Delete an item |
| GET | `/locations` | List locations |
| POST | `/locations` | Add a location |
| PATCH | `/locations/:id` | Rename a location |
| DELETE | `/locations/:id` | Delete a location (409 if it still has items) |
| GET | `/settings` | Get expiry warning settings |
| PATCH | `/settings` | Change expiry warning settings |
| POST | `/recipes/suggest` | Get recipe suggestions for expiring ingredients |

---

## Getting started

### Prerequisites

- Node.js 24 (what I develop on)
- A Supabase account for the hosted PostgreSQL database (no local install needed)
- A Firebase project with Email/Password and Google sign-in enabled
- A Gemini API key (needed from the AI phase)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/dom-detorres/Foodie.git
cd Foodie

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# then fill in the values (see below)

# 4. Start the app
npm run dev
```

The client runs on http://localhost:5173 and the server on http://localhost:3000. Database tables, migrations and seed data arrive in Phase 1, and the commands to run them will be added here then.

### Environment variables

`.env` holds secrets, so it is **never committed** to git.

| Variable | What it is | Where to get it |
|---|---|---|
| `DATABASE_URL` | Connection string for the Supabase Postgres database | Supabase dashboard > Connect > **Session pooler** (URI). Replace `[YOUR-PASSWORD]` with your database password |
| `PORT` | Port the server listens on (optional, defaults to 3000) | Leave as `3000` |
| `GEMINI_API_KEY` | API key for recipe suggestions | Added in the AI phase |
| `VITE_FIREBASE_API_KEY` | Firebase web app config | Firebase console > Project settings > Your apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase web app config | Firebase console > Project settings > Your apps |
| `VITE_FIREBASE_PROJECT_ID` | Firebase web app config | Firebase console > Project settings > Your apps |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase web app config | Firebase console > Project settings > Your apps |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase web app config | Firebase console > Project settings > Your apps |
| `VITE_FIREBASE_APP_ID` | Firebase web app config | Firebase console > Project settings > Your apps |
| `GOOGLE_APPLICATION_CREDENTIALS` | Full path to the Firebase service account JSON (used by the server only) | Firebase console > Project settings > Service accounts > **Generate new private key**. Save the file **outside the repo** (for example `~/secrets/`) and put its full path here |

### Firebase

Foodie uses a **single Firebase project on purpose**. Separate dev and production projects can be added later if needed. Email/Password and Google sign-in are both enabled in that project.

The `VITE_FIREBASE_*` values are not secret (they only identify the project, and Vite puts any `VITE_` variable into the browser bundle). The service account key **is** secret because it gives full admin access, so it lives outside the repo and is only referenced by path.

### Notes

- Use the **Session pooler** string, not the direct connection. The direct one only works on IPv6 networks.
- Never commit `.env` or any Firebase service account file. If a secret is ever pushed to GitHub, treat it as stolen and replace it.
- Never put a real secret behind a `VITE_` name.
- Free Supabase projects pause after a week of inactivity. If the server can't connect after a break, restore the project from the Supabase dashboard.

---

## Project structure

```
Foodie/
├── client/        # React app (apis, components, hooks, styles)
├── models/        # Shared TypeScript types
├── server/
│   ├── db/        # Knex connection, migrations, seeds, query functions
│   ├── routes/    # Express routes
│   ├── index.ts
│   └── server.ts
├── .env.example   # Names of the environment variables (no secrets)
├── index.html
├── LICENSE
└── vite.config.js
```

---

## Workflow

- `main` is always working. **Nobody pushes directly to `main`.**
- One branch per ticket, named by type and ticket, like `chore/0.4-firebase-project`
- Every change goes through a pull request. I don't require approval on my own PRs, and I review any PRs from others
- Commit prefixes: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
- Work is tracked on the GitHub Project board. Each phase is a Milestone and each task is an Issue

---

## Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| 0 | Setup (repo, Postgres, Firebase, `.env`, docs) | 🟨 |
| 1 | Backend core (CRUD, seeds, expiry logic + tests) | ⬜ |
| 2 | Auth (Firebase client + Admin middleware) | ⬜ |
| 3 | Frontend CRUD | ⬜ |
| 4 | Gemini recipe suggestions | ⬜ |
| 5 | Polish (empty, loading and error states, validation) | ⬜ |
| 6 | Stretch goals | ⬜ |

---

## Team

Solo for now. Built by Dom ([@dom-detorres](https://github.com/dom-detorres)) as a learning project. My partner may pick up tickets later.

---

## License

MIT, see [LICENSE](LICENSE). This is a student project built for learning.