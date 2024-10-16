const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 5000;

// MySQL connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nandees'
});

conn.connect((err) => {
    if (err) {
        console.log("DB Error: " + err);
    } else {
        console.log("MySQL DB Connected");
    }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Signup route
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    
    if (username && password) {
        const checkQuery = `SELECT * FROM users WHERE username = ?`;
        conn.query(checkQuery, [username], (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error checking username" });
            } else if (result.length > 0) {
                res.status(400).json({ message: "Username already exists" });
            } else {
                const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
                conn.query(insertQuery, [username, password], (err, result) => {
                    if (err) {
                        res.status(500).json({ message: "Signup failed" });
                    } else {
                        res.status(200).json({ message: "Signup successful" });
                    }
                });
            }
        });
    } else {
        res.status(400).json({ message: "Invalid input" });
    }
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username && password) {
        const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
        conn.query(query, [username, password], (err, result) => {
            if (err) {
                res.status(500).json({ message: "Login failed" });
            } else if (result.length > 0) {
                res.status(200).json({ message: "Login successful" });
            } else {
                res.status(400).json({ message: "Invalid credentials" });
            }
        });
    } else {
        res.status(400).json({ message: "Please provide username and password" });
    }
});

// 404 Not Found for other routes
app.use((req, res) => {
    res.status(404).send("404 Not Found");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
