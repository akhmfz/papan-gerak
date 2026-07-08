// kpi-engine.mjs — Compute 7 KPIs from score time series
// All KPIs computed for both baseline and MTF systems.

// KPI-1: Signal Stability — % stocks with >10pt change day-over-day
export function kpiSignalStability(allResults) {
  const stocks = [];
  for (const [ticker, scores] of Object.entries(allResults)) {
    let baseLarge = 0, mtfLarge = 0, n = scores.length - 1;
    for (let i = 1; i < scores.length; i++) {
      if (Math.abs(scores[i].base - scores[i - 1].base) > 10) baseLarge++;
      if (Math.abs(scores[i].mtf - scores[i - 1].mtf) > 10) mtfLarge++;
    }
    stocks.push({ ticker, basePct: baseLarge / n * 100, mtfPct: mtfLarge / n * 100, delta: mtfLarge / n * 100 - baseLarge / n * 100 });
  }
  return stocks;
}

// KPI-2: Signal Persistence — mean consecutive same-direction signal duration
export function kpiPersistence(allResults) {
  function measure(scores, key) {
    const runs = [];
    let cur = null, len = 0;
    for (const s of scores) {
      const sig = s[key];
      if (sig === 0) { if (cur !== null) { runs.push(len); cur = null; len = 0; } continue; }
      if (sig === cur) { len++; }
      else { if (cur !== null) runs.push(len); cur = sig; len = 1; }
    }
    if (cur !== null) runs.push(len);
    return runs.length > 0 ? runs.reduce((a, b) => a + b, 0) / runs.length : 0;
  }
  const stocks = [];
  for (const [ticker, scores] of Object.entries(allResults)) {
    stocks.push({
      ticker,
      baseMean: measure(scores, 'signalBase'),
      mtfMean: measure(scores, 'signalMtf'),
      delta: measure(scores, 'signalMtf') - measure(scores, 'signalBase'),
    });
  }
  return stocks;
}

// KPI-3: Whipsaw Reduction — flips across 0 within ≤3 bars
export function kpiWhipsaw(allResults) {
  function countWhipsaw(scores, key) {
    let count = 0;
    for (let i = 0; i < scores.length - 3; i++) {
      const a = scores[i][key], b = scores[i + 1][key], c = scores[i + 2][key];
      if (a !== 0 && b !== 0 && c !== 0) {
        if (a !== b && b !== c && a !== c) count++; // flip in 3 bars
      }
    }
    return count;
  }
  const stocks = [];
  for (const [ticker, scores] of Object.entries(allResults)) {
    stocks.push({
      ticker,
      baseCount: countWhipsaw(scores, 'signalBase'),
      mtfCount: countWhipsaw(scores, 'signalMtf'),
      delta: countWhipsaw(scores, 'signalMtf') - countWhipsaw(scores, 'signalBase'),
    });
  }
  return stocks;
}

// KPI-4: Forward Return — top-decile return projection (based on synthetic data scoring)
// Since we don't have price data in this layer, we use score-based proxy:
// "Return" = score trend (how well top-scored stocks maintain their score)
export function kpiForwardReturn(allResults) {
  const DAYS = 252;
  const lookaheads = [3, 5, 10];
  const topPct = 0.20;
  const stocks = [];

  for (const [ticker, scores] of Object.entries(allResults)) {
    const stockResults = { ticker };
    for (const n of lookaheads) {
      let baseRet = 0, mtfRet = 0, countBase = 0, countMtf = 0;
      for (let d = 0; d < DAYS - n; d++) {
        // Top decile for baseline
        if (scores[d].base >= 70) {
          baseRet += (scores[d + n].base - scores[d].base) / scores[d].base;
          countBase++;
        }
        // Top decile for MTF
        if (scores[d].mtf >= 70) {
          mtfRet += (scores[d + n].mtf - scores[d].mtf) / scores[d].mtf;
          countMtf++;
        }
      }
      stockResults[`baseRet${n}`] = countBase > 0 ? baseRet / countBase : 0;
      stockResults[`mtfRet${n}`] = countMtf > 0 ? mtfRet / countMtf : 0;
    }
    stocks.push(stockResults);
  }
  return stocks;
}

// KPI-5: Rank Correlation — Spearman ρ between baseline and MTF ranks per day
export function kpiRankCorrelation(allResults) {
  // Aggregate results: for each day, get vector of (base, mtf) scores across stocks
  const tickers = Object.keys(allResults);
  const DAYS = Math.min(...tickers.map(t => allResults[t].length));
  const dailyRhos = [];

  for (let d = 0; d < DAYS; d++) {
    const pairs = tickers.map(t => ({ base: allResults[t][d].base, mtf: allResults[t][d].mtf }));
    // Compute Spearman ρ
    const baseSorted = [...pairs].sort((a, b) => a.base - b.base);
    const mtfSorted = [...pairs].sort((a, b) => a.mtf - b.mtf);
    const baseRank = new Map(pairs.map((p, i) => [i, baseSorted.indexOf(p)]));
    const mtfRank = new Map(pairs.map((p, i) => [i, mtfSorted.indexOf(p)]));

    const n = pairs.length;
    const dSqSum = pairs.reduce((sum, _, i) => {
      const d = (baseRank.get(i) || 0) - (mtfRank.get(i) || 0);
      return sum + d * d;
    }, 0);
    const rho = 1 - (6 * dSqSum) / (n * (n * n - 1));
    dailyRhos.push(rho);
  }

  return {
    mean: dailyRhos.reduce((a, b) => a + b, 0) / dailyRhos.length,
    min: Math.min(...dailyRhos),
    max: Math.max(...dailyRhos),
    p5: dailyRhos.sort((a, b) => a - b)[Math.floor(dailyRhos.length * 0.05)],
    p95: dailyRhos.sort((a, b) => a - b)[Math.floor(dailyRhos.length * 0.95)],
    values: dailyRhos,
  };
}

// KPI-6: Coverage — % stocks with meaningful score change
export function kpiCoverage(allResults) {
  const threshold = 1.0; // minimum |delta| to count as "affected"
  const stocks = [];
  let affected = 0;
  for (const [ticker, scores] of Object.entries(allResults)) {
    const totalDays = scores.length;
    const changedDays = scores.filter(s => Math.abs(s.delta) > threshold).length;
    const pct = changedDays / totalDays * 100;
    stocks.push({ ticker, pct, avgDelta: scores.reduce((a, s) => a + s.delta, 0) / totalDays });
    if (pct > 10) affected++;
  }
  return { stocks, affected, total: Object.keys(allResults).length, coveragePct: affected / Object.keys(allResults).length * 100 };
}

// KPI-7: Score Drift Distribution — histogram of Δ scores
export function kpiDriftDistribution(allResults) {
  const buckets = { '0-2': 0, '2-5': 0, '5-10': 0, '10-15': 0, '15+': 0 };
  const allDeltas = [];
  for (const scores of Object.values(allResults)) {
    for (const s of scores) {
      allDeltas.push(s.delta);
      const absD = Math.abs(s.delta);
      if (absD <= 2) buckets['0-2']++;
      else if (absD <= 5) buckets['2-5']++;
      else if (absD <= 10) buckets['5-10']++;
      else if (absD <= 15) buckets['10-15']++;
      else buckets['15+']++;
    }
  }
  allDeltas.sort((a, b) => a - b);
  const n = allDeltas.length;
  const pct = (v) => allDeltas[Math.floor(n * v)];
  return {
    buckets,
    total: n,
    p5: Math.round(pct(0.05) * 10) / 10,
    p25: Math.round(pct(0.25) * 10) / 10,
    p50: Math.round(pct(0.50) * 10) / 10,
    p75: Math.round(pct(0.75) * 10) / 10,
    p95: Math.round(pct(0.95) * 10) / 10,
    mean: Math.round((allDeltas.reduce((a, b) => a + b, 0) / n) * 10) / 10,
  };
}
