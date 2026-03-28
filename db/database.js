import * as SQLite from 'expo-sqlite';

let db = null;

export async function getDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('notes.db');
    await initTables();
  }
  return db;
}

async function initTables() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
    );
  `);
}

// 获取所有笔记
export async function getAllNotes() {
  const db = await getDB();
  return await db.getAllAsync(
    'SELECT * FROM notes ORDER BY updated_at DESC'
  );
}

// 搜索笔记
export async function searchNotes(keyword) {
  const db = await getDB();
  const kw = `%${keyword}%`;
  return await db.getAllAsync(
    'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC',
    [kw, kw]
  );
}

// 按标签筛选
export async function getNotesByTag(tag) {
  const db = await getDB();
  return await db.getAllAsync(
    'SELECT * FROM notes WHERE tags LIKE ? ORDER BY updated_at DESC',
    [`%${tag}%`]
  );
}

// 获取单条笔记
export async function getNoteById(id) {
  const db = await getDB();
  return await db.getFirstAsync('SELECT * FROM notes WHERE id = ?', [id]);
}

// 新建笔记
export async function createNote(title, content, tags) {
  const db = await getDB();
  const now = Date.now();
  const result = await db.runAsync(
    'INSERT INTO notes (title, content, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
    [title, content, tags, now, now]
  );
  return result.lastInsertRowId;
}

// 更新笔记
export async function updateNote(id, title, content, tags) {
  const db = await getDB();
  const now = Date.now();
  await db.runAsync(
    'UPDATE notes SET title = ?, content = ?, tags = ?, updated_at = ? WHERE id = ?',
    [title, content, tags, now, id]
  );
}

// 删除笔记
export async function deleteNote(id) {
  const db = await getDB();
  await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
}

// 获取所有标签
export async function getAllTags() {
  const db = await getDB();
  const rows = await db.getAllAsync('SELECT tags FROM notes');
  const tagSet = new Set();
  rows.forEach(row => {
    if (row.tags) {
      row.tags.split(',').forEach(t => {
        const trimmed = t.trim();
        if (trimmed) tagSet.add(trimmed);
      });
    }
  });
  return [...tagSet].sort();
}

// 导出所有笔记为 JSON
export async function exportAllNotes() {
  const db = await getDB();
  return await db.getAllAsync('SELECT * FROM notes ORDER BY id');
}

// 从 JSON 导入笔记
export async function importNotes(notes) {
  const db = await getDB();
  await db.withTransactionAsync(async () => {
    for (const note of notes) {
      await db.runAsync(
        'INSERT OR REPLACE INTO notes (id, title, content, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [note.id, note.title, note.content, note.tags, note.created_at, note.updated_at]
      );
    }
  });
}
