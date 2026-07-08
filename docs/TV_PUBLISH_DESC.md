# TradingView — Deskripsi Publikasi

Copy-paste berikut saat publish indicator di TradingView:

---

### v0.2.1-alpha Update (2026-07-06)

**Critical Fixes:**
- **Perbaikan sinyal Composite Score**: Bug deadlock `prevZone = -1` menyebabkan Entry Trigger, Level Referensi, Return Sejak Sinyal, dan Histori Sinyal tidak pernah muncul di mode default. Sekarang sudah berfungsi penuh.
- **Risk Levels muncul di semua mode entry**: SL/TP sebelumnya hanya muncul di mode Composite Score — sekarang berfungsi di Pullback dan Breakout juga.
- **Confluence scoring lebih akurat**: Trend tidak lagi menghitung ADX weak, Volatility menggunakan threshold chop 38 (bukan 50).
- **Zero compiler warnings**: Semua multi-line operator dikonversi ke `if/else` untuk kepatuhan Pine Script v6.

**UX Improvements:**
- 16+ tooltip pada input settings Entry Trigger, Risk Mgmt, Position Size, MTF, Signal, Webhook
- Panduan trading 10 langkah (`docs/PANDUAN-TRADING.md`) — dari membaca tabel hingga keputusan entry
- "Return Sejak Sinyal" (Indonesia) menggantikan "Forward Return"

---

## Judul

## Judul

**Saham: Papan Gerak By. Akhmfz**

## Deskripsi (Indonesia)

Dashboard Analisis Teknikal Multidimensi untuk Pasar Modal Indonesia (IDX).

Pasangan natural dari Papan Instrumen (fundamental) — fundamental + teknikal = analisis lengkap.

### 4 Dimensi Scoring (bobot bisa diatur)
- **Trend** — EMA 20/50/200, SuperTrend, ADX/DMI
- **Momentum** — RSI(14), MACD(12,26,9), Stochastic(14,3,3)
- **Volatilitas** — Bollinger Bands, Choppiness Index, ATR%
- **Volume** — Volume Ratio, OBV, Net Volume (Chaikin MF)
- **Smart Money** (opsional) — Deteksi flow institusional

### 3 Mode Tampilan
- **Compact** — 1 baris untuk scan cepat
- **Standard (default)** — Tabel narrative + score + sinyal + backtest + 4 dimensi
- **Detailed** — Breakdown sub-indikator per dimensi

### Fitur Unggulan
- Overall score 0-100 dengan 3 zona sinyal (Bullish/Netral/Bearish)
- Confluence counter per dimensi (berapa sub-indikator setuju)
- Narrative engine — insight 1 baris (Bahasa Indonesia / English)
- Signal validation — forward return % sejak sinyal terakhir
- Backtest — win rate 20 sinyal terakhir (circular buffer)
- Tooltips pada setiap sel tabel
- Oscillator plot dengan bgcolor zone coloring
- 5 color themes (Gelap, Terang, Bursa Hijau, Biru Nusantara, Emas Premium)
- 7 alert triggers otomatis

### Cara Pakai
1. Add to Chart
2. Atur Settings → Mode (Compact/Standard/Detailed)
3. Sesuaikan parameter teknikal per saham
4. Hover tabel untuk detail sub-indikator
5. Gunakan alert untuk notifikasi real-time

### Catatan
- Data teknikal bersifat historis, BUKAN rekomendasi beli/jual
- Threshold 40/70 fixed — sesuaikan parameter per saham jika perlu
- Score naik turun secara real-time di setiap bar baru
- Backtest: 20 sinyal terakhir, dievaluasi 10 bar setelah cross

### Author
Muhammad Akhmal (AKHMFZ) — Indonesia
akhmfz.analytics@gmail.com

License: MIT
Source: https://github.com/akhmfz/papan-gerak

---

## English Version (for international users)

Multi-Dimension Technical Analysis Dashboard for IDX (Indonesia Stock Exchange).

Natural companion to Papan Instrumen (fundamental analysis).

### 4 Scoring Dimensions (adjustable weights)
- **Trend** — EMA 20/50/200, SuperTrend, ADX/DMI
- **Momentum** — RSI(14), MACD(12,26,9), Stochastic(14,3,3)
- **Volatility** — Bollinger Bands, Choppiness Index, ATR%
- **Volume** — Volume Ratio, OBV, Net Volume (Chaikin MF)
- **Smart Money** (optional)

### 3 Display Modes
- **Compact** — 1 line quick scan
- **Standard (default)** — Full table with narrative + score + signal + backtest
- **Detailed** — Sub-indicator breakdown per dimension

### Key Features
- 0-100 overall score with 3 signal zones (Bullish/Neutral/Bearish)
- Confluence counters per dimension
- 1-line narrative insight (Indonesian / English)
- Signal validation with forward return %
- Backtest: 20-signal circular buffer, 10-bar evaluation
- Tooltips on every table cell
- Oscillator plot with zone background coloring
- 5 color themes
- 7 automated alert triggers

### Author
Muhammad Akhmal (AKHMFZ) — Indonesia

License: MIT
Source: https://github.com/akhmfz/papan-gerak
