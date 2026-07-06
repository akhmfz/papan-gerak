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

---

## 🐛 Bug Tracker

| ID | Bug | Lokasi | Dampak | Fix |
|----|-----|--------|--------|-----|
| — | — | — | — | — |

---

## 🧪 Testing Catatan

### PineTS Limitations
✅ Utility functions, scoring formulas
❌ syminfo.tickerid, request.financial(), table.* (sama seperti Papan Instrumen)

### Test Coverage Target
- Utility: 12 tests
- Trend: 6 tests
- Momentum: 6 tests
- Volatility: 6 tests
- Volume: 6 tests
- Overall: 4 tests
- **Total target: 40 tests**

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
