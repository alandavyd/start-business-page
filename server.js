const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE_DIR = __dirname;
// Artifact brain directory for AI-generated images
const BRAIN_DIR = 'C:\\Users\\aland\\.gemini\\antigravity\\brain\\516e463d-9acb-48ca-b374-257bbeedb2ba';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');

  let urlPath = req.url === '/' ? '/index.html' : req.url;
  urlPath = decodeURIComponent(urlPath.split('?')[0]);

  // Special route: /brain/:filename  → serve from brain artifact dir
  if (urlPath.startsWith('/brain/')) {
    const filename = urlPath.replace('/brain/', '');
    const filePath = path.join(BRAIN_DIR, filename);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Image not found: ' + filename);
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
    return;
  }

  // Default: serve from project directory
  const filePath = path.join(BASE_DIR, urlPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 - Not Found: ' + urlPath);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n⭐ STAR BUSINESS — Terapia Capilar Server running!`);
  console.log(`➜  Local: http://localhost:${PORT}\n`);
});
