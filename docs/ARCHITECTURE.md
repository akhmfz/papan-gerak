# Arsitektur Papan Gerak — Scoring Methodology

> v0.2.0-alpha | Teknikal Dashboard untuk IDX

---

## 1. Filosofi

Papan Gerak mengikuti prinsip yang sama dengan Papan Instrumen:
1. **Indonesia First** — Dikalibrasi untuk karakteristik pasar Indonesia.
2. **Methodology Before Code** — Metodologi didahulukan, kode adalah implementasi.
3. **Simplicity** — Satu skor, satu sinyal. Tidak perlu 10 indikator terpisah.
4. **Multi-Dimensi** — 4 dimensi teknikal yang saling melengkapi.

## 2. Dimensi Scoring

### 2.1 Trend Score (30% default)

Menilai arah dan kekuatan tren pasar.

| Sub-Komponen | Bobot | Metode |
|-------------|-------|--------|
| EMA Position | 33% | Posisi harga relatif terhadap EMA 20/50/200 (-1 s/d 2 → 0-100) |
| SuperTrend | 22% | Arah SuperTrend (up = 100, down = 0) |
| ADX Strength | 22% | ADX ≥ threshold = tren kuat (arah ADX menentukan 80/20), < threshold = 50 |
| Trend Alignment | 11% | Konsistensi antar indikator (AND dari ADX + SuperTrend + EMA) — sinyal echo, bukan independen |
| EMA Slope | 11% | Kemiringan EMA Fast dalam 5 bar via f_scoreHigher |

### 2.2 Momentum Score (30% default)

Mengukur kekuatan dan percepatan pergerakan harga.

| Sub-Komponen | Bobot | Metode |
|-------------|-------|--------|
| RSI(14) | 30% | 0-100 scale via f_scoreHigher(30, 70) |
| MACD | 30% | Kombinasi MACD bullish/bearish + histogram rising/falling (10/35/55/70/90) |
| Stochastic(14,3) | 20% | 0-100 scale via f_scoreHigher(20, 80) |
| RSI Direction | 10% | RSI naik/turun dalam 1 bar (70/30) |
| MACD Hist Slope | 10% | Histogram membaik/memburuk dalam 2 bar (70/30) |

### 2.3 Volatility Score (20% default)

Mengukur kondisi volatilitas — terlalu rendah = sideway, terlalu tinggi = tidak stabil.

| Sub-Komponen | Bobot | Metode |
|-------------|-------|--------|
| Bollinger Width Ratio | 30% | BB width vs average via f_scoreRange(0.3, 3.0, 0.8, 1.2) |
| Choppiness Index | 30% | 0-100 scale (rendah = trending, tinggi = ranging) → chopScore = 100 - chopValue |
| ATR% | 20% | ATR sebagai % harga via f_scoreRange(0.5, 10.0, 1.0, 3.0) |
| BB Position | 20% | Posisi harga dalam band (100 - |pos - 50| × 2) |

**Formula Choppiness Index:**
```
chopValue = log(atrSum / range_) / log(length) × 100
```
Rendah (<38) = trending, Tinggi (>62) = ranging.

### 2.4 Volume Score (20% default)

Mengkonfirmasi pergerakan harga dengan volume.

| Sub-Komponen | Bobot | Metode |
|-------------|-------|--------|
| Volume vs MA | 30% | Volume relatif terhadap SMA 20 via f_scoreRange(0.2, 5.0, 0.8, 2.0) |
| OBV Agreement | 30% | OBV searah dengan harga? (80/30) |
| Net Volume | 20% | Chaikin Money Flow multiplier proxy, smoothed via SMA 5 (70/30) |
| Volume Spike Quality | 10% | Spike + arah + posisi close: 90/70/30/50 |

### 2.5 Smart Money Flow (Optional)

Mendeteksi aktivitas institusional via volume anomaly.

| Sub-Komponen | Bobot | Metode |
|-------------|-------|--------|
| Volume Z-Score | 30% | Volume > 2.5 SD dari rata-rata (90/50) |
| Body Volume | 20% | Body/range ratio ≥ 0.6 + volume spike (80/50) |
| OBV Alignment | 20% | OBV searah dengan institutional flow (75/40) |
| Net Volume | 10% | Net volume positif (70/40) |

## 3. Overall Score

```
Overall = (Trend × wTrend + Momentum × wMomentum +
           Volatility × wVolatility + Volume × wVolume) / (wTrend + wMomentum + wVolatility + wVolume)
```

Semua bobot bisa diatur user via Settings → **Weights** tab.
Jika Smart Money ON: tambah `SmartMoney × wSM` ke pembilang dan `wSM` ke penyebut.

## 4. Confluence Counts

Setiap dimensi memiliki counter biner: berapa sub-indikator "setuju" (skor ≥50).

| Dimensi | Total | Komponen |
|---------|-------|----------|
| Trend | 4 | EMA pos ≥1, SuperTrend up, ADX trend up, trend aligned |
| Momentum | 5 | RSI >50, MACD bullish, Stoch bullish, RSI dir up, Hist rising |
| Volatility | 4 | BB moderate, Chop <50, ATR moderate, BB pos 30-70 |
| Volume | 4 | Vol ratio ≥0.8, OBV agree, Net vol >0, Vol spike |

Confluence ≠ Score. Confluence = biner, Score = kontinu. Keduanya ditampilkan untuk deteksi konflik.

## 5. Narrative Engine

9 kondisi prioritas, dievaluasi berurutan:

| Prioritas | Kondisi | Narasi |
|-----------|---------|--------|
| 1 | Momentum ≥65 & RSI ≥70 (overbought) | ⚠️ Momentum kuat tapi RSI overbought |
| 2 | RSI ≤30 (oversold) & volume spike | 📈 RSI oversold + volume spike |
| 3 | Trend <40 & Volatility <40 | ⚠️ Tren lemah & volatil |
| 4 | Trend ≥65 & volume confluence ≥3 | ✅ Volume konfirmasi tren |
| 5 | Overall ≥70 & trend ≥65 & vol confluence ≥3 | ✅ Semua align bullish |
| 6 | Overall ≤30 & trend ≤35 & vol confluence ≤1 | ✅ Semua align bearish |
| 7 | OBV divergence (close up, OBV down) | ⚠️ Harga naik tapi OBV divergen |
| 8 | MTF conflict (enableMtfFilter ON) | ⚠️ Tren MTF bearish/bullish — konfirmasi |
| 9 | Choppiness ≥62 | ⏳ Pasar ranging |
| 10 | Fallback | 💡 Kondisi campuran |

## 6. Entry Trigger Engine (3 Modes)

### 6.1 Composite Score (Default)
Zone-based: overallScore crossing 40 atau 70.
- Bearish→Neutral (bullish) atau Neutral→Bullish: sinyal LONG
- Bullish→Neutral (bearish) atau Neutral→Bearish: sinyal SHORT
- Dibatasi oleh `minSignalBars` (min bar antar sinyal) dan `signalFilterMode` (chop filter)

### 6.2 Pullback
Masuk saat harga pullback ke EMA20 dalam tren kuat:
- `trendScore ≥ 65`
- Harga dalam 1.5× ATR dari EMA20
- RSI ≤ 50 dan berbalik naik (`ta.rising(rsiValue, 1)`)
- Sinyal selalu LONG

### 6.3 Breakout
Masuk saat harga break 20-bar range dengan volume:
- `volumeScore ≥ 60`
- Close ≥ highest(20) → LONG, atau close ≤ lowest(20) → SHORT
- Tidak ada filter arah

### 6.4 Unified Signal
Semua mode menghasilkan `entryTriggered` (boolean) yang digunakan untuk:
- Signal tracking (forward return)
- Backtest recording
- Alert messaging
- Risk level capture
- Position sizing

## 7. Risk Management

### 7.1 Stop Loss Levels
| Mode | Formula | Trigger |
|------|---------|---------|
| ATR | entry ± ATR × slAtrMult | Saat sinyal masuk |
| Swing Low/High | lowest(swingPeriod) / highest(swingPeriod) | Saat sinyal masuk |
| Both (Wider) | min/max dari ATR & Swing | Paling lebar |

### 7.2 Target
R-multiple: `entryPrice + riskAmount × targetR × direction`

### 7.3 Position Sizing
```
riskRp = accountBalance × riskPct / 100
suggestedLots = floor(riskRp / riskAmt / 100)
```
Ditampilkan di baris "Level Referensi" tabel.

## 8. Multi-Timeframe Filter (Optional)

`request.security()` dengan `lookahead_off` untuk trend di timeframe lebih tinggi (W / M):
- MTF Trend Score dihitung dari posisi close terhadap EMA 20/50/200 di timeframe MTF
- `mtfConflict` terdeteksi jika overallScore harian bertentangan dengan MTF
- Narasi #8 aktif saat konflik
- MTF score ditampilkan di baris Trend sebagai indikator

## 9. Signal & Thresholds

| Skor | Sinyal | Aksi |
|------|--------|------|
| ≥ 70 | **BUY** / BULLISH | Entry long zone |
| 40–70 | **HOLD** / NETRAL | Sideway, hold |
| ≤ 40 | **SELL** / BEARISH | Exit / hedging zone |

Cross 40 = bearish↔netral. Cross 70 = netral↔bullish.

## 10. Backtest

20 sinyal terakhir disimpan di circular buffer. Setiap sinyal dievaluasi **10 bar** setelah cross:

```
forwardReturn = (close / entryPrice - 1) × direction × 100
```

- direction = +1 (long), -1 (short) — tergantung mode entry
- Positif = prediksi benar → win
- Negatif = prediksi salah → loss

Win rate dan total return ditampilkan di tabel. Hover untuk detail.

## 11. Webhook / Alert Format

Dua format via `webhookFormat` input:

| Mode | Output | Contoh |
|------|--------|--------|
| Simple (Default) | Teks biasa | `PAPAN GERAK (Composite Score): Neutral→Bullish → BULLISH` |
| JSON | Pipeline key=value | `PG\|event=entry\|time=...\|ticker=BBRI\|mode=...\|action=buy\|price=1234\|score=75` |

Format JSON didesain untuk parsing oleh TradersPost, Pine Connector, atau webhook kustom.

## 12. Companion Strategy Script (Terpisah)

`src/strategies/PapanGerakStrategy.pine` — script `strategy()` untuk backtest:
- Komisi 0.15%, slippage 5 tick, modal Rp100jt
- 3 entry trigger mode (Composite / Pullback / Breakout)
- SL/TP via `strategy.exit()`
- Simplified scoring (trigger-konsisten dengan indicator)
- Win rate + profit factor + return di tabel

## 13. Oscillator (Signal Line)

Indicator `overlay = false` — ditampilkan di panel terpisah:
- Garis: overallScore, warna sesuai signal
- Hline 70 (merah) — overbought reference
- Hline 40 (hijau) — oversold reference
- Hline 50 (abu) — midline
- Background: tint hijau (>70), kuning (40-70), merah (<40)

## 14. Keterbatasan

- Data teknikal bersifat historis, tidak prediktif mutlak
- Choppiness Index bisa false signal di saham volume tipis IDX
- Smart Money detection adalah proxy, bukan data institusional aktual
- Threshold 40/70 fixed — perlu penyesuaian manual per saham
- Webhook format bukan JSON murni (Pine v6 tidak support escape chars) — pipe-delimited key=value
- Sektor-aware scaling belum diimplementasikan (v2)
