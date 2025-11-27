const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'registros_dni.json');

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

function readRecords() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('No se pudo leer el archivo de datos', error);
    return [];
  }
}

function writeRecords(records) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

app.get('/api/records', (req, res) => {
  const records = readRecords();
  res.json({ records });
});

app.post('/api/records', (req, res) => {
  const incoming = req.body;
  if (!Array.isArray(incoming)) {
    return res.status(400).json({ error: 'El formato de datos es inválido.' });
  }
  try {
    writeRecords(incoming);
    res.json({ ok: true });
  } catch (error) {
    console.error('No se pudo escribir el archivo de datos', error);
    res.status(500).json({ error: 'No se pudo guardar el archivo en el servidor.' });
  }
});

app.listen(PORT, () => {
  ensureDataFile();
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
