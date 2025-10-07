═══════════════════════════════════════════════════════════════
          VERCEL DEPLOYMENT - TROUBLESHOOTING GUIDE
═══════════════════════════════════════════════════════════════

🔴 ISSUE: White page with routing errors on samuelmarndi.com

📋 WHAT WE JUST DID:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ✅ Updated vercel.json with proper configuration
2. ✅ Added --legacy-peer-deps for npm install
3. ✅ Added cache-busting BUILD_INFO.txt file
4. ✅ Pushed to GitHub to trigger fresh Vercel build
5. 🔄 Vercel is now building...

⏰ WAIT 3-5 MINUTES for the new deployment to complete

═══════════════════════════════════════════════════════════════

📍 STEP-BY-STEP VERIFICATION:

1. CHECK VERCEL DEPLOYMENT STATUS
   ────────────────────────────────────────────────────────────
   • Go to: https://vercel.com/dashboard
   • Find your "Samuel-Marndi" project
   • Click "Deployments" tab
   • Look for the latest deployment (should show "Building")
   • Wait until it shows "Ready" (2-3 minutes)

2. VERIFY BUILD LOGS
   ────────────────────────────────────────────────────────────
   • Click on the latest deployment
   • Check "Building" logs for errors
   • Look for successful completion message
   • Verify it says "Build Completed"

3. CHECK ENVIRONMENT VARIABLES (CRITICAL!)
   ────────────────────────────────────────────────────────────
   • Go to Settings → Environment Variables
   • Verify these 3 are set:
     ✓ DATABASE_URL
     ✓ SESSION_SECRET  
     ✓ NODE_ENV

   If missing, ADD THEM NOW:
   
   DATABASE_URL=
   postgresql://neondb_owner:npg_gT60odRIKwHs@ep-purple-flower-a68e34if.us-west-2.aws.neon.tech/neondb?sslmode=require
   
   SESSION_SECRET=(generate at https://randomkeygen.com/)
   
   NODE_ENV=production

   After adding, REDEPLOY:
   • Go to Deployments tab
   • Click latest deployment → ⋯ → Redeploy

4. TEST THE SITE
   ────────────────────────────────────────────────────────────
   • Visit: https://samuelmarndi.com
   • Hard refresh: Ctrl+Shift+R (or Ctrl+F5)
   • Check browser console (F12) for errors
   
   ✅ SUCCESS if you see:
   - Content loads (not blank)
   - No routing errors
   - Services, portfolio pages work

   ❌ STILL BROKEN if you see:
   - Blank white page
   - "Cannot read properties of undefined" errors
   - 500 errors on /api/ endpoints

═══════════════════════════════════════════════════════════════

🔥 IF STILL BROKEN AFTER STEPS 1-4:

OPTION A: Clear Vercel Build Cache
  1. Go to Settings → General
  2. Scroll to "Build & Development Settings"
  3. Find "Build Cache" section
  4. Click "Clear Build Cache"
  5. Redeploy the site

OPTION B: Check Vercel Function Logs
  1. Go to latest deployment
  2. Click "Functions" tab
  3. Look for errors in API functions
  4. Common issues:
     - Database connection errors (check DATABASE_URL)
     - Missing dependencies
     - Node version mismatch

OPTION C: Force Clean Deploy
  1. In Vercel dashboard, go to Settings
  2. Scroll to bottom
  3. Delete and reconnect GitHub repo
  4. Or manually trigger "Redeploy" with "Use existing Build Cache" UNCHECKED

═══════════════════════════════════════════════════════════════

📊 EXPECTED TIMELINE:

Time  | Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Now   | Push detected by Vercel
+1min | Building started  
+2min | npm install running
+3min | Vite build running
+4min | Deploying to CDN
+5min | ✅ Site live at samuelmarndi.com

If it takes longer than 10 minutes, check the logs for errors.

═══════════════════════════════════════════════════════════════

🆘 STILL NEED HELP?

Share these details:
1. Screenshot of Vercel deployment logs
2. Screenshot of browser console errors (F12)
3. Screenshot of Environment Variables page
4. Deployment URL from Vercel

═══════════════════════════════════════════════════════════════

