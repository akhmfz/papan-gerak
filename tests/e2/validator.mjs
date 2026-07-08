// validator.mjs — CSV Dataset Validator
// Checks dataset integrity before running experiments.
//
// Usage:
//   import { validateDataset } from './validator.mjs';
//   const report = validateDataset(data);

const VALID_TICKER_RE = /^[A-Z0-9]{2,10}$/;
const VALID_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateDataset(rows) {
  const report = {
    totalRows: rows.length,
    uniqueTickers: [...new Set(rows.map(r => r.ticker))].length,
    tickerList: [...new Set(rows.map(r => r.ticker))].sort(),
    dateRange: { min: null, max: null },
    errors: [],
    warnings: [],
    stats: {},
  };

  if (rows.length === 0) {
    report.errors.push('Empty dataset');
    return report;
  }

  // Date range
  const dates = rows.map(r => r.date).filter(Boolean).sort();
  if (dates.length > 0) {
    report.dateRange.min = dates[0];
    report.dateRange.max = dates[dates.length - 1];
  }

  // Per-ticker checks
  const tickerMap = {};
  for (const row of rows) {
    if (!tickerMap[row.ticker]) tickerMap[row.ticker] = { count: 0, dates: [] };
    tickerMap[row.ticker].count++;
    tickerMap[row.ticker].dates.push(row.date);
  }

  // Run checks
  for (const row of rows) {
    // Check ticker format
    if (!VALID_TICKER_RE.test(row.ticker)) {
      report.errors.push(`Line ${row._line}: invalid ticker format "${row.ticker}"`);
    }

    // Check date format
    if (row.date && !VALID_DATE_RE.test(row.date)) {
      report.errors.push(`Line ${row._line}: invalid date format "${row.date}" (expected YYYY-MM-DD)`);
    }

    // Check score range (0-100)
    if (row.baseline_score !== null && (row.baseline_score < 0 || row.baseline_score > 100)) {
      report.errors.push(`Line ${row._line}: baseline_score ${row.baseline_score} out of range [0,100]`);
    }
    if (row.mtf_score !== null && (row.mtf_score < 0 || row.mtf_score > 100)) {
      report.errors.push(`Line ${row._line}: mtf_score ${row.mtf_score} out of range [0,100]`);
    }

    // Check optional component scores
    for (const col of ['trend', 'momentum', 'volatility', 'volume']) {
      if (row[col] !== undefined && row[col] !== null && (row[col] < 0 || row[col] > 100)) {
        report.warnings.push(`Line ${row._line}: ${col} ${row[col]} out of range [0,100]`);
      }
    }

    // Check NaN
    for (const col of ['baseline_score', 'mtf_score', 'trend', 'momentum', 'volatility', 'volume']) {
      if (row[col] !== null && row[col] !== undefined && isNaN(row[col])) {
        report.errors.push(`Line ${row._line}: ${col} is NaN`);
      }
    }

    // Check direction
    if (row.mtf_direction !== null && row.mtf_direction !== undefined && row.mtf_direction !== '') {
      const d = Number(row.mtf_direction);
      if (![-1, 0, 1].includes(d)) {
        report.warnings.push(`Line ${row._line}: mtf_direction ${row.mtf_direction} not in [-1, 0, 1]`);
      }
    }
  }

  // Cross-ticker checks
  const tickerCounts = Object.entries(tickerMap).map(([t, info]) => ({ ticker: t, ...info }));
  const expectedDays = Math.max(...tickerCounts.map(t => t.dates.length));
  const shortTickers = tickerCounts.filter(t => t.dates.length < expectedDays * 0.9);
  for (const t of shortTickers) {
    report.warnings.push(`Ticker ${t.ticker}: only ${t.dates.length} rows (expected ~${expectedDays})`);
  }

  // Gap detection (per ticker, sorted dates)
  for (const [ticker, info] of Object.entries(tickerMap)) {
    const sorted = [...info.dates].sort();
    for (let i = 1; i < sorted.length; i++) {
      const d1 = new Date(sorted[i - 1]);
      const d2 = new Date(sorted[i]);
      const diffDays = (d2 - d1) / (1000 * 60 * 60 * 24);
      if (diffDays > 5) {
        report.warnings.push(`Ticker ${ticker}: gap of ${diffDays} days between ${sorted[i - 1]} and ${sorted[i]}`);
        break; // Report first gap only per ticker
      }
    }
  }

  // Stats
  const baseScores = rows.map(r => r.baseline_score).filter(v => v !== null);
  const mtfScores = rows.map(r => r.mtf_score).filter(v => v !== null);
  const deltas = rows.map(r => (r.mtf_score !== null && r.baseline_score !== null) ? r.mtf_score - r.baseline_score : null).filter(v => v !== null);

  report.stats = {
    baselineScore: {
      min: Math.min(...baseScores),
      max: Math.max(...baseScores),
      mean: baseScores.reduce((a, b) => a + b, 0) / baseScores.length,
    },
    mtfScore: {
      min: Math.min(...mtfScores),
      max: Math.max(...mtfScores),
      mean: mtfScores.reduce((a, b) => a + b, 0) / mtfScores.length,
    },
    delta: {
      min: Math.min(...deltas),
      max: Math.max(...deltas),
      mean: deltas.reduce((a, b) => a + b, 0) / deltas.length,
    },
    tickerCounts: tickerCounts.map(t => ({ ticker: t.ticker, rows: t.count })),
  };

  report.valid = report.errors.length === 0;

  return report;
}
