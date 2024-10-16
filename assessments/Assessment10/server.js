const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize Express app
const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server); // Bind Socket.IO to the HTTP server

// Serve the static HTML client
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Emit a welcome message when a client connects
  socket.emit('welcome', 'Welcome to the Socket.IO server!');

  // Listen for custom events from the client
  socket.on('message', (data) => {
    console.log(`Received message from ${socket.id}: ${data}`);

    // Broadcast the message to all other clients
    socket.broadcast.emit('message', data);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Socket.IO server is running on http://localhost:3000');
});
