# 🚂 Railway Deployment Guide for SkyLens Backend

## Quick Setup

### 1. Create PostgreSQL Database on Railway
```
New → Database → PostgreSQL (SSL enabled)
```

### 2. Connect to Backend Service

In Railway, add these environment variables to your backend service:

**Required:**
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<generate-random-32-char-string>
PORT=4001
HOST=0.0.0.0
NODE_ENV=production
```

**After Frontend Deploy:**
```env
FRONTEND_URL=https://your-frontend-app.up.railway.app
```

### 3. Deploy Backend

Railway will automatically:
1. Install dependencies
2. Generate Prisma Client
3. Run database migrations
4. Start the server

### 4. Create Admin User

After deployment, open Railway shell and run:
```bash
npm run create-admin
```

Or seed default admin:
```bash
npm run railway:seed
```

**Default Admin Credentials (from seed):**
- Email: `admin@skylens.com`
- Password: `Admin123!`
- **⚠️ Change password after first login!**

## Available Commands

```bash
# Setup database (migrations + verification)
npm run railway:setup

# Run migrations only
npm run railway:migrate

# Seed database with default admin
npm run railway:seed

# Create custom admin user (interactive)
npm run create-admin

# Open Prisma Studio
npm run db:studio
```

## Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | ✅ Yes |
| `JWT_SECRET` | Random 32+ char string | ✅ Yes |
| `PORT` | `4001` | ✅ Yes |
| `HOST` | `0.0.0.0` | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `FRONTEND_URL` | Your frontend URL | ✅ Yes |

## Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Verify Deployment

### Check Health Endpoint
```bash
curl https://your-backend-app.up.railway.app/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-01-03T..."
}
```

### Check Database Connection

In Railway shell:
```bash
node -e "const { PrismaClient } = require('./generated/prisma'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('✅ Connected')).catch(e => console.error('❌', e));"
```

## Troubleshooting

### Migrations Fail
```bash
# In Railway shell
npx prisma migrate deploy --skip-seed
```

### Database Connection Issues
- Verify `DATABASE_URL` is set
- Check PostgreSQL service is running
- Ensure SSL mode is enabled

### Prisma Client Not Found
```bash
npx prisma generate
```

### View Logs
```bash
# In Railway dashboard
Click on your backend service → Logs tab
```

## Manual Database Setup

If automatic migrations fail:

```bash
# Connect via Railway shell
npx prisma db push --force-reset --skip-generate
npx prisma generate
npx prisma migrate deploy
```

## Database Schema

After deployment, these tables will be created:

- **User** - User accounts and authentication
- **Order** - Service bookings and requests
- **_prisma_migrations** - Migration history

## Post-Deployment Checklist

- [ ] PostgreSQL database is running
- [ ] Backend service is deployed
- [ ] Health endpoint returns OK
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] FRONTEND_URL updated in environment variables
- [ ] Test signup endpoint
- [ ] Test signin endpoint
- [ ] Test order creation

## Security Notes

1. **Change default admin password** immediately after seeding
2. **Use strong JWT_SECRET** (32+ random characters)
3. **Enable CORS** only for your frontend domain
4. **Use environment variables** - never commit secrets
5. **Enable SSL** for database connections (already configured in Railway)

## Useful Railway Commands

```bash
# View service logs
railway logs

# Open shell
railway shell

# Link to project
railway link

# Set environment variable
railway variables set KEY=VALUE
```

## Support

- Check Railway logs for errors
- Review Prisma documentation: https://www.prisma.io/docs
- Review backend API endpoints in controllers/

---

**Deployment successful?** 🎉 Test your API endpoints and create your first admin user!

