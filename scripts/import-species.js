#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import admin from 'firebase-admin';

const serviceAccountPath = path.resolve('./serviceAccountKey.json');
const excelPath = path.resolve('./data/species.xlsx');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: coloca tu serviceAccountKey.json en la raíz del proyecto.');
  process.exit(1);
}
if (!fs.existsSync(excelPath)) {
  console.error('Error: coloca el archivo Excel en data/species.xlsx');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

function readExcelRows(p) {
  const wb = xlsx.readFile(p);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet, { defval: null });
}

async function importSpecies() {
  const rows = readExcelRows(excelPath);
  console.log('Filas leídas:', rows.length);

  let count = 0;
  for (const row of rows) {
    const doc = {
      name: row.name || row.Name || row.NOMBRE || '',
      scientificName: row.scientificName || row.ScientificName || row.CIENTIFICO || '',
      description: row.description || row.Description || row.DESCRIPCION || '',
      imageUrl: row.imageUrl || row.Image || row.IMAGE || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const ref = await db.collection('species').add(doc);
    console.log('Agregado:', ref.id, doc.name);
    count++;
  }
  console.log('Import completado. Total:', count);
}

importSpecies().catch(err => {
  console.error('Import error:', err);
  process.exit(1);
});
