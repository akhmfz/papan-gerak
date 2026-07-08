// synthetic-data.mjs — Generate realistic IDX80-like multi-TF component scores
// Output: 80 stocks × 252 days × 3 TFs × 4 components
// Seeded RNG for deterministic, reproducible results.

// Sector parameters: trend bias (-1 to 1, how bullish/bearish),
// vol (0-1, how noisy), momBias (momentum directionality).
// Higher |trend| = more stocks with clear directional bias.
// Stocks randomly vary around the sector mean ± spread.
const SECTORS = [
  { name: 'Banks',       count: 27, trend:  0.4, spread: 0.3, vol: 0.12, momBias:  0.3 },
  { name: 'Coal',        count: 16, trend: -0.2, spread: 0.4, vol: 0.20, momBias: -0.2 },
  { name: 'CPO',         count: 15, trend:  0.2, spread: 0.3, vol: 0.15, momBias:  0.2 },
  { name: 'Consumer',    count: 20, trend:  0.3, spread: 0.25, vol: 0.10, momBias:  0.25 },
  { name: 'Industrial',  count: 20, trend:  0.0, spread: 0.35, vol: 0.14, momBias:  0.0 },
  { name: 'Healthcare',  count: 15, trend:  0.2, spread: 0.3, vol: 0.12, momBias:  0.2 },
  { name: 'Property',    count: 20, trend: -0.3, spread: 0.35, vol: 0.18, momBias: -0.25 },
  { name: 'Infra',       count: 15, trend:  0.25, spread: 0.25, vol: 0.10, momBias: 0.2 },
  { name: 'Technology',  count: 20, trend: -0.1, spread: 0.4, vol: 0.22, momBias: 0.0 },
  { name: 'Transport',   count: 15, trend: -0.15, spread: 0.35, vol: 0.16, momBias: -0.1 },
];

// Deterministic PRNG (mulberry32)
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Simple moving average for smoothing
function sma(arr, period) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (i < period - 1) { result.push(arr[i]); continue; }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += arr[j];
    result.push(sum / period);
  }
  return result;
}

function clamp(v) { return Math.max(0, Math.min(100, v)); }

// Generate one TF's component series for one stock
function genTF(rng, days, trendBias, vol, momBias) {
  // Trend: random walk with drift, smoothed
  const trendRaw = [];
  let t = 50 + trendBias * 40;
  for (let i = 0; i < days; i++) {
    t += (rng() - 0.5) * vol * 20;
    t = clamp(t);
    trendRaw.push(t);
  }
  const trend = sma(trendRaw, 5); // smooth

  // Momentum: correlated with trend but wider swings + noise
  const mom = trend.map((v, i) => {
    const base = v + (rng() - 0.5) * vol * 50;
    const bias = momBias * 20;
    return clamp(base + bias);
  });

  // Volatility: inverse-ish of trend strength (strong trend = low vol)
  const volSeries = trend.map((v, i) => {
    const distFrom50 = Math.abs(v - 50) / 50; // 0 at 50, 1 at 0 or 100
    const baseVol = 50 - distFrom50 * 25 + (rng() - 0.5) * 10;
    return clamp(baseVol + 20); // min ~20, max ~75
  });

  // Volume: slightly correlated with volatility, cyclical
  const volm = volSeries.map((v, i) => {
    const cycle = Math.sin(i / 10) * 5;
    return clamp(v + cycle + (rng() - 0.5) * 10);
  });

  return { trend, mom, vol: volSeries, volm };
}

export function generateDataset(seed = 42) {
  const rng = mulberry32(seed);
  const DAYS = 252;

  let stockId = 0;
  const stocks = [];

  for (const sector of SECTORS) {
    for (let i = 0; i < sector.count; i++) {
      stockId++;
      const ticker = `${sector.name.toUpperCase().slice(0,4)}${String(stockId).padStart(2,'0')}`;
      const stockSeed = seed + stockId;
      const stockRng = mulberry32(stockSeed);

      // Individual stock trend varies around sector mean
      const stockTrend = sector.trend + (stockRng() - 0.5) * sector.spread * 2;
      const stockVol = sector.vol * (0.7 + stockRng() * 0.6);
      const stockMom = sector.momBias + (stockRng() - 0.5) * 0.3;

      // Generate each TF with different persistence
      const daily = genTF(mulberry32(stockSeed), DAYS, stockTrend, stockVol, stockMom);
      const weekly = genTF(mulberry32(stockSeed + 1000), DAYS, stockTrend, stockVol * 0.6, stockMom * 1.2);
      const monthly = genTF(mulberry32(stockSeed + 2000), DAYS, stockTrend, stockVol * 0.35, stockMom * 1.5);

      // Higher TF should be smoother — apply heavier smoothing
      weekly.trend = sma(weekly.trend, 10);
      monthly.trend = sma(monthly.trend, 20);

      const days = [];
      for (let d = 0; d < DAYS; d++) {
        days.push({
          daily: {
            trend: Math.round(daily.trend[d] * 10) / 10,
            mom: Math.round(daily.mom[d] * 10) / 10,
            vol: Math.round(daily.vol[d] * 10) / 10,
            volm: Math.round(daily.volm[d] * 10) / 10,
          },
          weekly: {
            trend: Math.round(weekly.trend[d] * 10) / 10,
            mom: Math.round(weekly.mom[d] * 10) / 10,
            vol: Math.round(weekly.vol[d] * 10) / 10,
            volm: Math.round(weekly.volm[d] * 10) / 10,
          },
          monthly: {
            trend: Math.round(monthly.trend[d] * 10) / 10,
            mom: Math.round(monthly.mom[d] * 10) / 10,
            vol: Math.round(monthly.vol[d] * 10) / 10,
            volm: Math.round(monthly.volm[d] * 10) / 10,
          },
        });
      }

      stocks.push({ ticker, sector: sector.name, days });
    }
  }

  return stocks;
}
