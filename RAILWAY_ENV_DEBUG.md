# 🔧 Railway Environment Variables Debug Guide

## 🎯 What Was Fixed

### **Problem:**
- Frontend was calling `http://localhost:4001` instead of Railway backend URL
- Backend CORS was configured for `http://localhost:3000` instead of Railway frontend URL
- Images from Cloudinary were not loading (NOW FIXED ✅)

### **Root Cause:**
Railway's Nixpacks wasn't properly injecting `NEXT_PUBLIC_*` environment variables during the Next.js build phase. These variables **MUST** be available at build time because Next.js embeds them into the compiled JavaScript bundle.

### **Solution Implemented:**
1. ✅ Created centralized environment configuration (`frontend/src/config/env.ts`)
2. ✅ Updated all components to use centralized config
3. ✅ Added build-time logging in `next.config.ts` to verify variables
4. ✅ Enhanced `nixpacks.toml` with detailed environment variable logging
5. ✅ Explicitly exposed variables in `next.config.ts` → `env` section

---

## 🚨 CRITICAL: What You MUST Do Now

### **Step 1: Verify Railway Environment Variables**

#### **Frontend Service Variables:**

Go to Railway Dashboard → **Frontend Service** → **Variables** tab

**Required variables (case-sensitive):**

```bash
NEXT_PUBLIC_API_URL=https://meticulous-creativity-production.up.railway.app
NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/dm2sd9t1n/image/upload
NODE_ENV=production
PORT=8080
```

⚠️ **CRITICAL CHECKS:**
- [ ] `NEXT_PUBLIC_API_URL` starts with `https://` (not just the domain)
- [ ] No trailing slashes on any URLs
- [ ] Variable names are EXACTLY as shown (case-sensitive)
- [ ] All variables are set in the **Service Variables** tab (not Shared Variables)

#### **Backend Service Variables:**

Go to Railway Dashboard → **Backend Service** → **Variables** tab

**Required variables:**

```bash
DATABASE_URL=(Your PostgreSQL connection string from Railway)
FRONTEND_URL=https://skylensrepo-production.up.railway.app
JWT_SECRET=(Your secure random string - at least 32 characters)
NODE_ENV=production
```

⚠️ **CRITICAL CHECKS:**
- [ ] `FRONTEND_URL` matches your frontend Railway URL **exactly**
- [ ] `FRONTEND_URL` starts with `https://`
- [ ] No trailing slashes
- [ ] `JWT_SECRET` is a secure random string (not "your-super-secret-jwt-key-here")
- [ ] `DATABASE_URL` is connected to your PostgreSQL database

---

### **Step 2: Redeploy Both Services (IMPORTANT)**

The code has been pushed. Now you MUST trigger redeployments:

#### **Redeploy Backend:**
1. Go to Railway → **Backend Service** → **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for deployment to complete (~2 minutes)
4. **Check logs** for:
   ```
   🔒 CORS configured for origin: https://skylensrepo-production.up.railway.app
   SkyLens backend running on 0.0.0.0:4001
   ```

#### **Redeploy Frontend:**
1. Go to Railway → **Frontend Service** → **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for build to complete (~3-5 minutes)
4. **CRITICAL: Check build logs** for these sections:

**Look for in the build logs:**

```
🔍 ================================================
🔍 Railway Build Environment Check
🔍 ================================================
NODE_ENV: production
NEXT_PUBLIC_API_URL: https://meticulous-creativity-production.up.railway.app
NEXT_PUBLIC_IMAGE_BASE_URL: https://res.cloudinary.com/dm2sd9t1n/image/upload
🔍 ================================================
```

**AND later in the logs:**

```
🔍 Next.js Build Config - Environment Variables:
   NEXT_PUBLIC_API_URL: https://meticulous-creativity-production.up.railway.app
   NEXT_PUBLIC_IMAGE_BASE_URL: https://res.cloudinary.com/dm2sd9t1n/image/upload
```

⚠️ **If you see "NOT SET" instead of the URLs, the Railway variables aren't configured correctly!**

---

### **Step 3: Verify the Fix**

After **BOTH** services have finished deploying:

1. **Clear browser cache and hard refresh:**
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` or `Cmd+Shift+R`
   - Or use Incognito/Private mode

2. **Open the frontend** (`https://skylensrepo-production.up.railway.app`)

3. **Open browser console** (Press `F12` → Console tab)

4. **Look for these logs:**
   ```
   🔧 Environment Configuration:
      API_URL: https://meticulous-creativity-production.up.railway.app
      IMAGE_BASE_URL: https://res.cloudinary.com/dm2sd9t1n/image/upload
   ```

5. **Try signing up** with a test account

6. **Check Network tab** (F12 → Network tab):
   - The signup request should go to: `https://meticulous-creativity-production.up.railway.app/api/auth/signup`
   - **NOT** `http://localhost:4001/api/auth/signup`
   - Status should be `200 OK` or `201 Created`
   - **NO CORS errors**

7. **Verify images** load from Cloudinary on the homepage

---

## 🐛 Troubleshooting

### **Issue: Frontend still calls localhost:4001**

**Diagnosis:**
```
POST http://localhost:4001/api/auth/signup
```

**Possible Causes:**

1. **Environment variables not set in Railway**
   - Solution: Double-check Railway Frontend Variables tab
   - Ensure `NEXT_PUBLIC_API_URL` exists and starts with `https://`

2. **Frontend not rebuilt after setting variables**
   - Solution: Redeploy the frontend service
   - Wait for build to complete fully

3. **Browser cache**
   - Solution: Hard refresh (`Ctrl+Shift+R`) or use Incognito mode

4. **Variables set but build logs show "NOT SET"**
   - Solution: Variables might be in wrong place (Shared Variables vs Service Variables)
   - Move them to **Service Variables** for the frontend service

**Verification Steps:**
1. Check Railway frontend build logs for the environment check section
2. Console should show correct API_URL (not localhost)
3. Network tab should show requests to Railway backend URL

---

### **Issue: CORS error persists**

**Diagnosis:**
```
Access-Control-Allow-Origin header has a value 'http://localhost:3000'
```

**Possible Causes:**

1. **Backend FRONTEND_URL not set correctly**
   - Solution: Set `FRONTEND_URL` in Railway backend variables
   - Must be: `https://skylensrepo-production.up.railway.app`

2. **Backend not redeployed after changing FRONTEND_URL**
   - Solution: Redeploy backend service
   - Check logs for: `🔒 CORS configured for origin: https://skylensrepo-production.up.railway.app`

3. **Frontend and backend URLs don't match exactly**
   - Solution: Ensure no trailing slashes, correct protocol (https://)

**Verification Steps:**
1. Check backend logs for CORS configuration line
2. Should show frontend's Railway URL, not localhost
3. Test OPTIONS request in Network tab (preflight)

---

### **Issue: Build logs show variables as "NOT SET"**

**Diagnosis:**
```
NEXT_PUBLIC_API_URL: NOT SET
```

**This is the smoking gun! Variables aren't being passed to the build.**

**Solutions:**

1. **Check variable names are exact:**
   - Must be: `NEXT_PUBLIC_API_URL` (not `NEXT_PUBLIC_API_URL=...` or any variation)
   - Case-sensitive!

2. **Check variables are in Service Variables, not Shared Variables:**
   - Go to Frontend Service → Variables
   - Should see the variables listed there

3. **Check for typos in variable names:**
   - Copy-paste from this guide to avoid typos

4. **Try deleting and re-adding the variables:**
   - Sometimes Railway caches variable values
   - Delete the variable, save, then re-add it

5. **Check Railway service configuration:**
   - Ensure service is pointing to the `frontend` directory
   - Check `railway.json` or `nixpacks.toml` aren't overriding variables

---

### **Issue: Signup works but images don't load**

**Diagnosis:**
Images return 404 from Cloudinary

**Solutions:**

1. **Check Cloudinary URL is correct:**
   ```
   NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/dm2sd9t1n/image/upload
   ```

2. **Verify images exist on Cloudinary:**
   - Go to https://cloudinary.com
   - Check that images are in the `/skylens/` folder

3. **Check browser console for image errors:**
   - Press F12 → Console
   - Look for 404 errors on image URLs

---

## 📊 How to Read Railway Logs

### **Frontend Build Logs - What to Look For:**

✅ **GOOD (Variables are set):**
```
🔍 ================================================
🔍 Railway Build Environment Check
🔍 ================================================
NODE_ENV: production
NEXT_PUBLIC_API_URL: https://meticulous-creativity-production.up.railway.app
NEXT_PUBLIC_IMAGE_BASE_URL: https://res.cloudinary.com/dm2sd9t1n/image/upload
🔍 ================================================

...

🔍 Next.js Build Config - Environment Variables:
   NEXT_PUBLIC_API_URL: https://meticulous-creativity-production.up.railway.app
   NEXT_PUBLIC_IMAGE_BASE_URL: https://res.cloudinary.com/dm2sd9t1n/image/upload

...

✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
```

❌ **BAD (Variables NOT set):**
```
🔍 ================================================
🔍 Railway Build Environment Check
🔍 ================================================
NODE_ENV: production
NEXT_PUBLIC_API_URL: NOT SET
NEXT_PUBLIC_IMAGE_BASE_URL: NOT SET
🔍 ================================================
```

→ **This means Railway variables aren't being passed during build!**
→ **Go back to Step 1 and verify variable configuration**

---

### **Backend Logs - What to Look For:**

✅ **GOOD:**
```
Prisma schema loaded from prisma/schema.prisma
✔ Generated Prisma Client
🔒 CORS configured for origin: https://skylensrepo-production.up.railway.app
SkyLens backend running on 0.0.0.0:4001
```

❌ **BAD:**
```
🔒 CORS configured for origin: http://localhost:3000
```

→ **This means `FRONTEND_URL` isn't set in backend variables**
→ **Add it and redeploy backend**

---

## 🎯 Quick Checklist

Use this checklist to ensure everything is configured correctly:

### **Railway Configuration:**
- [ ] Frontend `NEXT_PUBLIC_API_URL` set with `https://`
- [ ] Frontend `NEXT_PUBLIC_IMAGE_BASE_URL` set
- [ ] Backend `FRONTEND_URL` set with `https://`
- [ ] Backend `JWT_SECRET` set (secure random string)
- [ ] Backend `DATABASE_URL` connected to PostgreSQL
- [ ] All variables in **Service Variables** (not Shared)

### **Deployment:**
- [ ] Backend redeployed after setting variables
- [ ] Frontend redeployed after setting variables
- [ ] Backend logs show correct CORS origin
- [ ] Frontend build logs show correct environment variables

### **Testing:**
- [ ] Browser cache cleared / hard refresh done
- [ ] Browser console shows correct API_URL (not localhost)
- [ ] Network tab shows requests to Railway backend URL
- [ ] Sign up works without CORS errors
- [ ] Images load from Cloudinary

---

## 🆘 Still Not Working?

If you've followed all the steps and it's still not working:

### **Take Screenshots of:**

1. **Railway Frontend Variables tab** (showing all variables)
2. **Railway Backend Variables tab** (showing all variables)
3. **Frontend build logs** (specifically the "Railway Build Environment Check" section)
4. **Frontend build logs** (specifically the "Next.js Build Config" section)
5. **Backend runtime logs** (specifically the "CORS configured" line)
6. **Browser console** (showing the Environment Configuration logs)
7. **Browser Network tab** (showing the failed API request)

### **Run the Smoke Test:**

```bash
./smoke_test.sh
```

This will automatically test all endpoints and report what's working and what's broken.

---

## 📚 Technical Details

### **Why NEXT_PUBLIC_* Variables Are Special:**

Next.js has a special convention for client-side environment variables:

1. **Variables starting with `NEXT_PUBLIC_`** are exposed to the browser
2. They are **embedded at BUILD time**, not runtime
3. This means they must be available when running `npm run build`
4. Railway/Nixpacks must pass these variables to the build phase

### **Why `env` in next.config.ts:**

The `env` property in `next.config.ts` explicitly tells Next.js:
1. Which environment variables to embed in the build
2. What fallback values to use if they're not set
3. Makes them available via `process.env.NEXT_PUBLIC_*` in client code

### **Why Centralized Config:**

The new `frontend/src/config/env.ts` file:
1. Provides a single source of truth for all environment variables
2. Makes it easier to debug (all env vars logged in one place)
3. Allows for runtime fallbacks if build-time vars aren't available
4. Improves type safety and maintainability

---

## ✅ Success Indicators

When everything is working correctly:

1. **Build logs show:**
   ```
   NEXT_PUBLIC_API_URL: https://meticulous-creativity-production.up.railway.app
   NEXT_PUBLIC_IMAGE_BASE_URL: https://res.cloudinary.com/dm2sd9t1n/image/upload
   ```

2. **Browser console shows:**
   ```
   🔧 Environment Configuration:
      API_URL: https://meticulous-creativity-production.up.railway.app
      IMAGE_BASE_URL: https://res.cloudinary.com/dm2sd9t1n/image/upload
   ```

3. **Backend logs show:**
   ```
   🔒 CORS configured for origin: https://skylensrepo-production.up.railway.app
   ```

4. **Network tab shows:**
   - All API requests go to `https://meticulous-creativity-production.up.railway.app`
   - All image requests go to `https://res.cloudinary.com/dm2sd9t1n`
   - No CORS errors
   - 200/201 status codes

5. **Functionality:**
   - Homepage loads with all images visible
   - Sign up works
   - Login works
   - Dashboard loads after login
   - Orders can be created

---

**Last Updated:** October 3, 2025  
**Status:** Code pushed - Awaiting Railway redeploy  
**Next Step:** Verify Railway variables and redeploy both services

