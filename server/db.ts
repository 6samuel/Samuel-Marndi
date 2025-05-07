import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("Setting up database connection...");
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Test the database connection
pool.connect()
  .then(client => {
    console.log("Successfully connected to database!");
    client.release();
  })
  .catch(err => {
    console.error("Error connecting to database:", err);
  });

export const db = drizzle(pool, { schema });