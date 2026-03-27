import * as SQLite from 'expo-sqlite';

let db = null;

export async function getDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('notes.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT DEFAULT '',
        content TEXT DEFAULT '',
        tags TEXT DEFAULT '[]',
        created_at INTEGER,
        updated_at INTEGER
      );
    `);
  }
  return db;
}

export async function getAllNotes() {
  const database = await getDB();
  const rows = await database.getAllAsync('SELECT * FROM notes ORDER BY updated_at DESC');
  return rows.map(r => ({
    ...r,
    tags: JSON.parse(r.tags || '[]')
  }));
}

export async function getNote(id) {
  const database = await getDB();
  const row = await database.getFirstAsync('SELECT * FROM notes WHERE id = ?', [id]);
  if (row) row.tags = JSON.parse(row.tags || '[]');
  return row;
}

export async function createNote(title, content, tags = []) {
  const database = await getDB();
  const now = Date.now();
  const result = await database.runAsync(
    'INSERT INTO notes (title, content, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
    [title, content, JSON.stringify(tags), now, now]
  );
  return result.lastInsertRowId;
}

export async function updateNote(id, title, content, tags) {
  const database = await getDB();
  await database.runAsync(
    'UPDATE notes SET title = ?, content = ?, tags = ?, updated_at = ? WHERE id = ?',
    [title, content, JSON.stringify(tags), Date.now(), id]
  );
}

export async function deleteNote(id) {
  const database = await getDB();
  await database.runAsync('DELETE FROM notes WHERE id = ?', [id]);
}

export async function searchNotes(query) {
  const database = await getDB();
  const rows = await database.getAllAsync(
    'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC',
    [`%${query}%`, `%${query}%`]
  );
  return rows.map(r => ({ ...r, tags: JSON.parse(r.tags || '[]') }));
}

export async function getNotesByTag(tag) {
  const database = await getDB();
  const rows = await database.getAllAsync('SELECT * FROM notes ORDER BY updated_at DESC');
  return rows
    .map(r => ({ ...r, tags: JSON.parse(r.tags || '[]') }))
    .filter(r => r.tags.includes(tag));
}

export async function getAllTags() {
  const database = await getDB();
  const rows = await database.getAllAsync('SELECT tags FROM notes');
  const tagSet = new Set();
  rows.forEach(r => {
    JSON.parse(r.tags || '[]').forEach(t => tagSet.add(t));
  });
  return [...tagSet].sort();
}

export async function exportNotes() {
  const database = await getDB();
  const rows = await database.getAllAsync('SELECT * FROM notes ORDER BY id');
  return rows.map(r => ({ ...r, tags: JSON.parse(r.tags || '[]') }));
}

export async function importNotes(notes) {
  const database = await getDB();
  for (const n of notes) {
    if (n.title !== undefined && n.content !== undefined) {
      await database.runAsync(
        'INSERT OR REPLACE INTO notes (id, title, content, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [n.id, n.title, n.content, JSON.stringify(n.tags || []), n.created_at || Date.now(), n.updated_at || Date.now()]
      );
    }
  }
}
