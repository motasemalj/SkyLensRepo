# SkyLens Railway Deployment Guide

## 🚀 Quick Deploy to Railway

### Prerequisites
- Railway account (sign up at [railway.app](https://railway.app))
- GitHub repository connected to Railway

### Step 1: Connect Repository
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `motasemalj/SkyLensRepo`
5. Select the `frontend` folder as the root directory

### Step 2: Configure Environment Variables
Add these environment variables in Railway dashboard:

```bash
# Database (Railway will provide this)
DATABASE_URL=postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway

# API Configuration
NEXT_PUBLIC_API_URL=https://your-app.railway.app
API_URL=https://your-app.railway.app

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Railway Configuration
PORT=3000
NODE_ENV=production

# Next.js Configuration
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### Step 3: Database Setup
1. Add PostgreSQL service in Railway
2. Copy the `DATABASE_URL` from the PostgreSQL service
3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Step 4: Deploy
1. Railway will automatically build and deploy
2. Your app will be available at `https://your-app.railway.app`

## 🔧 Configuration Files

### railway.json
- Defines build and deployment settings
- Sets health check path and timeout
- Configures restart policy

### nixpacks.toml
- Specifies Node.js 18 as the runtime
- Defines build phases and commands
- Optimizes for production deployment

### Dockerfile
- Multi-stage build for optimal image size
- Security best practices
- Production-ready configuration

## 📊 Monitoring

Railway provides:
- Real-time logs
- Performance metrics
- Automatic scaling
- Health checks

## 🔄 Updates

To update your deployment:
1. Push changes to GitHub
2. Railway automatically rebuilds and redeploys
3. Zero-downtime deployments

## 🛠 Troubleshooting

### Common Issues:
1. **Build Failures**: Check Node.js version (requires 18+)
2. **Database Connection**: Verify DATABASE_URL format
3. **Environment Variables**: Ensure all required vars are set
4. **Port Issues**: Railway automatically sets PORT variable

### Debug Commands:
```bash
# Check logs
railway logs

# Connect to service
railway connect

# Run migrations
railway run npx prisma migrate deploy
```

## 📈 Performance Optimization

- Static assets are optimized
- Images are unoptimized for Railway compatibility
- Database queries are optimized
- Caching headers are configured

## 🔒 Security

- Security headers configured
- Environment variables secured
- Database credentials protected
- HTTPS enforced by Railway
