const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


// like a mock data
pool.query(`
  CREATE TABLE IF NOT EXISTS lists (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
  );
  CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    list_id INTEGER REFERENCES lists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

app.get('/lists', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lists');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching lists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/lists', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query('INSERT INTO lists (title) VALUES ($1) RETURNING *', [title]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/cards', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cards ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/cards', async (req, res) => {
  try {
    const { list_id, title } = req.body;
    const result = await pool.query('INSERT INTO cards (list_id, title, updated_at) VALUES ($1, $2, NOW()) RETURNING *', [list_id, title]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/cards/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { list_id, title } = req.body;
      const result = await pool.query(
        'UPDATE cards SET list_id = $1, title = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [list_id, title, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating card:', error);
      res.status(500).json({ error: 'Internal server error'}); 
    }
  });

app.delete('/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM cards WHERE id = $1', [id]);
    res.json({ message: 'Card deleted' });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM lists WHERE id = $1', [id]);
    res.json({ message: 'List deleted' });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));