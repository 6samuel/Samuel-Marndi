# Samuel Marndi Web - Local Setup Guide

## ✅ Current Status

**The application is now running successfully at http://localhost:5000 with FULL DATABASE CONNECTIVITY!**

### What's Working:
- ✅ Frontend (React + Vite) serving on port 5000
- ✅ Backend (Express.js) API server
- ✅ **PostgreSQL Database connected (Neon Database)**
- ✅ **All database tables created and synced**
- ✅ **Sample data loaded (12 services, portfolio items, testimonials, blog posts)**
- ✅ **API endpoints working with real data**
- ✅ Hot Module Replacement (HMR) for development
- ✅ Static assets and routing
- ✅ TypeScript compilation
- ✅ TailwindCSS styling
- ✅ Sitemap and robots.txt generation

### What Needs Configuration:
- ⚠️ Admin user (needs to be created)
- ⚠️ Email notifications (no SMTP configured)
- ⚠️ Payment gateways (no API keys configured)
- ⚠️ SMS notifications (no Twilio configured)

## Project Overview

This is a **full-stack web application** built for Samuel Marndi's portfolio and business website.

### Technology Stack

**Frontend:**
- React 18.3.1 with TypeScript
- Vite 5.4.20 (Build tool & Dev server)
- TailwindCSS 3.4.17
- Wouter (Routing)
- React Query (Data fetching)
- Radix UI (Component library)
- Chart.js & Recharts (Visualization)
- Framer Motion (Animations)

**Backend:**
- Node.js 22.20.0
- Express.js 4.21.2
- TypeScript
- Drizzle ORM 0.39.1
- PostgreSQL (via Neon Database)
- Passport.js (Authentication)

**Features:**
- Admin Dashboard for content management
- Service & Portfolio management
- Blog system
- Consultation booking
- Payment integration (Stripe, PayPal, Razorpay)
- Analytics & tracking
- Marketing campaign management

## How to Run

### Quick Start (Already Running)
```bash
# The server is currently running at http://localhost:5000
# Open your browser and navigate to that URL
```

### To Stop the Server
Press `Ctrl+C` in the PowerShell window where the server is running.

### To Start Again
```powershell
$env:NODE_ENV="development"
$env:DATABASE_URL="postgresql://neondb_owner:npg_gT60odRIKwHs@ep-purple-flower-a68e34if.us-west-2.aws.neon.tech/neondb?sslmode=require"
$env:SESSION_SECRET="development-secret-key-12345"
npx tsx server/index.ts
```

Or simply use the npm script (environment variables are loaded from .env):
```bash
npm run dev
```

## Database Setup (Already Configured! ✅)

Your application is already connected to a Neon PostgreSQL database:

**Database Information:**
- **Host**: ep-purple-flower-a68e34if.us-west-2.aws.neon.tech
- **Database**: neondb
- **User**: neondb_owner
- **Status**: ✅ Connected and synced
- **Sample Data**: ✅ Loaded (12 services, portfolio items, testimonials, blog posts)

The database schema has been successfully pushed and all tables are created. No additional database setup is required!

## Configuration Files

### Environment Variables (.env)
The `.env` file has been created with basic configuration. You can add:

```env
# Database (Already configured with Neon!)
DATABASE_URL=postgresql://neondb_owner:npg_gT60odRIKwHs@ep-purple-flower-a68e34if.us-west-2.aws.neon.tech/neondb?sslmode=require

# Session Secret
SESSION_SECRET=your-secret-key-here

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Payment Gateways (Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

# Twilio (Optional)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Google Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-...
```

## Project Structure

```
D:\Sam\samuelweb\
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   └── index.html
├── server/                 # Express backend
│   ├── index.ts            # Main entry point
│   ├── routes.ts           # API routes
│   ├── auth.ts             # Authentication
│   ├── db.ts               # Database connection
│   └── [other services]
├── shared/                 # Shared types/schemas
│   └── schema.ts           # Drizzle ORM schema
├── public/                 # Static assets
├── package.json
├── vite.config.ts
├── drizzle.config.ts
├── tsconfig.json
└── .env                    # Environment variables
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run check            # Type check with TypeScript
npm run db:push          # Push database schema changes
```

## Troubleshooting

### Issue: npm packages not installing properly
**Solution:** The issue was `NODE_ENV=production` preventing devDependencies from installing.
Run: `npm install --include=dev` or ensure `NODE_ENV` is not set to production.

### Issue: "reusePort" error on Windows
**Solution:** Already fixed in `server/index.ts` - the code now detects Windows and disables `reusePort`.

### Issue: Database connection errors
**Solution:** This is expected if PostgreSQL is not set up. The app will run but database features won't work.

### Issue: Port 5000 already in use
**Solution:** Stop other processes using port 5000:
```powershell
netstat -ano | findstr ":5000"
# Find the PID and kill it
taskkill /PID <PID> /F
```

## Development Workflow

1. **Make changes** to files in `client/src/` or `server/`
2. **Hot reload** will automatically update the browser (for frontend changes)
3. **Backend changes** require server restart (Ctrl+C and run again)
4. **Test** your changes at http://localhost:5000

## Admin Access

Once database is configured, you can create an admin user:
```bash
npx tsx server/create-admin.ts
```

Then access admin dashboard at: http://localhost:5000/admin/login

## Next Steps

1. ✅ ~~Set up PostgreSQL database~~ (Already done!)
2. ✅ ~~Run database migrations~~ (Already synced!)
3. **Create admin user**: `npx tsx server/create-admin.ts` ⬅️ Do this next!
4. **Access admin dashboard**: http://localhost:5000/admin/login
5. **Configure payment gateways** (optional) in `.env`
6. **Set up email service** (optional) in `.env`
7. **Add Google Analytics** (optional) in `.env`

## Support

For issues or questions:
- Check the console output for error messages
- Ensure all environment variables are set correctly
- Verify PostgreSQL is running if you need database features
- Check that port 5000 is available

## Production Deployment

This application is designed to be deployed on Replit, but can also be deployed to:
- Heroku
- Vercel
- Netlify
- Railway
- Any Node.js hosting service

Make sure to:
1. Set all environment variables in your hosting platform
2. Run `npm run build` to create production build
3. Use `npm start` as the start command
4. Ensure PostgreSQL database is accessible

---

**Current Status:** 
- ✅ Development server running at http://localhost:5000
- ✅ Database connected and synced with Neon PostgreSQL
- ✅ Sample data loaded and accessible via API
- ✅ All core features functional

**Quick Test:**
- Homepage: http://localhost:5000
- Services API: http://localhost:5000/api/services
- Admin Login: http://localhost:5000/admin/login (create admin user first)

Last updated: January 2025
