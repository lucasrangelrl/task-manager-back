const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tasks.db');

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL
  )
`);

module.exports = db;