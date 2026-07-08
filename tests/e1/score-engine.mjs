// score-engine.mjs — Baseline and MTF scoring from component scores
// Follows Papan Gerak v6 scoring logic exactly.
// Parameter freeze: 50/35/15, α=0.70, penalty=0.25, hysteresis=10, threshold 40/70.

const PARAMS = {
  // Weights (frozen)
  weightTrend: 0.30,
  weightMomentum: 0.30,
  weightVolatility: 0.20,
  weightVolume: 0.20,
  // MTF (frozen)
  mtfPrimaryWeight: 0.50,
  mtfSecondaryWeight: 0.35,
  mtfTertiaryWeight: 0.15,
  mtfAlpha: 0.70,
  mtfMaxPenalty: 0.25,
  mtfDirectionHysteresis: 10.0,
};

function clamp(v) { return Math.max(0, Math.min(100, v)); }

// Baseline composite score (daily only)
export function baselineScore(daily) {
  const total = PARAMS.weightTrend + PARAMS.weightMomentum + PARAMS.weightVolatility + PARAMS.weightVolume;
  if (total === 0) return 50;
  const score = (
    daily.trend * PARAMS.weightTrend +
    daily.mom * PARAMS.weightMomentum +
    daily.vol * PARAMS.weightVolatility +
    daily.volm * PARAMS.weightVolume
  ) / total;
  return Math.round(score * 10) / 10;
}

// MTF alignment score (3 TFs)
export function mtfScore(tf1, tf2, tf3) {
  const p = PARAMS;

  // Directional per TF: trend * 0.55 + momentum * 0.45
  const tf1Dir = tf1.trend * 0.55 + tf1.mom * 0.45;
  const tf2Dir = tf2.trend * 0.55 + tf2.mom * 0.45;
  const tf3Dir = tf3.trend * 0.55 + tf3.mom * 0.45;

  // Context per TF: vol * 0.55 + volm * 0.45
  const tf1Ctx = tf1.vol * 0.55 + tf1.volm * 0.45;
  const tf2Ctx = tf2.vol * 0.55 + tf2.volm * 0.45;
  const tf3Ctx = tf3.vol * 0.55 + tf3.volm * 0.45;

  const totalW = p.mtfPrimaryWeight + p.mtfSecondaryWeight + p.mtfTertiaryWeight;
  const normW1 = totalW > 0 ? p.mtfPrimaryWeight / totalW : 0.50;
  const normW2 = totalW > 0 ? p.mtfSecondaryWeight / totalW : 0.35;
  const normW3 = totalW > 0 ? p.mtfTertiaryWeight / totalW : 0.15;

  const mtfDirRaw = tf1Dir * normW1 + tf2Dir * normW2 + tf3Dir * normW3;
  const mtfCtxRaw = tf1Ctx * normW1 + tf2Ctx * normW2 + tf3Ctx * normW3;

  // Symmetric fuzzy threshold
  const bullConf = (s) => clamp((s - 50) / 20);
  const bearConf = (s) => clamp((50 - s) / 20);

  const tf1Bull = bullConf(tf1Dir);
  const tf2Bull = bullConf(tf2Dir);
  const tf3Bull = bullConf(tf3Dir);
  const tf1Bear = bearConf(tf1Dir);
  const tf2Bear = bearConf(tf2Dir);
  const tf3Bear = bearConf(tf3Dir);

  const weightedBull = tf1Bull * normW1 + tf2Bull * normW2 + tf3Bull * normW3;
  const weightedBear = tf1Bear * normW1 + tf2Bear * normW2 + tf3Bear * normW3;

  const hysteresis = p.mtfDirectionHysteresis / 100;
  let direction = 0;
  if (weightedBull > weightedBear + hysteresis) direction = 1;
  else if (weightedBear > weightedBull + hysteresis) direction = -1;

  const maxDiv = Math.max(
    Math.abs(tf1Dir - tf2Dir),
    Math.abs(tf1Dir - tf3Dir),
    Math.abs(tf2Dir - tf3Dir)
  );
  const penalty = (maxDiv / 100) * p.mtfMaxPenalty;

  const conflictScore = mtfDirRaw * (1 - penalty);
  const finalScore = conflictScore * p.mtfAlpha + mtfCtxRaw * (1 - p.mtfAlpha);

  return {
    mtfScore: Math.round(finalScore * 10) / 10,
    direction,
    penaltyPct: Math.round(penalty * 1000) / 10,
    tfDir: [Math.round(tf1Dir * 10) / 10, Math.round(tf2Dir * 10) / 10, Math.round(tf3Dir * 10) / 10],
  };
}

// Compute scores for one stock across all days
export function computeStockScores(stock) {
  const results = [];
  for (const day of stock.days) {
    const base = baselineScore(day.daily);
    const mtf = mtfScore(day.daily, day.weekly, day.monthly);
    const signalBase = base >= 70 ? 1 : base <= 40 ? -1 : 0;
    const signalMtf = mtf.mtfScore >= 70 ? 1 : mtf.mtfScore <= 40 ? -1 : 0;
    results.push({
      base,
      mtf: mtf.mtfScore,
      direction: mtf.direction,
      penalty: mtf.penaltyPct,
      signalBase,
      signalMtf,
      delta: Math.round((mtf.mtfScore - base) * 10) / 10,
      tfDir: mtf.tfDir,
    });
  }
  return results;
}
