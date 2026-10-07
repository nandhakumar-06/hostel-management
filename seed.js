import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function seed() {
  const sqlPath = path.join(__dirname, 'queries.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

  console.log('Seeding SQLite database (hostel.db)...');

  db.serialize(() => {
    db.exec(sqlContent, (err) => {
      if (err) {
        console.error('Error executing seed queries:', err.message);
      } else {
        console.log('Successfully initialized and seeded hostel.db!');
      }
    });
  });
}

seed();
