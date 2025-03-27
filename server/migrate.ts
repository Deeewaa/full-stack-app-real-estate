import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './db';

// This script runs migrations on the database
async function main() {
  console.log('Running migrations...');
  
  try {
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

main();