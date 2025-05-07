import { db } from "./db";
import { users } from "@shared/schema";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";

async function createAdminUser() {
  const adminUsername = "admin";
  const adminPassword = "adminpass123"; // This is just a default password, would need to be changed in production
  
  try {
    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, adminUsername)).execute();
    
    if (existingAdmin.length > 0) {
      console.log("Admin user already exists");
      return;
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(adminPassword);
    
    // Create the admin user
    const [adminUser] = await db.insert(users).values({
      username: adminUsername,
      password: hashedPassword,
      name: "Admin User",
      email: "admin@samuelmarndi.in",
      role: "admin",
      createdAt: new Date()
    }).returning();
    
    console.log("Admin user created successfully:", adminUser.username);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

// Run the function immediately
createAdminUser()
  .then(() => {
    console.log("Admin user creation process completed.");
  })
  .catch(error => {
    console.error("Unhandled error:", error);
  });

export { createAdminUser };