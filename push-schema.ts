import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from './shared/schema';

neonConfig.webSocketConstructor = ws;

async function main() {
  console.log('Running schema migration...');
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not set');
  }
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });
  
  try {
    // Create marketing_goals table for tracking marketing targets
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marketing_goals (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        target INTEGER NOT NULL,
        current INTEGER DEFAULT 0,
        period TEXT NOT NULL,
        start_date TIMESTAMP WITH TIME ZONE,
        end_date TIMESTAMP WITH TIME ZONE,
        tracker_id INTEGER REFERENCES ad_trackers(id) ON DELETE SET NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Create marketing_activities table for tracking campaigns and activities
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marketing_activities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        start_date TIMESTAMP WITH TIME ZONE NOT NULL,
        end_date TIMESTAMP WITH TIME ZONE,
        status TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Create ab_tests table for A/B testing
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ab_tests (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        tracker_id INTEGER REFERENCES ad_trackers(id) ON DELETE SET NULL,
        page_url TEXT NOT NULL,
        start_date TIMESTAMP WITH TIME ZONE,
        end_date TIMESTAMP WITH TIME ZONE,
        conversion_metric TEXT NOT NULL,
        target_sample_size INTEGER DEFAULT 1000,
        minimum_confidence INTEGER DEFAULT 95,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Create ab_test_variants table for A/B test variations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ab_test_variants (
        id SERIAL PRIMARY KEY,
        test_id INTEGER NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        is_control BOOLEAN DEFAULT FALSE,
        content TEXT,
        custom_properties JSONB,
        impressions INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        conversion_rate INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Create ab_test_hits table for tracking A/B test interactions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ab_test_hits (
        id SERIAL PRIMARY KEY,
        variant_id INTEGER NOT NULL REFERENCES ab_test_variants(id) ON DELETE CASCADE,
        session_id TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        device_type TEXT,
        converted BOOLEAN DEFAULT FALSE,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Create the partner_applications table directly if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS partner_applications (
        id SERIAL PRIMARY KEY,
        company_name TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        website TEXT,
        business_type TEXT NOT NULL,
        services TEXT NOT NULL,
        expectations TEXT NOT NULL,
        submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        status TEXT NOT NULL DEFAULT 'new'
      );
    `);

    // Create consultations table for paid consultation bookings
    await pool.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        date DATE NOT NULL,
        time_slot TEXT NOT NULL,
        topic TEXT NOT NULL,
        message TEXT,
        payment_status TEXT NOT NULL DEFAULT 'pending',
        payment_id TEXT,
        payment_amount INTEGER NOT NULL DEFAULT 1000,
        payment_method TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        status TEXT NOT NULL DEFAULT 'scheduled',
        meeting_link TEXT,
        notes TEXT
      );
    `);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await pool.end();
  }
}

main();