import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "./shared/schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function main() {
  console.log("Creating tables if they don't exist...");
  
  try {
    // Create campaigns table
    await db.query.campaigns.findMany().catch(async () => {
      console.log("Creating campaigns table...");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS campaigns (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          subject TEXT,
          content TEXT NOT NULL,
          recipient_filter TEXT NOT NULL DEFAULT 'all',
          recipient_count INTEGER DEFAULT 0,
          sent_at TIMESTAMP,
          scheduled_for TIMESTAMP,
          status TEXT NOT NULL DEFAULT 'draft',
          open_rate INTEGER,
          click_rate INTEGER,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          created_by INTEGER NOT NULL
        )
      `);
      console.log("Campaigns table created!");
    });
    
    // Create recipients table
    await db.query.recipients.findMany().catch(async () => {
      console.log("Creating recipients table...");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS recipients (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          added TIMESTAMP NOT NULL DEFAULT NOW(),
          source TEXT NOT NULL DEFAULT 'website',
          tags TEXT[],
          unsubscribed BOOLEAN NOT NULL DEFAULT FALSE,
          metadata JSONB
        )
      `);
      console.log("Recipients table created!");
    });
    
    // Create campaign_results table
    await db.query.campaignResults.findMany().catch(async () => {
      console.log("Creating campaign_results table...");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS campaign_results (
          id SERIAL PRIMARY KEY,
          campaign_id INTEGER NOT NULL,
          recipient_id INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'sent',
          sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
          opened_at TIMESTAMP,
          clicked_at TIMESTAMP,
          failure_reason TEXT
        )
      `);
      console.log("Campaign results table created!");
    });
    
    console.log("All tables have been created!");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await pool.end();
  }
}

main();