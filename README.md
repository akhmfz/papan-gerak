# Saham: Papan Gerak By. Akhmfz

> Multi-Dimension Technical Analysis Dashboard for Indonesian Stock Market (IDX) — Pine Script v6.
> Natural companion to [Papan Instrumen](https://github.com/akhmfz/papan-instrumen).

[![Version](https://img.shields.io/badge/version-v0.2.1--alpha-blue)](https://github.com/akhmfz/papan-gerak/releases)
[![Pine Script](https://img.shields.io/badge/Pine%20Script-v6-green)](https://www.tradingview.com/pine-script-docs/en/v6/)
[![Market](https://img.shields.io/badge/Market-IDX-red)]()
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

---

4 dimensi scoring (Trend, Momentum, Volatilitas, Volume) + 3 entry trigger modes + risk management + position sizing + MTF filter + webhook support.

**See full documentation: [`docs/README.md`](docs/README.md)** (EN) | [`docs/README.id.md`](docs/README.id.md) (ID)

---

## Quick Start

```
1. TradingView → Pine Editor → Copy src/PapanGerak.pine → Add to Chart
2. Strategy tester: src/strategies/PapanGerakStrategy.pine
```

## Stats

- **90 tests**: 88 unit + 2 PineTS full-script integration
- **1286 lines** built output
- **50 parameters** across 12 settings groups
- **7 alert conditions**, 2 formats (Simple / JSON webhook)
- **16+ tooltips** on inputs

## Project Structure

| Path | Description |
|------|-------------|
| `src/modules/` | Source modules (edit these) |
| `src/PapanGerak.pine` | Built indicator (auto-generated) |
| `src/strategies/PapanGerakStrategy.pine` | Strategy backtest script |
| `docs/` | Full documentation |
| `tests/` | 90 PineJS/PineTS tests |
| `scripts/` | Lint, build tools |

## Development

```bash
npm install
npm run build        # Generate built file
npm run lint         # Reserved keywords + budget
npm run test:all     # 90 tests
npm run ci           # Full pipeline
```

## Documentation

| Document | Description |
|----------|-------------|
| [`docs/README.md`](docs/README.md) | User guide (EN) |
| [`docs/README.id.md`](docs/README.id.md) | Panduan pengguna (ID) |
| [`docs/PANDUAN-TRADING.md`](docs/PANDUAN-TRADING.md) | Trading guide: table → entry decision |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Scoring methodology |
| [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) | Dev setup & changelog |
| [`docs/AI.md`](docs/AI.md) | AI collaboration context |
| [`docs/webhook-integration.md`](docs/webhook-integration.md) | Webhook setup (TradersPost, Pine Connector) |
| [`docs/TV_PUBLISH_DESC.md`](docs/TV_PUBLISH_DESC.md) | TradingView publication description |
| [`CHANGELOG.md`](CHANGELOG.md) | Release history |
| [`CATATAN.md`](CATATAN.md) | Lessons learned |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Contribution guide |

## Author

**Muhammad Akhmal** — AKHMFZ Analytics, Indonesia
[TradingView](https://www.tradingview.com/u/akhmfz/) · akhmfz.analytics@gmail.com

## License

MIT — see [LICENSE](LICENSE).
