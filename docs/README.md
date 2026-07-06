# Saham: Papan Gerak By. Akhmfz

> Technical Analysis Dashboard for Indonesian Stock Market — built with Pine Script v6.

[![Version](https://img.shields.io/badge/version-v0.1.0--alpha-blue)](https://github.com/akhmfz/papan-gerak/releases)
[![Pine Script](https://img.shields.io/badge/Pine%20Script-v6-green)](https://www.tradingview.com/pine-script-docs/en/v6/)
[![Market](https://img.shields.io/badge/Market-IDX-red)]()
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

**Pasangan natural dari [Papan Instrumen](https://github.com/akhmfz/papan-instrumen)** — fundamental + teknikal = analisis lengkap.

---

## Quick Start

```
1. Buka TradingView → Pine Editor
2. Copy src/PapanGerak.pine → Paste → Add to Chart
3. Adjust settings if needed (Compact Mode ON by default)
```

## Overview

**Papan Gerak** adalah dashboard teknikal 4 dimensi yang merangkum kondisi pasar dalam satu skor (0-100):

| Dimensi | Bobot | Komponen |
|---------|-------|----------|
| **Trend** | 30% | EMA Position (20/50/200), SuperTrend, ADX Strength |
| **Momentum** | 30% | RSI(14), MACD Histogram + Slope, Stochastic |
| **Volatilitas** | 20% | Bollinger Width vs Avg, Choppiness Index, ATR% |
| **Volume** | 20% | Volume vs MA, OBV Agreement, Net Volume |

**+ Smart Money Flow** (opsional, default OFF) — Institutional flow detection via volume Z-score.

### Sinyal

| Skor | Sinyal | Arti |
|------|--------|------|
| ≥ 70 | BULLISH | Kondisi teknikal kuat |
| 40–70 | NETRAL | Kondisi mixed / sideway |
| ≤ 40 | BEARISH | Kondisi teknikal lemah |

## Customization

| Fitur | Opsi |
|-------|------|
| **Color Themes** | 5 tema (Gelap, Terang, Bursa Hijau, Biru Nusantara, Emas Premium) |
| **Table Position** | 4 pojok |
| **Compact Mode** | Score + signal only (1 baris) |
| **Dimension Weights** | Bobot per dimensi (default: 30/30/20/20) |
| **Parameter** | Period, threshold, multiplier semua komponen |
| **Smart Money** | Optional dimension (default OFF) |
| **Bahasa** | Indonesia / English |

## Alerts

| Alert | Trigger |
|-------|---------|
| Signal Change | Skor crossing 70 atau 40 |
| Trend Extreme | Trend ≥ 80 atau ≤ 20 |
| RSI Oversold | RSI ≤ 30 |
| RSI Overbought | RSI ≥ 70 |
| Volume Spike | Volume ≥ 2x MA |
| Smart Money Flow | Institutional flow terdeteksi |
| Ranging Market | Choppiness Index ≥ 62 |

## Repository Structure

```
build.sh                     — Build: concat modules → PapanGerak.pine
package.json                 — npm scripts (build, lint, test, transpile, ci)
src/
├── modules/
│   ├── 01-base.pine         — Header, inputs, tema, utilities
│   ├── 02-data.pine         — TA calculations (trend, momentum, volatility, volume)
│   ├── 03-scoring.pine      — Scoring engine + overall
│   └── 04-ui.pine           — Table rendering + alerts
└── PapanGerak.pine          — Built output (auto-generated)
tests/
├── pinets-verify.mjs        — Utility function tests
├── transpile.sh             — Syntax validation
└── scoring/                 — Dimension scoring tests
scripts/
├── lint.sh                  — Custom linter
└── gh-sync.sh               — GitHub Issues
docs/
├── README.id.md             — Panduan pengguna (ID)
├── AI.md                    — AI collaboration context
├── ARCHITECTURE.md          — Scoring methodology
└── DEVELOPMENT.md           — Coding standard, changelog
```

## Development

```bash
git clone git@github.com:akhmfz/papan-gerak.git
cd papan-gerak
npm install
npm run build        # Generate built file
npm run lint         # Lint check
npm run test:all     # Run tests
npm run transpile    # Syntax validation
npm run ci           # Full CI pipeline
```

## Disclaimer

**Papan Gerak** adalah alat bantu analisis teknikal — **BUKAN** nasihat keuangan atau investasi. Seluruh keputusan investasi tetap tanggung jawab masing-masing pengguna.

## License

MIT License — see [LICENSE](LICENSE).

## Author

**Muhammad Akhmal** — Founder of AKHMFZ Analytics, Indonesia

[TradingView](https://www.tradingview.com/u/akhmfz/) · akhmfz.analytics@gmail.com
