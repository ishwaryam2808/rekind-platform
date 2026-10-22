import { resetDatabase } from './db.js';

console.log('[REKIND] Resetting database to clean first-use state...');
resetDatabase();
console.log('[REKIND] Database successfully reset. All collections are now empty.');
