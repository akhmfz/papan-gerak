# Saham: Papan Gerak By. Akhmfz

> Dashboard Analisis Teknikal untuk Pasar Modal Indonesia — dibangun dengan Pine Script v6.

## Cara Pakai

1. Buka TradingView → Pine Editor
2. Copy isi `src/PapanGerak.pine`
3. Paste → klik **Add to Chart**
4. Atur setting sesuai selera (Compact Mode ON secara default)

## Mode Compact (Default)

Tampilan satu baris:
```
PAPAN GERAK  BULLISH  72
```

## Mode Lengkap

Tampilan tabel 5 baris:
```
PAPAN GERAK      BULLISH
Tren          ↑  78
Momentum      →  65
Volatilitas   ↓  45
Volume        ↑  82
```

## Fitur

| Fitur | Detail |
|-------|--------|
| **4 Dimensi** | Trend, Momentum, Volatilitas, Volume |
| **Overall Score** | 0-100 + sinyal (Bullish/Netral/Bearish) |
| **Smart Money** | Deteksi flow institusional (opsional) |
| **5 Color Themes** | Gelap, Terang, Bursa Hijau, Biru Nusantara, Emas Premium |
| **Compact Mode** | Tampilan 1 baris |
| **Custom Weights** | Bobot per dimensi bisa diatur |
| **5 Preset Parameter** | Default untuk tiap komponen |
| **7 Alert Conditions** | Signal change, extreme, spike, dll |
| **Bilingual** | Indonesia / English |

## Settings

### Trend
| Parameter | Default | Range |
|-----------|---------|-------|
| EMA Fast | 20 | 5–50 |
| EMA Mid | 50 | 20–100 |
| EMA Slow | 200 | 100–500 |
| SuperTrend Factor | 3.0 | 1.0–5.0 |
| SuperTrend ATR | 10 | 5–30 |
| ADX Length | 14 | 7–28 |

### Momentum
| Parameter | Default | Range |
|-----------|---------|-------|
| RSI Length | 14 | 7–28 |
| RSI Overbought | 70 | 60–85 |
| RSI Oversold | 30 | 15–40 |
| MACD Fast/Slow/Signal | 12/26/9 | — |
| Stochastic K/D | 14/3 | — |

### Volatilitas
| Parameter | Default | Range |
|-----------|---------|-------|
| ATR Length | 14 | 7–30 |
| Bollinger Length | 20 | 10–50 |
| Bollinger Multiplier | 2.0 | 1.5–3.0 |
| Choppiness Length | 14 | 7–30 |

### Volume
| Parameter | Default | Range |
|-----------|---------|-------|
| Volume MA | 20 | 10–50 |
| Spike Multiplier | 2.0 | 1.5–5.0 |

## Keterbatasan

- Data teknikal bersifat historis, tidak prediktif mutlak
- Choppiness Index bisa false signal di saham volume tipis
- Smart Money adalah proxy, bukan data institusional aktual
- Tidak ada rekomendasi beli/jual — ini alat bantu analisis

## Pengembangan

```bash
git clone git@github.com:akhmfz/papan-gerak.git
cd papan-gerak
npm install
npm run build
npm run test:all
```

Edit `src/modules/*.pine`, run `bash build.sh`, copy `src/PapanGerak.pine` → TradingView.
