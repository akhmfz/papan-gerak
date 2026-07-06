# Saham: Papan Gerak By. Akhmfz

> Dashboard Analisis Teknikal Multidimensi untuk Pasar Modal Indonesia — Pine Script v6.
> **Pasangan natural dari [Papan Instrumen](https://github.com/akhmfz/papan-instrumen)** (fundamental + teknikal = analisis lengkap).

---

## Cara Instalasi

1. Buka TradingView → Pine Editor
2. Copy seluruh isi `src/PapanGerak.pine` (atau `npm run build` dulu)
3. Paste → klik **Add to Chart**
4. Atur mode dan parameter di Settings sesuai kebutuhan

---

## Mode Tampilan

Ada 3 mode yang bisa dipilih via Settings → **Mode**:

### Compact — 1 Baris
```
PAPAN GERAK BULLISH 72
```
Cocok untuk **scan cepat** — lihat signal + skor tanpa detail.

### Standard — Tabel Lengkap (Default)
```
📊 ⚠️ Momentum kuat tapi RSI overbought — waspada koreksi
PAPAN GERAK (last bar)                   82
Sinyal                              BULLISH
📊 Sinyal                           +3.2%
📊 Backtest                     65% win (13/20)
↑ Tren 80 (4/4↑)                    hover → detail
↑ Momentum 72 (3/5↑)                hover → detail
≈ Volatilitas 77 (3/4✓)            hover → detail
↑ Volume 88 (4/4✓)                 hover → detail
🔴 <40 Bearish | 🟡 40-70 Netral | 🟢 >70 Bullish
```

### Detailed — Tabel + Sub-Indikator
Sama seperti Standard, tapi setiap dimensi punya baris tambahan yang nunjukin status masing-masing sub-indikator:
```
↑ Trend 80 (4/4↑)
  ➔ EMA>MA50 ✓ | SuperTrend Up ✓ | ADX 28 (strong) ✓ | Aligned ✓
```

---

## Cara Membaca Tabel (Standard Mode)

> 📖 **Panduan lengkap dari tabel ke keputusan entry:** [`PANDUAN-TRADING.md`](PANDUAN-TRADING.md) — alur baca 10 langkah, interpretasi confluence, contoh tiap mode entry.

### 1. 📊 Baris Narasi (paling atas)
Insight 1 baris dari kondisi pasar. Prioritas dari konflik tertinggi:

| Narasi | Arti | Tindakan |
|--------|------|----------|
| ⚠️ Momentum kuat tapi RSI overbought — waspada koreksi | Harga naik, tapi udah jenuh beli | Jangan entry long — tunggu koreksi |
| 📈 RSI oversold + volume spike — potensi bounce | Harga turun, volume naik, RSI jenuh jual | Cari konfirmasi reversal candle |
| ⚠️ Tren lemah & volatil — hindari entry baru | Market chaotic, ga ada arah | No trade — resiko tinggi |
| ✅ Volume konfirmasi tren — bias searah | Volume mendukung pergerakan harga | Entry searah tren |
| ✅ Semua dimensi align — bias bullish/bearish | Semua indikator setuju | Entry dengan confidence tinggi |
| ⚠️ Harga naik tapi OBV divergen — konfirmasi dulu | Volume ga dukung kenaikan | Waspada fake breakout |
| ⏳ Pasar ranging — tunggu breakout | Market sideways | Hold / wait |
| 💡 Kondisi campuran — cek detail per dimensi | Tidak ada sinyal dominan | Cek confluence counter |

### 2. Header — `PAPAN GERAK (last bar) 82`
- **Skor keseluruhan (0-100)**: agregasi 4 dimensi + Smart Money
- Label **(last bar)**: data berdasarkan bar terakhir, bukan bar yang di-hover
- Warna: 🟢 ≥70 (bullish), 🟡 40-70 (netral), 🔴 <40 (bearish)

### 3. Sinyal & BUY/SELL/HOLD
| Signal | Threshold | Arti |
|--------|-----------|------|
| 🔵 **BUY** | Score cross >40 atau >70 | Momen entry beli |
| ⚪ **HOLD** | Score di 40-70, tidak ada cross | Tahan / tunggu |
| 🔴 **SELL** | Score cross <70 atau <40 | Momen exit / short |

**Tidak ada sinyal di compact/standard mode** — BUY/SELL muncul otomatis berdasarkan cross threshold.

### 4. 📊 Sinyal (Forward Return)
Return % sejak sinyal terakhir. Menjawab: **"kalau saya entry waktu signal, sekarang untung apa rugi?"**

| Status | Arti |
|--------|------|
| ✅ +5.2% | Sinyal sebelumnya benar — tren searah |
| ➖ +0.8% | Masih positif, tipis |
| ➖ -1.2% | Mulai melawan — evaluasi ulang |
| ❌ -4.1% | Sinyal sebelumnya salah — waspada reversal |

### 5. 📊 Backtest (Win Rate)
Dari 20 sinyal terakhir (dievaluasi 10 bar setelah cross), berapa % yang benar:

| Win Rate | Arti |
|----------|------|
| **≥65%** | Threshold 40/70 cocok untuk saham ini — sinyal bisa dipercaya |
| **40-65%** | Lumayan, tapi perlu konfirmasi ekstra |
| **<40%** | Threshold tidak cocok — mungkin perlu ubah parameter |

Hover untuk lihat total return akumulasi.

### 6. Detail Per Dimensi + Confluence

Setiap dimensi nunjukin **skor** + **confluence counter**:

```
↑ Tren 80 (4/4↑)   → 4 dari 4 sub-indikator bullish — semua setuju
↑ Momentum 64 (3/5) → 3 dari 5 bullish — ada konflik, waspada
≈ Volatilitas 77 (3/4✓) → 3 dari 4 ideal — volatilitas sehat
↑ Volume 88 (4/4✓) → semua indikator volume setuju
```

**Cara baca confluence:**
- **(4/4↑)** = semua sub-indikator tren bullish → skor bisa dipercaya
- **(2/5↑)** = mayoritas sub-indikator momentum bearish → skor 64 menyesatkan
- **Hover** pada angka skor untuk lihat breakdown sub-indikator

### 7. Legend Warna
```
🔴 <40 Bearish | 🟡 40-70 Netral | 🟢 >70 Bullish
```

---

## Alerts

| Alert | Trigger | Cara Pakai |
|-------|---------|------------|
| Signal Change | Score cross 40 atau 70 | Notifikasi perubahan arah |
| Trend Extreme | Trend ≥80 atau ≤20 | Peringatan tren ekstrem |
| RSI Oversold | RSI ≤30 | Potensi reversal naik |
| RSI Overbought | RSI ≥70 | Potensi reversal turun |
| Volume Spike | Volume ≥2x MA | Konfirmasi breakout/breakdown |
| Smart Money Flow | Flow institusional | Deteksi akumulasi distribusi |
| Ranging Market | Choppiness ≥62 | Market sideways, tunggu |

Semua alert mendukung 2 format (pilih via Settings → Webhook → **Alert Format**):
- **Simple**: teks biasa (`PAPAN GERAK (Composite Score): Neutral→Bullish → BULLISH`)
- **JSON**: pipeline terstruktur untuk webhook (`PG|event=entry|time=...|ticker=BBRI|...`)

Lihat `docs/webhook-integration.md` untuk setup TradersPost / Pine Connector.

---

## Settings Lengkap

### Tab Display
| Parameter | Default | Opsi |
|-----------|---------|------|
| Table Position | Top Right | 4 pojok |
| Mode | Standard | Compact / Standard / Detailed |
| Bahasa | Indonesia | Indonesia / English |
| Color Theme | Gelap | 5 tema |

### Tab Trend
| Parameter | Default | Range |
|-----------|---------|-------|
| EMA Fast | 20 | 5–50 |
| EMA Mid | 50 | 20–100 |
| EMA Slow | 200 | 100–500 |
| SuperTrend Factor | 3.0 | 1.0–5.0 |
| SuperTrend ATR | 10 | 5–30 |
| ADX Length | 14 | 7–28 |
| ADX Threshold | 25 | 15–40 |

### Tab Momentum
| Parameter | Default | Range |
|-----------|---------|-------|
| RSI Length | 14 | 7–28 |
| RSI Overbought | 70 | 60–85 |
| RSI Oversold | 30 | 15–40 |
| MACD Fast | 12 | 5–25 |
| MACD Slow | 26 | 15–50 |
| MACD Signal | 9 | 5–20 |
| Stochastic K | 14 | 7–28 |
| Stochastic D | 3 | 2–10 |
| Stoch Overbought | 80 | 70–90 |
| Stoch Oversold | 20 | 10–30 |

### Tab Volatility
| Parameter | Default | Range |
|-----------|---------|-------|
| ATR Length | 14 | 7–30 |
| Bollinger Length | 20 | 10–50 |
| Bollinger Multiplier | 2.0 | 1.5–3.0 |
| Choppiness Length | 14 | 7–30 |

### Tab Volume
| Parameter | Default | Range |
|-----------|---------|-------|
| Volume MA Length | 20 | 10–50 |
| Spike Multiplier | 2.0 | 1.5–5.0 |

### Tab Weights
| Parameter | Default | Range |
|-----------|---------|-------|
| Trend Weight | 30% | 0–100 |
| Momentum Weight | 30% | 0–100 |
| Volatility Weight | 20% | 0–100 |
| Volume Weight | 20% | 0–100 |

### Tab Smart Money
| Parameter | Default | Deskripsi |
|-----------|---------|-----------|
| Enable SM Flow | OFF | Aktifkan dimensi Smart Money |
| SM Weight | 20% | Bobot SM di overall score |
| SM Volume Z-Threshold | 2.5 | SD threshold untuk volume spike |
| SM Lookback | 20 | Periode lookback Z-score |

### Tab Signal
| Parameter | Default | Range |
|-----------|---------|-------|
| Min Bars Between Signals | 5 | 1–50 |
| Signal Filter | Disabled | Trending / Ranging / Off |

### Tab Risk Mgmt
| Parameter | Default | Deskripsi |
|-----------|---------|-----------|
| Show Risk Levels | ON | Tampilkan SL/Target di tabel |
| SL Type | ATR | ATR / Swing Low-High / Both |
| SL ATR Multiplier | 1.5 | 0.5–5.0 |
| SL Swing Lookback | 10 | 5–50 |
| Target R-Multiple | 2.0 | 0.5–10.0 |

### Tab Position Size
| Parameter | Default | Deskripsi |
|-----------|---------|-----------|
| Show Position Sizing | OFF | Aktifkan kalkulator lot |
| Account Balance | Rp50jt | 1jt–1M |
| Risk Per Trade | 1.0% | 0.1–5.0% |

### Tab MTF
| Parameter | Default | Deskripsi |
|-----------|---------|-----------|
| Enable MTF Trend Filter | OFF | Filter dengan tren timeframe lebih tinggi |
| MTF Timeframe | W | Weekly / Monthly |

### Tab Entry Trigger
| Parameter | Default | Opsi |
|-----------|---------|------|
| Entry Trigger | Composite Score | Composite / Pullback / Breakout |

### Tab Webhook
| Parameter | Default | Opsi |
|-----------|---------|------|
| Alert Format | Simple | Simple / JSON |

---

## Contoh Skenario Trading

### Entry Long (confidence tinggi)
```
✅ Semua dimensi align — bias bullish
PAPAN GERAK (last bar)                   85
Sinyal                              BULLISH
📊 Sinyal                           +4.2%
📊 Backtest                     72% win (18/25)
↑ Trend 90 (5/5↑)
↑ Momentum 88 (4/4↑)
≈ Volatilitas 80 (3/4✓)
↑ Volume 85 (4/4✓)
```
→ Narasi positif, backtest bagus, confluence max, semua dimensi ≥70.

### Tidak Entry (walaupun skor bagus)
```
⚠️ Momentum kuat tapi RSI overbought — waspada koreksi
PAPAN GERAK (last bar)                   78
Sinyal                              BULLISH
📊 Sinyal                           -1.5%
📊 Backtest                     45% win (9/20)
↑ Trend 85 (4/4↑)
↑ Momentum 72 (3/5↑)
≈ Volatilitas 80 (3/4✓)
↑ Volume 75 (3/4✓)
```
→ Narasi warning, backtest rendah, forward return negatif, momentum cuma 3/5.

### Exit / Hedging
```
💡 Kondisi campuran — cek detail per dimensi
PAPAN GERAK (last bar)                   52
Sinyal                              NETRAL
📊 Sinyal                           -5.8%
📊 Backtest                     38% win (8/21)
→ Tren 48 (2/4↑)
↓ Momentum 35 (1/5↑)
≈ Volatilitas 55 (2/4✓)
→ Volume 60 (2/4✓)
```
→ Forward return negatif, backtest jelek, skor turun drastis.

---

## Metodologi Scoring

Lihat `docs/ARCHITECTURE.md` untuk detail lengkap metodologi.

### Skala 0-100
Setiap sub-indikator diskor 0-100, lalu dirata-rata tertimbang per dimensi. Empat dimensi diagregasi dengan bobot yang bisa diatur user. Threshold sinyal: 70 (bullish) dan 40 (bearish).

### Confluence Count
Jumlah sub-indikator yang setuju arah (biner: ≥50 atau <50) — berbeda dengan skor kontinu. Keduanya ditampilkan berdampingan agar user bisa deteksi konflik.

### Backtest
20 sinyal terakhir disimpan dalam circular buffer. Setiap sinyal dievaluasi 10 bar setelah cross. Win rate = persentase sinyal yang benar (forward return positif).

---

## Pengembangan

```bash
git clone git@github.com:akhmfz/papan-gerak.git
cd papan-gerak
npm install
npm run build        # Generate built file
npm run lint         # Cek reserved keywords + budget
npm run test:all     # 90 tests (unit + PineTS full integration)
npm run ci           # Full pipeline: lint → build → test
```

Edit `src/modules/*.pine` → `bash build.sh` → lalu copy `src/PapanGerak.pine` ke TradingView Pine Editor.

Untuk backtest strategi, gunakan `src/strategies/PapanGerakStrategy.pine` di Strategy Tester.

---

## Keterbatasan

- Data teknikal bersifat historis, **bukan** prediktif mutlak
- Choppiness Index bisa false signal di saham volume tipis
- Smart Money adalah proxy volume, bukan data institusional aktual
- Threshold 40/70 fixed — mungkin perlu penyesuaian per saham
- Format webhook JSON pipe-delimited key=value (Pine v6 tidak support escape chars)
- **BUKAN rekomendasi beli/jual** — alat bantu analisis

---

## Author

**Muhammad Akhmal** — AKHMFZ Analytics, Indonesia
[TradingView](https://www.tradingview.com/u/akhmfz/) · akhmfz.analytics@gmail.com

## License

MIT License — see [LICENSE](LICENSE).
