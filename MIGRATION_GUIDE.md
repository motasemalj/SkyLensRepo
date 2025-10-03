# Migration Guide: Old System → New System

## 🔄 Overview

This guide will help you migrate from the old booking system to the new enhanced system with service types and estimates.

## ⚠️ Important Changes

### Database Schema Changes

1. **New Field: `service`** (Required)
   - Type: `ServiceType` enum
   - Values: `AERIAL_PHOTOGRAPHY`, `EDITED_VIDEO`, `MAPPING_3D`, `INDUSTRIAL_INSPECTION`

2. **New Field: `estimate`** (Optional)
   - Type: `Float`
   - Stores the calculated price estimate

### Breaking Changes

- Orders now require a `service` field in addition to `package`
- The old `package` field still exists but now works alongside `service`
- Frontend form has been completely redesigned

## 🚀 Migration Steps

### Step 1: Backup Your Database

```bash
# For PostgreSQL
pg_dump your_database > backup_$(date +%Y%m%d).sql

# Or use your preferred backup method
```

### Step 2: Update Your Environment

Make sure you have the latest dependencies:

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 3: Run Database Migration

**Option A: If you have a DATABASE_URL configured**

```bash
cd backend
npx prisma migrate dev --name add_service_type_and_estimate
```

**Option B: If migration fails (existing data without service field)**

You'll need to handle existing orders. Here's a SQL script to migrate existing data:

```sql
-- First, add a default service type to existing orders
-- (You may want to customize this based on your data)

UPDATE "Order"
SET service = 'AERIAL_PHOTOGRAPHY'
WHERE service IS NULL;

-- Or map based on package type
UPDATE "Order"
SET service = CASE
  WHEN package = 'RAW' THEN 'AERIAL_PHOTOGRAPHY'
  WHEN package = 'EDITED' THEN 'EDITED_VIDEO'
  ELSE 'AERIAL_PHOTOGRAPHY'
END
WHERE service IS NULL;

-- Add estimates to existing orders based on service and package
UPDATE "Order"
SET estimate = CASE
  WHEN service = 'AERIAL_PHOTOGRAPHY' AND package = 'RAW' THEN 800
  WHEN service = 'AERIAL_PHOTOGRAPHY' AND package = 'EDITED' THEN 1200
  WHEN service = 'EDITED_VIDEO' AND package = 'RAW' THEN 1500
  WHEN service = 'EDITED_VIDEO' AND package = 'EDITED' THEN 2250
  WHEN service = 'MAPPING_3D' AND package = 'RAW' THEN 2500
  WHEN service = 'MAPPING_3D' AND package = 'EDITED' THEN 3750
  WHEN service = 'INDUSTRIAL_INSPECTION' AND package = 'RAW' THEN 3000
  WHEN service = 'INDUSTRIAL_INSPECTION' AND package = 'EDITED' THEN 4500
  ELSE 1000
END
WHERE estimate IS NULL;
```

**Option C: Fresh Start (if you don't have important data)**

```bash
cd backend

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or just push the new schema
npx prisma db push --force-reset
```

### Step 4: Generate Prisma Client

```bash
cd backend
npx prisma generate
```

### Step 5: Restart Your Servers

```bash
# Backend
cd backend
npm run dev

# Frontend (in a new terminal)
cd frontend
npm run dev
```

## 🧪 Testing the Migration

### 1. Test Authentication
- [ ] Sign up a new user
- [ ] Sign in with existing credentials
- [ ] Check token persistence after refresh

### 2. Test User Dashboard
- [ ] Create a new booking with all services
- [ ] Verify price calculations
- [ ] Check map picker functionality
- [ ] Submit a booking
- [ ] View booking history

### 3. Test Admin Dashboard
- [ ] Access admin dashboard (sign in with admin account)
- [ ] View all orders in table view
- [ ] Switch to calendar view
- [ ] Approve/reject orders
- [ ] Check status filters
- [ ] Verify analytics stats

### 4. Create Test Admin User

If you don't have an admin user, create one:

```bash
# Connect to your database
psql your_database

# Create admin user (replace with your details)
INSERT INTO "User" (id, email, password, name, "isAdmin")
VALUES (
  gen_random_uuid(),
  'admin@skylens.com',
  -- Password: Admin123! (hashed with bcrypt)
  '$2a$10$YourHashedPasswordHere',
  'Admin User',
  true
);
```

Or use a signup endpoint and then manually update:

```sql
UPDATE "User"
SET "isAdmin" = true
WHERE email = 'youradmin@email.com';
```

## 🔧 Configuration Updates

### Backend Environment Variables

Your `backend/.env` should have:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/skylens"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=4001
HOST="0.0.0.0"
FRONTEND_URL="http://localhost:3000"
```

### Frontend Environment Variables

Your `frontend/.env.local` should have:

```env
NEXT_PUBLIC_API_URL="http://localhost:4001"
```

## 📋 Verification Checklist

Before considering migration complete:

- [ ] Database schema is updated
- [ ] All existing orders have valid service types
- [ ] Estimates are calculated for existing orders
- [ ] New bookings can be created
- [ ] Authentication works correctly
- [ ] User dashboard displays properly
- [ ] Admin dashboard shows all orders
- [ ] Calendar view renders correctly
- [ ] Status changes work (approve/reject)
- [ ] No console errors in browser
- [ ] No errors in backend logs

## 🐛 Common Issues & Solutions

### Issue: "Column 'service' does not exist"
**Solution:** Run the migration script again or manually add the column:
```sql
ALTER TABLE "Order" ADD COLUMN service TEXT;
```

### Issue: "Cannot read property 'service' of undefined"
**Solution:** Make sure Prisma client is regenerated:
```bash
cd backend
npx prisma generate
```

### Issue: "Calendar not showing events"
**Solution:** Verify orders have valid date strings:
```sql
SELECT id, date, time FROM "Order" WHERE date IS NOT NULL;
```

### Issue: "Admin dashboard shows empty"
**Solution:** Check if user has isAdmin flag:
```sql
SELECT id, email, "isAdmin" FROM "User";
```

### Issue: "Price calculation not working"
**Solution:** Verify service types match exactly:
- Frontend: `AERIAL_PHOTOGRAPHY`
- Backend: `AERIAL_PHOTOGRAPHY`
- Database: `AERIAL_PHOTOGRAPHY`

## 🔄 Rollback Plan

If you need to rollback:

### 1. Restore Database Backup
```bash
psql your_database < backup_20250103.sql
```

### 2. Revert Code Changes
```bash
git revert HEAD  # or checkout previous commit
git push
```

### 3. Reinstall Previous Dependencies
```bash
npm ci  # Uses package-lock.json
```

## 📞 Need Help?

If you encounter issues:

1. Check the main README.md
2. Review AUTHENTICATION_AND_DASHBOARDS.md
3. Look at browser console for errors
4. Check backend server logs
5. Verify database connection
6. Test API endpoints directly with Postman/Thunder Client

## 🎉 Post-Migration

Once migration is successful:

1. **Test thoroughly** with different user roles
2. **Update documentation** for your team
3. **Train users** on new features
4. **Monitor** for any issues in production
5. **Backup** the new database regularly

---

**Migration completed successfully?** 🎊 Enjoy your enhanced booking system with beautiful dashboards!

