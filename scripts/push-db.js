// This script pushes the schema to the database

const { exec } = require('child_process');

console.log('Pushing database schema...');

exec('npm run db:push', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  
  console.log(`Output: ${stdout}`);
  console.log('Database schema pushed successfully!');
});