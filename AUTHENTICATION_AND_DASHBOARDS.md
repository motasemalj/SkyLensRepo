# Authentication & Dashboard System - Complete Guide

## 🎉 What's New

We've completely revamped the authentication system and dashboards with modern UX/UI and powerful new features!

## ✨ Features

### 🔐 Authentication System
- **Email-based signup with JWT authentication**
- Password validation with strength requirements
- Secure token-based authentication
- Automatic token persistence in localStorage
- Protected routes with role-based access control

### 👤 User Dashboard
- **Beautiful, modern UI** with gradient backgrounds and smooth animations
- **Service Selection**: Choose from 4 professional drone services
  - Aerial Photography (800 AED base)
  - Edited Video (1,500 AED base)
  - 3D Mapping (2,500 AED base)
  - Industrial Inspection (3,000 AED base)
- **Package Options**: RAW footage or professionally edited content
- **Real-time Price Calculator**: See estimates instantly as you select options
- **Interactive Map Picker**: Pin your exact location on the map
- **Date & Time Scheduler**: Choose your preferred filming date and time
- **Booking History**: View all your requests and their status in a beautiful sidebar
- **Status Tracking**: Monitor your bookings (Pending, Approved, Rejected)

### 👨‍💼 Admin Dashboard
- **Dual View Modes**:
  - **Table View**: Comprehensive list with all booking details
  - **Calendar View**: Visual timeline of all scheduled bookings
- **Smart Filtering**: Filter by status (All, Pending, Approved, Rejected)
- **Analytics Dashboard**: Key metrics at a glance
  - Total orders
  - Pending requests
  - Approved bookings
  - Rejected orders
  - Total revenue from approved orders
- **Quick Actions**: Approve or reject orders with one click
- **Detailed Order Modal**: View complete booking information
- **Google Maps Integration**: Quick links to booking locations
- **Color-coded Status**: Easy visual identification of booking status

## 🚀 Getting Started

### Database Migration

First, you need to apply the database schema changes:

```bash
cd backend

# If you have a DATABASE_URL set up, run:
npx prisma migrate deploy

# Or for development:
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### Environment Variables

Make sure your backend has these environment variables set:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-secret-key-here"
PORT=4001
FRONTEND_URL="http://localhost:3000"
```

And your frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:4001"
```

### Starting the Application

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📝 Database Schema

The updated schema includes:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  isAdmin   Boolean  @default(false)
  orders    Order[]
}

model Order {
  id          String      @id @default(uuid())
  user        User        @relation(fields: [userId], references: [id])
  userId      String
  service     ServiceType  // NEW FIELD
  location    String
  latitude    Float?
  longitude   Float?
  package     Package
  description String
  estimate    Float?       // NEW FIELD
  date        String?
  time        String?
  status      OrderStatus @default(PENDING)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum ServiceType {
  AERIAL_PHOTOGRAPHY
  EDITED_VIDEO
  MAPPING_3D
  INDUSTRIAL_INSPECTION
}
```

## 🎨 UI/UX Improvements

### Design System
- **Modern gradients** with cyan and blue accent colors
- **Smooth animations** for all interactions
- **Responsive design** optimized for mobile, tablet, and desktop
- **Dark theme** with carefully chosen contrast ratios
- **Custom scrollbars** for a polished look
- **Hover effects** and transitions for better feedback

### User Experience Enhancements
- **Real-time validation** for forms
- **Loading states** for all async operations
- **Success/error notifications** with auto-dismiss
- **Skeleton loaders** while fetching data
- **Optimistic updates** for instant feedback
- **Mobile-first design** with touch-friendly controls

## 🔒 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- Protected API routes with middleware
- Role-based access control (User vs Admin)
- Secure HTTP-only cookies support ready
- CORS configuration for production

## 📱 Mobile Optimization

- Responsive grid layouts
- Touch-friendly buttons (minimum 44px height)
- Mobile-optimized calendar view
- Swipe-friendly tables with horizontal scroll
- Optimized font sizes for readability
- No zoom on input focus (prevents mobile keyboard issues)

## 🎯 User Workflows

### For Customers:
1. Sign up with email and password
2. Get redirected to user dashboard
3. Select a service type
4. Choose package (RAW or Edited)
5. See real-time price estimate
6. Fill in location details
7. Pin exact location on map
8. Schedule date and time
9. Add project description
10. Submit booking request
11. Track status in sidebar

### For Admins:
1. Sign in with admin credentials
2. View analytics overview
3. Switch between table and calendar views
4. Filter bookings by status
5. Click on any booking for details
6. Approve or reject with one click
7. Monitor scheduled bookings on calendar
8. Track total revenue

## 🛠️ Technical Stack

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcryptjs for password hashing

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- react-big-calendar for calendar view
- Leaflet for maps
- date-fns for date manipulation

## 📊 Price Calculation

The system automatically calculates estimates based on:

```javascript
Base Prices:
- Aerial Photography: 800 AED
- Edited Video: 1,500 AED
- 3D Mapping: 2,500 AED
- Industrial Inspection: 3,000 AED

Package Multipliers:
- RAW: 1x (no additional cost)
- EDITED: 1.5x (50% premium)
```

Example: 3D Mapping + Edited = 2,500 × 1.5 = 3,750 AED

## 🎨 Color Scheme

```
Primary: Cyan-500 (#06b6d4)
Secondary: Blue-500 (#3b82f6)
Success: Emerald-500 (#10b981)
Warning: Amber-500 (#f59e0b)
Error: Red-500 (#ef4444)
Background: Black to Neutral-950
Text: White with neutral variations
```

## 📦 Calendar Features

The admin calendar view includes:
- Month, Week, Day, and Agenda views
- Color-coded events by status
- Click events to view details
- Hover previews
- Responsive layout
- Custom styling to match theme

## 🔧 Customization

### Changing Prices
Edit `frontend/src/app/dashboard/page.tsx`:
```typescript
const services = [
  { 
    label: "Aerial Photography", 
    value: "AERIAL_PHOTOGRAPHY", 
    basePrice: 800, // Change this
    // ...
  },
  // ...
];
```

### Adding New Services
1. Update `backend/prisma/schema.prisma` with new service type
2. Run `npx prisma migrate dev`
3. Update pricing in dashboard
4. Add service to frontend constants

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL in backend/.env
- Ensure PostgreSQL is running
- Verify database exists

### "Token expired" errors
- Tokens expire after 7 days
- User needs to sign in again
- Check JWT_SECRET is consistent

### Calendar not showing
- Ensure date-fns is installed
- Check browser console for errors
- Verify orders have valid dates

### Map not loading
- Check Leaflet CSS is imported
- Ensure dynamic import is used
- Verify SSR is disabled for map

## 📈 Future Enhancements

Potential features to add:
- Email notifications for status changes
- Payment integration (Stripe/PayPal)
- File upload for reference images
- Chat system for customer-admin communication
- Multi-language support
- Advanced analytics dashboard
- Export bookings to CSV/PDF
- Customer reviews and ratings

## 🙏 Credits

Built with love using modern web technologies and best practices in UX/UI design.

---

**Need help?** Check the code comments or create an issue in the repository.

