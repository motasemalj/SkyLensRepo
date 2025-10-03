# 🚀 Quick Reference Guide

## Common Commands

### Start Development
```bash
# Backend
cd backend && npm run dev

# Frontend (new terminal)
cd frontend && npm run dev
```

### Database Operations
```bash
cd backend

# Generate Prisma client
npm run db:generate

# Create migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Deploy migrations
npm run db:deploy
```

### Create Admin User
```bash
cd backend
npm run create-admin
# Follow prompts: enter name, email, password
```

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:4001 | API server |
| Sign Up | http://localhost:3000/signup | New user registration |
| Sign In | http://localhost:3000/signin | User login |
| User Dashboard | http://localhost:3000/dashboard | Customer bookings |
| Admin Panel | http://localhost:3000/admin | Order management |

## 📋 Service Types & Pricing

| Service | Value | Base Price | With Editing |
|---------|-------|------------|--------------|
| Aerial Photography | `AERIAL_PHOTOGRAPHY` | 800 AED | 1,200 AED |
| Edited Video | `EDITED_VIDEO` | 1,500 AED | 2,250 AED |
| 3D Mapping | `MAPPING_3D` | 2,500 AED | 3,750 AED |
| Industrial Inspection | `INDUSTRIAL_INSPECTION` | 3,000 AED | 4,500 AED |

## 🎨 Status Colors

| Status | Color | Hex | Tailwind |
|--------|-------|-----|----------|
| Pending | Amber | #f59e0b | amber-500 |
| Approved | Emerald | #10b981 | emerald-500 |
| Rejected | Red | #ef4444 | red-500 |

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@host:port/db"
JWT_SECRET="your-secret-key-here"
PORT=4001
HOST="0.0.0.0"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:4001"
```

## 📡 API Endpoints

### Auth Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user

### Order Routes (Authenticated)
- `POST /api/order/create` - Create new order
- `GET /api/order/my-orders` - Get user's orders

### Admin Routes (Admin Only)
- `GET /api/admin/orders` - Get all orders
- `POST /api/admin/orders/:id/approved` - Approve order
- `POST /api/admin/orders/:id/rejected` - Reject order

## 🗄️ Database Quick Queries

### View all users
```sql
SELECT id, email, name, "isAdmin" FROM "User";
```

### Make user admin
```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'user@example.com';
```

### View all orders
```sql
SELECT * FROM "Order" ORDER BY "createdAt" DESC;
```

### Count orders by status
```sql
SELECT status, COUNT(*) FROM "Order" GROUP BY status;
```

### Calculate total revenue
```sql
SELECT SUM(estimate) FROM "Order" WHERE status = 'APPROVED';
```

## 🐛 Quick Troubleshooting

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
pg_isready

# Verify DATABASE_URL
echo $DATABASE_URL
```

### "Token expired"
```javascript
// Clear localStorage in browser console
localStorage.clear();
// Then sign in again
```

### "Prisma Client not generated"
```bash
cd backend
npm run db:generate
```

### "Module not found"
```bash
# Reinstall dependencies
npm install
```

### Reset everything
```bash
# Backend
cd backend
rm -rf node_modules
npm install
npx prisma generate

# Frontend
cd frontend
rm -rf node_modules .next
npm install
```

## 📱 Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| sm | 640px | Small tablets |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

## 🎯 Component Locations

```
frontend/src/app/
├── components/
│   ├── NavBar.tsx          # Main navigation
│   ├── Footer.tsx          # Site footer
│   ├── NavBarWrapper.tsx   # Nav wrapper
│   └── ProtectedRoute.tsx  # Auth wrapper
├── context/
│   └── AuthContext.tsx     # Auth state
├── dashboard/
│   ├── page.tsx           # User dashboard
│   └── MapPicker.tsx      # Map component
├── admin/
│   └── page.tsx           # Admin dashboard
├── signin/
│   └── page.tsx           # Login page
└── signup/
    └── page.tsx           # Registration page
```

## 🔧 Common Customizations

### Change service prices
```typescript
// frontend/src/app/dashboard/page.tsx
const services = [
  { 
    label: "Aerial Photography", 
    value: "AERIAL_PHOTOGRAPHY", 
    basePrice: 800, // <- Change this
    // ...
  },
];
```

### Add new service
```prisma
// backend/prisma/schema.prisma
enum ServiceType {
  AERIAL_PHOTOGRAPHY
  EDITED_VIDEO
  MAPPING_3D
  INDUSTRIAL_INSPECTION
  YOUR_NEW_SERVICE  // <- Add here
}
```

### Change token expiration
```javascript
// backend/controllers/authController.js
const token = jwt.sign(
  { userId: user.id, isAdmin: user.isAdmin }, 
  JWT_SECRET, 
  { expiresIn: '7d' } // <- Change this
);
```

### Modify color scheme
```javascript
// frontend/src/app/globals.css or component files
// Primary: cyan-500 -> Change to your color
// Example: bg-cyan-500 -> bg-purple-500
```

## 📚 Documentation Index

1. **IMPLEMENTATION_SUMMARY.md** - What was built
2. **AUTHENTICATION_AND_DASHBOARDS.md** - Feature details
3. **MIGRATION_GUIDE.md** - Database migration
4. **QUICK_REFERENCE.md** - This file (quick commands)
5. **README.md** - Original project docs

## 💡 Pro Tips

1. **Use Prisma Studio** for easy database viewing:
   ```bash
   cd backend && npm run db:studio
   ```

2. **Test API with REST client** (Thunder Client, Postman):
   - Install VS Code extension
   - Test endpoints directly
   - Save common requests

3. **Enable React DevTools** for debugging:
   - Install browser extension
   - Inspect component tree
   - Monitor state changes

4. **Use browser console** for quick tests:
   ```javascript
   // Check auth state
   console.log(localStorage.getItem('token'));
   console.log(localStorage.getItem('user'));
   ```

5. **Watch server logs** for debugging:
   - Backend logs show API calls
   - Frontend console shows client errors
   - Check both when troubleshooting

## 🎓 Key Files to Understand

| File | Purpose | Priority |
|------|---------|----------|
| `authController.js` | Auth logic | High |
| `orderController.js` | Order logic | High |
| `AuthContext.tsx` | Frontend auth | High |
| `schema.prisma` | Database schema | High |
| `dashboard/page.tsx` | User interface | Medium |
| `admin/page.tsx` | Admin interface | Medium |
| `auth.js` (middleware) | Route protection | Medium |

## ⚡ Performance Tips

- Images: Use Next.js Image component
- API calls: Implement caching where appropriate
- Database: Add indexes for frequent queries
- Frontend: Use React.memo for expensive components
- Assets: Optimize and compress before upload

---

**Need more details?** Check the comprehensive documentation files.

**Found a bug?** Check browser console and server logs first.

**Adding features?** Follow existing patterns in the codebase.

Happy coding! 🚀

