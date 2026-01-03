import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Serve static files from the dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes and serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), { root: '.' });
});

const PORT = process.env.PORT || 4173;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`App running on http://localhost:${PORT}`);
});