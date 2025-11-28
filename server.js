const express = require('express');
const { sql } = require('@vercel/postgres');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.static(__dirname));

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS registros_dni (
      dni VARCHAR(32) PRIMARY KEY,
      name TEXT,
      last_check TEXT,
      total INTEGER DEFAULT 0
    )
  `;
}

async function readRecords() {
  await ensureTable();
  const { rows } = await sql`SELECT dni, name, last_check, total FROM registros_dni ORDER BY name ASC`;
  return rows.map((row) => ({
    dni: row.dni,
    name: row.name || '',
    lastCheck: row.last_check || '',
    total: Number(row.total) || 0,
  }));
}

async function writeRecords(records) {
  await sql.begin(async (tx) => {
    await tx`
      CREATE TABLE IF NOT EXISTS registros_dni (
        dni VARCHAR(32) PRIMARY KEY,
        name TEXT,
        last_check TEXT,
        total INTEGER DEFAULT 0
      )
    `;

    await tx`TRUNCATE TABLE registros_dni`;

    for (const record of records) {
      await tx`
        INSERT INTO registros_dni (dni, name, last_check, total)
        VALUES (${record.dni}, ${record.name}, ${record.lastCheck}, ${record.total})
      `;
    }
  });
}

app.get('/api/records', async (req, res) => {
  try {
    const records = await readRecords();
    res.json({ records });
  } catch (error) {
    console.error('No se pudo leer la base de datos', error);
    res.status(500).json({ error: 'No se pudo obtener los registros desde la base de datos.' });
  }
});

app.post('/api/records', async (req, res) => {
  const incoming = req.body;
  if (!Array.isArray(incoming)) {
    return res.status(400).json({ error: 'El formato de datos es inválido.' });
  }
  try {
    const normalized = incoming
      .map((row) => ({
        dni: String(row?.dni || '').replace(/\D/g, ''),
        name: row?.name ? String(row.name).trim() : '',
        lastCheck: row?.lastCheck ? String(row.lastCheck) : '',
        total: Number.isFinite(Number(row?.total)) ? Number(row.total) : 0,
      }))
      .filter((row) => row.dni);

    await writeRecords(normalized);
    res.json({ ok: true, records: normalized });
  } catch (error) {
    console.error('No se pudo escribir en la base de datos', error);
    res.status(500).json({ error: 'No se pudo guardar los registros en la base de datos.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
