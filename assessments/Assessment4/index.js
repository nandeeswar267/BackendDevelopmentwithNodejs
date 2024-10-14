const http = require('http');
const url = require('url');

// User database object (stores user data in memory)
let users = {};

// Create HTTP Server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true); // Parse URL
    const method = req.method;
    
    // Set response header for JSON response
    res.setHeader('Content-Type', 'application/json');

    if (method === 'POST') {
        let body = '';
        
        // Collect POST data
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            const data = JSON.parse(body);
            
            // Signup logic
            if (parsedUrl.pathname === '/signup') {
                const { username, password } = data;
                
                if (users[username]) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ message: 'User already exists' }));
                } else {
                    users[username] = { password };
                    res.statusCode = 200;
                    res.end(JSON.stringify({ message: 'Signup successful' }));
                }
            }

            // Login logic
            else if (parsedUrl.pathname === '/login') {
                const { username, password } = data;
                
                if (users[username] && users[username].password === password) {
                    res.statusCode = 200;
                    res.end(JSON.stringify({ message: 'Login successful' }));
                } else {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ message: 'Invalid username or password' }));
                }
            }

            // Forgot Password logic
            else if (parsedUrl.pathname === '/forgotpassword') {
                const { username, newPassword } = data;
                
                if (users[username]) {
                    users[username].password = newPassword;
                    res.statusCode = 200;
                    res.end(JSON.stringify({ message: 'Password reset successful' }));
                } else {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ message: 'User not found' }));
                }
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'Route not found' }));
            }
        });
    } else {
        res.statusCode = 405;
        res.end(JSON.stringify({ message: 'Method not allowed' }));
    }
});

// Server listens on port 3000
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
