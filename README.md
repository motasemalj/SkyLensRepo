# SkyLens - Drone Filming Service

A modern, full-stack web application for drone filming services built with Next.js, Express.js, and PostgreSQL.

## Features

- **User Authentication**: Sign up, sign in, and user management
- **Order Management**: Place and track drone filming orders
- **Admin Dashboard**: Manage orders and approve/reject requests
- **Interactive Map**: Select filming locations using Leaflet maps
- **Responsive Design**: Modern UI with Tailwind CSS
- **Email Notifications**: Automated email notifications for order updates

## Tech Stack

### Frontend
- Next.js 15.3.3
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- React Leaflet
- NextAuth (configured but not used)

### Backend
- Express.js 5.1.0
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Nodemailer
- bcryptjs

## Project Structure

```
SkyLens/
├── frontend/
│   ├── src/app/           # Next.js app directory
│   ├── public/            # Static assets
│   └── components/        # React components
├── backend/               # Express.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes
│   ├── prisma/            # Database schema & migrations
│   └── utils/             # Utility functions
├── scripts/               # Utility scripts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkyLens
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in the appropriate directories:
   
   **backend/.env:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/skylens_db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   PORT=4001
   NODE_ENV=development
   ```
   
   **frontend/.env.local:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4001
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

5. **Run the application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4001

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Orders
- `POST /api/order/create` - Create new order (requires auth)
- `GET /api/order/my-orders` - Get user orders (requires auth)

### Admin
- `GET /api/admin/orders` - Get all orders (requires admin)
- `POST /api/admin/orders/:orderId/approved` - Approve order (requires admin)
- `POST /api/admin/orders/:orderId/rejected` - Reject order (requires admin)
- `POST /api/admin/orders/:orderId/:status` - Update order status (requires admin)
- `DELETE /api/admin/orders` - Delete all orders (requires admin)

## Database Schema

### User
- id (UUID, Primary Key)
- email (String, Unique)
- password (String, Hashed)
- name (String, Optional)
- isAdmin (Boolean, Default: false)

### Order
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- location (String)
- latitude (Float, Optional)
- longitude (Float, Optional)
- package (Enum: RAW, EDITED)
- description (String)
- date (String, Optional)
- time (String, Optional)
- status (Enum: PENDING, APPROVED, REJECTED)
- createdAt (DateTime)
- updatedAt (DateTime)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact:
- Email: info@skylensuae.com
- Phone: +971 50 519 6895

