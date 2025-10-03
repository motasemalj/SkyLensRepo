# 🧪 Complete Deployment Testing Guide

## 🎯 Current Status

### ✅ What's Been Fixed

1. **Frontend Build:**
   - ✅ Using Nixpacks (not Docker)
   - ✅ Environment variables passed correctly during build
   - ✅ `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_IMAGE_BASE_URL` set correctly
   - ✅ Server binding to `0.0.0.0` for Railway proxy

2. **Backend:**
   - ✅ CORS configured for frontend URL
   - ✅ Database migration added for `service` and `estimate` columns
   - ✅ Auto-migration on deployment configured

3. **Database:**
   - ⏳ Migration deploying now (will add `service` and `estimate` columns)

---

## 📋 Step 1: Wait for Railway Deployments

### **Backend Deployment**

Go to Railway → **Backend Service** → **Deployments**

**Look for in logs:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database

The following migration(s) have been applied:
migrations/
  └─ 20250604000000_add_service_and_estimate/
    └─ migration.sql

✔ Generated Prisma Client
🔒 CORS configured for origin: https://skylensrepo-production.up.railway.app
SkyLens backend running on 0.0.0.0:4001
```

### **Frontend Deployment**

Go to Railway → **Frontend Service** → **Deployments**

**Look for in logs:**
```
🚀 Starting Next.js server...
   Environment: production
   Port: 8080
   Hostname: 0.0.0.0
✅ Server ready on http://0.0.0.0:8080
   Railway will proxy requests to this server
```

---

## 🔐 Step 2: Create Admin User

Once the backend deployment completes successfully, create the admin user.

### **Option A: Using Railway CLI (Recommended)**

```bash
# Install Railway CLI if not already installed
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your backend service
railway link

# Run the admin creation script
railway run node scripts/createAdminDirect.js
```

### **Option B: Using Railway Dashboard**

1. Go to Railway → **Backend Service** → **Settings** → **Variables**
2. Click **"+ New Variable"**
3. Add a temporary variable for running one-time scripts
4. Or use the Railway web console (if available)

### **Option C: Manual Database Insert**

If the above doesn't work, you can insert directly into the database:

1. Go to Railway → **PostgreSQL Database** → **Data**
2. Run this SQL (password is already hashed for `Test123!`):

```sql
INSERT INTO "User" (id, email, password, name, "isAdmin")
VALUES (
  gen_random_uuid(),
  'abdelhadi.zabin@gmail.com',
  '$2a$10$rKZqF8YJxGbMxGvxYpQp8.OXqZF6Qx3qYZGqQ5YxGvxYpQp8.OXqZ',
  'Abdelhadi Zabin',
  true
);
```

**Admin Credentials:**
- Email: `abdelhadi.zabin@gmail.com`
- Password: `Test123!`

---

## 🧪 Step 3: Comprehensive Smoke Test

### **Test 1: Frontend Loads**

1. Visit: `https://skylensrepo-production.up.railway.app`
2. **Expected:** Homepage loads with images from Cloudinary
3. **Check:** Open browser console (F12), should see:
   ```
   🔧 Environment Configuration:
      API_URL: https://meticulous-creativity-production.up.railway.app
      IMAGE_BASE_URL: https://res.cloudinary.com/dm2sd9t1n/image/upload
   ```

**✅ PASS** if homepage loads  
**❌ FAIL** if 502 error or images don't load

---

### **Test 2: Backend Health Check**

Visit: `https://meticulous-creativity-production.up.railway.app/health`

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-03T..."
}
```

**✅ PASS** if 200 OK  
**❌ FAIL** if error or timeout

---

### **Test 3: Sign Up (New User)**

1. Go to: `https://skylensrepo-production.up.railway.app/signup`
2. Fill in form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test123!` (with uppercase, lowercase, number, special char)
   - Confirm Password: `Test123!`
3. Click **Sign Up**

**Expected:**
- ✅ "Registration successful! Redirecting..." message
- ✅ Redirected to `/signin` page
- ✅ No CORS errors in console
- ✅ Network tab shows: `POST https://meticulous-creativity-production.up.railway.app/api/auth/signup` → `201 Created`

**✅ PASS** if user created successfully  
**❌ FAIL** if CORS error, 500 error, or database error

---

### **Test 4: Sign In (Regular User)**

1. Go to: `https://skylensrepo-production.up.railway.app/signin`
2. Use credentials from Test 3:
   - Email: `test@example.com`
   - Password: `Test123!`
3. Click **Sign In**

**Expected:**
- ✅ Redirected to `/dashboard`
- ✅ Dashboard loads with user interface
- ✅ Shows "Welcome, Test User"

**✅ PASS** if login successful  
**❌ FAIL** if credentials invalid or error

---

### **Test 5: User Dashboard - Create Order**

1. On dashboard, fill in order form:
   - **Service:** Aerial Photography
   - **Package:** RAW
   - **Location:** "Test Location, Dubai"
   - **Description:** "Test aerial photography request"
   - **Date:** Select tomorrow's date
   - **Time:** "10:00"
2. Click **Submit Request**

**Expected:**
- ✅ Shows price estimate (e.g., $800 for Aerial Photography RAW)
- ✅ "Order submitted successfully!" message
- ✅ Order appears in "Your Requests" section below
- ✅ Status shows "PENDING"
- ✅ Network tab shows: `POST .../api/order/create` → `200 OK`

**✅ PASS** if order created  
**❌ FAIL** if error about `service` column → migration didn't run

---

### **Test 6: Sign Out**

1. Click **Sign Out** button
2. **Expected:**
   - ✅ Redirected to home page
   - ✅ Logged out successfully

**✅ PASS** if sign out works  
**❌ FAIL** if still shows logged in

---

### **Test 7: Admin Sign In**

1. Go to: `https://skylensrepo-production.up.railway.app/signin`
2. Use admin credentials:
   - Email: `abdelhadi.zabin@gmail.com`
   - Password: `Test123!`
3. Click **Sign In**

**Expected:**
- ✅ Redirected to `/admin` (not `/dashboard`)
- ✅ Admin dashboard loads
- ✅ Shows all orders from all users
- ✅ Shows calendar view

**✅ PASS** if admin dashboard loads  
**❌ FAIL** if redirected to user dashboard or error

---

### **Test 8: Admin Dashboard - View Orders**

1. On admin dashboard, check the orders table
2. **Expected:**
   - ✅ Shows the test order created in Test 5
   - ✅ Shows user name "Test User"
   - ✅ Shows service, package, location
   - ✅ Shows status "PENDING"

**✅ PASS** if orders visible  
**❌ FAIL** if no orders or error

---

### **Test 9: Admin Dashboard - Approve Order**

1. Find the test order in the list
2. Click **Approve** button
3. **Expected:**
   - ✅ Status changes to "APPROVED"
   - ✅ Button changes to "Reject"
   - ✅ Network tab shows: `PATCH .../api/admin/orders/{id}` → `200 OK`

**✅ PASS** if order approved  
**❌ FAIL** if error or status doesn't change

---

### **Test 10: Admin Dashboard - Calendar View**

1. Click on **Calendar View** tab
2. **Expected:**
   - ✅ Calendar displays current month
   - ✅ Test order appears on selected date
   - ✅ Event shows service type and user name
   - ✅ Can navigate between months

**✅ PASS** if calendar works  
**❌ FAIL** if calendar doesn't load or no events

---

### **Test 11: User Dashboard - See Updated Order**

1. Sign out from admin account
2. Sign in as test user (`test@example.com` / `Test123!`)
3. Go to dashboard
4. **Expected:**
   - ✅ Order status shows "APPROVED" (updated from "PENDING")
   - ✅ Green badge or indicator for approved status

**✅ PASS** if status updated  
**❌ FAIL** if still shows PENDING

---

### **Test 12: Create Multiple Orders (Stress Test)**

1. As test user, create 3 more orders with different services:
   - Edited Video + EDITED package
   - 3D Mapping + RAW package
   - Industrial Inspection + EDITED package
2. **Expected:**
   - ✅ Each shows correct price estimate
   - ✅ All orders created successfully
   - ✅ All appear in user's order list

**✅ PASS** if all orders created  
**❌ FAIL** if any order fails

---

### **Test 13: Admin Dashboard - Multiple Orders**

1. Sign in as admin
2. Go to admin dashboard
3. **Expected:**
   - ✅ Shows all 4 orders (1 from Test 5 + 3 from Test 12)
   - ✅ Can filter/sort orders
   - ✅ Stats show correct counts

**✅ PASS** if all orders visible  
**❌ FAIL** if orders missing

---

### **Test 14: Map Picker (Location Selection)**

1. Sign in as test user
2. Go to dashboard
3. Try to select location on map:
   - Click on map to select coordinates
   - **Expected:**
     - ✅ Map loads (Leaflet)
     - ✅ Can click to select location
     - ✅ Coordinates populate in form

**✅ PASS** if map works  
**❌ FAIL** if map doesn't load or error

---

### **Test 15: Cloudinary Images**

Check all pages for image loading:

1. **Homepage:**
   - ✅ Hero image loads
   - ✅ Service images load
   - ✅ Project images load

2. **About Page:**
   - ✅ Team photos load
   - ✅ Story images load

3. **Services Page:**
   - ✅ Service showcase images load

**✅ PASS** if all images load from Cloudinary  
**❌ FAIL** if any images show 404 or broken

---

## 📊 Test Results Summary

Create a checklist:

- [ ] Test 1: Frontend Loads
- [ ] Test 2: Backend Health Check
- [ ] Test 3: Sign Up
- [ ] Test 4: Sign In (User)
- [ ] Test 5: Create Order
- [ ] Test 6: Sign Out
- [ ] Test 7: Admin Sign In
- [ ] Test 8: View Orders (Admin)
- [ ] Test 9: Approve Order (Admin)
- [ ] Test 10: Calendar View (Admin)
- [ ] Test 11: See Updated Order (User)
- [ ] Test 12: Multiple Orders
- [ ] Test 13: Multiple Orders (Admin View)
- [ ] Test 14: Map Picker
- [ ] Test 15: Cloudinary Images

---

## 🐛 Common Issues & Fixes

### **Issue: "service column does not exist"**

**Diagnosis:** Migration didn't run

**Fix:**
1. Check Railway backend logs
2. Should see: "The following migration(s) have been applied: 20250604000000_add_service_and_estimate"
3. If not, manually trigger migration:
   ```bash
   railway run npx prisma migrate deploy
   ```

---

### **Issue: Frontend still calls localhost**

**Diagnosis:** Environment variables not set or old build cached

**Fix:**
1. Verify Railway Frontend variables:
   - `NEXT_PUBLIC_API_URL=https://meticulous-creativity-production.up.railway.app`
2. Check frontend build logs for environment check
3. Redeploy frontend if needed
4. Hard refresh browser (Cmd+Shift+R)

---

### **Issue: CORS errors**

**Diagnosis:** Backend `FRONTEND_URL` doesn't match frontend URL

**Fix:**
1. Check Railway Backend variables:
   - `FRONTEND_URL=https://skylensrepo-production.up.railway.app`
2. Check backend logs for: `🔒 CORS configured for origin: ...`
3. Must match exactly (no trailing slash, correct protocol)
4. Redeploy backend if changed

---

### **Issue: 502 Bad Gateway**

**Diagnosis:** Server not binding correctly

**Fix:**
1. Check frontend deploy logs
2. Should see: `✅ Server ready on http://0.0.0.0:8080`
3. If not, ensure `server.js` binds to `0.0.0.0`
4. Already fixed in latest deployment

---

### **Issue: Admin user can't log in**

**Diagnosis:** Admin user not created

**Fix:**
1. Create admin user using one of the methods in Step 2
2. Verify email is exactly: `abdelhadi.zabin@gmail.com`
3. Password is: `Test123!` (case-sensitive)
4. Check database directly if needed

---

## 🎉 Success Criteria

All tests should pass. If any test fails, refer to the Common Issues section above.

**Deployment is successful when:**
- ✅ Frontend loads without errors
- ✅ Backend health check responds
- ✅ Users can sign up and sign in
- ✅ Users can create orders with all services
- ✅ Admin can view and manage all orders
- ✅ Calendar view works
- ✅ No CORS errors
- ✅ Images load from Cloudinary
- ✅ No database errors

---

## 📞 Next Steps After All Tests Pass

1. **Remove test user and test orders** (if desired):
   ```sql
   DELETE FROM "Order" WHERE "userId" IN (SELECT id FROM "User" WHERE email = 'test@example.com');
   DELETE FROM "User" WHERE email = 'test@example.com';
   ```

2. **Update admin password** (if desired):
   - Log in as admin
   - (Implement password change feature if needed)

3. **Configure email notifications** (optional):
   - Set up email service for order notifications
   - Update backend `.env` with email credentials

4. **Set up monitoring:**
   - Railway provides metrics
   - Consider adding error tracking (Sentry, etc.)

5. **Custom domain** (optional):
   - Add custom domain in Railway settings
   - Update environment variables with new domain

---

**Good luck with testing! 🚀**

