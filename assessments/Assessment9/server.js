const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Serve the HTML file for the WebSocket client
  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading HTML file');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

// Create the WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

// Listen for WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  // Send a welcome message to the client
  ws.send('Welcome to the WebSocket server!');

  // Handle incoming messages from clients
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Client says: ${message}`);
      }
    });
  });

  // Handle WebSocket disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('HTTP and WebSocket server running on http://localhost:3000');
});
