# 🚀 Railway Deployment Fix Guide

## 🔍 Root Cause Analysis

The issue was that **Railway's Nixpacks doesn't automatically inject `NEXT_PUBLIC_*` environment variables during the Next.js build phase**. Next.js embeds these variables at BUILD time, not runtime, so they must be explicitly exposed in `next.config.ts`.

---

## ✅ What Was Fixed

### 1. **Updated `next.config.ts`**
   - Explicitly exposed `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_IMAGE_BASE_URL` in the `env` section
   - This ensures Railway Nixpacks passes these variables during build

### 2. **Enhanced `nixpacks.toml`**
   - Added debug logging to verify environment variables during build
   - Added `NODE_ENV = "production"` to variables section

---

## 🎯 CRITICAL: Verify Railway Environment Variables

### **Frontend Service Variables** (Must have `https://`)

Go to your **Frontend service** → **Variables** tab and verify:

```bash
NEXT_PUBLIC_API_URL = https://meticulous-creativity-production.up.railway.app
NEXT_PUBLIC_IMAGE_BASE_URL = https://res.cloudinary.com/dm2sd9t1n/image/upload
NODE_ENV = production
PORT = 8080
```

⚠️ **IMPORTANT**: The `NEXT_PUBLIC_API_URL` MUST start with `https://` (not just the domain name)!

---

### **Backend Service Variables**

Go to your **Backend service** → **Variables** tab and verify:

```bash
DATABASE_URL = (Your Railway PostgreSQL connection string)
FRONTEND_URL = https://skylensrepo-production.up.railway.app
JWT_SECRET = (Your secure random string)
NODE_ENV = production
PORT = (Leave empty - Railway will set it automatically)
```

⚠️ **IMPORTANT**: The `FRONTEND_URL` MUST match your frontend's Railway URL exactly (with `https://`)!

---

## 📋 Step-by-Step Fix Instructions

### **Step 1: Update Frontend Environment Variables**

1. Go to Railway Dashboard → **Frontend Service** → **Variables**
2. Click on `NEXT_PUBLIC_API_URL`
3. Change value to: `https://meticulous-creativity-production.up.railway.app`
4. Click **Save** or **Update**
5. Verify `NEXT_PUBLIC_IMAGE_BASE_URL` is set to: `https://res.cloudinary.com/dm2sd9t1n/image/upload`

### **Step 2: Update Backend Environment Variables**

1. Go to Railway Dashboard → **Backend Service** → **Variables**
2. Verify or add `FRONTEND_URL` = `https://skylensrepo-production.up.railway.app`
3. Verify `JWT_SECRET` is set to a secure random string
4. Verify `DATABASE_URL` is connected to your PostgreSQL database

### **Step 3: Force Redeploy Both Services**

The code has been pushed, now trigger redeployments:

**Backend:**
1. Go to **Backend Service** → **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for deployment to complete (~2-3 minutes)
4. Check logs for: `🔒 CORS configured for origin: https://skylensrepo-production.up.railway.app`

**Frontend:**
1. Go to **Frontend Service** → **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for build to complete (~3-5 minutes)
4. **CRITICAL**: Check build logs for these debug lines:
   ```
   🔍 Build environment check:
   NEXT_PUBLIC_API_URL=https://meticulous-creativity-production.up.railway.app
   NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/dm2sd9t1n/image/upload
   ```

### **Step 4: Verify the Fix**

1. After both services are deployed, **hard refresh your browser**:
   - **Chrome/Edge**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - **Firefox**: `Ctrl+F5` or `Cmd+Shift+R`

2. Open browser console (F12) and check for:
   ```
   🔧 AuthContext - API_URL: https://meticulous-creativity-production.up.railway.app
   ```

3. Try signing up with a test account

4. Check Network tab (F12 → Network):
   - The signup request should go to: `https://meticulous-creativity-production.up.railway.app/api/auth/signup`
   - Status should be `200 OK` or `201 Created`
   - **NO CORS errors**

5. Check if Cloudinary images load on the homepage

---

## 🐛 Troubleshooting

### **Issue: Frontend still calls localhost:4001**

**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` in Railway has `https://` prefix
2. Check frontend build logs for the debug output showing correct URL
3. Clear browser cache and hard refresh
4. Verify in browser console: the `API_URL` log should show the Railway URL

### **Issue: CORS error persists**

**Solution:**
1. Verify backend's `FRONTEND_URL` matches frontend's Railway URL exactly
2. Check backend logs for: `🔒 CORS configured for origin: <your-frontend-url>`
3. Ensure both URLs use `https://` (not `http://`)
4. Redeploy backend after changing `FRONTEND_URL`

### **Issue: Images not loading from Cloudinary**

**Solution:**
1. Verify `NEXT_PUBLIC_IMAGE_BASE_URL` is set in Railway frontend variables
2. Check if it's exactly: `https://res.cloudinary.com/dm2sd9t1n/image/upload`
3. Verify the Cloudinary images exist by visiting the direct URL
4. Check browser Network tab for 404 errors on image URLs

### **Issue: Build fails with "Cannot find module 'tailwindcss'"**

**Solution:**
1. The `nixpacks.toml` is configured to install devDependencies
2. If issue persists, verify `frontend/package.json` has moved build tools to `dependencies`
3. Check that `.npmrc` has `production=false`

---

## 📊 How to Read Railway Build Logs

### **Frontend Build Logs - What to Look For:**

✅ **GOOD:**
```
🔍 Build environment check:
NEXT_PUBLIC_API_URL=https://meticulous-creativity-production.up.railway.app
NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/dm2sd9t1n/image/upload
...
✓ Compiled successfully
```

❌ **BAD:**
```
🔍 Build environment check:
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_IMAGE_BASE_URL=
```
→ This means Railway variables aren't being passed. Double-check they're set in the Variables tab.

### **Backend Build Logs - What to Look For:**

✅ **GOOD:**
```
🔒 CORS configured for origin: https://skylensrepo-production.up.railway.app
SkyLens backend running on 0.0.0.0:4001
```

❌ **BAD:**
```
🔒 CORS configured for origin: http://localhost:3000
```
→ This means `FRONTEND_URL` isn't set. Add it to backend variables.

---

## 🎯 Quick Test Checklist

After redeploying both services:

- [ ] Backend logs show correct CORS origin (frontend Railway URL)
- [ ] Frontend build logs show correct `NEXT_PUBLIC_API_URL` during build
- [ ] Browser console shows correct API URL (not localhost)
- [ ] Sign up works without CORS errors
- [ ] Images load from Cloudinary
- [ ] Network tab shows requests going to Railway backend URL

---

## 🆘 Still Having Issues?

If the above steps don't work:

1. **Take screenshots** of:
   - Frontend Variables tab in Railway
   - Backend Variables tab in Railway
   - Frontend build logs (specifically the "Build environment check" section)
   - Backend logs (specifically the "CORS configured" line)
   - Browser console errors
   - Browser Network tab showing failed request

2. **Share these details** and we'll debug further!

---

## 📚 Why This Happened

**Next.js Environment Variables:**
- `NEXT_PUBLIC_*` variables are embedded at **BUILD time**, not runtime
- Railway's Nixpacks doesn't automatically expose them during build
- Solution: Explicitly declare them in `next.config.ts` → `env` section

**CORS Policy:**
- Backend must explicitly allow the frontend's origin
- Wildcard `*` doesn't work when using `credentials: true`
- Solution: Set `FRONTEND_URL` in backend to match frontend's Railway URL

**Cloudinary Images:**
- Image URLs are constructed using `NEXT_PUBLIC_IMAGE_BASE_URL`
- Must be set during build so the URLs are correct in the generated HTML
- Solution: Ensure variable is set in Railway before building

---

## 🎉 Success Indicators

When everything works correctly:

1. **Homepage loads** with Cloudinary images visible
2. **Sign up form** works without errors
3. **Browser console** shows:
   ```
   🔧 AuthContext - API_URL: https://meticulous-creativity-production.up.railway.app
   ```
4. **Network tab** shows API requests going to Railway backend URL (not localhost)
5. **No CORS errors** in console
6. **User dashboard** loads after successful login

---

**Last Updated:** October 3, 2025  
**Status:** Fixes pushed to main branch - Ready for Railway redeploy

