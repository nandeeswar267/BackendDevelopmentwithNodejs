import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { join } from 'node:path';

const server = createServer((req, res) => {
  // Check if the request is for the HTML file
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = join(process.cwd(), 'index.html'); // Path to your HTML file

    // Set the correct content type for HTML
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // Stream the HTML file to the response
    const readStream = createReadStream(filePath);
    
    // Pipe the file stream to the response
    readStream.pipe(res);

    // Handle file read errors
    readStream.on('error', (err) => {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    });
  } else {
    // Handle other routes or invalid requests
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Not Found');
  }
});

// Start the server on port 3000
server.listen(3000, '127.0.0.1', () => {
  console.log('Server is running on http://127.0.0.1:3000');
});
