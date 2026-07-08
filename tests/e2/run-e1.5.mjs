#!/usr/bin/env node
// run-e1.5.mjs — Market Data Interface smoke test
// Usage: node tests/e2/run-e1.5.mjs
// Validates the template CSV + importer + validator work end-to-end.

import { importCSV } from './importer.mjs';
import { validateDataset } from './validator.mjs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('=' .repeat(72));
console.log('  Sprint E1.5 — Market Data Interface');
console.log('=' .repeat(72));

// Step 1: Import template
const templatePath = resolve(__dirname, 'templates/idx80-export.csv');
console.log('\n[1/3] Importing template CSV...');
const data = importCSV(templatePath);
console.log(`  ${data.length} rows imported`);

// Step 2: Validate
console.log('[2/3] Validating dataset...');
const report = validateDataset(data);

if (report.errors.length > 0) {
  console.log(`  Errors: ${report.errors.length}`);
  for (const e of report.errors) console.log(`    ✗ ${e}`);
}
if (report.warnings.length > 0) {
  console.log(`  Warnings: ${report.warnings.length}`);
  for (const w of report.warnings) console.log(`    ⚠ ${w}`);
}
console.log(`  Valid: ${report.valid ? '✅ YES' : '❌ NO'}`);

// Step 3: Summary
console.log('[3/3] Dataset summary...');
console.log(`  Tickers:  ${report.uniqueTickers}`);
console.log(`  Date:     ${report.dateRange.min} → ${report.dateRange.max}`);
console.log(`  Score Δ:  mean ${report.stats.delta.mean.toFixed(2)}, range [${report.stats.delta.min.toFixed(1)}, ${report.stats.delta.max.toFixed(1)}]`);

// Verify template data is usable
console.log('\n  Sample rows:');
for (const row of data.slice(0, 3)) {
  console.log(`    ${row.ticker} | ${row.date} | base=${row.baseline_score} | mtf=${row.mtf_score} | signal: ${row.signal_base}→${row.signal_mtf}`);
}

console.log('\n✅ E1.5 pipeline ready. Awaiting real TradingView export.');
