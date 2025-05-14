import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../../shared/schema";

// Use environment variables for database connection
const connectionString = process.env.DATABASE_URL;

// Create a connection pool
const client = postgres(connectionString!);

// Create a Drizzle instance with our schema
export const db = drizzle(client, { schema });