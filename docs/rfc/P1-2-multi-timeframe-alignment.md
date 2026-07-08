# RFC: P1-2 — Multi-Timeframe Alignment Score

**Status:** Draft  
**Author:** OpenCode  
**Date:** 2026-07-08  
**Tags:** [rfc, papan-gerak, scoring, mtf]

---

## 1. Problem Statement

Papan Gerak saat ini menghitung semua score (trend, momentum, volatility, volume)
hanya pada **timeframe chart yang sedang aktif**. Sebuah sinyal bullish di Daily
chart belum tentu valid jika Weekly chart menunjukkan bearish.

Trader IDX sering menggunakan multiple timeframe untuk entry:

- **Daily** untuk entry timing
- **Weekly** untuk trend utama
- **Monthly** untuk konteks makro

Tanpa MTF Alignment, sinyal di timeframe kecil bisa menyesatkan saat timeframe
besar bertentangan.

---

## 2. Proposed Solution

Tambahkan dimensi scoring baru: **MTF Alignment Score** (0–100).

Cara kerja:

1. Request data dari timeframe yang lebih tinggi (higher timeframe / HTF)
   via `request.security()` atau pendekatan multi-timeframe lain
2. Hitung score untuk setiap timeframe secara independen
3. Gabungkan dengan sistem bobot: timeframe besar punya influence lebih besar
4. Hasil akhir: MTF score + alignment direction flag

---

## 3. Timeframe Selection

### 3a. Timeframes

| Timeframe | Label | Weight | Fungsi |
|-----------|-------|--------|--------|
| Daily | D | 50% | Entry timing, sinyal utama |
| Weekly | W | 35% | Trend konfirmasi |
| Monthly | M | 15% | Konteks makro |

Alasan:

- Daily adalah default chart mayoritas trader IDX → bobot tertinggi
- Weekly menangkap trend 1-6 bulan → bobot sedang
- Monthly sebagai konteks (support/resistance jangka panjang) → bobot rendah

### 3b. Kenapa bukan 4H?

4H termasuk timeframe intraday. Papan Gerak dirancang untuk **swing trading**
(biasanya Daily+), bukan scalping. Jika nanti diperlukan, 4H bisa ditambahkan
sebagai opsi lanjutan.

---

## 4. Scoring Model

### 4a. Komponen per timeframe

Setiap timeframe menghasilkan 4 sub-score (menggunakan engine yang sudah ada):

| Sub-score | Sumber | Bobot dalam timeframe |
|-----------|--------|-----------------------|
| Trend | `f_trendScore()` via `request.security()` | 35% |
| Momentum | `f_momentumScore()` via `request.security()` | 30% |
| Volatility | `f_volatilityScore()` via `request.security()` | 20% |
| Volume | `f_volumeScore()` via `request.security()` | 15% |

### 4b. Weighted combination

```
mtfRaw = trendScore(D) × 0.35 + momentumScore(D) × 0.30 +
         volatilityScore(D) × 0.20 + volumeScore(D) × 0.15
         ──────────────────── × 0.50  (Daily weight)

         trendScore(W) × 0.35 + momentumScore(W) × 0.30 +
         volatilityScore(W) × 0.20 + volumeScore(W) × 0.15
         ──────────────────── × 0.35  (Weekly weight)

         trendScore(M) × 0.35 + momentumScore(M) × 0.30 +
         volatilityScore(M) × 0.20 + volumeScore(M) × 0.15
         ──────────────────── × 0.15  (Monthly weight)
```

### 4c. Conflict penalty

Ketika Daily dan Weekly bertentangan, beri **penalti**:

| Daily | Weekly | Monthly | Penalty | Contoh |
|-------|--------|---------|---------|--------|
| Bullish | Bullish | Bullish | 0% | Strong buy |
| Bullish | Bullish | Bearish | -5% | Buy with caution |
| Bullish | Bearish | Bullish | -15% | Potential reversal |
| Bullish | Bearish | Bearish | -25% | Avoid — trend conflict |
| Bearish | Bullish | Bullish | -15% | Potential bounce |
| Bearish | Bullish | Bearish | -25% | Avoid — trend conflict |
| Bearish | Bearish | Bullish | -5% | Sell with caution |
| Bearish | Bearish | Bearish | 0% | Strong sell |

Threshold untuk "bullish" per timeframe: `mtfSubScore >= 60`

```
conflictScore = mtfRaw × (1 - penalty)

finalScore = conflictScore
```

---

## 5. Output

### 5a. Score (0–100)

Nilai final setelah penalty. Interpretasi:

| Range | Label | Makna |
|-------|-------|-------|
| 80–100 | Strong Alignment | Semua timeframe setuju |
| 60–79 | Moderate Alignment | Sebagian besar setuju |
| 40–59 | Neutral / Mixed | Tidak ada sinyal jelas |
| 20–39 | Weak Alignment | Sebagian bertentangan |
| 0–19 | Conflict | Timeframe saling bertentangan |

### 5b. Direction Flag

`mtfDirection`: `1` (bullish) / `-1` (bearish) / `0` (mixed)

Ditentukan dari weighted majority:

```
if weightedBullishScore > weightedBearishScore + 10 → 1
if weightedBearishScore > weightedBullishScore + 10 → -1
else → 0
```

### 5c. Display

Di dashboard Papan Gerak, tambahkan 1 baris di tabel:

```
MTF Alignment  | 72 (Bullish) | D:75 W:68 M:55
```

---

## 6. Implementation

### 6a. Input parameters

| Parameter | Type | Default | Group |
|-----------|------|---------|-------|
| `useMTF` | bool | true | Multi-Timeframe |
| `mtfWeeklyWeight` | float | 0.35 | Multi-Timeframe |
| `mtfMonthlyWeight` | float | 0.15 | Multi-Timeframe |
| `mtfConflictPenalty` | float | 1.0 (1x = full penalty) | Multi-Timeframe |
| `mtfBullThreshold` | float | 60 | Multi-Timeframe |

### 6b. File changes

| File | Change |
|------|--------|
| `01-base.pine` | +5 input parameters (MTF group) |
| `02-data.pine` | +`request.security()` calls for Weekly & Monthly data (existing indicator values on HTF) |
| `03-scoring.pine` | +`f_mtfAlignmentScore()` function |
| `04-ui.pine` | +1 row in table for MTF score |

### 6c. request.security approach

```
f_mtfScore(string tf) =>
    request.security(syminfo.tickerid, tf,
        trendScore = f_trendScore(),
        momentumScore = f_momentumScore(),
        ...
    )
```

**Catatan:** Pendekatan `request.security()` dengan multi-return memerlukan
Pine Script v6 tuple syntax. Repainting harus dicek: gunakan
`barmerge.lookahead_off` dan `repaint=false`.

### 6d. Performance impact

- +2 `request.security()` calls per bar (Weekly + Monthly)
- Total API budget: current ~X → X+2
- Kedua calls menggunakan `close` yang sudah ada — tidak ada data eksternal baru

---

## 7. Open Questions

### Q1: Conflict penalty formula

Proposal di atas menggunakan tabel diskrit 8 kondisi. Alternatif:

**Continuous penalty:** `penalty = abs(scoreD - scoreW) / 100 × maxPenalty`

Continuous lebih halus tapi kurang intuitif. Diskrit lebih mudah dipahami.
**Rekomendasi:** mulai dengan diskrit, evaluasi setelah 1 sprint.

### Q2: Sektor-aware?

Saat ini belum. Hook untuk integrasi P1-1 (Sector-aware Volatility) bisa
ditambahkan nanti sebagai weight modifier:

```
mtfMonthlyWeight = isSiklikalLike ? 0.25 : 0.15
```

### Q3: Pengaruh ke entry trigger

Apakah MTF score digunakan sebagai:

1. **Filter** — hanya entry jika `mtfScore >= 40` (minimal neutral)
2. **Modifier** — entry quality dikalikan dengan `mtfScore / 100`
3. **Keduanya** — filter dulu, lalu modifier

**Rekomendasi:** Mulai sebagai display-only (opsi 0). Beri toggle untuk
aktifkan sebagai filter di Sprint berikutnya.

### Q4: Timeframe aliasing

Bagaimana jika chart sedang di Weekly? Maka Daily adalah lower timeframe.
Apakah system tetap jalan? Ya — `request.security()` bekerja dari timeframe
manapun ke timeframe lain. Tapi pastikan dokumentasi menyebutkan bahwa MTF
dirancang untuk Daily chart.

---

## 8. Acceptance Criteria

1. [ ] MTF score 0–100 dihasilkan dari kombinasi 3 timeframe
2. [ ] Conflict penalty bekerja: Daily bullish + Weekly bearish → score turun
3. [ ] Direction flag benar: 1 / -1 / 0
4. [ ] Performance: +2 `request.security()` — budget terpenuhi
5. [ ] Dokumentasi: cara membaca MTF score
6. [ ] Regression test: pipeline existing tidak berubah
7. [ ] Tooltip menjelaskan tiap komponen (D/W/M breakdown)

---

## 9. Timeline Estimate

| Phase | Duration | Output |
|-------|----------|--------|
| RFC review | 1 session | Approval / revision |
| Implementation | 2 sessions | Code + unit test |
| Integration test | 1 session | PineTS + manual check |
| **Total** | **4 sessions** | |

---

*RFC ini akan diperbarui setelah diskusi dan persetujuan.*
