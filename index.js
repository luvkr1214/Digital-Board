const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database(path.join(__dirname, 'mydb.sqlite'));

// ✅ Serve CSS, JS, and images from 'assets' folder
app.use(express.static(path.join(__dirname, 'assets')));

// ✅ Parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT
  )
`);

// ✅ Handle form submit
app.post('/submit', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send("Username required");

  db.run('INSERT INTO users (username) VALUES (?)', [username], function(err) {
    if (err) return res.status(500).send("DB error");
    res.send("User saved!");
  });
});

// ✅ Serve index.html from 'assets'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
