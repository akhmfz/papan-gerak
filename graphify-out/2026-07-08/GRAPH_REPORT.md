# Graph Report - .  (2026-07-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 331 nodes · 315 edges · 31 communities (24 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c3d4ef47`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Saham: Papan Gerak By. Akhmfz
- Arsitektur Papan Gerak — Scoring Methodology
- Saham: Papan Gerak By. Akhmfz
- CATATAN PENGEMBANGAN — Lessons Learned
- v0.2.1-alpha (2026-07-06)
- Deskripsi (Indonesia)
- Saham: Papan Gerak By. Akhmfz
- Panduan Kombinasi — Papan Instrumen + Papan Gerak
- Webhook Integration — Papan Gerak
- package.json
- Alur Baca Tabel (urut dari atas ke bawah)
- Settings Reference
- Development Guide — Papan Gerak
- README.md
- Panduan Pengguna — Papan Gerak
- full-pinets.mjs
- lint.sh
- build.sh
- gh-sync.sh
- transpile.sh
- Settings Lengkap
- Color Legend & Themes
- IDX Market Considerations

## God Nodes (most connected - your core abstractions)
1. `Arsitektur Papan Gerak — Scoring Methodology` - 15 edges
2. `Settings Lengkap` - 14 edges
3. `Settings Reference` - 14 edges
4. `Saham: Papan Gerak By. Akhmfz` - 12 edges
5. `Saham: Papan Gerak By. Akhmfz` - 12 edges
6. `Panduan Pengguna — Papan Gerak` - 12 edges
7. `Alur Baca Tabel (urut dari atas ke bawah)` - 11 edges
8. `AI.md — AI Collaboration Context` - 9 edges
9. `Webhook Integration — Papan Gerak` - 9 edges
10. `Saham: Papan Gerak By. Akhmfz` - 8 edges

## Surprising Connections (you probably didn't know these)
- `AI Collaboration Context` --governs--> `Panduan Pengguna — Papan Gerak`  [EXTRACTED]
  docs/AI.md → docs/README.id.md
- `4 Dimensi Scoring` --includes--> `Momentum Dimensi`  [EXTRACTED]
  docs/ARCHITECTURE.md → docs/README.id.md
- `4 Dimensi Scoring` --includes--> `Smart Money`  [EXTRACTED]
  docs/ARCHITECTURE.md → docs/README.id.md
- `4 Dimensi Scoring` --includes--> `Trend Dimensi`  [EXTRACTED]
  docs/ARCHITECTURE.md → docs/README.id.md
- `4 Dimensi Scoring` --includes--> `Volatility Dimensi`  [EXTRACTED]
  docs/ARCHITECTURE.md → docs/README.id.md

## Import Cycles
- None detected.

## Communities (31 total, 7 thin omitted)

### Community 0 - "Saham: Papan Gerak By. Akhmfz"
Cohesion: 0.07
Nodes (27): 1. 📊 Baris Narasi (paling atas), 2. Header — `PAPAN GERAK (last bar) 82`, 3. Sinyal & BUY/SELL/HOLD, 4. 📊 Sinyal (Forward Return), 5. 📊 Backtest (Win Rate), 6. Detail Per Dimensi + Confluence, 7. Legend Warna, Alerts (+19 more)

### Community 1 - "Arsitektur Papan Gerak — Scoring Methodology"
Cohesion: 0.07
Nodes (27): 10. Backtest, 11. Webhook / Alert Format, 12. Companion Strategy Script (Terpisah), 13. Oscillator (Signal Line), 14. Keterbatasan, 1. Filosofi, 2.1 Trend Score (30% default), 2.2 Momentum Score (30% default) (+19 more)

### Community 2 - "Saham: Papan Gerak By. Akhmfz"
Cohesion: 0.08
Nodes (26): 1. 📊 Narrative Row (top), 2. Header — Score + Signal, 3. Signal Validation (Forward Return), 4. Backtest (Win Rate), 5. Dimension Score + Confluence Counter, 6. Color Legend, Alerts, Author (+18 more)

### Community 3 - "CATATAN PENGEMBANGAN — Lessons Learned"
Cohesion: 0.10
Nodes (19): 1. Reserved Keywords, 2. NO Local Functions Inside `if` Blocks, 3. Type Annotations, 4. Error Cascade, 5. `alert()` v6 vs v5, 6. `input.*` → selalu tambah `display=`, ⏳ Backlog, ⏳ Backlog (+11 more)

### Community 4 - "v0.2.1-alpha (2026-07-06)"
Cohesion: 0.12
Nodes (16): Changelog — Papan Gerak, Docs, Docs, Docs, Features, Features, Fixes, Fixes (Critical) (+8 more)

### Community 5 - "Deskripsi (Indonesia)"
Cohesion: 0.12
Nodes (16): 3 Display Modes, 3 Mode Tampilan, 4 Dimensi Scoring (bobot bisa diatur), 4 Scoring Dimensions (adjustable weights), Author, Author, Cara Pakai, Catatan (+8 more)

### Community 6 - "Saham: Papan Gerak By. Akhmfz"
Cohesion: 0.25
Nodes (8): Author, Development, Documentation, License, Project Structure, Quick Start, Saham: Papan Gerak By. Akhmfz, Stats

### Community 7 - "Panduan Kombinasi — Papan Instrumen + Papan Gerak"
Cohesion: 0.12
Nodes (15): Alur 2 Fase, Catatan Penting, Contoh Skenario, Fase 1: Fundamental Screening (mingguan), Fase 2: Teknikal Timing (harian), Link Cepat, Matriks Keputusan Gabungan, Panduan Kombinasi — Papan Instrumen + Papan Gerak (+7 more)

### Community 8 - "Webhook Integration — Papan Gerak"
Cohesion: 0.12
Nodes (16): 1.1 Simple (Default), 1.2 JSON (Webhook), 1.3 Event Types, 1. Alert Format, 2. TradingView Alert Setup, 3. TradersPost Integration, 4. Pine Connector (MT4/MT5), 5. Custom Webhook Server (+8 more)

### Community 9 - "package.json"
Cohesion: 0.13
Nodes (14): description, devDependencies, pinets, license, name, private, scripts, build (+6 more)

### Community 10 - "Alur Baca Tabel (urut dari atas ke bawah)"
Cohesion: 0.13
Nodes (15): 10. Position Sizing = Batas Atas, 1. Baca Narrative Dulu, Bukan Skor, 2. Cek Zona Sinyal sebagai Filter Arah, 3. Cek Volatilitas — Jangan Entry saat Ranging, 4. Konfirmasi dengan Confluence per Dimensi, 5. Volume Harus Konfirmasi Tren, 6. Hormati MTF Filter, 7. Smart Money sebagai Konfirmasi Tambahan (+7 more)

### Community 11 - "Settings Reference"
Cohesion: 0.14
Nodes (14): Display Tab, Entry Trigger Tab, Momentum Tab, MTF Tab, Position Size Tab, Risk Mgmt Tab, Settings Reference, Signal Tab (+6 more)

### Community 12 - "Development Guide — Papan Gerak"
Cohesion: 0.17
Nodes (11): Backlog, Changelog, Commit Convention, Development Flow, Development Guide — Papan Gerak, Module Budget, Structure, Tech Stack (+3 more)

### Community 14 - "README.md"
Cohesion: 0.12
Nodes (11): Contributing to Papan Gerak, Guidelines, AI.md — AI Collaboration Context, AI Roles, Constraints, Context Loading Order, Golden Rules, Product Philosophy (+3 more)

### Community 15 - "Panduan Pengguna — Papan Gerak"
Cohesion: 0.12
Nodes (17): 3 Display Modes, 4 Dimensi Scoring, AI Collaboration Context, Built-in Backtest (20 signals), Confluence Counter, Entry Trigger Engine, Momentum Dimensi, MTF Trend Filter (+9 more)

### Community 28 - "Settings Lengkap"
Cohesion: 0.14
Nodes (14): Settings Lengkap, Tab Display, Tab Entry Trigger, Tab Momentum, Tab MTF, Tab Position Size, Tab Risk Mgmt, Tab Signal (+6 more)

## Knowledge Gaps
- **227 isolated node(s):** `build.sh script`, `name`, `version`, `description`, `private` (+222 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Saham: Papan Gerak By. Akhmfz` connect `Saham: Papan Gerak By. Akhmfz` to `Settings Lengkap`, `README.md`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **Why does `Saham: Papan Gerak By. Akhmfz` connect `Saham: Papan Gerak By. Akhmfz` to `Settings Reference`, `README.md`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **What connects `build.sh script`, `name`, `version` to the rest of the system?**
  _227 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Saham: Papan Gerak By. Akhmfz` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Arsitektur Papan Gerak — Scoring Methodology` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Saham: Papan Gerak By. Akhmfz` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `CATATAN PENGEMBANGAN — Lessons Learned` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._