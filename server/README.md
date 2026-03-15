# Ebenezer Motors Backend

Node/Express + MongoDB API for vehicles, contact messages, trade-ins, hire requests, and admin auth.

## Setup

### 1) Create env files

From the repo root:

```
Copy-Item .env.example .env
Copy-Item server\.env.example server\.env
```

### 2) Configure env values

Frontend `.env`:

```
VITE_API_BASE_URL=http://localhost:5000
```

Backend `server/.env`:

```
MONGODB_URI=mongodb://localhost:27017/ebenezer_motors
JWT_SECRET=your-strong-secret
ADMIN_REGISTRATION_KEY=your-admin-key

# Storage driver: s3 (AWS S3 or Cloudflare R2) OR local
STORAGE_DRIVER=s3

# AWS S3 example:
S3_REGION=us-east-1
S3_BUCKET=your-bucket
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret
S3_ENDPOINT=
S3_PUBLIC_BASE_URL=https://your-bucket.s3.us-east-1.amazonaws.com

# Cloudflare R2 example:
# S3_REGION=auto
# S3_BUCKET=your-bucket
# S3_ACCESS_KEY_ID=your-r2-key
# S3_SECRET_ACCESS_KEY=your-r2-secret
# S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
# S3_PUBLIC_BASE_URL=https://<public-domain-or-cdn>/<optional-path>
```

### 3) Install backend deps and start API

From the repo root:

```
Set-Location server
npm install
npm run dev
```

### 4) Seed vehicles

Open another terminal at the repo root:

```
npm run seed
```

### 5) Start frontend and create admin

```
Set-Location ..
npm install
npm run dev
```

Then open:

```
http://localhost:5173/admin
```

Use the same `ADMIN_REGISTRATION_KEY` you set in `server/.env` to create the first admin.
