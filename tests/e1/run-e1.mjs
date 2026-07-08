#!/usr/bin/env node
// run-e1.mjs — Sprint E1: MTF Signal Quality Measurement
// Usage: node tests/e1/run-e1.mjs
// Output: console report + tests/e1/e1-report.json

import { generateDataset } from './synthetic-data.mjs';
import { computeStockScores } from './score-engine.mjs';
import {
  kpiSignalStability,
  kpiPersistence,
  kpiWhipsaw,
  kpiForwardReturn,
  kpiRankCorrelation,
  kpiCoverage,
  kpiDriftDistribution,
} from './kpi-engine.mjs';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('=' .repeat(72));
console.log('  Sprint E1 — MTF Signal Quality Measurement');
console.log('  Dataset: Synthetic IDX80 (seeded, deterministic)');
console.log('  Parameters: FROZEN (50/35/15, α=0.70, penalty=0.25, hysteresis=10)');
console.log('=' .repeat(72));

// Step 1: Generate dataset
console.log('\n[1/4] Generating synthetic dataset...');
const stocks = generateDataset(42);
console.log(`  ${stocks.length} stocks, ${stocks[0].days.length} days each`);

// Step 2: Compute scores
console.log('[2/4] Computing scores (baseline + MTF)...');
const allResults = {};
for (const stock of stocks) {
  allResults[stock.ticker] = computeStockScores(stock);
}
console.log(`  ${Object.keys(allResults).length} stocks scored`);

// Step 3: Compute KPIs
console.log('[3/4] Computing 7 KPIs...');

const stability = kpiSignalStability(allResults);
const persistence = kpiPersistence(allResults);
const whipsaw = kpiWhipsaw(allResults);
const forwardReturn = kpiForwardReturn(allResults);
const rankCorr = kpiRankCorrelation(allResults);
const coverage = kpiCoverage(allResults);
const drift = kpiDriftDistribution(allResults);

// Step 4: Report
console.log('[4/4] Generating report...\n');

function fmtPct(v) { return (v * 100).toFixed(1) + '%'; }

function mean(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }
function median(arr) { const s = [...arr].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; }

// --- KPI-1: Signal Stability ---
{
  const baseLarge = stability.filter(s => s.basePct > 10).length;
  const mtfLarge = stability.filter(s => s.mtfPct > 10).length;
  const baseMean = mean(stability.map(s => s.basePct));
  const mtfMean = mean(stability.map(s => s.mtfPct));
  console.log('KPI-1: Signal Stability (% stocks with >10pt Δ day-over-day)');
  console.log('  Baseline:  mean ' + baseMean.toFixed(1) + '% (' + baseLarge + '/' + stability.length + ' stocks >10%)');
  console.log('  MTF:       mean ' + mtfMean.toFixed(1) + '% (' + mtfLarge + '/' + stability.length + ' stocks >10%)');
  console.log('  Δ:         ' + (mtfMean - baseMean).toFixed(1) + ' pp' + (mtfMean < baseMean ? ' ✓ MTF lebih stabil' : ''));
  console.log();
}

// --- KPI-2: Signal Persistence ---
{
  const baseMean = mean(persistence.map(s => s.baseMean));
  const mtfMean = mean(persistence.map(s => s.mtfMean));
  const ratio = baseMean > 0 ? mtfMean / baseMean : 0;
  console.log('KPI-2: Signal Persistence (mean consecutive same-direction days)');
  console.log('  Baseline:  ' + baseMean.toFixed(1) + ' days');
  console.log('  MTF:       ' + mtfMean.toFixed(1) + ' days');
  console.log('  Ratio:     ' + ratio.toFixed(2) + 'x' + (ratio >= 1.2 ? ' ✓ MTF lebih persisten' : ''));
  console.log();
}

// --- KPI-3: Whipsaw Reduction ---
const _baseWhipsawTotal = whipsaw.reduce((a, s) => a + s.baseCount, 0);
const _mtfWhipsawTotal = whipsaw.reduce((a, s) => a + s.mtfCount, 0);
{
  console.log('KPI-3: Whipsaw Reduction (Bull→Bear→Bull flips within ≤3 bars)');
  console.log('  Baseline:  ' + _baseWhipsawTotal + ' whipsaw events');
  console.log('  MTF:       ' + _mtfWhipsawTotal + ' whipsaw events');
  const reduction = _baseWhipsawTotal > 0 ? (1 - _mtfWhipsawTotal / _baseWhipsawTotal) * 100 : 0;
  console.log('  Reduction: ' + reduction.toFixed(1) + '%' + (reduction >= 15 ? ' ✓ Target ≥15% tercapai' : reduction > 0 ? ' (positif, di bawah target 15%)' : ''));
  console.log();
}

// --- KPI-4: Forward Return ---
{
  console.log('KPI-4: Forward Return (top-20% score future score preservation)');
  for (const n of [3, 5, 10]) {
    const base = mean(forwardReturn.map(s => s['baseRet' + n] || 0));
    const mtf = mean(forwardReturn.map(s => s['mtfRet' + n] || 0));
    const better = mtf >= base ? '✓' : '✗';
    console.log('  N=' + n + ': baseline ' + (base * 100).toFixed(2) + '%, MTF ' + (mtf * 100).toFixed(2) + '% ' + better);
  }
  console.log();
}

// --- KPI-5: Rank Correlation ---
{
  console.log('KPI-5: Rank Correlation (Spearman ρ, baseline vs MTF)');
  console.log('  Mean ρ:  ' + rankCorr.mean.toFixed(3));
  console.log('  Min ρ:   ' + rankCorr.min.toFixed(3));
  console.log('  Max ρ:   ' + rankCorr.max.toFixed(3));
  console.log('  P5:      ' + rankCorr.p5.toFixed(3));
  console.log('  P95:     ' + rankCorr.p95.toFixed(3));
  const inRange = rankCorr.mean >= 0.60 && rankCorr.mean <= 0.90;
  console.log('  Range:   ' + (inRange ? '✓ 0.60–0.90 (perubahan berarti, tidak ekstrem)' : (rankCorr.mean > 0.90 ? '⚠ >0.90 — hampir tidak ada perubahan' : '⚠ <0.60 — terlalu agresif')));
  console.log();
}

// --- KPI-6: Coverage ---
{
  console.log('KPI-6: Coverage (stocks with |Δ| > 1pt on >10% of days)');
  console.log('  ' + coverage.affected + '/' + coverage.total + ' stocks affected (' + coverage.coveragePct.toFixed(0) + '%)');
  const top5 = coverage.stocks.sort((a, b) => b.pct - a.pct).slice(0, 5);
  console.log('  Top 5 affected: ' + top5.map(s => s.ticker + '(' + s.pct.toFixed(0) + '%)').join(', '));
  const bottom5 = coverage.stocks.sort((a, b) => a.pct - b.pct).slice(0, 5);
  console.log('  Bottom 5: ' + bottom5.map(s => s.ticker + '(' + s.pct.toFixed(0) + '%)').join(', '));
  console.log();
}

// --- KPI-7: Score Drift Distribution ---
{
  console.log('KPI-7: Score Drift Distribution (Δ = MTF - Baseline)');
  console.log('  Mean: ' + drift.mean.toFixed(1) + ' | P50: ' + drift.p50.toFixed(1) + ' | P5: ' + drift.p5.toFixed(1) + ' | P95: ' + drift.p95.toFixed(1));
  const total = drift.total;
  for (const [bucket, count] of Object.entries(drift.buckets)) {
    const bar = '█'.repeat(Math.round(count / total * 100));
    console.log('  ' + bucket.padEnd(6) + ' ' + (count / total * 100).toFixed(1) + '% ' + bar);
  }
  console.log();
}

// Summary
{
  const stabilityBetter = mean(stability.map(s => s.mtfPct)) < mean(stability.map(s => s.basePct));
  const persistenceBetter = mean(persistence.map(s => s.mtfMean)) > mean(persistence.map(s => s.baseMean));
  const whipsawBetter = _mtfWhipsawTotal < _baseWhipsawTotal;
  const fr3 = mean(forwardReturn.map(s => s.baseRet3 || 0)) <= mean(forwardReturn.map(s => s.mtfRet3 || 0));
  const rankOk = rankCorr.mean >= 0.60 && rankCorr.mean <= 0.90;

  console.log('=' .repeat(72));
  console.log('  SUMMARY');
  console.log('=' .repeat(72));
  console.log('  KPI-1 Stability:       ' + (stabilityBetter ? '✓ MTF lebih stabil' : '✗ Baseline lebih stabil'));
  console.log('  KPI-2 Persistence:     ' + (persistenceBetter ? '✓ MTF lebih persisten' : '✗ Baseline lebih persisten'));
  console.log('  KPI-3 Whipsaw:         ' + (whipsawBetter ? '✓ MTF lebih sedikit whipsaw' : '✗ MTF lebih banyak whipsaw'));
  console.log('  KPI-4 Forward N=3:     ' + (fr3 ? '✓ MTF ≥ baseline' : '✓ Baseline ≥ MTF'));
  console.log('  KPI-5 Rank Corr:       ' + (rankOk ? '✓ Dalam rentang 0.60–0.90' : '⚠ Di luar rentang target'));
  console.log('  KPI-6 Coverage:        ' + coverage.coveragePct.toFixed(0) + '% stocks affected');
  console.log('  KPI-7 Drift P50:       ' + drift.p50.toFixed(1) + ' pt (target: ≤5 pt)');
  console.log('  KPI-7 Drift P95:       ' + drift.p95.toFixed(1) + ' pt (target: ≤15 pt)');
  console.log();
}

// Save JSON
const reportPath = resolve(__dirname, 'e1-report.json');
const report = {
  dataset: { stocks: stocks.length, days: stocks[0].days.length, sectors: [...new Set(stocks.map(s => s.sector))] },
  params: { frozen: true, note: 'No tuning during E1. 50/35/15, α=0.70, penalty=0.25, hysteresis=10.0' },
  kpis: {
    stability: {
      baseMean: mean(stability.map(s => s.basePct)),
      mtfMean: mean(stability.map(s => s.mtfPct)),
      baseLarge: stability.filter(s => s.basePct > 10).length,
      mtfLarge: stability.filter(s => s.mtfPct > 10).length,
    },
    persistence: {
      baseMean: mean(persistence.map(s => s.baseMean)),
      mtfMean: mean(persistence.map(s => s.mtfMean)),
    },
    whipsaw: {
      baseTotal: _baseWhipsawTotal,
      mtfTotal: _mtfWhipsawTotal,
      reductionPct: _baseWhipsawTotal > 0 ? (1 - _mtfWhipsawTotal / _baseWhipsawTotal) * 100 : 0,
    },
    forwardReturn: {
      n3: { base: mean(forwardReturn.map(s => s.baseRet3 || 0)), mtf: mean(forwardReturn.map(s => s.mtfRet3 || 0)) },
      n5: { base: mean(forwardReturn.map(s => s.baseRet5 || 0)), mtf: mean(forwardReturn.map(s => s.mtfRet5 || 0)) },
      n10: { base: mean(forwardReturn.map(s => s.baseRet10 || 0)), mtf: mean(forwardReturn.map(s => s.mtfRet10 || 0)) },
    },
    rankCorrelation: {
      mean: rankCorr.mean,
      min: rankCorr.min,
      max: rankCorr.max,
      p5: rankCorr.p5,
      p95: rankCorr.p95,
    },
    coverage: {
      affected: coverage.affected,
      total: coverage.total,
      pct: coverage.coveragePct,
    },
    driftDistribution: {
      buckets: drift.buckets,
      p5: drift.p5,
      p25: drift.p25,
      p50: drift.p50,
      p75: drift.p75,
      p95: drift.p95,
      mean: drift.mean,
    },
  },
  recommendation: 'E1 measurement complete. Awaiting review to decide: proceed E2 (optimization), freeze parameters, or cancel MTF integration.',
};
writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log('JSON report saved: tests/e1/e1-report.json');
