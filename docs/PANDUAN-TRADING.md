# Panduan Trading — Papan Gerak

*Dari Tabel ke Keputusan Entry*

Dokumen ini menjelaskan cara membaca tabel Papan Gerak secara sistematis — bukan sekadar tahu angka-angkanya, tapi tahu **kapan dan bagaimana** menggunakannya untuk mengambil keputusan entry.

---

## Alur Baca Tabel (urut dari atas ke bawah)

### 1. Baca Narrative Dulu, Bukan Skor

Baris paling atas (💡/⚠️/✅) merangkum kondisi pasar saat ini. Narrative adalah prioritas utama — kalau ada ⚠️, ini peringatan yang harus didahulukan di atas skor angka mana pun.

| Narrative | Arti |
|-----------|------|
| ✅ Semua dimensi align | Sinyal kuat, semua indikator sepakat |
| ⚠️ Momentum kuat tapi RSI overbought | Harga bisa koreksi — waspada |
| ⚠️ Tren MTF bearish | Jangan lawan tren timeframe besar |
| ⏳ Pasar ranging | Tunggu breakout, jangan entry |

### 2. Cek Zona Sinyal sebagai Filter Arah

`>70 Bullish` / `40-70 Netral` / `<40 Bearish` menentukan arah yang layak dicari:

| Zona | Arah |
|------|------|
| Bullish (>70) | Cari sinyal long |
| Netral (40-70) | Tidak ada edge jelas — tunggu |
| Bearish (<40) | Cari sinyal short |

Jangan entry hanya karena skor 58 "kelihatan oke" — zona Netral memang didesain sebagai zona tanpa arah jelas.

### 3. Cek Volatilitas — Jangan Entry saat Ranging

Kalau Choppiness Index menunjukkan **Ranging** (nilai >62) atau narrative bilang "Pasar ranging — tunggu breakout", tahan entry apa pun. Di kondisi ranging, sinyal tren/momentum yang bagus sekalipun cenderung palsu (whipsaw).

### 4. Konfirmasi dengan Confluence per Dimensi

Confluence counter (mis. "3/4" atau "4/5") menunjukkan seberapa banyak sub-indikator dalam satu dimensi yang sepakat. Angka ini lebih informatif daripada skor tunggal:

| Confluence | Interpretasi |
|------------|-------------|
| **≥75%** (3/4, 4/5) | Sinyal kuat dalam dimensi ini — cukup untuk entry |
| **50-75%** (2/4, 3/5) | Beragam — pakai sebagai konfirmasi tambahan |
| **<50%** (1/4, 2/5) | Sub-indikator saling bertentangan — jangan andalkan skor saja |

Buka tooltip (hover) untuk melihat detail sub-indikator mana yang tidak sepakat.

### 5. Volume Harus Konfirmasi Tren

Kombinasi paling sehat untuk entry: skor Tren tinggi **DAN** Volume confluence juga tinggi.

| Volume Tooltip | Arti |
|----------------|------|
| `1.2x (healthy) ✓` | Volume normal — konfirmasi |
| `0.4x (low)` | Volume rendah — pergerakan rawan berbalik |
| `2.5x (spike!)` | Volume lonjakan — bisa akselerasi atau exhaustion |

Tren naik tapi Volume rendah = pergerakan tanpa partisipasi pasar yang meyakinkan.

### 6. Hormati MTF Filter

Kalau ada peringatan **MTF ▼** atau narrative conflict soal MTF (Multi-Timeframe), tren harian bertentangan dengan timeframe lebih besar (weekly/monthly). Probabilitas entry menurun drastis kalau melawan arah MTF.

### 7. Smart Money sebagai Konfirmasi Tambahan

Skor Smart Money (jika diaktifkan) adalah "bonus keyakinan". Jangan entry hanya karena Smart Money terdeteksi — pastikan Tren dan Volume juga mendukung.

### 8. Tunggu Entry Trigger Sungguhan

Skor tinggi terus-menerus BUKAN sinyal entry berulang. Entry terjadi saat **event** `entryTriggered` muncul sesuai mode:

| Mode | Cocok Untuk | Trigger |
|------|------------|---------|
| **Composite Score** | Swing/posisi | Zona berubah (Netral→Bullish atau sebaliknya) |
| **Pullback** | Menambah posisi di tren kuat | Harga retrace ke EMA20 + RSI rebound |
| **Breakout** | Momentum | Harga tembus level 20-bar + volume tinggi |

Begitu event muncul, baris **Level Referensi** akan menampilkan SL/Target. Jangan entry sebelum baris ini terisi — itu tanda sistem belum mendeteksi setup valid.

### 9. Cek Histori Sinyal

Lihat win rate di tabel. Kalau kumulatif rendah (<40%), perlakukan sinyal baru dengan lebih skeptis — riwayat aktual saham ini lebih informatif daripada asumsi umum.

### 10. Position Sizing = Batas Atas

Jumlah lot yang ditampilkan adalah batas **maksimal**, bukan target. Kurangi lot kalau confluence di poin 4-6 tidak semuanya solid.

---

## Ringkasan Alur Cepat

> **Narrative → Zona Sinyal → Cek Ranging? → Confluence per Dimensi → Volume Konfirmasi Tren? → MTF Searah? → Tunggu Entry Trigger → Catat SL/Target → Cek Histori Sinyal → Sizing sesuai Saran**

---

## Catatan Penting

- **Indikator ini bukan rekomendasi beli/jual.** Semua angka adalah alat bantu analisis — keputusan akhir tetap di tangan pengguna.
- **Default settings sudah dioptimalkan** untuk saham IDX. Tidak perlu mengubah apa pun untuk mulai menggunakan.
- **Kondisi pasar tipis IDX** (volume <Rp10 miliar/hari) bisa menghasilkan sinyal kurang akurat — verifikasi dengan price action.
