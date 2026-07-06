# CATATAN PENGEMBANGAN — Lessons Learned

> Kumpulan pelajaran, anti-pattern, dan bug selama pengembangan Papan Gerak.
> Dibaca ulang sebelum mulai sprint baru.

---

## ⛔ Pine Script v6 — Jebakan & Anti-Pattern

Lihat CATATAN.md di Papan Instrumen untuk referensi lengkap.

### 1. Reserved Keywords
| Keyword | Kenapa Error | Solusi |
|---------|-------------|--------|
| `base` | Parameter security() legacy | Ganti jadi `col` atau `column` |
| `open`, `high`, `low`, `close`, `volume` | Built-in bar variables | Jangan dipakai sebagai parameter |

### 2. NO Local Functions Inside `if` Blocks
Pine Script v6 hanya support fungsi di TOP LEVEL.

### 3. Type Annotations
| Context | Allowed? |
|---------|----------|
| Top-level function parameter | ✅ |
| Local function parameter | ❌ |

### 4. Error Cascade
Fix error PERTAMA dulu sebelum lihat error lain. Satu error bisa cascade ke baris berikutnya.

### 5. `alert()` v6 vs v5
| Version | Signature | Notes |
|---------|-----------|-------|
| v5 | `alert(condition, message, freq)` | `freq` opsional |
| v6 | `alert(message, condition)` | **message di posisi pertama!**, tdk ada `freq` param. Gunakan `if condition` di luar jika perlu filter |
| v5 | `alertcondition(condition, title, message)` | `message` hrs `const string` |
| v6 | `alertcondition()` → masih ada | Tapi lebih baik pake `alert()` + `if` untuk dynamic message |

### 6. `input.*` → selalu tambah `display=`
Default Pine Script v6 menampilkan semua input di legend chart. Untuk parameter teknikal, selalu:
```pine
input.int(14, "Title", group = "Grup", display = display.data_window)
```

---

## 🐛 Bug Tracker

| ID | Bug | Lokasi | Dampak | Fix |
|----|-----|--------|--------|-----|
| BG-1 | Multi-var `color a, b, c` dlm 1 baris | `01-base.pine:86` | CE10156 (koma) | Split per baris |
| BG-2 | `color bgColor` tanpa init | `01-base.pine:86` | CE10156 (end of line) | `var color bgColor = na` |
| BG-3 | Indentasi `size.large` 8 spasi (bukan 12) | `04-ui.pine:37` | CE10156 (line continuation) | 12 spasi |
| BG-4 | `ta.di` dipanggil 2x dgn params sama (salah) | `02-data.pine:23-24` | `adxDn` dpt +DI bukan -DI | `ta.dmi(adxLength, adxLength)` |
| BG-5 | Choppiness Index: `*100` di dlm `math.log(...)` | `02-data.pine:79` | Nilai 174-275 (hrs 0-100) | Pindah ke luar log |
| BG-6 | `f_scoreRange` abaikan param `min`/`max` | `01-base.pine:185` | Asimtotik tdk pernah 0 | Linear 3 segmen |
| BG-7 | `lint.sh` regex false positive masif | `scripts/lint.sh:13` | Flag semua `close` dll | Filter baris `=>` saja |
| BG-8 | CI pipeline `\|\| true` 2 lapis | `transpile.sh:6`, `build.yml:30,33` | Test & transpile tdk bisa gagalkan CI | Hapus `\|\| true` |
| BG-9 | 35 input tanpa `display=` | `01-base.pine:19-81` | Legend chart penuh parameter | Tambah `display.data_window` |
| BG-10 | `alert()` argumen ke-3 (`freq`) | `04-ui.pine:103-128` | CE10115 (too many args) | Hapus, pake `if` block |
| BG-11 | `alert()` v6 swap `message`/`condition` | `04-ui.pine:103-128` | Argumen terbalik | `alert(message, condition)` |
| BG-12 | Bobot SM hardcoded 20 | `03-scoring.pine:230` | Tdk bisa diatur user | `weightSmartMoney` input |
| BG-13 | `rowCount=5` (kurang) | `04-ui.pine:57` | Row Volume mungkin terpotong | `rowCount=7`/`8` |

---

## 🧪 Testing Catatan

### PineTS Limitations
✅ Utility functions, scoring formulas
❌ syminfo.tickerid, request.financial(), table.* (sama seperti Papan Instrumen)

### Test Coverage
- Utility: 16 tests
- Trend: 6 tests
- Momentum: 6 tests
- Volatility: 11 tests
- Volume: 6 tests
- Overall: 6 tests
- **Total: 51 tests (all passing)**

---

## ⏳ Backlog

| ID | Item | Prioritas |
|----|------|-----------|
| P1-1 | Sektor-aware volatility calibration | P2-high |
| P1-2 | Multi-timeframe alignment score | P2-high |
| P2-1 | Volume Profile integration | P3-medium |
| P2-2 | Divergence detection (RSI/MACD) | P3-medium |
| P3-1 | Backtest framework | P4-low |

---

> **Golden Rule:** Jangan tambah fitur baru di atas fondasi yang belum diverifikasi.
> No Silent Changes — setiap commit tercatat di changelog.
