import * as SQLite from 'expo-sqlite';

const DB_NAME = 'notes.db';
let db = null;

export async function getDB() {
  if (!db) {
    db = SQLite.openDatabase(DB_NAME);
    await initTables();
  }
  return db;
}

function initTables() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL DEFAULT '',
          content TEXT NOT NULL DEFAULT '',
          tags TEXT NOT NULL DEFAULT '',
          created_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
          updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
        );`,
        [],
        () => resolve(),
        (_, error) => { reject(error); return false; }
      );
    });
  });
}

// 封装查询
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql, params,
        (_, result) => resolve(result),
        (_, error) => { reject(error); return false; }
      );
    });
  });
}

// 获取所有笔记
export async function getAllNotes() {
  await getDB();
  const result = await runQuery('SELECT * FROM notes ORDER BY updated_at DESC');
  const rows = [];
  for (let i = 0; i < result.rows.length; i++) {
    rows.push(result.rows.item(i));
  }
  return rows;
}

// 搜索笔记
export async function searchNotes(keyword) {
  await getDB();
  const kw = `%${keyword}%`;
  const result = await runQuery(
    'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC',
    [kw, kw]
  );
  const rows = [];
  for (let i = 0; i < result.rows.length; i++) {
    rows.push(result.rows.item(i));
  }
  return rows;
}

// 按标签筛选
export async function getNotesByTag(tag) {
  await getDB();
  const result = await runQuery(
    'SELECT * FROM notes WHERE tags LIKE ? ORDER BY updated_at DESC',
    [`%${tag}%`]
  );
  const rows = [];
  for (let i = 0; i < result.rows.length; i++) {
    rows.push(result.rows.item(i));
  }
  return rows;
}

// 获取单条笔记
export async function getNoteById(id) {
  await getDB();
  const result = await runQuery('SELECT * FROM notes WHERE id = ?', [id]);
  if (result.rows.length > 0) {
    return result.rows.item(0);
  }
  return null;
}

// 新建笔记
export async function createNote(title, content, tags) {
  await getDB();
  const now = Date.now();
  const result = await runQuery(
    'INSERT INTO notes (title, content, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
    [title, content, tags, now, now]
  );
  return result.insertId;
}

// 更新笔记
export async function updateNote(id, title, content, tags) {
  await getDB();
  const now = Date.now();
  await runQuery(
    'UPDATE notes SET title = ?, content = ?, tags = ?, updated_at = ? WHERE id = ?',
    [title, content, tags, now, id]
  );
}

// 删除笔记
export async function deleteNote(id) {
  await getDB();
  await runQuery('DELETE FROM notes WHERE id = ?', [id]);
}

// 获取所有标签
export async function getAllTags() {
  await getDB();
  const result = await runQuery('SELECT tags FROM notes');
  const tagSet = new Set();
  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    if (row.tags) {
      row.tags.split(',').forEach(t => {
        const trimmed = t.trim();
        if (trimmed) tagSet.add(trimmed);
      });
    }
  }
  return [...tagSet].sort();
}

// 导出所有笔记为 JSON
export async function exportAllNotes() {
  return await getAllNotes();
}

// 从 JSON 导入笔记
export async function importNotes(notes) {
  await getDB();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      for (const note of notes) {
        tx.executeSql(
          'INSERT OR REPLACE INTO notes (id, title, content, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
          [note.id, note.title, note.content, note.tags, note.created_at, note.updated_at]
        );
      }
    }, reject, resolve);
  });
}
