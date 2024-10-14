const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // Replace with your host
  user: 'localhost', // Replace with your MySQL username
  password: 'root', // Replace with your MySQL password
  database: 'users', // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// API for Signup
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Insert user into the database
  db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    (error, results) => {
      if (error) {
        console.error('Error inserting user:', error);
        return res.status(500).json({ message: 'Error creating user' });
      }
      res.status(201).json({ message: 'User created successfully!' });
    }
  );
});

// API for Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (error, results) => {
      if (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = results[0];

      // Check if passwords match
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.status(200).json({ message: 'Login successful!' });
    }
  );
});

// API for Forgot Password
app.post('/forgot-password', (req, res) => {
  const { username, newPassword } = req.body;

  // Update user password in the database
  db.query(
    'UPDATE users SET password = ? WHERE username = ?',
    [newPassword, username],
    (error, results) => {
      if (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Password updated successfully!' });
    }
  );
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
