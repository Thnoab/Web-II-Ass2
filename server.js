// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'YOUR_DB_PASSWORD',
  database: process.env.DB_NAME || 'charityevents_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const sql = `
      SELECT e.*, c.name AS category_name, o.name AS org_name,
        CASE WHEN e.date < CURDATE() THEN 'past' ELSE 'upcoming' END AS status
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN organizations o ON e.org_id = o.id
      WHERE e.suspended = FALSE
      ORDER BY e.date ASC
    `;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { date, location, category } = req.query;
    let sql = `
      SELECT e.*, c.name AS category_name, o.name AS org_name,
        CASE WHEN e.date < CURDATE() THEN 'past' ELSE 'upcoming' END AS status
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN organizations o ON e.org_id = o.id
      WHERE e.suspended = FALSE
    `;
    const params = [];
    if (date) { sql += ' AND e.date = ?'; params.push(date); }
    if (location) { sql += ' AND e.location LIKE ?'; params.push(`%${location}%`); }
    if (category) { sql += ' AND e.category_id = ?'; params.push(category); }
    sql += ' ORDER BY e.date ASC';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const sql = `
      SELECT e.*, c.name AS category_name, o.name AS org_name,
        CASE WHEN e.date < CURDATE() THEN 'past' ELSE 'upcoming' END AS status
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN organizations o ON e.org_id = o.id
      WHERE e.id = ? AND e.suspended = FALSE
      LIMIT 1
    `;
    const [rows] = await db.query(sql, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
