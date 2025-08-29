// server.js
// npm i express
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Carpeta pública con tu index.html
const WEBROOT = path.resolve(__dirname, 'public');
// Directorio de datos (en Render, montaremos un Persistent Disk aquí)
const DATA_DIR = process.env.DATA_DIR || path.join(WEBROOT); // por defecto junto a la página
const LIB_PATH = path.join(DATA_DIR, 'library.json');

app.use(express.json({ limit: '2mb' }));
app.use(express.static(WEBROOT, { etag: false, lastModified: false }));

// Asegura que DATA_DIR exista
fs.mkdirSync(DATA_DIR, { recursive: true });

// GET /library.json -> lee SIEMPRE del disco persistente
app.get('/library.json', (req, res) => {
  if (!fs.existsSync(LIB_PATH)) return res.json([]);
  try {
    const data = JSON.parse(fs.readFileSync(LIB_PATH, 'utf8') || '[]');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'No se pudo leer library.json' });
  }
});

// API opcional para leer (no imprescindible porque ya servimos /library.json)
app.get('/api/library', (req, res) => {
  if (!fs.existsSync(LIB_PATH)) return res.json([]);
  try {
    const data = JSON.parse(fs.readFileSync(LIB_PATH, 'utf8') || '[]');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'No se pudo leer library.json' });
  }
});

// Guardar en disco persistente
app.put('/api/library', (req, res) => {
  const body = req.body;
  if (!Array.isArray(body)) {
    return res.status(400).json({ error: 'El cuerpo debe ser un arreglo JSON' });
  }
  try {
    fs.writeFileSync(LIB_PATH, JSON.stringify(body, null, 2), 'utf8');
    res.status(200).send('ok');
  } catch (e) {
    res.status(500).json({ error: 'No se pudo escribir library.json' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor en http://localhost:' + PORT);
  console.log('Sirviendo', WEBROOT, 'y guardando en', DATA_DIR);
});
