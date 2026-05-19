const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;
const dataDir = path.join(__dirname, 'data');

const usePostgres = !!process.env.DATABASE_URL;
let pgPool = null;

if (usePostgres) {
  pgPool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
}

// SQLite DBs (local development fallback)
const taskDb = new sqlite3.Database(path.join(dataDir, 'task-data.db'));
const exerciseDb = new sqlite3.Database(path.join(dataDir, 'exercise-data.db'));
const foodDb = new sqlite3.Database(path.join(dataDir, 'food-data.db'));

const runSqlite = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) return reject(err);
    resolve({ lastID: this.lastID, changes: this.changes });
  });
});

const allSqlite = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) return reject(err);
    resolve(rows);
  });
});

const runPg = async (sql, params = []) => {
  const res = await pgPool.query(sql, params);
  return { lastID: res.rows[0] ? res.rows[0].id : undefined, rows: res.rows, rowCount: res.rowCount };
};

const allPg = async (sql, params = []) => {
  const res = await pgPool.query(sql, params);
  return res.rows;
};

const initDb = async () => {
  if (usePostgres) {
    // Create Postgres tables
    await runPg(`CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      points INTEGER NOT NULL,
      status TEXT NOT NULL,
      date TEXT NOT NULL,
      createdAt BIGINT NOT NULL
    )`);

    await runPg(`CREATE TABLE IF NOT EXISTS exercises (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      calories_burned INTEGER NOT NULL,
      date TEXT NOT NULL,
      completed BOOLEAN NOT NULL
    )`);

    await runPg(`CREATE TABLE IF NOT EXISTS foods (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      calories_per_100g REAL NOT NULL,
      protein_per_100g REAL NOT NULL,
      carbs_per_100g REAL NOT NULL,
      fat_per_100g REAL NOT NULL
    )`);

    await runPg(`CREATE TABLE IF NOT EXISTS food_log (
      id SERIAL PRIMARY KEY,
      food TEXT NOT NULL,
      quantity_g REAL NOT NULL,
      calories REAL NOT NULL,
      protein REAL NOT NULL,
      carbs REAL NOT NULL,
      fat REAL NOT NULL,
      date TEXT NOT NULL,
      createdAt BIGINT NOT NULL
    )`);
  } else {
    // SQLite local tables
    taskDb.serialize(() => {
      taskDb.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        points INTEGER NOT NULL,
        status TEXT NOT NULL,
        date TEXT NOT NULL,
        createdAt INTEGER NOT NULL
      )`);
    });

    exerciseDb.serialize(() => {
      exerciseDb.run(`CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        calories_burned INTEGER NOT NULL,
        date TEXT NOT NULL,
        completed INTEGER NOT NULL
      )`);
    });

    foodDb.serialize(() => {
      foodDb.run(`CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        calories_per_100g REAL NOT NULL,
        protein_per_100g REAL NOT NULL,
        carbs_per_100g REAL NOT NULL,
        fat_per_100g REAL NOT NULL
      )`);

      foodDb.run(`CREATE TABLE IF NOT EXISTS food_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        food TEXT NOT NULL,
        quantity_g REAL NOT NULL,
        calories REAL NOT NULL,
        protein REAL NOT NULL,
        carbs REAL NOT NULL,
        fat REAL NOT NULL,
        date TEXT NOT NULL,
        createdAt INTEGER NOT NULL
      )`);
    });
  }
};

initDb().catch(err => console.error('DB init error', err));

app.use(express.json());

// Helper functions to route queries to Postgres or SQLite depending on env
const allQuery = async (source, sql) => {
  if (usePostgres) return allPg(sql);
  if (source === 'tasks') return allSqlite(taskDb, sql);
  if (source === 'exercises') return allSqlite(exerciseDb, sql);
  if (source === 'foods') return allSqlite(foodDb, sql);
  if (source === 'food_log') return allSqlite(foodDb, sql);
  return [];
};

const runQuery = async (source, sql, params = []) => {
  if (usePostgres) return runPg(sql, params);
  if (source === 'tasks') return runSqlite(taskDb, sql, params);
  if (source === 'exercises') return runSqlite(exerciseDb, sql, params);
  if (source === 'foods') return runSqlite(foodDb, sql, params);
  if (source === 'food_log') return runSqlite(foodDb, sql, params);
  return null;
};

app.get('/api/tasks', async (req, res) => {
  try {
    const rows = await allQuery('tasks', 'SELECT * FROM tasks ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to read tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { name, points, status, date, createdAt } = req.body;
    if (usePostgres) {
      const r = await runQuery('tasks', 'INSERT INTO tasks (name, points, status, date, createdAt) VALUES ($1, $2, $3, $4, $5) RETURNING id', [name, points, status, date, createdAt]);
      res.status(201).json({ id: r.lastID || (r.rows && r.rows[0] && r.rows[0].id), name, points, status, date, createdAt });
    } else {
      const r = await runQuery('tasks', 'INSERT INTO tasks (name, points, status, date, createdAt) VALUES (?, ?, ?, ?, ?)', [name, points, status, date, createdAt]);
      res.status(201).json({ id: r.lastID, name, points, status, date, createdAt });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to save task' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const id = Number(req.params.id);
    if (usePostgres) {
      await runQuery('tasks', 'UPDATE tasks SET status = $1 WHERE id = $2', [status, id]);
    } else {
      await runQuery('tasks', 'UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    }
    res.json({ id, status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (usePostgres) {
      await runQuery('tasks', 'DELETE FROM tasks WHERE id = $1', [id]);
    } else {
      await runQuery('tasks', 'DELETE FROM tasks WHERE id = ?', [id]);
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete task' });
  }
});

app.get('/api/foods', async (req, res) => {
  try {
    const rows = await allQuery('foods', usePostgres ? 'SELECT * FROM foods ORDER BY name ASC' : 'SELECT * FROM foods ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to read foods' });
  }
});

app.post('/api/foods', async (req, res) => {
  try {
    const { name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g } = req.body;
    if (usePostgres) {
      const r = await runQuery('foods', 'INSERT INTO foods (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g) VALUES ($1,$2,$3,$4,$5) RETURNING id', [name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g]);
      res.status(201).json({ id: r.lastID || (r.rows && r.rows[0] && r.rows[0].id), name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g });
    } else {
      const r = await runQuery('foods', 'INSERT INTO foods (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g) VALUES (?, ?, ?, ?, ?)', [name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g]);
      res.status(201).json({ id: r.lastID, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to save food item' });
  }
});

app.get('/api/food-log', async (req, res) => {
  try {
    const rows = await allQuery('food_log', usePostgres ? 'SELECT * FROM food_log ORDER BY createdAt DESC' : 'SELECT * FROM food_log ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to read food log' });
  }
});

app.post('/api/food-log', async (req, res) => {
  try {
    const { food, quantity_g, calories, protein, carbs, fat, date, createdAt } = req.body;
    if (usePostgres) {
      const r = await runQuery('food_log', 'INSERT INTO food_log (food, quantity_g, calories, protein, carbs, fat, date, createdAt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id', [food, quantity_g, calories, protein, carbs, fat, date, createdAt]);
      res.status(201).json({ id: r.lastID || (r.rows && r.rows[0] && r.rows[0].id), food, quantity_g, calories, protein, carbs, fat, date, createdAt });
    } else {
      const r = await runQuery('food_log', 'INSERT INTO food_log (food, quantity_g, calories, protein, carbs, fat, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [food, quantity_g, calories, protein, carbs, fat, date, createdAt]);
      res.status(201).json({ id: r.lastID, food, quantity_g, calories, protein, carbs, fat, date, createdAt });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to save food log entry' });
  }
});

app.delete('/api/food-log/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (usePostgres) {
      await runQuery('food_log', 'DELETE FROM food_log WHERE id = $1', [id]);
    } else {
      await runQuery('food_log', 'DELETE FROM food_log WHERE id = ?', [id]);
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete food log entry' });
  }
});

app.get('/api/exercises', async (req, res) => {
  try {
    const rows = await allQuery('exercises', usePostgres ? 'SELECT * FROM exercises ORDER BY date DESC' : 'SELECT * FROM exercises ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to read exercises' });
  }
});

app.post('/api/exercises', async (req, res) => {
  try {
    const { name, duration_minutes, calories_burned, date, completed } = req.body;
    if (usePostgres) {
      const r = await runQuery('exercises', 'INSERT INTO exercises (name, duration_minutes, calories_burned, date, completed) VALUES ($1,$2,$3,$4,$5) RETURNING id', [name, duration_minutes, calories_burned, date, completed]);
      res.status(201).json({ id: r.lastID || (r.rows && r.rows[0] && r.rows[0].id), name, duration_minutes, calories_burned, date, completed });
    } else {
      const r = await runQuery('exercises', 'INSERT INTO exercises (name, duration_minutes, calories_burned, date, completed) VALUES (?, ?, ?, ?, ?)', [name, duration_minutes, calories_burned, date, completed]);
      res.status(201).json({ id: r.lastID, name, duration_minutes, calories_burned, date, completed });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to save exercise entry' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
