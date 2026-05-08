const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();

async function migrate() {
  const db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
  try {
    await db.run('ALTER TABLE users ADD COLUMN created_at TEXT');
    console.log('Added created_at column');
  } catch (e) {
    console.log('created_at already exists or error:', e.message);
  }
  await db.run("UPDATE users SET created_at = datetime('now') WHERE created_at IS NULL");
  const cols = await db.all('PRAGMA table_info(users)');
  console.log('Columns:', cols.map(c => c.name).join(', '));
  process.exit(0);
}
migrate().catch(console.error);
