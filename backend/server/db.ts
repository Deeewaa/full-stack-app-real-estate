import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../../shared/schema";

// Use environment variables for database connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

console.log('Connecting to Supabase database...');

// Create a connection pool with Supabase connection string
const client = postgres(connectionString, {
  max: 20,
  idle_timeout: 30,
});

// Test the connection
client`SELECT 1`.then(() => {
  console.log('Database connection successful');
}).catch((err) => {
  console.error('Database connection failed:', err);
});

// Create a Drizzle instance with our schema
export const db = drizzle(client, { schema });