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

// In-memory cache ensures zero read/write race conditions across concurrent requests
let _cachedDb = null;

function loadFromDisk() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = getInitialSchema();
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to create initial db.json file:', e);
    }
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    if (!content || !content.trim()) {
      return getInitialSchema();
    }
    const data = JSON.parse(content);
    const schema = getInitialSchema();
    for (const key of Object.keys(schema)) {
      if (!Array.isArray(data[key])) {
        data[key] = [];
      }
    }
    return data;
  } catch (err) {
    console.error('Warning: could not read DB from disk:', err);
    // Never wipe existing DB on a transient read error; return initial schema or existing cache
    return _cachedDb || getInitialSchema();
  }
}

// Ensure database is loaded and return live database object
export function getDb() {
  if (!_cachedDb) {
    _cachedDb = loadFromDisk();
  }
  return _cachedDb;
}

// Safely persist to disk and keep in-memory cache synchronized
export function saveDb(data) {
  if (data) {
    _cachedDb = data;
  }
  const toSave = _cachedDb || data || getInitialSchema();
  try {
    const content = JSON.stringify(toSave, null, 2);
    // Write directly to DB_FILE to prevent temp file rename collisions on Windows / containers
    fs.writeFileSync(DB_FILE, content, 'utf-8');
  } catch (err) {
    console.error('Error saving DB to disk:', err);
  }
}

// Explicit administrative reset
export function resetDatabase() {
  _cachedDb = getInitialSchema();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(_cachedDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error during resetDatabase:', err);
  }
  return _cachedDb;
}
