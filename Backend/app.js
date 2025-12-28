const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vulnshop"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

// ❌ Vulnerable Login (SQL Injection)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `
    SELECT * FROM users
    WHERE username = '${username}'
    AND password = '${password}'
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length > 0) {
      const token = jwt.sign({ user: result[0] }, "secret");
      res.json({ success: true, token });
    } else {
      res.json({ success: false });
    }
  });
});

// ❌ XSS Vulnerable Products
app.get('/products', (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    res.json(result);
  });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
