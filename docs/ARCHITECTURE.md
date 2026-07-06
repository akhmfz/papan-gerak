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

**Catatan:** MACD adalah komponen terpenting — 5 tingkat kondisi mencerminkan momentum secara granular.

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

**Net Volume Formula (Chaikin MF Multiplier):**
```
mfMultiplier = (close - low) - (high - close)
netVol = volume × mfMultiplier / (high - low)
```
Positif = buying pressure, Negatif = selling pressure.

**Volume Spike Quality:**
- Close in upper half + net volume positif → 90 (quality spike)
- Close in upper half OR net volume positif → 70
- Neither → 30 (distribution)
- No spike → 50

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
| 7 | OBV divergence (close > 10 bar lalu, OBV turun) | ⚠️ Harga naik tapi OBV divergen |
| 8 | Choppiness ≥62 | ⏳ Pasar ranging |
| 9 | Fallback | 💡 Kondisi campuran |

## 6. Sinyal

| Skor | Sinyal | Aksi |
|------|--------|------|
| ≥ 70 | **BUY** / BULLISH | Entry long zone |
| 40–70 | **HOLD** / NETRAL | Sideway, hold |
| ≤ 40 | **SELL** / BEARISH | Exit / hedging zone |

Cross 40 = bearish↔netral. Cross 70 = netral↔bullish.

## 7. Backtest

20 sinyal terakhir disimpan di circular buffer. Setiap sinyal dievaluasi **10 bar** setelah cross:

```
forwardReturn = (close / entryPrice - 1) × direction × 100
```

- direction = 1 (bullish cross 40/70), -1 (bearish cross 40/70)
- Positif = prediksi benar → win
- Negatif = prediksi salah → loss

Win rate dan total return ditampilkan di tabel. Hover untuk detail.

## 8. Oscillator (Signal Line)

Indicator `overlay = false` — ditampilkan di panel terpisah:

- Garis: overallScore, warna sesuai signal (bullish/neutral/bearish)
- Hline 70 (merah) — overbought reference
- Hline 40 (hijau) — oversold reference
- Hline 50 (abu) — midline
- Background: tint hijau (>70), kuning (40-70), merah (<40)

## 9. Keterbatasan

- Data teknikal bersifat historis, tidak prediktif mutlak
- Choppiness Index bisa false signal di saham volume tipis IDX
- Smart Money detection adalah proxy, bukan data institusional aktual
- Threshold 40/70 fixed — perlu penyesuaian manual per saham
- Sektor-aware scaling belum diimplementasikan (v2)
