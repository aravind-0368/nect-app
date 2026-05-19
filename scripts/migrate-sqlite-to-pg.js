#!/usr/bin/env node
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Please set DATABASE_URL environment variable (Postgres/Supabase connection string)');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

const dataDir = path.join(__dirname, '..', 'data');

async function migrateTasks() {
  const dbPath = path.join(dataDir, 'task-data.db');
  const db = new sqlite3.Database(dbPath);
  const rows = await new Promise((resolve, reject) => db.all('SELECT * FROM tasks', (err, r) => err ? reject(err) : resolve(r)));
  console.log(`Migrating ${rows.length} tasks`);
  for (const r of rows) {
    await pool.query('INSERT INTO tasks (name, points, status, date, createdAt) VALUES ($1,$2,$3,$4,$5)', [r.name, r.points, r.status, r.date, r.createdAt]);
  }
  db.close();
}

async function migrateExercises() {
  const dbPath = path.join(dataDir, 'exercise-data.db');
  const db = new sqlite3.Database(dbPath);
  let rows = [];
  try {
    rows = await new Promise((resolve, reject) => db.all('SELECT * FROM exercises', (err, r) => err ? reject(err) : resolve(r)));
  } catch (e) {
    console.log('No exercises table found or empty');
  }
  console.log(`Migrating ${rows.length} exercises`);
  for (const r of rows) {
    await pool.query('INSERT INTO exercises (name, duration_minutes, calories_burned, date, completed) VALUES ($1,$2,$3,$4,$5)', [r.name, r.duration_minutes, r.calories_burned, r.date, !!r.completed]);
  }
  db.close();
}

async function migrateFoods() {
  const dbPath = path.join(dataDir, 'food-data.db');
  const db = new sqlite3.Database(dbPath);
  let foods = [];
  try {
    foods = await new Promise((resolve, reject) => db.all('SELECT * FROM foods', (err, r) => err ? reject(err) : resolve(r)));
  } catch (e) {
    console.log('No foods table found or empty');
  }
  console.log(`Migrating ${foods.length} foods`);
  for (const f of foods) {
    await pool.query('INSERT INTO foods (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g) VALUES ($1,$2,$3,$4,$5)', [f.name, f.calories_per_100g, f.protein_per_100g, f.carbs_per_100g, f.fat_per_100g]);
  }

  // migrate food_log if present
  let logs = [];
  try {
    logs = await new Promise((resolve, reject) => db.all('SELECT * FROM food_log', (err, r) => err ? reject(err) : resolve(r)));
  } catch (e) {
    // ignore
  }
  console.log(`Migrating ${logs.length} food log entries`);
  for (const l of logs) {
    await pool.query('INSERT INTO food_log (food, quantity_g, calories, protein, carbs, fat, date, createdAt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [l.food, l.quantity_g, l.calories, l.protein, l.carbs, l.fat, l.date, l.createdAt]);
  }

  db.close();
}

async function run() {
  try {
    console.log('Checking Postgres connection...');
    await pool.query('SELECT 1');
    console.log('Connected to Postgres.');

    await migrateTasks();
    await migrateExercises();
    await migrateFoods();

    console.log('Migration completed.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

run();
