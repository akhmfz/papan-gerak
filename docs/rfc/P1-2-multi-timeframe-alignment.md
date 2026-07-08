# RFC: P1-2 — Multi-Timeframe Alignment Score

**Status:** Approved — Implementation Spec  
**Author:** OpenCode  
**Date:** 2026-07-08  
**Tags:** [rfc, papan-gerak, scoring, mtf]

---

## 1. Problem Statement

Papan Gerak saat ini menghitung semua score (trend, momentum, volatility, volume)
hanya pada **timeframe chart yang sedang aktif**. Sebuah sinyal bullish di Daily
chart belum tentu valid jika Weekly chart menunjukkan bearish.

Trader IDX sering menggunakan multiple timeframe untuk entry:

- **Primary TF** — entry timing
- **Secondary TF** — trend konfirmasi
- **Tertiary TF** — konteks makro

Tanpa MTF Alignment, sinyal di timeframe kecil bisa menyesatkan saat timeframe
besar bertentangan.

---

## 2. Proposed Solution

Tambahkan dimensi scoring baru: **MTF Alignment Score** (0–100).

Cara kerja:

1. Request data dari higher timeframe via `request.security()`
2. Hitung 4 sub-score untuk setiap timeframe secara independen
3. **Pisahkan directional (Trend+Momentum) dari non-directional (Volatility+Volume)**
   — conflict detection hanya dari directional components
4. Gabungkan dengan sistem bobot
5. Hasil akhir: MTF score + alignment direction flag

---

## 3. Timeframe Selection

### 3a. Timeframes

| Role | Label | Weight | Fungsi |
|------|-------|--------|--------|
| Primary | TF1 | 50% | Entry timing, sinyal utama |
| Secondary | TF2 | 35% | Trend konfirmasi |
| Tertiary | TF3 | 15% | Konteks makro |

Default mapping: TF1 = Daily, TF2 = Weekly, TF3 = Monthly.

Alasan:

- Daily adalah default chart mayoritas trader IDX → bobot tertinggi
- Weekly menangkap trend 1-6 bulan → bobot sedang
- Monthly sebagai konteks (support/resistance jangka panjang) → bobot rendah

### 3b. Parameterisasi label

Nama `Primary`/`Secondary`/`Tertiary` dipilih alih-alih `Daily`/`Weekly`/`Monthly`
karena `request.security()` bekerja dari timeframe manapun. Jika user membuka
Weekly chart, `PrimaryTF=Weekly` tetap masuk akal secara semantik —
`Daily=50%` di Weekly chart tidak.

### 3c. Kenapa bukan 4H?

4H termasuk timeframe intraday. Papan Gerak dirancang untuk **swing trading**
(typically Daily+), bukan scalping. Jika nanti diperlukan, 4H bisa ditambahkan
sebagai parameter opsional.

---

## 4. Scoring Model

### 4a. Dua komponen terpisah

Setiap timeframe menghasilkan 2 metrik terpisah:

#### Directional Components (untuk alignment & conflict detection)

| Sub-score | Sumber | Bobot dalam TF |
|-----------|--------|----------------|
| Trend | `f_trendScore()` via `request.security()` | 55% |
| Momentum | `f_momentumScore()` via `request.security()` | 45% |

#### Context Components (untuk konfirmasi, non-directional)

| Sub-score | Sumber | Bobot dalam TF |
|-----------|--------|----------------|
| Volatility | `f_volatilityScore()` via `request.security()` | 55% |
| Volume | `f_volumeScore()` via `request.security()` | 45% |

### 4b. Weighted combination

```
tfDirectionalScore = trendScore × 0.55 + momentumScore × 0.45
tfContextScore     = volatilityScore × 0.55 + volumeScore × 0.45

mtfDirectionalRaw = tf1Directional × 0.50 +
                    tf2Directional × 0.35 +
                    tf3Directional × 0.15

mtfContextRaw     = tf1Context × 0.50 +
                    tf2Context × 0.35 +
                    tf3Context × 0.15

mtfRaw = mtfDirectionalRaw × 0.70 + mtfContextRaw × 0.30
```

`α = 0.70` (default, user-configurable) — bobot directional vs context.

### 4c. Conflict detection (hanya dari directional)

Threshold untuk "bullish" per timeframe menggunakan **fuzzy threshold**:

```
bullishConfidence = math.max(math.min((tfDirectionalScore - 50) / 20, 1), 0)
// 0.0 di 50, 1.0 di 70
```

### 4d. Continuous penalty

Penalti proporsional terhadap divergence, bukan diskrit:

```
divergence = math.abs(tf1Directional - tf2Directional)
penalty    = (divergence / 100) × maxPenalty

maxPenalty = 0.25 (user-configurable, default 25%)
```

Rationale:

- Continuous lebih halus — tidak ada lonjakan mendadak di threshold
- Divergence 0 → penalty 0%; divergence 100 → penalty 25%
- Bertentangan dengan RFC sebelumnya yang menggunakan tabel diskrit 8 kondisi.
  Continuous dipilih karena menghindari edge case di batas threshold 60.

**Opsi eksplisit:** Jika user ingin tabel diskrit (lebih intuitif untuk debugging),
tersedia sebagai mode alternatif via `mtfPenaltyMode`:
- `'continuous'` — default
- `'discrete'` — mode eksplisit 8 kondisi dari RFC awal

### 4e. Final score

```
conflictScore   = mtfDirectionalRaw × (1 - penalty)
finalScore      = conflictScore × 0.70 + mtfContextRaw × 0.30
```

---

## 5. Historical Offset Behavior

`f_trendScore()` menggunakan historical offset `[5]` untuk perhitungan slope:

```
slopeFast = emaFast - emaFast[5]
```

Pada HTF, offset `[5]` mereferensi bar yang secara temporal berbeda:

| Timeframe | 5 bar = | Implikasi |
|-----------|---------|-----------|
| Daily | 5 hari | Valid untuk slope jangka pendek |
| Weekly | 5 minggu (~35 hari) | Slope terlalu lambat bereaksi |
| Monthly | 5 bulan (~150 hari) | Praktis tidak berguna |

**Fix:** Parameterisasi historical offset berdasarkan timeframe, atau gunakan
pendekatan berbasis rasio (`emaFast / emaFast[5] - 1`) yang tidak bergantung
pada jumlah bar absolut. RAFD memilih rasio `[1]` karena slope `[5]` pada Monthly
setara 150 hari — tidak relevan untuk konteks MTF.

### Implemetasi fix

```
// Di 01-base.pine — ganti slope linear dengan rate of change
slopeFast = emaFast / emaFast[1] - 1
slopeSlow = emaSlow / emaSlow[1] - 1
```

Perubahan ini berlaku global (tidak hanya di MTF) karena slope rate-based lebih
konsisten di semua timeframe.

---

## 6. Output

### 6a. Score (0–100)

Nilai final setelah penalty. Interpretasi:

| Range | Label | Makna |
|-------|-------|-------|
| 80–100 | Strong Alignment | Semua timeframe setuju |
| 60–79 | Moderate Alignment | Sebagian besar setuju |
| 40–59 | Neutral / Mixed | Tidak ada sinyal jelas |
| 20–39 | Weak Alignment | Sebagian bertentangan |
| 0–19 | Conflict | Timeframe saling bertentangan |

### 6b. Direction Flag

`mtfDirection`: `1` (bullish) / `-1` (bearish) / `0` (mixed)

Ditentukan dari weighted majority directional components:

```
bullishScore = sum(tfWeight × bullishConfidence for each TF)
bearishScore = sum(tfWeight × (1 - bullishConfidence) for each TF)

if bullishScore > bearishScore + 10 → 1
if bearishScore > bullishScore + 10 → -1
else → 0
```

Sideways market (Trend ~50, Momentum ~50) → direction flag = `0` (mixed).
Ini bukan error — ini berarti "no clear signal."

### 6c. Display

Di dashboard Papan Gerak, tambahkan 1 baris di tabel:

```
MTF Alignment  | 72 (Bullish)  | D:75/65  W:68/55  M:55/50
```

Format detail baris: `TF1:dirScore/ctxScore  TF2:...  TF3:...`

---

## 7. Implementation

### 7a. Input parameters

| Parameter | Type | Default | Group |
|-----------|------|---------|-------|
| `useMTF` | bool | true | Multi-Timeframe |
| `mtfPrimaryWeight` | float | 0.50 | Multi-Timeframe |
| `mtfSecondaryWeight` | float | 0.35 | Multi-Timeframe |
| `mtfTertiaryWeight` | float | 0.15 | Multi-Timeframe |
| `mtfAlpha` | float | 0.70 | Multi-Timeframe |
| `mtfMaxPenalty` | float | 0.25 | Multi-Timeframe |
| `mtfPenaltyMode` | enum | continuous | Multi-Timeframe |
| `mtfDirectionHysteresis` | float | 10.0 | Multi-Timeframe |

Semua weight adalah parameter input — user bisa override. Dokumentasi menyebut
nilai default adalah heuristic, belum divalidasi secara statistik.

### 7b. File changes

| File | Change |
|------|--------|
| `01-base.pine` | +8 input parameters (MTF group); slope fix `[5]` → ratio `[1]` |
| `02-data.pine` | +`request.security()` calls for Secondary & Tertiary timeframe |
| `03-scoring.pine` | +`f_mtfAlignmentScore()` function |
| `04-ui.pine` | +1 row in table for MTF score |

### 7c. request.security approach

```
f_mtfScore(string tf) =>
    request.security(syminfo.tickerid, tf,
        trendScore = f_trendScore(),
        momentumScore = f_momentumScore(),
        volatilityScore = f_volatilityScore(),
        volumeScore = f_volumeScore()
    )
```

**Catatan Pine Script v6:** `request.security()` dengan multi-return memerlukan
sintaks tuple. Pastikan:

- `barmerge.lookahead_off` — cegah repainting
- Fungsi yang dipanggil (`f_trendScore()` dll) tidak memiliki side effect pada
  mutable state global — aman karena Pine Script v6 mengevaluasi ulang setiap bar
- **Verifikasi eksperimental:** Sebelum implementasi penuh, buat test script kecil
  yang memverifikasi `request.security()` dengan multi-mutasi variabel lokal di
  dalam fungsi yang dipanggil

### 7d. Performance impact

- +2 `request.security()` calls per bar (Secondary + Tertiary)
- Total API budget: current ~X → X+2
- Kedua calls menggunakan data yang sudah ada — tidak ada sumber data eksternal baru

---

## 8. Open Questions (terselesaikan)

### Q1: Conflict penalty — continuous vs discrete

**Keputusan:** Continuous sebagai default. Discrete sebagai mode alternatif.

Alasan: Continuous menghindari sharp discontinuity di threshold. Divergence kecil
→ penalty kecil, bukan lompatan tiba-tiba.

### Q2: Sektor-aware?

Belum. Hook untuk integrasi P1-1 (Sector-aware Volatility) dapat ditambahkan
nanti sebagai weight modifier.

### Q3: Pengaruh ke entry trigger

**Keputusan:** Display-only dulu (opsi 0). Toggle untuk filter di Sprint
berikutnya. Dokumentasi menyebut mode filter sebagai future extension.

### Q4: Timeframe aliasing

Diselesaikan dengan parameterisasi label Primary/Secondary/Tertiary — bukan
Daily/Weekly/Monthly. Dokumentasi menyebut optimal saat `PrimaryTF = chart
timeframe`.

### Q5: Volatility & Volume non-directional

Diselesaikan dengan pemisahan scoring model (section 4a). Directional components
hanya Trend + Momentum.

---

## 9. Acceptance Criteria

1. [ ] MTF score 0–100 dihasilkan dari kombinasi 3 timeframe
2. [ ] Conflict penalty bekerja: TF1 bullish + TF2 bearish → score turun proporsional
3. [ ] Direction flag benar: 1 / -1 / 0 (bukan False Positive dari Volatility/Volume)
4. [ ] Slope direfactor: tidak lagi bergantung pada offset `[5]` — menggunakan ratio
5. [ ] Fuzzy threshold: transisi mulus, tanpa lonjakan di threshold 60
6. [ ] Performance: +2 `request.security()` — budget terpenuhi
7. [ ] Regression test: pipeline existing tidak berubah
8. [ ] Tooltip menjelaskan tiap komponen (breakdown D/W/M)

---

## 10. Future Extension

RFC ini membahas implementasi baseline MTF Alignment Score. Berikut area yang
secara sengaja **tidak** dicakup sekarang tetapi sudah diantisipasi:

### 10a. Adaptive weights

Bobot default (50/35/15, α=0.70) dipilih secara heuristik. Versi mendatang
dapat mengadopsi:

- **Sektor-specific weights:** sektor defensif vs siklikal punya karakteristik
  timeframe berbeda
- **Regime-aware weighting:** bobot bergeser berdasarkan market regime (trending
  vs ranging) — diukur dari ADX atau metrik serupa
- **Volatility-aware weighting:** saat volatilitas tinggi, bobot tertiary TF
  (Monthly) dinaikkan untuk stabilitas
- **AI-assisted calibration:** optimasi bobot berbasis historical backtest

### 10b. Intraday timeframe

4H dan 1H tidak termasuk di baseline. Untuk trader yang ingin konvergensi
intraday, parameter tambahan `mtfInclude4H` dan `mtfInclude1H` bisa ditambahkan
dengan bobot yang mengurangi Primary Weight.

### 10c. Entry filter mode

Saat ini MTF bersifat display-only. Mode filter (`hanya entry jika
mtfScore >= 40`) dan mode modifier (`entry quality × mtfScore / 100`) adalah
kandidat Sprint berikutnya.

### 10d. Multi-pair alignment

Untuk portfolio trading, MTF bisa diperluas ke multi-pair: alignment score
antara saham dan sektor/index-nya (misal: BBCA vs IDXFIN).

---

## 11. Timeline Estimate

| Phase | Duration | Output |
|-------|----------|--------|
| RFC review | 1 session | Approval / revision ✓ |
| Implementation | 2 sessions | Code + unit test |
| Integration test | 1 session | PineTS + manual check |
| **Total** | **4 sessions** | |

---

*RFC ini telah melalui technical review dan difreeze sebagai implementation spec.*
*Perubahan setelah freeze hanya melalui amendemen yang disetujui.*
