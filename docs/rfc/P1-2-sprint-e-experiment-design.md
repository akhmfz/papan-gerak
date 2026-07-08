# Sprint E — Experiment Design: MTF Signal Quality Validation

> **Status**: Approved (Sprint E1 ✅, Sprint E2 ✅ dengan revised direction)
> **Related**: [P1-2 Multi-Timeframe Alignment](./P1-2-multi-timeframe-alignment.md)
> **Sprint E1**: Measurement only — selesai. Pipeline reproducible, KPI deterministik.
> **Sprint E2**: Validasi data riil — evaluasi empiris, bukan target-driven tuning.

---

## 1. Research Question

Apakah MTF Alignment Score meningkatkan kualitas sinyal dibandingkan baseline (tanpa MTF)?

Ini bukan verifikasi ("apakah algoritma bekerja?") — itu sudah dijawab Sprint A–D.
Ini adalah **validasi**: apakah perubahan ini menghasilkan keputusan trading yang lebih baik?

---

## 2. Dataset

| Parameter | Value |
|-----------|-------|
| Universe | Saham IDX — seluruh konstituen IDX80 (≈80 saham likuid) |
| Periode | 12 bulan: 1 Juli 2025 – 30 Juni 2026 |
| Timeframe utama | Daily |
| Timeframe MTF | Daily (primary), Weekly (secondary), Monthly (tertiary) |
| Candles per saham | ≈252 trading days × 3 TF = ~756 bar per saham |

**Mengapa IDX80?**
- Cukup likuid untuk sinyal berarti
- Bervariasi sektor → tidak overfit ke satu sektor
- Jumlah terbatas (80) → komputasi feasible di PineTS

**Risiko**: survivorship bias (IDX80 berubah komposisi). Consequences: jika saham delisted karena bangkrut, bias ke atas. Mitigasi: catat saham yang keluar/masuk selama periode.

---

## 3. Baseline

Dua sistem diukur pada dataset dan baris yang **sama persis**:

### Sistem A (Baseline)
```
Score = Trend×30% + Momentum×30% + Volatility×20% + Volume×20%
↓
Signal: score >= 70 → BULLISH, score <= 40 → BEARISH
```

### Sistem B (MTF)
```
MTFScore = alignmentScore(Trend, Momentum, Volatility, Volume, MTF params)
↓
Signal: MTFScore >= 70 → BULLISH, MTFScore <= 40 → BEARISH
```

**Perbedaan hanya pada scoring layer.** Entry trigger, risk management, dan parameter lain dibuat identik. Ini memastikan perbedaan hasil hanya disebabkan oleh MTF.

---

## 4. KPI (Minimum 5 Metrik)

### KPI-1: Signal Stability

**Definisi**: Persentase saham yang berubah skor >10 poin dari hari ke hari (bar ke bar).

```
Stability = (jumlah saham dengan |score[t] - score[t-1]| > 10) / total saham × 100%
```

**Target E1 (measurement only)**: Laporkan nilai baseline vs MTF.
**Target E2**: Stabilitas MTF lebih baik dari baseline (perubahan >10 poin lebih jarang).

**Mengapa**: MTF seharusnya smoothing karena menggabungkan 3 timeframe. Lonjakan >10 poin per bar menunjukkan noise.

---

### KPI-2: Signal Persistence

**Definisi**: Rata-rata durasi (dalam hari) sinyal bertahan sebelum berubah arah.

```
Persistence = mean(duration of consecutive same-direction signals)
```

**Target E1**: Laporkan rata-rata, median, distribusi.
**Target E2**: Persistence MTF ≥ 1.5× baseline (sinyal bertahan lebih lama).

**Mengapa**: Salah satu tujuan utama MTF adalah mengurangi sinyal pendek yang berganti arah terlalu cepat.

---

### KPI-3: Whipsaw Reduction

**Definisi**: Frekuensi flip sinyal dalam waktu singkat (Bull→Bear→Bull dalam ≤3 bar).

```
WhipsawRate = (jumlah flip ≤3 bar) / (total sinyal) × 100%
```

**Target E1**: Laporkan whipsaw rate kedua sistem.
**Target E2**: Whipsaw rate MTF ≤ 85% dari baseline (turun minimal 15%).

**Mengapa**: Ini adalah klaim manfaat utama MTF — menghaluskan noise timeframe rendah.

---

### KPI-4: Forward Return (Top Decile)

**Definisi**: Rata-rata return N hari ke depan dari saham-saham peringkat teratas.

```
Ambil Top-20% saham berdasarkan score hari ini.
Hitung rata-rata return +5 hari dan +10 hari.
Bandingkan baseline vs MTF.
```

**Target E1**: Laporkan return top-decile untuk N={3,5,10}.
**Target E2**: Forward return MTF ≥ baseline (tidak perlu signifikan secara statistik di E1, tapi harus tidak lebih buruk).

**Mengapa**: Ujung dari semua scoring adalah: apakah peringkat yang lebih tinggi benar-benar menghasilkan return yang lebih baik? Jika MTF menurunkan forward return, ada masalah.

---

### KPI-5: Rank Correlation

**Definisi**: Hubungan peringkat saham antara baseline dan MTF.

```
Spearman Rank Correlation: ρ(rank_baseline, rank_mtf)
Kendall Tau: τ(rank_baseline, rank_mtf)
```

**Target E1**: Laporkan ρ dan τ untuk setiap hari + distribusi selama 12 bulan.
**Target E2** (revised — evidence-driven, bukan target-driven):
   - ρ > 0.95 → terlalu konservatif (MTF hampir tidak mengubah keputusan)
   - ρ < 0.70 → terlalu agresif (MTF merombak terlalu banyak)
   - Zona ideal: 0.80 ≤ ρ ≤ 0.95
   - Optimasi hanya jika ρ di luar rentang sehat, bukan untuk mengejar angka tertentu.

**Mengapa**: Ini menjawab "seberapa besar MTF mengubah keputusan?" Kalau tidak berubah sama sekali, MTF tidak berguna. Kalau berubah total, mungkin overfit. Tapi mengejar angka spesifik tanpa bukti empiris berbahaya — lebih baik evaluasi apakah parameter saat ini berada di rentang sehat.

---

### KPI-6: Coverage

**Definisi**: Berapa banyak saham yang benar-benar mengalami perubahan skor akibat MTF.

```
Coverage = (jumlah saham dengan |mtfScore - baselineScore| > 1) / total saham × 100%
```

**Target E1**: Laporkan coverage keseluruhan + distribusi per sektor.
**Target E2**: 50% ≤ Coverage ≤ 90%. Jika < 50% → MTF terlalu jarang mengubah skor. Jika > 90% → hampir semua saham berubah, kemungkinan terlalu agresif.

**Mengapa**: Coverage mengukur "jangkauan" efek MTF. Kalau hanya 5 dari 80 saham berubah, MTF tidak berguna. Kalau 79 dari 80 berubah drastis, mungkin MTF mendominasi skor asli.

---

### KPI-7: Score Drift Distribution

**Definisi**: Distribusi selisih skor (Δ = mtfScore - baselineScore) di seluruh saham dan hari.

```
Drift buckets: 0–2, 2–5, 5–10, 10–15, 15+
Histogram: berapa banyak observasi di tiap bucket
```

**Target E1**: Laporkan histogram + persentil (P5, P25, P50, P75, P95).
**Target E2**: 
   - P50 (median drift) ≤ 5 poin (perubahan tidak ekstrem)
   - P95 ≤ 15 poin (tidak ada outlier liar)
   - Distribusi tidak heavily skewed ke satu arah

**Mengapa**: Rata-rata bisa menipu. Distribusi menunjukkan apakah perubahan terkonsentrasi di satu arah (misal MTF selalu menurunkan skor) atau tersebar merata.

---

### KPI-8: Signal Churn Rate

**Definisi**: Rata-rata jumlah transisi status sinyal per tahun per saham.

```
Churn = (jumlah perubahan status) / (total hari) × 252
Status: Bullish (score ≥ 70), Neutral (40 < score < 70), Bearish (score ≤ 40)
1 transisi = perubahan dari satu status ke status lain
```

**Target E1**: Laporkan churn rate baseline vs MTF dalam satuan transisi/tahun.
**Target E2**: Churn rate MTF ≤ baseline (sinyal lebih stabil, lebih jarang berganti status). Idealnya 5-15 transisi/tahun (rata-rata 1-3 bulan per sinyal).

**Mengapa**: Lebih intuitif daripada Persistence. Trader langsung paham "model ini rata-rata berganti rekomendasi X kali setahun." Juga berguna untuk mengukur frekuensi keputusan trading yang dihasilkan model.

---

### KPI-9 (Opsional — Cadangan): Confusion Matrix

Jika resource memungkinkan, buat confusion matrix:

| | Baseline Bull | Baseline Bear |
|---|---|---|
| **MTF Bull** | Agree Bull | Disagree (MTF lebih bearish) |
| **MTF Bear** | Disagree (MTF lebih bullish) | Agree Bear |

Hitung **Agreement Rate** = (agree_bull + agree_bear) / total. Kalau agreement rate > 90%, MTF tidak berguna. Kalau < 60%, terlalu agresif.

---

## 4a. Parameter Freeze

**Seluruh parameter RFC dibekukan selama Sprint E1.**

```
Bobot TF: 50% / 35% / 15%   ← tetap
Alpha:    0.70               ← tetap
Penalty:  0.25               ← tetap
Hysteresis: 10.0             ← tetap
Threshold: 40/70             ← tetap
```

Perubahan parameter hanya boleh dilakukan pada Sprint E2, dan harus melalui **RFC amendment** terlebih dahulu.

**Alasan**: Eksperimen harus fair. Jika parameter diubah di tengah pengukuran, hasilnya tidak bisa dibandingkan. Dengan parameter freeze, setiap perubahan di E2 memiliki baseline yang jelas untuk diukur dampaknya.

---

## 5. Success Criteria

Sprint E dianggap berhasil jika:

### E1 (Measurement)
1. Seluruh 5 KPI berhasil dihitung untuk kedua sistem pada dataset lengkap.
2. Tidak ada error/timeout pada 80 saham × 252 hari.
3. Hasil direkam ke file CSV/JSON yang bisa direview.

### E2 (Validasi & Evaluasi Empiris)

E2 bukan "optimasi menuju target angka", melainkan **validasi apakah parameter saat ini berada di rentang performa sehat pada data riil**. Optimasi hanya dilakukan jika data empiris menunjukkan kebutuhan.

1. **Validasi data riil**: Jalankan seluruh 8 KPI pada data IDX80 riil (12 bulan, daily).
2. **Evaluasi rank correlation**: ρ di 0.80–0.95 ideal. Jika ρ > 0.95 → terlalu konservatif. Jika ρ < 0.70 → terlalu agresif.
3. **Evaluasi churn rate**: 5-15 transisi/tahun ideal. Jika > 20 → terlalu sering. Jika < 3 → terlalu jarang.
4. **Whipsaw Rate** MTF ≤ 85% dari baseline (turun min 15%) — jika data memungkinkan.
5. **Forward Return** top-decile MTF ≥ baseline.
6. Tidak ada regresi pada Production Validation Pipeline (`tests/production/` dan `tests/mtf/`).
7. **Rekomendasi tegas**: lanjut parameter saat ini, ubah via RFC amendment, atau hentikan integrasi MTF.

---

## 6. Metode

Data akan digenerate menggunakan PineTS: untuk setiap saham di IDX80, ekstrak score (baseline) dan MTF score (sistem B) untuk setiap bar, lalu hitung 5 KPI dari kedua series.

### Pseudocode

```
for each stock in IDX80:
    candles_D = request.security(symbol, "D", ...)
    candles_W = request.security(symbol, "W", ...)
    candles_M = request.security(symbol, "M", ...)

    for each bar i:
        baselineScore = computeBaseline(candles_D[i])
        mtfResult = computeMTF(candles_D[i], candles_W[i], candles_M[i])
        store(baselineScore, mtfResult)

compute KPI-1..KPI-5 from stored series
```

### Tools

- **PineTS** — transpile & execute Pine Script logic (validated di Sprint D)
- **production pipeline** — PineTS pipeline untuk multi-saham (reuse dari PI)

---

## 7. Timeline Estimasi

| Fase | Output | Estimasi |
|------|--------|----------|
| E1: Measurement ✅ | Pipeline reproducible, 8 KPI, JSON report | Selesai |
| E2: Data pipeline | Integrasi data riil IDX80 ke framework E1 | 1 sesi |
| E2: Validasi | 8 KPI pada data riil, bandingkan vs sintetis | 1 sesi |
| E2: Evaluasi | Rekomendasi tegas: lanjut/ubah/hentikan MTF | 1 sesi |
| (Jika perlu) RFC amendment | Justifikasi empiris perubahan parameter | 1 sesi |

---

## 7a. Catatan Khusus E2

**Perubahan arah E2** (berdasarkan review):
- E2 bukan "optimasi target-driven" melainkan **validasi evidence-driven**.
- Pertanyaan utama E2: "Apakah parameter saat ini sudah berada di rentang sehat pada data riil?"
- Optimasi hanya dilakukan jika ρ<0.70 atau ρ>0.95 (di luar rentang toleransi).
- Signal Churn Rate adalah metrik utama E2 (lebih intuitif untuk keputusan bisnis).
- Setiap perubahan parameter harus melalui RFC amendment dengan justifikasi empiris.

---

## 8. Risiko

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| PineTS timeout untuk 80 saham | KPI tidak selesai | Batch kecil (20 saham per run), progress reporting |
| Survivorship bias IDX80 | Forward return overestimate | Catat komposisi di awal & akhir periode |
| Parameter MTF tidak optimal di default | E1 hasil buruk | E1 adalah measurement — hasil buruk tetap valid sebagai baseline |
| Overfitting E2 | Parameter bagus di data train, jelek di data baru | Holdout sample: 9 bulan train, 3 bulan test |
