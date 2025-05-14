import { db } from './db';
import { users } from '../../shared/schema';
import { sql } from 'drizzle-orm';

// Function to check if tables exist and are empty
export async function checkDatabase() {
  try {
    // Check if users table exists
    console.log("Checking database connection and tables...");
    
    // Try to query users table
    const userCount = await db.select({ count: sql`count(*)` }).from(users);
    console.log("User count in database:", userCount[0].count);
    
    // If table exists, try to fetch some users
    const allUsers = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      userType: users.userType
    }).from(users).limit(5);
    
    console.log("Sample users in database (up to 5):", allUsers);
    
    return {
      connected: true,
      tables: {
        users: {
          exists: true,
          count: Number(userCount[0].count),
          sample: allUsers
        }
      }
    };
  } catch (error: any) {
    console.error("Database check failed:", error.message);
    return {
      connected: false,
      error: error.message
    };
  }
}

// Function to populate database with initial data if empty
export async function populateDatabase() {
  try {
    // Check if database is empty
    const userCount = await db.select({ count: sql`count(*)` }).from(users);
    
    if (Number(userCount[0].count) === 0) {
      console.log("Database is empty, populating with initial data...");
      
      // Create initial test user
      const adminUser = await db.insert(users).values({
        username: "admin",
        password: "admin123",
        email: "admin@example.com",
        fullName: "Admin User",
        userType: "Landlord & Sell",
      }).returning();
      
      console.log("Created admin user:", adminUser);
      
      // Create test user with Rent & Buy role
      const testUser = await db.insert(users).values({
        username: "test",
        password: "test123",
        email: "test@example.com",
        fullName: "Test User",
        userType: "Rent & Buy",
      }).returning();
      
      console.log("Created test user:", testUser);
      
      return {
        success: true,
        message: "Database populated with initial data",
        users: [adminUser[0], testUser[0]]
      };
    } else {
      console.log("Database already has data, skipping population");
      return {
        success: false,
        message: "Database already has data"
      };
    }
  } catch (error: any) {
    console.error("Database population failed:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}