import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

// Check if we have a MySQL database URL or need to use PostgreSQL temporarily
const databaseUrl = process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL or MYSQL_DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("Setting up MySQL database connection...");

// Create MySQL connection pool with better error handling
export const pool = mysql.createPool({
  uri: databaseUrl,
  connectionLimit: 10,
  queueLimit: 0,
  timeout: 30000,
  acquireTimeout: 30000,
  reconnect: true,
  multipleStatements: false
});

// Test the database connection with better error handling
pool.getConnection()
  .then(connection => {
    console.log("✅ Successfully connected to MySQL database!");
    connection.release();
  })
  .catch(err => {
    console.error("❌ Error connecting to MySQL database:", err.message);
    console.log("");
    console.log("🔧 MYSQL SETUP REQUIRED:");
    console.log("=======================");
    console.log("1. 📊 Set up a MySQL database (recommended: PlanetScale or Railway)");
    console.log("2. 🔑 Add MYSQL_DATABASE_URL to your Replit environment secrets");
    console.log("3. 🔗 URL format: mysql://user:password@host:port/database");
    console.log("4. 📖 Check MYSQL_SETUP.md for detailed instructions");
    console.log("");
    console.log("🎯 Your application is fully configured for MySQL!");
    console.log("   Just add the database URL and it will work perfectly.");
    console.log("");
  });

export const db = drizzle(pool, { schema, mode: 'default' });