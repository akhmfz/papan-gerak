// importer.mjs — CSV Market Data Importer
// Reads TradingView export CSV, normalizes, outputs structured JS objects.
// Supports both daily and multi-TF export formats.
//
// Usage:
//   import { importCSV } from './importer.mjs';
//   const data = importCSV('path/to/export.csv');

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const REQUIRED_COLS = [
  'ticker', 'date', 'baseline_score', 'mtf_score',
];

const OPTIONAL_COLS = [
  'timeframe', 'trend', 'momentum', 'volatility', 'volume',
  'mtf_direction', 'mtf_penalty_pct', 'signal_base', 'signal_mtf',
];

const VALID_SIGNALS = ['BUY', 'SELL', 'HOLD', ''];

function parseValue(val, col) {
  if (val === '' || val === undefined || val === null) return null;
  // Date and signal columns are always strings
  if (col === 'date' || col === 'timeframe' || col.startsWith('signal_')) {
    return val.trim();
  }
  const num = parseFloat(val);
  if (isNaN(num)) return val.trim();
  return num;
}

export function importCSV(filePath) {
  if (!existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  const raw = readFileSync(filePath, 'utf-8').trim();
  if (!raw) return [];

  const lines = raw.split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  // Validate required columns exist
  for (const col of REQUIRED_COLS) {
    if (!headers.includes(col)) {
      throw new Error(`Missing required column: ${col}. Found: ${headers.join(', ')}`);
    }
  }

  const colMap = {};
  headers.forEach((h, i) => { colMap[h] = i; });

  const rows = [];
  const seen = new Set();

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    const vals = rawLine.split(',').map(v => v.trim());
    const row = { _line: i + 1, _raw: rawLine };

    for (const col of [...REQUIRED_COLS, ...OPTIONAL_COLS]) {
      if (colMap[col] !== undefined) {
        row[col] = parseValue(vals[colMap[col]] || '', col);
      }
    }

    // Validate required fields
    if (!row.ticker) {
      console.warn(`  ⚠ Line ${i + 1}: missing ticker, skipping`);
      continue;
    }
    if (!row.date) {
      console.warn(`  ⚠ Line ${i + 1}: missing date, skipping`);
      continue;
    }
    if (row.baseline_score === null) {
      console.warn(`  ⚠ Line ${i + 1}: missing baseline_score, skipping`);
      continue;
    }
    if (row.mtf_score === null) {
      console.warn(`  ⚠ Line ${i + 1}: missing mtf_score, skipping`);
      continue;
    }

    // Dedup check
    const key = `${row.ticker}|${row.date}`;
    if (seen.has(key)) {
      console.warn(`  ⚠ Line ${i + 1}: duplicate ${key}, keeping first occurrence`);
      continue;
    }
    seen.add(key);

    // Normalize signal values
    if (row.signal_base && !VALID_SIGNALS.includes(row.signal_base)) {
      console.warn(`  ⚠ Line ${i + 1}: invalid signal_base "${row.signal_base}", setting to HOLD`);
      row.signal_base = 'HOLD';
    }
    if (row.signal_mtf && !VALID_SIGNALS.includes(row.signal_mtf)) {
      console.warn(`  ⚠ Line ${i + 1}: invalid signal_mtf "${row.signal_mtf}", setting to HOLD`);
      row.signal_mtf = 'HOLD';
    }

    rows.push(row);
  }

  // Sort by ticker, then date
  rows.sort((a, b) => {
    if (a.ticker < b.ticker) return -1;
    if (a.ticker > b.ticker) return 1;
    return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
  });

  return rows;
}
