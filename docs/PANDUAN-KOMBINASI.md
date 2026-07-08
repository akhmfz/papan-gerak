# Panduan Kombinasi — Papan Instrumen + Papan Gerak

*Fundamental sebagai filter, teknikal sebagai timing.*

---

Dengan dua indikator ini, Anda punya **sistem analisis lengkap** untuk saham IDX:

| Indikator | Peran | Menjawab |
|-----------|-------|----------|
| **Papan Instrumen** | Filter fundamental | *Saham apa yang layak diperdagangkan?* |
| **Papan Gerak** | Entry timing | *Kapan masuk/keluar?* |

Keduanya dirancang sebagai **pasangan natural** — bukan dua alat terpisah.

---

## Alur 2 Fase

```
FASE 1 — Papan Instrumen (mingguan/bulanan)
  ↓ Skor fundamental ≥ 55
FASE 2 — Papan Gerak (harian)
  ↓ Entry trigger + konfirmasi
EKSEKUSI
```

### Fase 1: Fundamental Screening (mingguan)

Buka Papan Instrumen di chart daily. Evaluasi:

| Skor Fundamental | Tindakan |
|-----------------|----------|
| **≥70 (BAIK/SANGAT BAIK)** | Layak trading — lanjut ke Fase 2 |
| **55–70 (CUKUP)** | Layak bersyarat — perlu konfirmasi teknikal ekstra |
| **<55 (LEMAH/RISIKO TINGGI)** | Jangan trading — cari saham lain |

**Cek juga modul Risiko Likuiditas** di Papan Instrumen:
- Skor Risiko **≥70** → aman dari risiko gorengan
- Skor Risiko **<50** → hindari, terlepas dari skor fundamental

> ⚠️ Screening fundamental cukup dilakukan **1× per minggu** (data fundamental tidak berubah harian). Simpan watchlist saham dengan skor ≥55.

### Fase 2: Teknikal Timing (harian)

Setelah saham lolos filter fundamental, buka Papan Gerak di chart yang sama. Tunggu:

1. **Narrative** tidak ⚠️ (atau ⚠️ sudah terantisipasi)
2. **Zona sinyal** Bullish (>70) untuk long, Bearish (<40) untuk short
3. **Volatilitas** tidak Ranging (Choppiness <62)
4. **Confluence** ≥75% di dimensi Tren dan Volume
5. **Entry trigger** muncul (Level Referensi terisi)
6. **Histori sinyal** win rate ≥40%

Hanya entry jika **semua** kondisi di atas terpenuhi.

---

## Matriks Keputusan Gabungan

| Fundamental ↓ \ Teknikal → | Bullish (>70) | Netral (40-70) | Bearish (<40) |
|---------------------------|---------------|----------------|---------------|
| **≥70 (BAIK)** | ✅ ENTRY | ⏳ Tunggu entry trigger | 🔴 Jual/Short |
| **55-70 (CUKUP)** | ⏳ Entry hati-hati (kurangi lot) | ⏳ Tahan | 🔴 Jual |
| **<55 (LEMAH)** | ⚠️ Skeptis — verifikasi ulang fundamental | ❌ No trade | ❌ No trade — cari saham lain |

### Penjelasan per Kuadran

| Kuadran | Interpretasi | Aksi |
|---------|-------------|------|
| **✅ Kiri Atas** (Fundamental BAIK + Teknikal Bullish) | Ideal — fundamental sehat + momentum harga positif | Entry dengan confidence tinggi, lot sesuai saran sizing |
| **⏳ Kiri Tengah** (Fundamental CUKUP + Teknikal Bullish) | Fundamental sedang tapi teknikal bagus — bisa dimanfaatkan untuk swing pendek | Entry dengan lot lebih kecil (50% dari saran sizing) |
| **🔴 Kiri Bawah** (Fundamental LEMAH + Teknikal Bullish) | Teknikal naik tanpa fundamental — rawan reversal | Jangan entry. Kalau sudah terlanjur beli, jual saat teknikal memburuk |
| **⏳ Tengah Atas** (Fundamental BAIK + Teknikal Netral) | Saham bagus tapi belum waktunya — sabar | Pantau terus, entry tunggu teknikal Bullish |
| **❌ Tengah** | Tidak ada edge jelas di kedua sisi | No trade |
| **🔴 Kanan Atas** (Fundamental BAIK + Teknikal Bearish) | Fundamental sehat tapi harga turun — bisa jadi koreksi sehat atau sinyal awal masalah | Tutup posisi long. Bisa short jika Teknikal Bearish terkonfirmasi |
| **❌ Kanan Bawah** (Fundamental LEMAH + Teknikal Bearish) | Sampah ganda — fundamental jelek + harga turun | Jangan disentuh |

---

## Contoh Skenario

### Skenario A: Entry Long Ideal

**Papan Instrumen:**
```
Skor Fundamental: 82 (BAIK)
Value: 78 | Quality: 85 | Growth: 80 | Health: 88 | Risiko: 76
```

**Papan Gerak:**
```
✅ Semua dimensi align — bias bullish
PAPAN GERAK                     84
Signal                    BULLISH
↑ Trend 85 (4/4↑)
↑ Momentum 80 (4/5↑)
≈ Volatilitas 75 (3/4✓)
↑ Volume 82 (4/4✓)
Level Ref: SL -4.2% | Target +8.4%
Backtest: 70% win (14/20)
Lot: 3 lots (Rp150jt, 1% risk)
```

**Keputusan:** **ENTRY** — Fundamental BAIK + Teknikal Bullish. Semua konfirmasi checklist terpenuhi. Gunakan SL -4.2% sesuai Level Referensi.

---

### Skenario B: Fundamental Bagus, Teknikal Belum

**Papan Instrumen:**
```
Skor Fundamental: 78 (BAIK)
Value: 72 | Quality: 80 | Growth: 65 | Health: 85
```

**Papan Gerak:**
```
⏳ Pasar ranging — tunggu breakout
PAPAN GERAK                     52
Signal                     NEUTRAL
↑ Trend 55 (2/4↑)
↓ Momentum 45 (2/5↑)
≈ Volatilitas 60 (3/4✓)
→ Volume 58 (2/4✓)
```

**Keputusan:** **TUNGGU** — Fundamental bagus tapi teknikal Netral + Ranging. Masukkan ke watchlist, pantau setiap hari. Entry tunggu Papan Gerak menunjukkan Bullish.

---

### Skenario C: Teknikal Naik, Fundamental Jeblok

**Papan Instrumen:**
```
Skor Fundamental: 38 (RISIKO TINGGI)
Risiko Likuiditas: 42 (likuiditas rendah)
```

**Papan Gerak:**
```
⚠️ Momentum kuat tapi RSI overbought — waspada koreksi
PAPAN GERAK                     78
Signal                     BULLISH
↑ Trend 82 (4/4↑)
↑ Momentum 75 (3/5↑)
```

**Keputusan:** **NO TRADE** — Fundamental LEMAH + Risiko likuiditas rendah. Kenaikan teknikal berisiko tinggi reversal. Apalagi Narrative sudah warning overbought.

---

### Skenario D: Exit Signal

**Papan Instrumen (sudah terlanjur beli dari skenario A):**
```
Skor Fundamental: 82 (BAIK) — masih sama
```

**Papan Gerak (sekarang):**
```
💡 Kondisi campuran — cek detail per dimensi
PAPAN GERAK                     55
Signal                     BEARISH
📊 Sinyal                    -6.8%
📊 Backtest                 35% win (7/20)
↓ Trend 42 (1/4↑)
↓ Momentum 38 (1/5↑)
≈ Volatilitas 65 (2/4✓)
→ Volume 55 (2/4✓)
```

**Keputusan:** **EXIT** — Teknikal berubah Bearish, forward return negatif -6.8%, win rate turun ke 35%. Fundamental memang masih BAIK, tapi timing untuk keluar sudah tiba. Jual dulu, beli lagi kalau Papan Gerak balik Bullish.

---

## Ringkasan 1 Menit

1. Buka **Papan Instrumen** → skor fundamental ≥55? Kalau tidak, ganti saham.
2. Buka **Papan Gerak** di chart yang sama → skor teknikal >70?
3. Cek Narrative — ada ⚠️? Kalau ada, hati-hati atau tunggu.
4. Cek Ranging — Choppiness >62? Kalau iya, tahan entry.
5. Entry hanya saat **Fundamental BAIK + Teknikal Bullish + entry trigger muncul**.
6. Exit saat **Teknikal berbalik Bearish**, meski Fundamental masih BAIK.

---

## Catatan Penting

- **Fundamental tidak berubah harian** — cukup screening 1×/minggu. Teknikal bisa berubah setiap bar.
- **Prioritas akhiran**: jika Fundamental dan Teknikal bertentangan, fundamental menang untuk keputusan **screening**, teknikal menang untuk keputusan **timing**.
- **Saham gorengan** (Risiko Likuiditas <50) tidak layak trading meski Fundamental atau Teknikal terlihat bagus — data bisa dimanipulasi.
- **Kedua indikator bukan rekomendasi beli/jual** — alat bantu analisis. Keputusan akhir tetap di tangan pengguna.

---

## Link Cepat

| Sumber | Link |
|--------|------|
| Papan Instrumen (TV) | https://www.tradingview.com/script/s4Bjqc7S-Saham-Papan-Instrumen-By-Akhmfz/ |
| Papan Instrumen (GitHub) | https://github.com/akhmfz/papan-instrumen |
| Papan Gerak (TV) | https://www.tradingview.com/script/zmENYRvs-Saham-Papan-Gerak-By-Akhmfz/ |
| Papan Gerak (GitHub) | https://github.com/akhmfz/papan-gerak |
| Panduan Papan Gerak | `docs/PANDUAN-TRADING.md` |
