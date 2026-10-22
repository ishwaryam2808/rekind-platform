import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

export function getInitialSchema() {
  return {
    users: [],
    items: [],
    communityNeeds: [],
    itemRequests: [],
    communityNeedOffers: [],
    transfers: [],
    conversations: [],
    notifications: [],
    favorites: []
  };
}

// Ensure database file exists with clean initial empty data
export function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = getInitialSchema();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(content);
    // Ensure all collections exist
    const schema = getInitialSchema();
    let modified = false;
    for (const key of Object.keys(schema)) {
      if (!Array.isArray(data[key])) {
        data[key] = [];
        modified = true;
      }
    }
    if (modified) {
      saveDb(data);
    }
    return data;
  } catch (err) {
    console.error('Error reading DB, re-initializing empty schema:', err);
    const initialData = getInitialSchema();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

export function saveDb(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error saving DB:', err);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }
}

export function resetDatabase() {
  const cleanData = getInitialSchema();
  fs.writeFileSync(DB_FILE, JSON.stringify(cleanData, null, 2), 'utf-8');
  return cleanData;
}
