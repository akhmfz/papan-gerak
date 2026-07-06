# Changelog — Papan Gerak

## v0.2.0-alpha (2026-07-06)

### Features
- **F0 — Signal Foundation**: `minSignalBars` (min bar antar sinyal), `signalFilterMode` (Trending/Ranging/Disabled), unified zone-based signal trigger
- **F1 — Risk Levels**: ATR-based SL (`entry ± ATR×mult`), Swing Low/High SL, R-multiple target (default 2R), baris "Level Referensi" di tabel dengan tooltip disclaimer
- **F2 — Position Sizing**: `accountBalanceInput` (Rp50jt default), `riskPctInput` (1% default), lot count via `floor(riskRp/riskPerShare/100)`, toggle ON/OFF
- **F3 — Entry Trigger Precision**: 3 modes via `entryTriggerMode` — Composite Score (zone-based), Pullback (trend≥65 + near EMA20 + RSI≤50 & rebound), Breakout (price break 20-bar Hi/Lo + volumeScore≥60)
- **F4 — Strategy Companion Script**: `src/strategies/PapanGerakStrategy.pine` — backtest dengan `strategy()`, komisi 0.15%, slippage 5 tick, SL/TP via `strategy.exit()`, per-regime win rate
- **F5 — MTF Filter**: `request.security()` dengan `lookahead_off`, EMA-based trend di W/M, `mtfConflict` flag + narrative #8, indicator di baris Trend
- **F6 — Webhook/Execution**: `webhookFormat` input (Simple/JSON), `PG|key=value` structured output, `docs/webhook-integration.md` dengan TradersPost/Pine Connector parsers, IDX thin market disclaimer

### Fixes
- **Critical**: `mtfConflict` digunakan di `f_narrative()` sebelum didefinisikan — pindah ke baris sebelumnya
- Strategy inputs tanpa `display.data_window` — semua ditambahkan
- `bbPosition` potensi div-by-zero (`bbUpper == bbLower`) — guard
- `volRatio` potensi div-by-zero (`volMA == 0`) — guard
- `bbWidth` potensi div-by-zero (`bbMiddle == 0`) — guard
- `close[1]` historical reference tanpa na guard — ditambahkan
- `btLosses` variable mati — dihapus
- Strategy ATR hardcoded 14 — jadi input `atrLength`
- Choppiness Index formula (`*100` di dalam log)
- `f_scoreRange()` linear interpolation pakai `min`/`max`
- `ta.dmi()` gantikan `ta.di()` untuk +DI/-DI yang benar
- `alert()` signature v6 = `alert(message, condition)`
- CI `|| true` dihapus (test bisa gagalkan pipeline)
- `display = display.data_window` di semua 50 input
- `weightSmartMoney` input (tidak hardcoded lagi)
- `rowCount` tabel (sebelumnya 5, volume terpotong)

### Testing
- **90 tests total** (+39 dari v0.1.0-alpha)
- 88 unit tests: utility (16), trend (6), momentum (6), volatility (11), volume (6), overall (6), signal entry (10), risk levels (7), position sizing (5), MTF conflict (6), signal direction & zone (9)
- 2 PineTS full-script integration tests: kompilasi + eksekusi mock data
- Verifikasi: scores di range [0,100], bervariasi antar bar, semua plot hadir

### Docs
- `docs/webhook-integration.md` — setup TradersPost, Pine Connector, custom webhook, IDX disclaimer
- `docs/TV_PUBLISH_DESC.md` — deskripsi publikasi TradingView (bilingual ID/EN)
- `ARCHITECTURE.md` diperbarui: entry trigger engine, risk management, MTF, webhook, strategy companion
- `README.md` / `README.id.md` diperbarui: test count 90, settings baru, webhook format
- `DEVELOPMENT.md` diperbarui: budgets, changelog lengkap
- `CHANGELOG.md` — file terpisah dari DEVELOPMENT.md

---

## v0.1.0-alpha

### Features
- 4 dimensi scoring (Trend, Momentum, Volatility, Volume)
- 5 color themes (Gelap, Terang, Bursa Hijau, Biru Nusantara, Emas Premium)
- 3 display modes (Compact, Standard, Detailed)
- Smart Money Flow (optional, toggle ON/OFF)
- 7 alert conditions (signal change, trend extreme, RSI OB/OS, volume spike, SM flow, chop ranging)
- ID/EN bilingual
- Custom weights per dimension
- Oscillator panel with score zones
- Narrative engine (9 conditions)

### Testing
- 47 tests: utility functions + scoring engine
- Pine Script v6 compliance

### Docs
- `docs/ARCHITECTURE.md` — scoring methodology
- `docs/README.md` / `docs/README.id.md` — user guide
- `docs/DEVELOPMENT.md` — dev setup
- `docs/AI.md` — AI collaboration context
- `CATATAN.md` — lessons learned
- `CONTRIBUTING.md` — contribution guide
