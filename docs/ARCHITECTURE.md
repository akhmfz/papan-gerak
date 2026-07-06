# Arsitektur Papan Gerak — Scoring Methodology

> v0.1.0-alpha | Teknikal Dashboard untuk IDX

---

## 1. Filosofi

Papan Gerak mengikuti prinsip yang sama dengan Papan Instrumen:
1. **Indonesia First** — Dikalibrasi untuk karakteristik pasar Indonesia.
2. **Methodology Before Code** — Metodologi didahulukan, kode adalah implementasi.
3. **Simplicity** — Satu skor, satu sinyal. Tidak perlu 10 indikator terpisah.
4. **Multi-Dimensi** — 4 dimensi teknikal yang saling melengkapi.

## 2. Dimensi Scoring

### 2.1 Trend Score (30%)

Menilai arah dan kekuatan tren pasar.

| Sub-Komponen | Bobot | Metode |
|-------------|-------|--------|
| EMA Position | 30% | Posisi harga relatif terhadap EMA 20/50/200 |
| SuperTrend | 20% | Arah SuperTrend (1 = bullish, 0 = bearish) |
| ADX Strength | 20% | ADX ≥ 25 = tren kuat, < 25 = lemah |
| Trend Alignment | 20% | Konsistensi antar indikator tren |
| EMA Slope | 10% | Kemiringan EMA Fast dalam 5 bar |

**Formula:** Semakin banyak indikator tren yang sepakat = skor mendekati 100 atau 0.

### 2.2 Momentum Score (30%)

Mengukur kekuatan dan percepatan pergerakan harga.

| Sub-Komponen | Bobot | Metode |
|-------------|-------|--------|
| RSI(14) | 30% | 0-100 scale, ideal 30-70 |
| MACD Histogram | 30% | Posisi MACD + signal + histogram slope |
| Stochastic(14,3) | 20% | 0-100 scale, ideal 20-80 |
| RSI Direction | 10% | RSI naik/turun dalam 1 bar |
| MACD Slope | 10% | Histogram membaik/memburuk dalam 2 bar |

**Catatan:** MACD histogram adalah komponen terpenting — mencerminkan momentum yang sebenarnya.

### 2.3 Volatility Score (20%)

Mengukur kondisi volatilitas — terlalu rendah = sideway, terlalu tinggi = tidak stabil.

| Sub-Komponen | Bobot | Metode |
|-------------|-------|--------|
| Bollinger Width Ratio | 30% | BB width vs average (squeeze/expansion) |
| Choppiness Index | 30% | 0-100, rendah = trending, tinggi = ranging |
| ATR% | 20% | ATR sebagai % harga (moderate = ideal) |
| BB Position | 20% | Posisi harga dalam band |

**Ideal:** Volatilitas moderat (tidak squeeze, tidak extreme).

### 2.4 Volume Score (20%)

Mengkonfirmasi pergerakan harga dengan volume.

| Sub-Komponen | Bobot | Metode |
|-------------|-------|--------|
| Volume vs MA | 30% | Volume relatif terhadap rata-rata 20 hari |
| OBV Agreement | 30% | OBV searah dengan harga? |
| Net Volume | 20% | Buying vs selling pressure |
| Volume Spike | 20% | Volume spike berkualitas |

**Prinsip:** Harga tanpa volume = sinyal lemah.

### 2.5 Smart Money Flow (Optional)

Mendeteksi aktivitas institusional via volume anomaly.

| Sub-Komponen | Bobot | Metode |
|-------------|-------|--------|
| Volume Z-Score | 30% | Volume spike > 2.5 SD dari rata-rata |
| Body Volume | 20% | Volume terakumulasi di body candle |
| OBV Alignment | 20% | OBV searah dengan instituional flow |
| Net Volume | 20% | Buying pressure dominan |

## 3. Overall Score

```
Overall = (Trend × TrendWeight + Momentum × MomentumWeight +
           Volatility × VolatilityWeight + Volume × VolumeWeight) / TotalWeight
```

Jika Smart Money ON:
```
Overall = (Trend × TrendWeight + Momentum × MomentumWeight +
           Volatility × VolatilityWeight + Volume × VolumeWeight +
           SmartMoney × 20) / (TotalWeight + 20)
```

## 4. Sinyal

| Skor | Sinyal | Aksi |
|------|--------|------|
| ≥ 80 | Strong Bullish | Akumulasi |
| 70–80 | Bullish | Entry support zone |
| 55–70 | Mild Bullish | Wait for confirmation |
| 45–55 | Netral | Sideway, hold |
| 30–45 | Mild Bearish | Wait for confirmation |
| 20–30 | Bearish | Exit / hedging |
| ≤ 20 | Strong Bearish | Avoid |

## 5. Keterbatasan

- Data teknisal bersifat historis, tidak prediktif mutlak.
- Choppiness Index bisa false signal di saham volume tipis IDX.
- Smart Money detection adalah proxy, bukan data institusional aktual.
- Sektor-aware scaling belum diimplementasikan (v2).
