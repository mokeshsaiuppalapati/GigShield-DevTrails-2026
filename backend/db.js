const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./gigshield.db');

db.serialize(()=>{

db.run(`CREATE TABLE IF NOT EXISTS workers (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT,
 phone TEXT,
 zone TEXT,
 upi TEXT,
 income REAL
)`);

db.run(`CREATE TABLE IF NOT EXISTS policies (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 worker_id INTEGER,
 plan TEXT,
 premium REAL,
 max_cap REAL,
 start_date TEXT,
 end_date TEXT,
 status TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS claims (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 worker_id INTEGER,
 type TEXT,
 amount REAL,
 hours REAL,
 zone TEXT,
 status TEXT
)`);

});

module.exports = db;