# Production-Ready: Vercel Deployment

The project is a **monorepo**: a Vite/React frontend (`/`) and an Express API (`/server`).  
Vercel will serve the **built static frontend** and run the **Express backend as a single serverless function** at `/api/*`.  
Images already use **Cloudflare R2 (S3-compatible)** — no changes needed there.  
The database uses **MongoDB Atlas** — the URI is already set in `.env`.

> [!WARNING]
> The `apiClient.js` currently contains broken server-side code (`res.setHeader(...)`) that will cause a **runtime crash in the browser**. This must be fixed before anything else.

> [!IMPORTANT]
> The root `.env` file contains real credentials. These must **also** be added as Vercel Environment Variables in the dashboard — Vercel does not read your `.env` file automatically.

---

## Proposed Changes

### 1 — Frontend fix

#### [MODIFY] apiClient.js (`src/services/apiClient.js`)
Remove the 4 broken lines (`origin` variable + `res.setHeader(...)` call) — these are Node.js server code mistakenly added to a browser file. The `API_BASE_URL` line stays, pointing to the production URL via `VITE_API_BASE_URL`.

---

### 2 — Vercel serverless entry-point

#### [NEW] api/index.js (project root `/api/index.js`)
A single file that imports the Express `app` and exports it as a Vercel serverless handler. Vercel treats every file in `/api/` as a serverless function.

```js
// api/index.js
import app from "../server/src/app.js";
export default app;
```

> [!NOTE]
> The server's `dotenv.config()` call in `env.js` reads from `process.env`, which Vercel populates from the dashboard — no `.env` file is needed on the server at runtime.

---

### 3 — Rewrite vercel.json

#### [MODIFY] vercel.json (project root)
Full replacement with proper `builds` + `rewrites`:
- Build the Vite frontend → `dist/`  
- Expose `api/index.js` as a Node.js 20 serverless function  
- Route `/api/*` → serverless function, everything else → static index.html (SPA fallback)

---

### 4 — server/.env (local dev only)

#### [NEW] server/.env
A copy of the root `.env` values that the server reads when running locally (`cd server && npm run dev`). This file is git-ignored and **only** needed for local development — Vercel uses dashboard env vars.

---

### 5 — Root package.json scripts

#### [MODIFY] package.json
Add `"vercel-build": "vite build"` — Vercel calls this automatically during deployment.

---

### 6 — Root .env (frontend)

#### [MODIFY] .env (root)
`VITE_API_BASE_URL` must equal the production URL: `https://ebenezer-motors-main.vercel.app`  
(Already partially set — confirm it matches the actual deployed domain.)

---

## Vercel Dashboard — Required Environment Variables

After deploying, add these in **Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | *(your Atlas URI)* |
| `JWT_SECRET` | *(strong random string)* |
| `JWT_EXPIRES_IN` | `7d` |
| `ADMIN_REGISTRATION_KEY` | *(your key)* |
| `CORS_ORIGIN` | `https://ebenezer-motors-main.vercel.app` |
| `STORAGE_DRIVER` | `s3` |
| `S3_REGION` | `auto` |
| `S3_BUCKET` | `ebenezer-motors` |
| `S3_ACCESS_KEY_ID` | *(R2 key)* |
| `S3_SECRET_ACCESS_KEY` | *(R2 secret)* |
| `S3_ENDPOINT` | *(R2 endpoint URL)* |
| `S3_PUBLIC_BASE_URL` | *(R2 public URL)* |
| `S3_FORCE_PATH_STYLE` | `true` |
| `VITE_API_BASE_URL` | `https://ebenezer-motors-main.vercel.app` |

## Verification Plan
1. Run `npm run build` locally — confirm `dist/` is created with no errors
2. Deploy to Vercel (`vercel --prod` or push to GitHub)
3. Test `https://ebenezer-motors-main.vercel.app/api/health` → should return `{ ok: true }`
4. Test the live site — browse vehicles, login to admin, upload an image (confirm S3)
