import readline from 'readline';
import { query } from './db.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('===================================================');
console.log('  HostelSync Pro - Live SQLite Terminal Browser    ');
console.log('  Connected to: hostel.db                          ');
console.log('  Type your SQL query (e.g. SELECT * FROM students;)');
console.log('  Type "exit" or "quit" to leave.                  ');
console.log('===================================================\n');

function promptQuery() {
  rl.question('SQL> ', async (input) => {
    const trimmed = input.trim();
    if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
      console.log('Goodbye!');
      rl.close();
      process.exit(0);
    }

    if (!trimmed) {
      promptQuery();
      return;
    }

    try {
      const results = await query(trimmed);
      console.log('\n--- Query Results ---');
      console.table(results);
      console.log(`Total rows returned: ${results.length}\n`);
    } catch (err) {
      console.error('\nSQL Error:', err.message, '\n');
    }

    promptQuery();
  });
}

promptQuery();
