═══════════════════════════════════════════════════════════════
            VERCEL ENVIRONMENT VARIABLES NEEDED
═══════════════════════════════════════════════════════════════

Your site is now deploying! However, you need to set up environment
variables in Vercel for the site to work properly.

📋 REQUIRED ENVIRONMENT VARIABLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Go to: https://vercel.com/YOUR_PROJECT/settings/environment-variables

Add these variables:

1. DATABASE_URL (REQUIRED)
   Value: postgresql://neondb_owner:npg_gT60odRIKwHs@ep-purple-flower-a68e34if.us-west-2.aws.neon.tech/neondb?sslmode=require
   
2. SESSION_SECRET (REQUIRED)
   Value: your-secure-random-string-here
   Generate one at: https://randomkeygen.com/

3. NODE_ENV (REQUIRED)
   Value: production

OPTIONAL (for full functionality):

4. EMAIL_HOST
   Value: smtp.gmail.com

5. EMAIL_PORT
   Value: 587

6. EMAIL_USER
   Value: your-email@gmail.com

7. EMAIL_PASSWORD
   Value: your-app-password

8. STRIPE_SECRET_KEY
   Value: sk_live_... (your Stripe key)

9. PAYPAL_CLIENT_ID
   Value: your PayPal client ID

10. RAZORPAY_KEY_ID
    Value: your Razorpay key

11. VITE_GA_MEASUREMENT_ID
    Value: G-XXXXXXXXXX (your Google Analytics ID)

═══════════════════════════════════════════════════════════════

STEPS TO ADD IN VERCEL:
1. Go to https://vercel.com/dashboard
2. Click on your "Samuel-Marndi" project
3. Go to Settings → Environment Variables
4. Add each variable above
5. Make sure to select "Production", "Preview", and "Development"
6. Click "Save"
7. Redeploy the site (Deployments tab → ⋯ → Redeploy)

═══════════════════════════════════════════════════════════════

