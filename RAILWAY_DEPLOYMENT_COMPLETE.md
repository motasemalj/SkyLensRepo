# 🚂 Complete Railway Deployment Guide - SkyLens

## 📋 Overview

This guide covers the complete deployment of SkyLens to Railway with PostgreSQL database, backend API, and frontend application.

## 🎯 What You'll Deploy

1. **PostgreSQL Database** (with SSL)
2. **Backend API** (Node.js + Express + Prisma)
3. **Frontend** (Next.js)

---

## Step 1: Create PostgreSQL Database

### In Railway Dashboard:

1. Click **"New"** → **"Database"** → **"PostgreSQL"**
2. Select **PostgreSQL 17 with SSL**
3. Name it: `skylens-database`
4. Wait for provisioning to complete
5. **Copy the `DATABASE_URL`** from the variables tab

---

## Step 2: Deploy Backend

### Create Backend Service:

1. Click **"New"** → **"GitHub Repo"**
2. Select your SkyLens repository
3. Railway will detect it as a monorepo

### Configure Backend:

**Root Directory:** `backend`

**Environment Variables:**
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<GENERATE_THIS>
PORT=4001
HOST=0.0.0.0
NODE_ENV=production
FRONTEND_URL=https://your-frontend.up.railway.app
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Link Database to Backend:

1. Go to backend service
2. Click **"Variables"** tab
3. Click **"New Variable"** → **"Add Reference"**
4. Select your PostgreSQL database
5. Variable name: `DATABASE_URL`
6. Railway will auto-populate: `${{Postgres.DATABASE_URL}}`

### Railway Will Automatically:
- ✅ Run `npm install`
- ✅ Generate Prisma Client
- ✅ Run database migrations
- ✅ Start the server on port 4001

### Get Backend URL:
After deployment completes, copy the public URL (e.g., `https://skylens-backend-production.up.railway.app`)

---

## Step 3: Deploy Frontend

### Create Frontend Service:

1. Click **"New"** → **"GitHub Repo"**
2. Select your SkyLens repository again

### Configure Frontend:

**Root Directory:** `frontend`

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
NODE_ENV=production
PORT=8080
```

### Railway Will Automatically:
- ✅ Run `npm install`
- ✅ Build Next.js app
- ✅ Start production server

### Get Frontend URL:
After deployment completes, copy the public URL (e.g., `https://skylens.up.railway.app`)

---

## Step 4: Update CORS Configuration

### Update Backend Environment Variables:

1. Go to **Backend Service** → **Variables**
2. Update `FRONTEND_URL` with your **actual frontend URL**
3. Example: `FRONTEND_URL=https://skylens.up.railway.app`
4. Redeploy backend if needed

---

## Step 5: Initialize Database

### Option A: Seed Default Admin (Recommended)

In Railway Backend Shell:
```bash
npm run railway:seed
```

**Default Admin Credentials:**
- Email: `admin@skylens.com`
- Password: `Admin123!`
- ⚠️ **Change password immediately after first login!**

### Option B: Create Custom Admin

In Railway Backend Shell:
```bash
npm run create-admin
```

Follow the prompts to create your admin user.

---

## ✅ Verification Checklist

### Backend Health Check:
```bash
curl https://your-backend.up.railway.app/health
```

Expected response:
```json
{"status":"OK","timestamp":"2025-01-03T..."}
```

### Database Connection:
In Railway Backend Shell:
```bash
node -e "const { PrismaClient } = require('./generated/prisma'); const prisma = new PrismaClient(); prisma.user.count().then(c => console.log('Users:', c));"
```

### Frontend Access:
1. Visit your frontend URL
2. Click **"Sign Up"**
3. Create a test account
4. Sign in successfully
5. Create a test booking

### Admin Access:
1. Sign in with admin credentials
2. Access admin dashboard at `/admin`
3. View bookings in table view
4. Switch to calendar view
5. Test approve/reject functionality

---

## 🎨 Frontend Railway Configuration

Your `frontend/railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## 🔧 Backend Railway Configuration

Your `backend/railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npx prisma migrate deploy"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## 📊 Environment Variables Summary

### PostgreSQL Database
No manual configuration needed - Railway manages this automatically.

### Backend Service (6 variables)
| Variable | Value | How to Get |
|----------|-------|------------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Railway reference |
| `JWT_SECRET` | Random 32+ chars | Generate with crypto |
| `PORT` | `4001` | Fixed value |
| `HOST` | `0.0.0.0` | Fixed value |
| `NODE_ENV` | `production` | Fixed value |
| `FRONTEND_URL` | Frontend Railway URL | Copy after frontend deploy |

### Frontend Service (2 variables)
| Variable | Value | How to Get |
|----------|-------|------------|
| `NEXT_PUBLIC_API_URL` | Backend Railway URL | Copy after backend deploy |
| `NODE_ENV` | `production` | Fixed value |

---

## 🚀 Quick Commands

### Backend Commands (in Railway Shell):
```bash
# Seed database with default admin
npm run railway:seed

# Create custom admin user
npm run create-admin

# Run migrations manually
npm run railway:migrate

# Check database connection
npm run railway:setup

# View Prisma Studio (if needed)
npm run db:studio
```

### Database Queries (in Railway PostgreSQL Data tab):
```sql
-- View all users
SELECT id, email, name, "isAdmin" FROM "User";

-- Make user admin
UPDATE "User" SET "isAdmin" = true WHERE email = 'user@example.com';

-- View all orders
SELECT * FROM "Order" ORDER BY "createdAt" DESC;

-- Count orders by status
SELECT status, COUNT(*) as count FROM "Order" GROUP BY status;

-- Total revenue
SELECT SUM(estimate) as revenue FROM "Order" WHERE status = 'APPROVED';
```

---

## 🐛 Troubleshooting

### Backend Won't Start
**Check:**
- DATABASE_URL is set and linked to PostgreSQL
- JWT_SECRET is set
- Check Railway logs for errors

**Fix:**
```bash
# In Railway backend shell
npx prisma generate
npx prisma migrate deploy
```

### Frontend Can't Connect to Backend
**Check:**
- NEXT_PUBLIC_API_URL is correct (no trailing slash)
- Backend is deployed and healthy
- CORS is configured correctly

**Fix:**
Update FRONTEND_URL in backend environment variables

### Database Migrations Failed
**Check:**
- DATABASE_URL is valid
- PostgreSQL service is running

**Fix:**
```bash
# In Railway backend shell
npx prisma migrate deploy --skip-seed
```

### CORS Errors in Browser Console
**Check:**
- FRONTEND_URL in backend matches actual frontend URL
- No trailing slashes in URLs

**Fix:**
Redeploy backend after updating FRONTEND_URL

---

## 🔒 Security Best Practices

1. ✅ **Change default admin password** immediately
2. ✅ **Use strong JWT_SECRET** (32+ random characters)
3. ✅ **Enable SSL** for database (already configured)
4. ✅ **Set specific FRONTEND_URL** (don't use wildcards)
5. ✅ **Never commit .env files** to git
6. ✅ **Use Railway secrets** for sensitive data
7. ✅ **Enable Railway's built-in DDoS protection**

---

## 📈 Monitoring

### View Logs:
- **Backend:** Railway → Backend Service → Logs
- **Frontend:** Railway → Frontend Service → Logs
- **Database:** Railway → PostgreSQL Service → Metrics

### Health Checks:
- Backend: `https://your-backend.up.railway.app/health`
- Frontend: Visit your frontend URL

### Database Stats:
```sql
SELECT 
  (SELECT COUNT(*) FROM "User") as users,
  (SELECT COUNT(*) FROM "Order") as orders,
  (SELECT COUNT(*) FROM "Order" WHERE status = 'PENDING') as pending,
  (SELECT COUNT(*) FROM "Order" WHERE status = 'APPROVED') as approved;
```

---

## 🎉 Success!

Your SkyLens application is now fully deployed on Railway!

**URLs to Save:**
- 🌐 Frontend: `https://your-frontend.up.railway.app`
- 🔧 Backend: `https://your-backend.up.railway.app`
- 🗄️ Database: Managed by Railway

**Next Steps:**
1. Test all functionality
2. Create your first real booking
3. Monitor performance in Railway dashboard
4. Set up custom domain (optional)
5. Configure environment-specific settings

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**Questions?** Check the logs, environment variables, and database connection first!

**Need help?** Review the troubleshooting section above or check Railway's support documentation.

