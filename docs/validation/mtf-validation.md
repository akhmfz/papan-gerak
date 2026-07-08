# MTF Alignment Score — Validation Baseline

> **File**: `tests/mtf/validate-mtf.mjs` (deterministic JS formula)
> **Golden**: `tests/mtf/golden/scenarios.json`
> **Scenarios**: `tests/mtf/scenarios.json`
> **Status**: ✅ All PASS (generated: 2026-07-08)

## Tabel Validation

| # | Skenario | Score | Direction | TF1 Dir | TF2 Dir | TF3 Dir | Penalty | PASS |
|---|----------|------:|:---------:|--------:|--------:|--------:|:-------:|:----:|
| 1 | All Bullish | 67.2 | +1 (Bullish) | 77.8 | 72.8 | 67.8 | 2.5% | ✅ |
| 2 | Daily Bullish, Weekly/Monthly Bearish | 46.5 | 0 (Mixed) | 72.8 | 27.3 | 22.3 | 12.6% | ✅ |
| 3 | All Neutral | 49.8 | 0 (Mixed) | 55.0 | 47.8 | 45.0 | 2.5% | ✅ |
| 4 | Daily+Weekly Bullish, Monthly Bearish | 53.6 | +1 (Bullish) | 72.8 | 62.8 | 25.0 | 11.9% | ✅ |
| 5 | All Bearish | 31.1 | -1 (Bearish) | 22.3 | 27.3 | 32.3 | 2.5% | ✅ |
| 6 | Daily Bearish, Weekly/Monthly Bullish | 46.9 | 0 (Mixed) | 27.3 | 72.8 | 67.8 | 11.4% | ✅ |

## Formula (ringkas)

```
tfDir = Trend×0.55 + Momentum×0.45        (directional, per TF)
tfCtx = Volatility×0.55 + Volume×0.45     (context, per TF)

bullConf = clamp((score - 50) / 20, 0, 1)
bearConf = clamp((50 - score) / 20, 0, 1)  (symmetric)

weightedBull = Σ(bullConf_i × weight_i)
weightedBear = Σ(bearConf_i × weight_i)
direction: +1 if weightedBull > weightedBear + hysteresis/100
           -1 if weightedBear > weightedBull + hysteresis/100
            0 otherwise

maxDiv = max(|tf1Dir - tf2Dir|, |tf1Dir - tf3Dir|, |tf2Dir - tf3Dir|)
penalty = (maxDiv / 100) × mtfMaxPenalty

finalScore = (mtfDirRaw × (1 - penalty)) × α + mtfCtxRaw × (1 - α)
```

## Catatan

- Formula **deterministic**: input sama → output selalu sama. Tidak ada randomness atau hidden state.
- Penalty **kontinu** — proporsional terhadap divergensi maksimum antar TF, bukan diskrit.
- **Symmetric fuzzy threshold**: bullConf dan bearConf dihitung independen (`(score-50)/20` vs `(50-score)/20`), bukan sebagai komplemen. Nilai netral (score=50) menghasilkan bull=bear=0.
- Hysteresis default 10% mencegah flip direction pada margin tipis.
