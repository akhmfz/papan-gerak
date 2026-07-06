# Saham: Papan Gerak By. Akhmfz

> Multi-Dimension Technical Analysis Dashboard for Indonesian Stock Market — built with Pine Script v6.
> **Natural companion to [Papan Instrumen](https://github.com/akhmfz/papan-instrumen)** (fundamental + technical = full analysis).

[![Version](https://img.shields.io/badge/version-v0.2.0--alpha-blue)](https://github.com/akhmfz/papan-gerak/releases)
[![Pine Script](https://img.shields.io/badge/Pine%20Script-v6-green)](https://www.tradingview.com/pine-script-docs/en/v6/)
[![Market](https://img.shields.io/badge/Market-IDX-red)]()
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

---

## Quick Start

```
1. Open TradingView → Pine Editor
2. Copy src/PapanGerak.pine → Paste → Add to Chart
3. Adjust mode & parameters in Settings
```

## Display Modes

Select via Settings → **Mode**:

### Compact — 1 Row
```
PAPAN GERAK BULLISH 72
```
Quick scan — signal + score only.

### Standard — Full Table (Default)
```
📊 ⚠️ Strong momentum but RSI overbought — watch for pullback
PAPAN GERAK (last bar)                   82
Signal                              BULLISH
📊 Signal                           +3.2%
📊 Backtest                     65% win (13/20)
↑ Trend 80 (4/4↑)                   hover → details
↑ Momentum 72 (3/5↑)                hover → details
≈ Volatility 77 (3/4✓)             hover → details
↑ Volume 88 (4/4✓)                  hover → details
🔴 <40 Bearish | 🟡 40-70 Neutral | 🟢 >70 Bullish
```

### Detailed — Full Table + Sub-Indicator Rows
```
↑ Trend 80 (4/4↑)
  ➔ EMA>MA50 ✓ | SuperTrend Up ✓ | ADX 28 (strong) ✓ | Aligned ✓
```

---

## Reading the Table

### 1. 📊 Narrative Row (top)
1-line insight. Highest priority conflicts first:

| Narrative | Meaning | Action |
|-----------|---------|--------|
| ⚠️ Strong momentum but RSI overbought | Price rising but overbought | Don't enter long — wait for correction |
| 📈 RSI oversold + volume spike | Price down, volume up, RSI exhausted | Look for reversal candle confirmation |
| ⚠️ Weak trend & volatile | Chaotic market, no direction | No trade — high risk |
| ✅ Volume confirms trend | Volume supports price move | Trade with trend |
| ✅ All dimensions aligned | All indicators agree | Enter with high confidence |
| ⚠️ Price up but OBV diverging | Volume doesn't support rally | Watch for fake breakout |
| ⏳ Ranging market | Sideways market | Hold / wait |
| 💡 Mixed conditions | No dominant signal | Check confluence counter |

### 2. Header — Score + Signal
- **Overall Score (0-100)**: weighted aggregate of 4 dimensions
- **(last bar)**: data reflects the last closed bar, not the hovered bar
- Color: 🟢 ≥70 (bullish), 🟡 40-70 (neutral), 🔴 <40 (bearish)

### 3. Signal Validation (Forward Return)
Return % since the last signal cross. Answers: "if I entered at the signal, am I up or down?"

| Status | Meaning |
|--------|---------|
| ✅ +5.2% | Previous signal correct — trend intact |
| ➖ +0.8% | Still positive, thin |
| ➖ -1.2% | Starting to fade — re-evaluate |
| ❌ -4.1% | Previous signal wrong — possible reversal |

### 4. Backtest (Win Rate)
Tracks last 20 signals, evaluates each 10 bars later:

| Win Rate | Meaning |
|----------|---------|
| **≥65%** | 40/70 thresholds fit this stock — signals are reliable |
| **40-65%** | Moderate — needs extra confirmation |
| **<40%** | Thresholds don't fit — consider adjusting parameters |

Hover for total accumulated return.

### 5. Dimension Score + Confluence Counter

```
↑ Trend 80 (4/4↑)   → 4 of 4 sub-indicators bullish — strong agreement
↑ Momentum 64 (3/5) → 3 of 5 bullish — internal conflict, caution
≈ Volatility 77 (3/4✓) → 3 of 4 ideal — healthy volatility
↑ Volume 88 (4/4✓) → all volume indicators agree
```

**Hover** the score number for a detailed sub-indicator breakdown tooltip.

### 6. Color Legend
```
🔴 <40 Bearish | 🟡 40-70 Neutral | 🟢 >70 Bullish
```

---

## Alerts

| Alert | Trigger | Usage |
|-------|---------|-------|
| Signal Change | Score crosses 40 or 70 | Direction change notification |
| Trend Extreme | Trend ≥80 or ≤20 | Extreme trend warning |
| RSI Oversold | RSI ≤30 | Potential bounce up |
| RSI Overbought | RSI ≥70 | Potential reversal down |
| Volume Spike | Volume ≥2x MA | Breakout/breakdown confirmation |
| Smart Money Flow | Institutional flow detected | Accumulation/distribution |
| Ranging Market | Choppiness ≥62 | Sideways market |

Alerts use `alert()` with dynamic messages (real score values included).

---

## Settings Reference

### Display Tab
| Parameter | Default | Options |
|-----------|---------|---------|
| Table Position | Top Right | 4 corners |
| Mode | Standard | Compact / Standard / Detailed |
| Language | Indonesia | Indonesia / English |
| Color Theme | Dark | 5 themes |

### Trend Tab
| Parameter | Default | Range |
|-----------|---------|-------|
| EMA Fast | 20 | 5–50 |
| EMA Mid | 50 | 20–100 |
| EMA Slow | 200 | 100–500 |
| SuperTrend Factor | 3.0 | 1.0–5.0 |
| SuperTrend ATR | 10 | 5–30 |
| ADX Length | 14 | 7–28 |
| ADX Threshold | 25 | 15–40 |

### Momentum Tab
| Parameter | Default | Range |
|-----------|---------|-------|
| RSI Length | 14 | 7–28 |
| RSI Overbought | 70 | 60–85 |
| RSI Oversold | 30 | 15–40 |
| MACD Fast/Slow/Signal | 12/26/9 | — |
| Stochastic K/D | 14/3 | — |
| Stoch Overbought | 80 | 70–90 |
| Stoch Oversold | 20 | 10–30 |

### Volatility Tab
| Parameter | Default | Range |
|-----------|---------|-------|
| ATR Length | 14 | 7–30 |
| Bollinger Length | 20 | 10–50 |
| Bollinger Multiplier | 2.0 | 1.5–3.0 |
| Choppiness Length | 14 | 7–30 |

### Volume Tab
| Parameter | Default | Range |
|-----------|---------|-------|
| Volume MA Length | 20 | 10–50 |
| Spike Multiplier | 2.0 | 1.5–5.0 |

### Weights Tab
| Parameter | Default | Range |
|-----------|---------|-------|
| Trend Weight | 30% | 0–100 |
| Momentum Weight | 30% | 0–100 |
| Volatility Weight | 20% | 0–100 |
| Volume Weight | 20% | 0–100 |

### Smart Money Tab
| Parameter | Default | Description |
|-----------|---------|-------------|
| Enable SM Flow | OFF | Enable Smart Money dimension |
| SM Weight | 20% | SM contribution to overall score |
| SM Volume Z-Threshold | 2.5 | SD threshold for volume spike |
| SM Lookback | 20 | Z-score lookback period |

---

## Trading Decision Guide

### High Confidence Entry
```
✅ All dimensions aligned — bullish bias
PAPAN GERAK (last bar)                   85
Signal                              BULLISH
📊 Signal                           +4.2%
📊 Backtest                     72% win (18/25)
↑ Trend 90 (5/5↑)
↑ Momentum 88 (4/4↑)
≈ Volatility 80 (3/4✓)
↑ Volume 85 (4/4✓)
```
→ Positive narrative, high backtest win rate, max confluence.

### Do Not Enter (despite good score)
```
⚠️ Strong momentum but RSI overbought — watch for pullback
PAPAN GERAK (last bar)                   78
Signal                              BULLISH
📊 Signal                           -1.5%
📊 Backtest                     45% win (9/20)
↑ Trend 85 (4/4↑)
↑ Momentum 72 (3/5↑)
≈ Volatility 80 (3/4✓)
↑ Volume 75 (3/4✓)
```
→ Warning narrative, low backtest, negative forward return, momentum conflict.

### Consider Exit
```
💡 Mixed conditions — check per-dimension details
PAPAN GERAK (last bar)                   52
Signal                              NEUTRAL
📊 Signal                           -5.8%
📊 Backtest                     38% win (8/21)
→ Trend 48 (2/4↑)
↓ Momentum 35 (1/5↑)
≈ Volatility 55 (2/4✓)
→ Volume 60 (2/4✓)
```
→ Negative forward return, poor backtest, score dropping sharply.

---

## Methodology

See `docs/ARCHITECTURE.md` for full scoring methodology.

### Score Scale (0-100)
Each sub-indicator scores 0-100, weighted-averaged per dimension. Signal thresholds: 70 (bullish), 40 (bearish).

### Confluence Count
Number of sub-indicators agreeing (binary: ≥50 vs <50) — different from continuous score. Displayed side-by-side to detect internal conflicts.

### Backtest
20 most recent signals stored in a circular buffer. Each evaluated 10 bars after cross. Win rate = % of correct predictions (positive forward return).

---

## Development

```bash
git clone git@github.com:akhmfz/papan-gerak.git
cd papan-gerak
npm install
npm run build        # Generate built file
npm run lint         # Reserved keywords + budget check
npm run test:all     # 51 tests (utility + scoring)
```

Edit `src/modules/*.pine` → `bash build.sh` → copy `src/PapanGerak.pine` → TradingView.

---

## Limitations

- Technical data is historical, **NOT** predictive
- Choppiness Index may false-signal on low-volume stocks
- Smart Money is a volume proxy, not actual institutional data
- 40/70 signal thresholds are fixed — may need per-stock tuning
- **NOT** buy/sell recommendations — analysis tool only

---

## Author

**Muhammad Akhmal** — AKHMFZ Analytics, Indonesia
[TradingView](https://www.tradingview.com/u/akhmfz/) · akhmfz.analytics@gmail.com

## License

MIT License — see [LICENSE](LICENSE).
